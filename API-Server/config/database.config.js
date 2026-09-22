const mongoose = require('mongoose');
const env = require('./env.config');
const logger = require('./logger.config');

let mongooseConn;

/**
 * Get a mongodb connection
 * @param {*} callback
 */
const _getConnection = (module.exports.getConnection = (callback) => {
  logger.info('Getting mongodb connection ...');

  const dbParams = env.database;
  let uri = '';

  if (dbParams.srvRecord) {
    uri = `mongodb+srv://${dbParams.host}/${dbParams.name}`;
  } else {
    uri = `mongodb://${dbParams.host}:${dbParams.port}/${dbParams.name}`;
  }

  createConnection(uri, (err, connection) => {
    if (err) {
      return callback(err, null);
    }
    mongooseConn = connection;
    return callback(null, connection);
  });
});

/**
 * Create a mongodb connection
 * @param {*} uri
 * @param {*} callback
 */
const createConnection = (module.exports.createConnection = (uri, callback) => {
  logger.info(`Creating mongodb connection to ${uri} ...`);
  mongoose
    .connect(uri, { serverSelectionTimeoutMS: 5000 })
    .then((connection) => {
      logger.info(`Database successfully connected to ${connection.connections[0].name}`);
      return callback(null, connection.connections[0]);
    })
    .catch((err) => {
      logger.error(`Could not connect to the database: ${err.message}`);
      return callback(err, null);
    });
});

/**
 * Returns the active mongoose connection
 * @returns {import('mongoose').Connection}
 */
const getMongooseConnection = (module.exports.getMongooseConnection = () => {
  return mongoose.connection;
});

module.exports.mongooseConn = mongooseConn;