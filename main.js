const Server = require('./utils/Server');
const App = require('./app/App');
const SERVER_CONFIG = require('./app/config/server');

const app = new App();
const expressApp = app.getExpressApp();
const server = new Server(expressApp, SERVER_CONFIG.HOST, SERVER_CONFIG.PORT);

expressApp.set('port', SERVER_CONFIG.PORT);
