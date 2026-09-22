const app = require('./app');
const { env, logger } = require('./config');
const { createServer } = require(env.server.url.protocol);

// read host and port from configured properties
const url = env.server.url;

logger.info('Starting the server...');
const httpServer = createServer(app);

httpServer.listen(url.port, url.host, () => {
  logger.info(`Server ready at ${url.protocol}://${url.host}:${url.port}`);
  logger.info(`Active Profile [${env.profile}]`);
});