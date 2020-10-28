import { createConnection } from 'mysql2/promise';
import { DB_CREDENTIALS } from './secret.js';


export const getMysqlConnection = async () => {
  return await createConnection({
    host: DB_CREDENTIALS.HOST,
    user: DB_CREDENTIALS.USERNAME,
    password: DB_CREDENTIALS.PASSWORD,
    database: DB_CREDENTIALS.DATABASE
  });
};


