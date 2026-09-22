const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const { logger, env, datasource } = require('./config');
const { ErrorHandler } = require('./utils');
const app = express();
const routes = require('./routes');
const healthCheckRoute = require('./packages/health-check/health-check.routes');

// CORS configuration
const corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  preflightContinue: false,
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));

// Use body parser to parse request body in json
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '5mb' }));

// Setup logger plugin into app
app.use(morgan('combined', { stream: logger.stream }));

// API Health Check endpoint
app.use('/health', healthCheckRoute);

// Connect to the datasource once
datasource.getConnection((err) => {
  if (err) {
    logger.error(`Error occured while connecting to database, err ${err}`);
  } else {
    logger.info('Database successfully connected');
  }
});

// Integrate all application routes
app.use('/', routes);

// Integrate error handler
app.use(ErrorHandler.handleError);

module.exports = app;