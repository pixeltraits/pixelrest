const mysql = require('mysql-promise')();

const DB_CREDENTIALS = require('./dbCredentials');
const MysqlParser = require('../../utils/database/MysqlParser');
const UsersRepository = require('../repositories/users.repository');


mysql.configure({
  host: DB_CREDENTIALS.HOST,
  user: DB_CREDENTIALS.USERNAME,
  password: DB_CREDENTIALS.PASSWORD,
  database: DB_CREDENTIALS.DATABASE
});

const REPOSITORIES = {
  users: new UsersRepository(mysql, MysqlParser.parse)
};

module.exports = REPOSITORIES;
