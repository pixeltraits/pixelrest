const { UsersRepository } = require('../repositories/users.repository');
const DB_CREDENTIALS = require('./dbCredentials');

const pgp = require('pg-promise')({
  extend: (obj) => {
    obj.users = new UsersRepository(obj);
  }
});
const POSTGRES_DB = pgp(
  `postgres://${DB_CREDENTIALS.USERNAME}:${DB_CREDENTIALS.PASSWORD}@${DB_CREDENTIALS.HOST}:${DB_CREDENTIALS.PORT}/${DB_CREDENTIALS.DATABASE}`
);

module.exports = POSTGRES_DB;
