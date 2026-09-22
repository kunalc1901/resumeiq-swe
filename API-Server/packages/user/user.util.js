const jwt = require('jsonwebtoken');
const { env } = require('../../config');

/**
 * Creates a signed JWT for a user payload
 * @param {Object} payload
 * @returns {String}
 */
module.exports.createToken = (payload) => {
  return jwt.sign(payload, env.auth.jwtSecret, {
    expiresIn: env.auth.jwtExpiresIn,
  });
};