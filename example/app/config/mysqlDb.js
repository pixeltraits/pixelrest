import { createPool } from 'mysql2/promise';
import { DB_CREDENTIALS } from './secret.js';


export const getMysqlPool = createPool({
  host: DB_CREDENTIALS.HOST,
  user: DB_CREDENTIALS.USERNAME,
  password: DB_CREDENTIALS.PASSWORD,
  database: DB_CREDENTIALS.DATABASE,
  waitForConnections: true,
  connectionLimit: 10
});


