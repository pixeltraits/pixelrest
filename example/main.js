import App from './app/App.js';
import { SERVER } from './app/config/server.js';
import { getMysqlPool } from './app/config/mysqlDb.js';


new App(getMysqlPool, SERVER);
