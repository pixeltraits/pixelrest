import nodemon from 'nodemon';

import Logger from 'node-rest/logger';
import { SERVER_ERROR_CODES } from './server-errors.config.js';

/**
 * @class Server
 */
export default class Server {
  /**
   * @static
   * @method onError
   * @param {object} error - Js Error oject
   * @param {number} port - Server port
   * @return {void}
   */
  static onError(error, port) {
    if (error.code === SERVER_ERROR_CODES.PORT_ALREADY_IN_USE) {
      Logger.handleError(`Port ${port} already in use`);

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
  /**
   * @static
   * @method onListening
   * @param {string} host - Server domain
   * @param {number} port - Server port
   * @return {void}
   */
  static onListening(host, port) {
    Logger.handleLog(`Listening on ${host}:${port}`);
  }
}
