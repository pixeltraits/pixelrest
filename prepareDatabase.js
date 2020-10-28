import { getMysqlConnection } from './app/config/mysqlDb.js';
import usersRepository from './app/repositories/users.repository.js';
import MysqlParser from 'node-rest/mysqlParser';


async function main() {
  const mysqlConnection = await getMysqlConnection();
  const userRepository = new usersRepository(mysqlConnection, MysqlParser);
  userRepository.createDataBase().then(() => {
  });
}

main();

