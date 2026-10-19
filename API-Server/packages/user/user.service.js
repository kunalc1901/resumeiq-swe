const { getMongooseConnection } = require('../../config/database.config');
const UserSchema = require('./user.schema');

/**
 * Returns the User model bound to the active mongoose connection.
 * @returns {Model}
 */
const getUserModel = () => {
  const connection = getMongooseConnection();
  return connection.model('User', UserSchema);
};

/**
 * Method to get users
 * @param {*} query
 * @param {*} callback
 */
exports.getUsers = (query, callback) => {
  const User = getUserModel();
  const filter = { is_deleted: { $in: [null, false] } };
  if (query && query.email) {
    filter.email = query.email;
  }
  User.find(filter)
    .then((data) => {
      return callback(null, data);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

/**
 * Method to normalize a Cognito custom attribute value ("true"/"1") to boolean
 * @param {*} value
 * @returns {Boolean}
 */
const toBoolean = (value) => {
  if (typeof value === 'boolean') {
    return value;
  }
  if (typeof value === 'number') {
    return value === 1;
  }
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    return normalized === 'true' || normalized === '1';
  }
  return false;
};

/**
 * Method to create a user profile from verified Cognito ID token claims.
 * The document is created once; fields managed manually (e.g. is_admin) are
 * never overwritten by later requests.
 * @param {Object} claims - verified ID token claims
 * @param {*} callback
 */
exports.upsertFromClaims = (claims, callback) => {
  const User = getUserModel();
  User.findOneAndUpdate(
    { cognito_sub: claims.sub },
    {
      $setOnInsert: {
        cognito_sub: claims.sub,
        email: claims.email || '',
        first_name: claims.given_name || '',
        last_name: claims.family_name || '',
        is_admin: toBoolean(claims['custom:is_admin']),
        is_deleted: false,
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  )
    .then((data) => {
      return callback(null, data);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

/**
 * Method to find a user by email
 * @param {String} email
 * @param {*} callback
 */
exports.findUserByEmail = (email, callback) => {
  const User = getUserModel();
  User.findOne({ email, is_deleted: { $in: [null, false] } })
    .then((data) => {
      return callback(null, data);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

/**
 * Method to create a user
 * @param {Object} body
 * @param {*} callback
 */
exports.createUser = (body, callback) => {
  const User = getUserModel();
  User.create(body)
    .then((data) => {
      return callback(null, data);
    })
    .catch((err) => {
      return callback(err, null);
    });
};
