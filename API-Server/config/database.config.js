const mongoose = require('mongoose');
const env = require('./env.config');
const logger = require('./logger.config');

let mongooseConn;

/**
 * Build the mongodb connection URI from the env config.
 * Supports a comma-separated host seed list and optional credentials.
 * @returns {String}
 */
const buildConnectionUri = () => {
  const dbParams = env.database;
  const credentials = dbParams.username
    ? `${encodeURIComponent(dbParams.username)}:${encodeURIComponent(dbParams.password)}@`
    : '';

  let uri = '';
  if (dbParams.srvRecord) {
    uri = `mongodb+srv://${credentials}${dbParams.host}/${dbParams.name}`;
  } else {
    const hosts = String(dbParams.host)
      .split(',')
      .map((host) => host.trim())
      .filter(Boolean)
      .map((host) => `${host}:${dbParams.port}`)
      .join(',');
    uri = `mongodb://${credentials}${hosts}/${dbParams.name}`;
  }

  const params = [];
  if (dbParams.authSource) {
    params.push(`authSource=${dbParams.authSource}`);
  }
  if (dbParams.replicaSet) {
    params.push(`replicaSet=${dbParams.replicaSet}`);
  }
  if (dbParams.tls) {
    params.push('tls=true');
  }
  if (params.length > 0) {
    uri += `?${params.join('&')}`;
  }
  return uri;
};

/**
 * Get a mongodb connection
 * @param {*} callback
 */
const _getConnection = (module.exports.getConnection = (callback) => {
  logger.info('Getting mongodb connection ...');

  createConnection(buildConnectionUri(), (err, connection) => {
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
  const maskedUri = uri.replace(/\/\/([^:@/]+):([^@/]+)@/, '//$1:****@');
  logger.info(`Creating mongodb connection to ${maskedUri} ...`);
  mongoose
    .connect(uri, { serverSelectionTimeoutMS: 10000 })
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
