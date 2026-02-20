import App from './app/App.js';
import { serverConfig } from './app/config/serverConfig.js';
import { DB_TYPE } from './app/config/dbConfig.js';
import { DbConnection } from 'pixelrest/dbConnection';
import BddParser from 'pixelrest/bddParser';

async function main(): Promise<void> {
  let dbConnection: DbConnection;
  let parser: BddParser;

  if (DB_TYPE === 'postgres') {
    const { PG_SQL } = await import('./app/config/postgresDb.js');
    const { default: PostgresAdapter } = await import('./app/config/postgresAdapter.js');
    const { default: PostgresParser } = await import('pixelrest/postgresParser');
    dbConnection = new PostgresAdapter(PG_SQL);
    parser = new PostgresParser();
  } else {
    const { getMysqlPool } = await import('./app/config/mysqlDb.js');
    const { default: MysqlParser } = await import('pixelrest/mysqlParser');
    dbConnection = getMysqlPool as DbConnection;
    parser = new MysqlParser();
  }

  new App(dbConnection, serverConfig, parser);
}

main();
