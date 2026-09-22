const appRoot = require('app-root-path');
const logger = require(`${appRoot}/config/logger.config`);
const error = require('common-errors');

/**
 * Express error handler middleware for handling defined and undefined errors.
 * Determines error type, sets appropriate HTTP status, logs error, and sends response.
 *
 * @param {Error} err - Error object
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {Next} next - Express next middleware function
 */
module.exports.handleError = (err, req, res, next) => {
  if (!err) {
    if (next) {
      return next();
    }
    return res.end();
  }

  let status = err.statusCode || err.status || 500;
  let message = err.message || 'Something unexpected happened';
  const field = err.field || null;
  const code = err.code || null;

  let raise_exception = true;

  if (err instanceof error.ValidationError || err instanceof error.ArgumentError) {
    status = 400;
    raise_exception = false;
  } else if (
    err instanceof error.AuthenticationRequiredError ||
    err.name === 'TokenExpiredError'
  ) {
    status = 401;
    raise_exception = false;
  } else if (err instanceof error.NotPermittedError) {
    status = 403;
    raise_exception = false;
  } else if (
    err instanceof error.ArgumentNullError ||
    err instanceof error.NotFoundError
  ) {
    status = 404;
    raise_exception = false;
  } else if (err instanceof error.NotSupportedError) {
    status = 405;
  } else if (err instanceof error.AlreadyInUseError) {
    status = 409;
  } else if (status >= 400 && status < 500) {
    raise_exception = false;
  }

  err.status = status;

  const errorDetails = {
    url: req.originalUrl,
    status: status,
    code: code,
    message: message,
    error: {
      name: err.name,
      message: err.message,
      stack: err.stack,
    },
  };

  if (raise_exception) {
    logger.error(JSON.stringify(errorDetails));
  } else {
    logger.warn(JSON.stringify(errorDetails));
  }

  if (!res.headersSent) {
    res.status(status).send({
      message: message,
      code: code,
      field: field,
      status: status,
    });
  }
};