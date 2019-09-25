const pgp = require('pg-promise')();

const PostgresParser = require('../../utils/database/PostgresParser');
const UsersRepository = require('../repositories/users.repository');
const DB_CREDENTIALS = require('./dbCredentials');


const POSTGRES_POOL = pgp(
  `postgres://${DB_CREDENTIALS.USERNAME}:${DB_CREDENTIALS.PASSWORD}@${DB_CREDENTIALS.HOST}:${DB_CREDENTIALS.PORT}/${DB_CREDENTIALS.DATABASE}`
);

const REPOSITORIES = {
  users: new UsersRepository(POSTGRES_POOL, PostgresParser.parse)
}

module.exports = REPOSITORIES;
