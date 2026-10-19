const appRoot = require('app-root-path');
const { logger } = require(`${appRoot}/config`);
const { ResponseHandler } = require(`${appRoot}/utils`);
const resumeService = require('./resume.service');

/**
 * Controller to get resumes for the authenticated user.
 * @param {Request} req
 * @param {Response} res
 * @param {Response} next
 */
exports.getResumes = (req, res, next) => {
  logger.debug('Request received to get resumes');

  resumeService.getResumes({ user_id: req.user.id }, (err, data) => {
    logger.info(`Got response for resumes, err: ${err}`);
    ResponseHandler.handleResponse(err, data, req, res, next);
  });
};

/**
 * Controller to create a presigned S3 upload URL for a resume.
 * @param {Request} req
 * @param {Response} res
 * @param {Response} next
 */
exports.getUploadUrl = (req, res, next) => {
  logger.debug('Request received to create a resume upload URL');

  resumeService.createUploadUrl(
    { ...(req.body || {}), user_id: req.user.id },
    (err, data) => {
      logger.info(`Got response for resume upload URL, err: ${err}`);
      ResponseHandler.handleResponse(err, data, req, res, next);
    },
  );
};

/**
 * Controller to save a resume after its S3 upload completed.
 * @param {Request} req
 * @param {Response} res
 * @param {Response} next
 */
exports.createResume = (req, res, next) => {
  logger.debug('Request received to save a resume');

  resumeService.createResume(
    { ...(req.body || {}), user_id: req.user.id },
    (err, data) => {
      logger.info(`Got response for resume creation, err: ${err}`);
      ResponseHandler.handleResponse(err, data, req, res, next);
    },
  );
};
