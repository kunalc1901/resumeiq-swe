const appRoot = require('app-root-path');
const errors = require('common-errors');
const { logger } = require(`${appRoot}/config`);
const { ResponseHandler } = require(`${appRoot}/utils`);
const dashboardService = require('./dashboard.service');

/**
 * Controller to get dashboard data for the authenticated user.
 * @param {Request} req
 * @param {Response} res
 * @param {Response} next
 */
exports.getDashboard = (req, res, next) => {
  logger.debug('Request received to get dashboard data');

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

  dashboardService.getLatestAnalyzedResume({ user_id: userId }, (err, data) => {
    logger.info(`Got response for dashboard, err: ${err}`);
    if (err) {
      return ResponseHandler.handleResponse(err, null, req, res, next);
    }
    // Wrapped in an object so that "no analysed resume yet" is still a valid
    // payload (the response handler cannot send falsy data).
    return ResponseHandler.handleResponse(
      null,
      { latest_resume: data || null },
      req,
      res,
      next,
    );
  });
};
