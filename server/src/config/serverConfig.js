const dotenv = require('dotenv');
require('dotenv').config();

module.exports = {
    PORT: process.env.PORT,
    DB_USERNAME: process.env.DB_USERNAME,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_DATABASE: process.env.DB_DATABASE,
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT,
    DB_DIALECT: process.env.DB_DIALECT,
    DEV_DB_USERNAME: process.env.DEV_DB_USERNAME,
    DEV_DB_PASSWORD: process.env.DEV_DB_PASSWORD,
    DEV_DB_HOST: process.env.DEV_DB_HOST,
    DEV_DB_DATABASE: process.env.DEV_DB_DATABASE,
    REDIS_PASS: process.env.REDIS_PASS,
    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_PORT: process.env.REDIS_PORT,
    SERVER_LINK: process.env.SERVER_LINK
}