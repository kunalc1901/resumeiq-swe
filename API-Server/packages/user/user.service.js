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
