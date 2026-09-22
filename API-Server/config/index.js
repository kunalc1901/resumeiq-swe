const env = require('./env.config');
const logger = require('./logger.config');
const datasource = require('./database.config');

// Export configured services
module.exports = {
  // Runtime environment properties configured with application
  env,
  // logger to handle logging
  logger,
  // Data source with connection
  datasource,
};