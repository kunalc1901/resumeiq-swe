const appRoot = require('app-root-path');
const errors = require('common-errors');
const { logger } = require(`${appRoot}/config`);
const { ResponseHandler } = require(`${appRoot}/utils`);
const userService = require('./user.service');
const { createToken } = require('./user.util');

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

/**
 * Controller to login a user and return a JWT
 * @param {Request} req
 * @param {Response} res
 * @param {Response} next
 */
exports.login = (req, res, next) => {
  logger.debug(`Request received to login user`);

  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return ResponseHandler.handleResponse(
      new errors.ValidationError('Email and password are required', 'credentials_required'),
      null,
      req,
      res,
      next,
    );
  }

  userService.findUserByEmail(email, (err, user) => {
    if (err) {
      logger.error(`Error occured while finding user, err: ${err}`);
      return ResponseHandler.handleResponse(err, null, req, res, next);
    }
    if (!user || user.password !== password) {
      return ResponseHandler.handleResponse(
        new errors.NotPermittedError('Invalid email or password', 'invalid_credentials'),
        null,
        req,
        res,
        next,
      );
    }

    const token = createToken({ id: user._id, email: user.email, role: user.role });
    logger.info(`User logged in successfully, email: ${email}`);
    return ResponseHandler.handleResponse(null, { token, user }, req, res, next);
  });
};

/**
 * Controller to register a user
 * @param {Request} req
 * @param {Response} res
 * @param {Response} next
 */
exports.signup = (req, res, next) => {
  logger.debug(`Request received to signup user`);

  const { first_name, last_name, email, password, role } = req.body;

  if (!email || !password) {
    return ResponseHandler.handleResponse(
      new errors.ValidationError('Email and password are required', 'credentials_required'),
      null,
      req,
      res,
      next,
    );
  }

  userService.createUser(
    { first_name, last_name, email, password, role },
    (err, data) => {
      logger.info(`Got response for create user, err: ${err}`);
      ResponseHandler.handleResponse(err, data, req, res, next);
    },
  );
};