const { createLogger, format, transports } = require('winston');
const env = require('./env.config');

const logFormat = format.printf((info) => {
  return `[${info.timestamp}] [${info.level}] :: ${info.message}`;
});

const logger = createLogger({
  level: env.logging.level,
  format: format.combine(format.timestamp(), logFormat),
  transports: [new transports.Console({ handleExceptions: true })],
  exitOnError: false,
});

// create a stream object with a 'write' function that will be used by `morgan`
logger.stream = {
  write: (message) => {
    logger.info(message);
  },
};

module.exports = logger;