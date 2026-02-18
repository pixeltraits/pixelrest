import MysqlParser from 'pixelrest/mysqlParser';

import UsersRepository from '../repositories/users.repository.js';
import DocumentsRepository from '../repositories/documents.repository.js';

import { getMysqlPool } from '../config/mysqlDb.js';


async function main() {
  try {
    const userRepository = new UsersRepository(getMysqlPool, new MysqlParser());
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

