import App from './app/App.js';
import { SERVER } from './app/config/server.js';
import { getMysqlConnection } from './app/config/mysqlDb.js';


async function main() {
  const mysqlConnection = await getMysqlConnection();
  new App(mysqlConnection, SERVER);
}

main();
