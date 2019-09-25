const http = require('http');
const nodemon = require('nodemon');

const Loggers = require('../loggers/Logger');


class Server {

  constructor(expressApp, host, port) {
    this.server = http.createServer(expressApp);
    this.host = host;
    this.port = port;
    this.server.listen(this.port);
    this.server.on('error', Server.onError);
    this.server.on('listening', Server.onListening);
  }

  static onError(error) {
    if (error.code === 'EADDRINUSE') {
      Loggers.handleError(`Port ${this.port} already in use`);
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

  static onListening() {
    Loggers.handleLog(`Listening on ${this.host}:${this.port}`);
  }

}

module.exports = Server;
