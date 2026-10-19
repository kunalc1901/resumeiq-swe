const appRoot = require('app-root-path');
const { logger } = require(`${appRoot}/config`);
const { ResponseHandler } = require(`${appRoot}/utils`);
const userService = require('./user.service');

/**
 * Controller to get users
 * @param {Request} req
 * @param {Response} res
 * @param {Response} next
 */
exports.getUsers = (req, res, next) => {
  logger.debug(`Request received to get users`);
  userService.getUsers(req.query, (err, data) => {
    logger.info(`Got response for users, err: ${err}`);
    ResponseHandler.handleResponse(err, data, req, res, next);
  });
};
