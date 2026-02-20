import UsersRepository from '../repositories/users.repository.js';
import DocumentsRepository from '../repositories/documents.repository.js';

import { getMysqlPool } from '../config/mysqlDb.js';
import MysqlParser from '../../../src/database/MysqlParser.js';
import { DbConnection } from '../../../src/database/repository.config.js';


async function main(): Promise<void> {
  try {
    const userRepository = new UsersRepository(getMysqlPool as DbConnection, new MysqlParser());
    const documentsRepository = new DocumentsRepository(getMysqlPool, new MysqlParser());

    await userRepository.createTable();
    await documentsRepository.createTable();
  } catch (error) {
    console.log(error);
  }
  await getMysqlPool.end();
  process.exit();
}

main();
