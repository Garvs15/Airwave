
const { DB_USERNAME, DB_PASSWORD, DB_DATABASE, DB_HOST, DB_DIALECT, DB_PORT, DEV_DB_USERNAME, DEV_DB_PASSWORD, DEV_DB_DATABASE, DEV_DB_HOST, DEV_DB_PORT } = require('./serverConfig');


const sslConfig = {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
};

module.exports = {
  development: {
    username: DEV_DB_USERNAME,
    password: DEV_DB_PASSWORD,
    database: DEV_DB_DATABASE,
    host: DEV_DB_HOST,
    dialect: DB_DIALECT,
    port: DEV_DB_PORT,
    ...sslConfig
  },
  test: {
    username: DEV_DB_USERNAME,
    password: DEV_DB_PASSWORD,
    database: DEV_DB_DATABASE,
    host: DEV_DB_HOST,
    dialect: DB_DIALECT,
    ...sslConfig
  },
  production: {
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_DATABASE,
    host: DB_HOST,
    dialect: DB_DIALECT,
    port: DB_PORT,
    ...sslConfig
  }
};
