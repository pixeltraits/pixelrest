import Logger from '../loggers/Logger.js';
import { SERVER_STRINGS, SERVER_ERROR_CODES } from './server-errors.config.js';

export default class Server {
  static onError(error: NodeJS.ErrnoException, port: number): void {
    if (error.code === SERVER_ERROR_CODES.PORT_ALREADY_IN_USE) {
      Logger.handleError(`${SERVER_STRINGS.PORT}${port}${SERVER_STRINGS.ALREADY_IN_USE}`);
      process.exit(1);
      return;
    }

    throw error;
  }

  static onListening(host: string, port: number): void {
    Logger.handleLog(`${SERVER_STRINGS.LISTENING_ON}${host}:${port}`);
  }
}
