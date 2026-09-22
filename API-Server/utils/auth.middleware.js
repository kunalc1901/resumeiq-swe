const jwt = require('jsonwebtoken');
const errors = require('common-errors');
const { env } = require('../config');

/**
 * Express middleware to verify the JWT in the Authorization header.
 * Attaches the decoded payload to req.user when valid, otherwise passes a 401.
 * @param {Request} req
 * @param {Response} _res
 * @param {Next} next
 */
module.exports.verifyToken = (req, _res, next) => {
  const header = req.headers['authorization'];
  if (!header || !header.startsWith('Bearer ')) {
    return next(
      new errors.AuthenticationRequiredError(
        'Authentication token is required',
        'authentication_required',
      ),
    );
  }

  const token = header.split(' ')[1];
  try {
    const decoded = jwt.verify(token, env.auth.jwtSecret);
    req.user = decoded;
    return next();
  } catch (err) {
    return next(
      new errors.AuthenticationRequiredError(
        'Invalid or expired authentication token',
        'invalid_token',
      ),
    );
  }
};