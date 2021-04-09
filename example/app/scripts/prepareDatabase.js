import MysqlParser from 'pixelrest/mysqlParser';

import UsersRepository from '../repositories/users.repository.js';
import DocumentsRepository from '../repositories/documents.repository.js';

import { getMysqlConnection } from '../config/mysqlDb.js';


async function main() {
  try {
    const mysqlConnection = await getMysqlConnection();
    const userRepository = new UsersRepository(mysqlConnection, new MysqlParser());
    const documentsRepository = new DocumentsRepository(mysqlConnection, new MysqlParser());

    await userRepository.createTable();
    await documentsRepository.createTable();
  } catch (error) {
    console.log(error);
  }
  process.exit();
}

main();

