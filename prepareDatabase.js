import { getMysqlConnection } from './example/config/mysqlDb.js';
import usersRepository from './example/repositories/users.repository.js';
import MysqlParser from 'node-rest/mysqlParser';


async function main() {
  const mysqlConnection = await getMysqlConnection();
  const userRepository = new usersRepository(mysqlConnection, MysqlParser);
  userRepository.createDataBase().then(() => {
  });
}

main();

