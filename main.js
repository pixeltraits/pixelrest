const Server = require('./utils/Server');
const App = require('./business/App');
const SERVER_CONFIG = require('./business/config/server');

const app = new App();
const expressApp = app.getExpressApp();
const server = new Server(expressApp, SERVER_CONFIG.HOST, SERVER_CONFIG.PORT);

expressApp.set('port', SERVER_CONFIG.PORT);
