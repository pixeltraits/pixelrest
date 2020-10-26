import http from 'http';
import nodemon from 'nodemon';

import Loggers from 'node-rest/logger';
import { SERVER_ERROR_CODES } from './server-errors.config.js';


export default class Server {

  constructor(expressApp, serverConfig) {
    this.config = serverConfig;
    this.server = http.createServer(expressApp);
    this.server.listen(this.config.PORT);
    this.server.on('error', error => Server.onError(error, this.config.PORT));
    this.server.on('listening', event => Server.onListening(this.config.HOST, this.config.PORT));
  }

  static onError(error, port) {
    if (error.code === SERVER_ERROR_CODES.PORT_ALREADY_IN_USE) {
      Loggers.handleError(`Port ${port} already in use`);

      nodemon.once(
        'exit',
        () => {
          process.exit();
        }
      ).emit('quit');

      return;
    }

    throw error;
  }

  static onListening(host, port) {
    Loggers.handleLog(`Listening on ${host}:${port}`);
  }

}
