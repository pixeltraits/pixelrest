import App from './app/App.js';
import Server from './utils/nodeExpress/Server.js';
import { SERVER } from './app/config/server.js';
import { getMysqlConnection } from './app/config/mysqlDb.js';


async function main() {
  const mysqlConnection = await getMysqlConnection();
  const app = new App(mysqlConnection);
  const expressApp = app.getExpressApp();
  const server = new Server(expressApp, SERVER);

  expressApp.set('port', SERVER.PORT);
}

main();
