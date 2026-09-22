const mongoose = require('mongoose');
const { getMongooseConnection } = require('../../config/database.config');
const UserSchema = require('./user.schema');

/**
 * In-memory fallback store used when MongoDB is not reachable, so the starter
 * auth flow still works out of the box. Replace with a real DB for any real work.
 */
const memoryUsers = [
  {
    _id: 'demo-user',
    first_name: 'Demo',
    last_name: 'User',
    email: 'demo@square.io',
    password: 'demo123',
    role: 'user',
    is_deleted: false,
  },
  {
    _id: 'admin-user',
    first_name: 'Admin',
    last_name: 'User',
    email: 'admin@square.io',
    password: 'admin123',
    role: 'admin',
    is_deleted: false,
  },
];

const isDbConnected = () =>
  mongoose.connection.readyState === 1 || mongoose.connection.readyState === 2;

/**
 * Returns the User model bound to the active mongoose connection.
 * @returns {mongoose.Model}
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
  if (!isDbConnected()) {
    let users = memoryUsers.map((u) => {
      const { password, ...rest } = u;
      return rest;
    });
    if (query && query.email) {
      users = users.filter((u) => u.email === query.email);
    }
    return callback(null, users);
  }

  const User = getUserModel();
  const filter = { is_deleted: { $in: [null, false] } };
  if (query && query.email) {
    filter.email = query.email;
  }
  User.find(filter, { password: 0 })
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
  if (!isDbConnected()) {
    const user = memoryUsers.find((u) => u.email === email);
    return callback(null, user || null);
  }

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
  if (!isDbConnected()) {
    if (memoryUsers.some((u) => u.email === body.email)) {
      return callback(new Error('User with this email already exists'), null);
    }
    const user = {
      _id: `${body.email}-mem`,
      ...body,
      is_deleted: false,
    };
    memoryUsers.push(user);
    return callback(null, user);
  }

  const User = getUserModel();
  User.create(body)
    .then((data) => {
      return callback(null, data);
    })
    .catch((err) => {
      return callback(err, null);
    });
};