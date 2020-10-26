import Mysql from 'mysql-promise';
import { DB_CREDENTIALS } from './secret.js';

export const mysql = new Mysql();

mysql.configure({
  host: DB_CREDENTIALS.HOST,
  user: DB_CREDENTIALS.USERNAME,
  password: DB_CREDENTIALS.PASSWORD,
  database: DB_CREDENTIALS.DATABASE
});
