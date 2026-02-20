import UsersRepository from '../repositories/users.repository.js';
import DocumentsRepository from '../repositories/documents.repository.js';
import { DB_TYPE } from '../config/dbConfig.js';
import { DbConnection } from 'pixelrest/dbConnection';
import BddParser from 'pixelrest/bddParser';

async function main(): Promise<void> {
  let dbConnection: DbConnection;
  let parser: BddParser;
  let cleanup: () => Promise<void>;

  if (DB_TYPE === 'postgres') {
    const { PG_SQL } = await import('../config/postgresDb.js');
    const { default: PostgresAdapter } = await import('../config/postgresAdapter.js');
    const { default: PostgresParser } = await import('pixelrest/postgresParser');
    const adapter = new PostgresAdapter(PG_SQL);
    dbConnection = adapter;
    parser = new PostgresParser();
    cleanup = () => adapter.end();
  } else {
    const { getMysqlPool } = await import('../config/mysqlDb.js');
    const { default: MysqlParser } = await import('pixelrest/mysqlParser');
    dbConnection = getMysqlPool as DbConnection;
    parser = new MysqlParser();
    cleanup = () => getMysqlPool.end();
  }

  try {
    const userRepository = new UsersRepository(dbConnection, parser);
    const documentsRepository = new DocumentsRepository(dbConnection, parser);

    await userRepository.createTable();
    await documentsRepository.createTable();
  } catch (error) {
    console.log(error);
  }

  await cleanup();
  process.exit();
}

main();
