require('dotenv').config();
const convict = require('convict');
const appRoot = require('app-root-path');
const fs = require('node:fs');

const config = convict({
  profile: {
    format: ['dev', 'qa', 'staging', 'prod', 'test'],
    default: 'dev',
    arg: 'node-env',
    env: 'NODE_ENV',
  },
  server: {
    url: {
      host: {
        doc: 'The application server host.',
        default: 'localhost',
        arg: 'host',
        env: 'SQ_HOST',
      },
      port: {
        format: 'port',
        doc: 'The application server port.',
        default: 3000,
        arg: 'port',
        env: 'SQ_PORT',
      },
      protocol: {
        format: ['http', 'https'],
        default: 'http',
        arg: 'protocol',
        env: 'SQ_URL_PROTOCOL',
      },
    },
  },
  database: {
    name: {
      format: String,
      default: 'resume_iq',
      arg: 'db-name',
      env: 'SQ_DB_NAME',
    },
    host: {
      format: String,
      default: 'localhost',
      arg: 'db-host',
      env: 'SQ_DB_HOST',
    },
    port: {
      format: 'port',
      default: 27017,
      arg: 'db-port',
      env: 'SQ_DB_PORT',
    },
    srvRecord: {
      format: Boolean,
      default: false,
      arg: 'db-srv-record',
      env: 'SQ_DB_SRV_RECORD',
    },
  },
  auth: {
    jwtSecret: {
      doc: 'Secret used to sign and verify JWTs.',
      format: String,
      default: 'change-me-in-production',
      sensitive: true,
      arg: 'jwt-secret',
      env: 'SQ_JWT_SECRET',
    },
    jwtExpiresIn: {
      doc: 'JWT lifetime, e.g. 1d or 8h.',
      format: String,
      default: '1d',
      arg: 'jwt-expires-in',
      env: 'SQ_JWT_EXPIRES_IN',
    },
  },
  logging: {
    level: {
      doc: 'The output log level',
      format: String,
      default: 'debug',
      arg: 'log-level',
      env: 'SQ_LOG_LEVEL',
    },
  },
});

const env = config.get('profile') || process.env.NODE_ENV || 'dev';
const envFilePath = `${appRoot}/env/${env}.json`;
const fallbackEnvFilePath = `${appRoot}/env/dev.json`;

config.loadFile(fs.existsSync(envFilePath) ? envFilePath : fallbackEnvFilePath);
config.validate();

module.exports = config.getProperties();