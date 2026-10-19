const appRoot = require('app-root-path');
const errors = require('common-errors');
const { isValidObjectId } = require('mongoose');
const { logger } = require(`${appRoot}/config`);
const { ResponseHandler } = require(`${appRoot}/utils`);
const jobMatchService = require('./job-match.service');

/**
 * Controller to get all job matches of the authenticated user, newest first.
 * @param {Request} req
 * @param {Response} res
 * @param {Response} next
 */
exports.getJobMatches = (req, res, next) => {
  logger.debug('Request received to get job matches');

  jobMatchService.getJobMatches({ user_id: req.user.id }, (err, data) => {
    logger.info(`Got response for job matches, err: ${err}`);
    ResponseHandler.handleResponse(err, data, req, res, next);
  });
};

/**
 * Controller to get a single job match (full analysis) by id.
 * @param {Request} req
 * @param {Response} res
 * @param {Response} next
 */
exports.getJobMatchById = (req, res, next) => {
  logger.debug('Request received to get a job match');

  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return ResponseHandler.handleResponse(
      new errors.ValidationError('Invalid job match id', 'invalid_job_match_id'),
      null,
      req,
      res,
      next,
    );
  }

  jobMatchService.getJobMatchById(id, req.user.id, (err, data) => {
    logger.info(`Got response for job match, err: ${err}`);
    if (err) {
      return ResponseHandler.handleResponse(err, null, req, res, next);
    }
    if (!data) {
      return ResponseHandler.handleResponse(
        new errors.NotFoundError('Job match not found', 'job_match_not_found'),
        null,
        req,
        res,
        next,
      );
    }
    return ResponseHandler.handleResponse(null, data, req, res, next);
  });
};
