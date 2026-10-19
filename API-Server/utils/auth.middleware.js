const appRoot = require('app-root-path');
const errors = require('common-errors');
const { CognitoJwtVerifier } = require('aws-jwt-verify');
const { env, logger } = require(`${appRoot}/config`);

let verifier;

/**
 * Lazily create the Cognito verifier so the app can boot without Cognito
 * configuration (e.g. health checks) and fail clearly on authenticated calls.
 * @returns {import('aws-jwt-verify').CognitoJwtVerifier}
 */
const getVerifier = () => {
  if (!verifier) {
    verifier = CognitoJwtVerifier.create({
      userPoolId: env.cognito.userPoolId,
      tokenUse: 'id',
      clientId: env.cognito.userPoolClientId,
    });
  }
  return verifier;
};

/**
 * Express middleware that verifies the Cognito ID token sent in the
 * Authorization header and exposes its claims on `req.user`. The user id is
 * taken from the token's `sub` claim, so clients never send it themselves.
 * @param {Request} req
 * @param {Response} res
 * @param {Next} next
 */
module.exports.verifyToken = async (req, res, next) => {
  if (!env.cognito.userPoolId || !env.cognito.userPoolClientId) {
    logger.error('Cognito is not configured: set cognito.userPoolId and cognito.userPoolClientId');
    return next(new Error('Cognito is not configured'));
  }

  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return next(new errors.AuthenticationRequiredError('Missing bearer token'));
  }

  try {
    const payload = await getVerifier().verify(token);
    req.user = {
      id: payload.sub,
      email: payload.email,
      is_admin: payload['custom:is_admin'],
    };
    return next();
  } catch (err) {
    logger.warn(`Cognito token verification failed: ${err.message}`);
    return next(new errors.AuthenticationRequiredError('Invalid or expired token'));
  }
};
