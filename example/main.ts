import App from './app/App.js';
import { serverConfig } from './app/config/serverConfig.js';
import { getMysqlPool } from './app/config/mysqlDb.js';


new App(getMysqlPool, serverConfig);
