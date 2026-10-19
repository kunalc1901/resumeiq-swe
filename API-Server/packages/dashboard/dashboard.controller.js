const appRoot = require('app-root-path');
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

  dashboardService.getLatestAnalyzedResume({ user_id: req.user.id }, (err, data) => {
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
