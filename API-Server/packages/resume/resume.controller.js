const appRoot = require('app-root-path');
const errors = require('common-errors');
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

  const userId = req.query.user_id || (req.user && req.user.id);
  if (!userId) {
    return ResponseHandler.handleResponse(
      new errors.ValidationError('user_id is required', 'user_id_required'),
      null,
      req,
      res,
      next,
    );
  }

  resumeService.getResumes({ user_id: userId }, (err, data) => {
    logger.info(`Got response for resumes, err: ${err}`);
    ResponseHandler.handleResponse(err, data, req, res, next);
  });
};
