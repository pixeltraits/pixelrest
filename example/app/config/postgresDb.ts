import pgp from 'pg-promise';

import { DB_CREDENTIALS } from './secret.js';


export const PG_SQL = pgp({})(
  `postgres://${DB_CREDENTIALS.USERNAME}:${DB_CREDENTIALS.PASSWORD}@${DB_CREDENTIALS.HOST}:${DB_CREDENTIALS.PORT}/${DB_CREDENTIALS.DATABASE}`
);
