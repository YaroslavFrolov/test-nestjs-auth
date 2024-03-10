const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  development: {
    dialect: 'postgres',
    host: 'db',
    port: process.env.PORT_DB,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  },
  test: {
    dialect: 'postgres',
    host: 'db',
    port: process.env.PORT_DB,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  },
  production: {
    dialect: 'postgres',
    host: 'db',
    port: process.env.PORT_DB,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  },
};
