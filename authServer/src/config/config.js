
const { DB_USERNAME, DB_PASSWORD, DB_DATABASE, DB_HOST, DB_DIALECT, DB_PORT, DB_SSL_CA, DEV_DB_USERNAME, DEV_DB_PASSWORD, DEV_DB_DATABASE, DEV_DB_HOST } = require('./serverConfig');

module.exports = {
  development: {
    username: DEV_DB_USERNAME,
    password: DEV_DB_PASSWORD,
    database: DEV_DB_DATABASE,
    host: DEV_DB_HOST,
    dialect: DB_DIALECT,
  },
  test: {
    username: DEV_DB_USERNAME,
    password: DEV_DB_PASSWORD,
    database: DEV_DB_DATABASE,
    host: DEV_DB_HOST,
    dialect: DB_DIALECT,
  },
  production: {
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_DATABASE,
    host: DB_HOST,
    dialect: DB_DIALECT,
    port: DB_PORT,
  }
};
