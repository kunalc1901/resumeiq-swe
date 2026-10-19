const { S3Client } = require('@aws-sdk/client-s3');
const env = require('./env.config');

let client;

/**
 * Returns a lazily-created S3 client. When explicit keys are not configured,
 * the SDK's default credential chain is used (environment variables, shared
 * config/credentials files, or the instance/task IAM role).
 * @returns {S3Client}
 */
const getS3Client = () => {
  if (!env.aws.region || !env.aws.bucket) {
    throw new Error('S3 is not configured: set aws.region and aws.bucket');
  }

  if (!client) {
    const credentials =
      env.aws.accessKeyId && env.aws.secretAccessKey
        ? {
            accessKeyId: env.aws.accessKeyId,
            secretAccessKey: env.aws.secretAccessKey,
          }
        : undefined;

    client = new S3Client({
      region: env.aws.region,
      // Don't add SDK-computed checksum parameters to presigned URLs; the
      // browser doesn't send the matching checksum header, and S3 would
      // reject the upload.
      requestChecksumCalculation: 'WHEN_REQUIRED',
      responseChecksumValidation: 'WHEN_REQUIRED',
      ...(credentials ? { credentials } : {}),
    });
  }

  return client;
};

module.exports = { getS3Client };
