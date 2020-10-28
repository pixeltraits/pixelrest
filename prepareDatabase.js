import { mysql } from './app/config/mysqlDb.js';
import usersRepository from './app/repositories/users.repository.js';
import MysqlParser from 'node-rest/mysqlParser';

const userRepository = new usersRepository(mysql, MysqlParser);
userRepository.createDataBase().then(() => {
});
