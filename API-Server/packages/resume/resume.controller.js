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
