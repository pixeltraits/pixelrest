import pgp from 'pg-promise';

import { PG_CREDENTIALS } from './secret.js';


export const PG_SQL = pgp({})(
  `postgres://${PG_CREDENTIALS.USERNAME}:${PG_CREDENTIALS.PASSWORD}@${PG_CREDENTIALS.HOST}:${PG_CREDENTIALS.PORT}/${PG_CREDENTIALS.DATABASE}`
);
