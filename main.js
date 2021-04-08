import App from './example/App.js';
import { SERVER } from './example/config/server.js';
import { getMysqlConnection } from './example/config/mysqlDb.js';


async function main() {
  const mysqlConnection = await getMysqlConnection();
  const app = new App(mysqlConnection, SERVER);
}

main();
