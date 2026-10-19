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
    username: {
      doc: 'Database username. Leave empty for unauthenticated connections.',
      format: String,
      default: '',
      arg: 'db-username',
      env: 'SQ_DB_USERNAME',
    },
    password: {
      doc: 'Database password.',
      format: String,
      default: '',
      sensitive: true,
      arg: 'db-password',
      env: 'SQ_DB_PASSWORD',
    },
    authSource: {
      doc: 'Database used to authenticate against (Atlas users live in "admin").',
      format: String,
      default: '',
      arg: 'db-auth-source',
      env: 'SQ_DB_AUTH_SOURCE',
    },
    replicaSet: {
      doc: 'Replica set name (for Atlas, from the SRV TXT record).',
      format: String,
      default: '',
      arg: 'db-replica-set',
      env: 'SQ_DB_REPLICA_SET',
    },
    tls: {
      doc: 'Use TLS for the database connection (required by Atlas when not using SRV).',
      format: Boolean,
      default: false,
      arg: 'db-tls',
      env: 'SQ_DB_TLS',
    },
  },
  cognito: {
    userPoolId: {
      doc: 'Cognito user pool id used to verify incoming ID tokens.',
      format: String,
      default: '',
      arg: 'cognito-user-pool-id',
      env: 'SQ_COGNITO_USER_POOL_ID',
    },
    userPoolClientId: {
      doc: 'Cognito app client id used to verify incoming ID tokens.',
      format: String,
      default: '',
      arg: 'cognito-client-id',
      env: 'SQ_COGNITO_CLIENT_ID',
    },
  },
  aws: {
    region: {
      doc: 'AWS region that hosts the resume bucket.',
      format: String,
      default: '',
      arg: 'aws-region',
      env: 'SQ_AWS_REGION',
    },
    bucket: {
      doc: 'S3 bucket used for resume uploads.',
      format: String,
      default: '',
      arg: 'aws-bucket',
      env: 'SQ_AWS_BUCKET',
    },
    accessKeyId: {
      doc: 'AWS access key id. Leave empty to use the default AWS credential chain.',
      format: String,
      default: '',
      sensitive: true,
      arg: 'aws-access-key-id',
      env: 'SQ_AWS_ACCESS_KEY_ID',
    },
    secretAccessKey: {
      doc: 'AWS secret access key. Leave empty to use the default AWS credential chain.',
      format: String,
      default: '',
      sensitive: true,
      arg: 'aws-secret-access-key',
      env: 'SQ_AWS_SECRET_ACCESS_KEY',
    },
    presignExpiresSeconds: {
      doc: 'Lifetime of generated upload URLs, in seconds.',
      format: 'int',
      default: 300,
      arg: 'aws-presign-expires',
      env: 'SQ_AWS_PRESIGN_EXPIRES',
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