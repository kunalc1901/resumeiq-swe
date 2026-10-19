const path = require('node:path');
const errors = require('common-errors');
const { PutObjectCommand, HeadObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { env } = require('../../config');
const { getMongooseConnection } = require('../../config/database.config');
const { getS3Client } = require('../../config/s3.config');
const ResumeSchema = require('./resume.schema');

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
const MAX_FILE_NAME_LENGTH = 255;
const ALLOWED_CONTENT_TYPES = ['application/pdf'];

/**
 * Returns the Resume model bound to the active mongoose connection.
 * @returns {Model}
 */
const getResumeModel = () => {
  const connection = getMongooseConnection();
  return connection.model('Resume', ResumeSchema);
};

/**
 * Validates and normalizes the display file name.
 * @param {*} fileName
 * @returns {String}
 */
const validateFileName = (fileName) => {
  if (typeof fileName !== 'string' || !fileName.trim()) {
    throw new errors.ValidationError('file_name is required');
  }
  if (fileName.length > MAX_FILE_NAME_LENGTH) {
    throw new errors.ValidationError(`file_name must be at most ${MAX_FILE_NAME_LENGTH} characters`);
  }
  return fileName.trim();
};

/**
 * Builds a safe S3 object name. The original name is kept for display in the
 * database; the key only needs to be readable and unique.
 * @param {String} fileName
 * @returns {String}
 */
const sanitizeFileName = (fileName) => {
  const base = path
    .basename(String(fileName))
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '');
  const stem = base.replace(/\.pdf$/i, '').slice(0, 80) || 'resume';
  return `${stem}.pdf`;
};

/**
 * Validates the upload request and returns the normalized content type/size.
 * @param {Object} payload
 * @returns {{ contentType: String, fileSize: Number }}
 */
const validateUploadRequest = ({ user_id, file_name, content_type, file_size }) => {
  if (!user_id) {
    throw new errors.ValidationError('User not found');
  }

  validateFileName(file_name);

  const contentType = String(content_type || '')
    .split(';')[0]
    .trim()
    .toLowerCase();
  if (!ALLOWED_CONTENT_TYPES.includes(contentType)) {
    throw new errors.ValidationError('Only PDF files are supported');
  }

  const fileSize = Number(file_size);
  if (!Number.isFinite(fileSize) || fileSize <= 0) {
    throw new errors.ValidationError('file_size must be a positive number');
  }
  if (fileSize > MAX_UPLOAD_BYTES) {
    throw new errors.ValidationError(
      `File is too large. Maximum size is ${MAX_UPLOAD_BYTES / (1024 * 1024)} MB`,
    );
  }

  return { contentType, fileSize };
};

/**
 * Method to get resumes for a user from the database, newest first.
 * @param {Object} query - requires user_id (derived from the verified token)
 * @param {*} callback
 */
exports.getResumes = (query, callback) => {
  const Resume = getResumeModel();
  Resume.find({ user_id: query.user_id })
    .sort({ uploaded_at: -1 })
    .then((data) => {
      return callback(null, data);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

/**
 * Method to create a presigned S3 PUT URL for a resume upload. The object key
 * is scoped to the authenticated user so uploads can never overwrite or read
 * another user's files.
 * @param {Object} payload
 * @param {*} callback
 */
exports.createUploadUrl = (payload, callback) => {
  let upload;
  let s3;
  try {
    upload = validateUploadRequest(payload);
    s3 = getS3Client();
  } catch (err) {
    return callback(err, null);
  }

  const key = `users/${payload.user_id}/${sanitizeFileName(payload.file_name)}`;
  const expiresIn = Math.min(
    Math.max(Number(env.aws.presignExpiresSeconds) || 300, 60),
    3600,
  );

  const command = new PutObjectCommand({
    Bucket: env.aws.bucket,
    Key: key,
    ContentType: upload.contentType,
  });

  getSignedUrl(s3, command, {
    expiresIn,
    // Bind the signature to the content type so the URL can't be reused to
    // upload a different kind of file.
    signableHeaders: new Set(['content-type']),
  })
    .then((uploadUrl) => {
      return callback(null, {
        upload_url: uploadUrl,
        key,
        file_name: payload.file_name.trim(),
        content_type: upload.contentType,
        expires_in: expiresIn,
      });
    })
    .catch((err) => {
      return callback(err, null);
    });
};

/**
 * Method to save a resume after the file has been uploaded to S3. The object
 * is verified with HeadObject so a client cannot register an arbitrary key or
 * a file that was never uploaded. Uploading the same file name again replaces
 * the object and refreshes the existing entry (analysis is cleared).
 * @param {Object} payload
 * @param {*} callback
 */
exports.createResume = (payload, callback) => {
  const { user_id, key } = payload;
  let fileName;
  let s3;

  try {
    if (!user_id) {
      throw new errors.ValidationError('User not found');
    }
    if (
      typeof key !== 'string' ||
      !key.startsWith(`users/${user_id}/`)
    ) {
      throw new errors.ValidationError('Invalid upload key');
    }
    fileName = validateFileName(payload.file_name);
    s3 = getS3Client();
  } catch (err) {
    return callback(err, null);
  }

  s3.send(new HeadObjectCommand({ Bucket: env.aws.bucket, Key: key }))
    .then(async (head) => {
      const size = Number(head.ContentLength);
      if (!Number.isFinite(size) || size <= 0) {
        throw new errors.ValidationError('The uploaded file is empty');
      }
      if (size > MAX_UPLOAD_BYTES) {
        throw new errors.ValidationError(
          `File is too large. Maximum size is ${MAX_UPLOAD_BYTES / (1024 * 1024)} MB`,
        );
      }

      const contentType = String(head.ContentType || '')
        .split(';')[0]
        .trim()
        .toLowerCase();
      if (!ALLOWED_CONTENT_TYPES.includes(contentType)) {
        throw new errors.ValidationError('Only PDF files are supported');
      }

      const Resume = getResumeModel();
      const resume = await Resume.findOneAndUpdate(
        { s3_key: key, user_id },
        {
          $set: {
            user_id,
            file_name: fileName,
            s3_key: key,
            uploaded_at: new Date(),
            analysis: null,
          },
        },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      ).lean();

      return callback(null, resume);
    })
    .catch((err) => {
      if (err.$metadata && err.$metadata.httpStatusCode === 404) {
        return callback(
          new errors.ValidationError(
            'Uploaded file was not found. Please upload it again.',
          ),
          null,
        );
      }
      return callback(err, null);
    });
};
