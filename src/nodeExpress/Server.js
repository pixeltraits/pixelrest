import nodemon from 'nodemon';

import Logger from 'node-rest/logger';
import { SERVER_STRINGS, SERVER_ERROR_CODES } from './server-errors.config.js';

/**
 * @class Server
 */
export default class Server {
  /**
   * @public
   * @method onError
   * @param {object} error - Js Error oject
   * @param {number} port - Server port
   * @return {void}
   */
  static onError(error, port) {
    if (error.code === SERVER_ERROR_CODES.PORT_ALREADY_IN_USE) {
      Logger.handleError(`${SERVER_STRINGS.PORT}${port}${SERVER_STRINGS.ALREADY_IN_USE}`);

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
   * @public
   * @method onListening
   * @param {string} host - Server domain
   * @param {number} port - Server port
   * @return {void}
   */
  static onListening(host, port) {
    Logger.handleLog(`${SERVER_STRINGS.LISTENING_ON}${host}:${port}`);
  }
}
