import App from './app/App.js';
import Server from './utils/nodeExpress/Server.js';
import { SERVER } from './app/config/server.js';

const app = new App();
const expressApp = app.getExpressApp();
const server = new Server(expressApp, SERVER);

expressApp.set('port', SERVER.PORT);
