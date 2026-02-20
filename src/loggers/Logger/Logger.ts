import logLevel from 'loglevel';
import fsPromises from 'fs/promises';

import {
  DEFAULT_LOG_CONFIG,
  LOGGER_ERRORS,
  FILE_ERROR_CODES
} from './logger.config.js';

export default class Logger {
  static async handleLog(log: string, logFilePath: URL = DEFAULT_LOG_CONFIG.LOG_FILE): Promise<void> {
    logLevel.enableAll();
    logLevel.info(log);
    await Logger.addLogToFile(log, logFilePath);
  }

  static async handleError(error: string, logFilePath: URL = DEFAULT_LOG_CONFIG.LOG_FILE): Promise<void> {
    logLevel.enableAll();
    logLevel.debug(error);
    await Logger.addLogToFile(error, logFilePath);
  }

  static async handleSQLError(error: string, logFilePath: URL = DEFAULT_LOG_CONFIG.LOG_FILE): Promise<void> {
    logLevel.enableAll();
    logLevel.debug(error);
    await Logger.addLogToFile(error, logFilePath);
  }

  static async addLogToFile(newLogs: string, logFilePath: URL = DEFAULT_LOG_CONFIG.LOG_FILE): Promise<void> {
    const logDirPath = new URL(logFilePath.href.substring(0, logFilePath.href.lastIndexOf('/')));

    try {
      const existingLogs = await fsPromises.readFile(logFilePath, DEFAULT_LOG_CONFIG.ENCODING);
      await Logger.updateLogFile(existingLogs, newLogs, logFilePath);
    } catch (error) {
      const err = error as NodeJS.ErrnoException;
      if (err.code === FILE_ERROR_CODES.NOT_FOUND) {
        try {
          await fsPromises.mkdir(logDirPath);
          await Logger.updateLogFile('', newLogs, logFilePath);
        } catch (errorDir) {
          const errDir = errorDir as NodeJS.ErrnoException;
          if (errDir.code === FILE_ERROR_CODES.ALREADY_EXIST) {
            await Logger.updateLogFile('', newLogs, logFilePath);
          } else {
            logLevel.error(LOGGER_ERRORS.DIR_ERROR);
            logLevel.error(errDir);
          }
        }
      } else {
        logLevel.error(LOGGER_ERRORS.READ_FILE_ERROR);
        logLevel.error(err);
      }
    }
  }

  private static async updateLogFile(existingLogs: string, newLogs: string, logFilePath: URL = DEFAULT_LOG_CONFIG.LOG_FILE): Promise<void> {
    try {
      await fsPromises.writeFile(logFilePath, `${existingLogs}${newLogs}`, DEFAULT_LOG_CONFIG.ENCODING);
    } catch (error) {
      logLevel.error(LOGGER_ERRORS.WRITE_FILE_ERROR);
      logLevel.error(error);
    }
  }
}
