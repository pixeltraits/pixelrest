import logLevel from 'loglevel';
import fsPromises from 'fs/promises';

import {
  DEFAULT_LOG_CONFIG
} from './logger.config.js';


export default class Logger {

  static async handleLog(log, logFilePath = DEFAULT_LOG_CONFIG.LOG_FILE) {
    logLevel.info(log);
    await Logger.addLogToFile(log, logFilePath);
  }

  static async handleError(error, logFilePath = DEFAULT_LOG_CONFIG.LOG_FILE) {
    logLevel.debug(error);
    await Logger.addLogToFile(error, logFilePath);
  }

  static async handleSQLError(error, logFilePath = DEFAULT_LOG_CONFIG.LOG_FILE) {
    logLevel.debug(error);
    await Logger.addLogToFile(error, logFilePath);
  }

  static async addLogToFile(newLogs, logFilePath = DEFAULT_LOG_CONFIG.LOG_FILE) {
    const logDirPath = new URL(logFilePath.href.substring(0, logFilePath.href.lastIndexOf('/')));

    try {
      const existingLogs = await fsPromises.readFile(logFilePath, `utf-8`);
      await Logger.updateLogFile(existingLogs, newLogs, logFilePath);
    } catch (error) {
      if (error.code === `ENOENT`) {
        try {
          await fsPromises.mkdir(logDirPath);
          await Logger.updateLogFile(``, newLogs, logFilePath);
        } catch (errorDir) {
          if (errorDir.code === `EEXIST`) {
            await Logger.updateLogFile(``, newLogs, logFilePath);
          } else {
            logLevel.error(`There is something wrong with log directory =>`);
            logLevel.error(errorDir);
          }
        }
      } else {
        logLevel.error(`There is something wrong with log file(reading) =>`);
        logLevel.error(error);
      }
    }
  }

  static async updateLogFile(existingLogs, newLogs, logFilePath = DEFAULT_LOG_CONFIG.LOG_FILE) {
    try {
      await fsPromises.writeFile(logFilePath, `${existingLogs}${newLogs}`, `utf-8`);
    } catch (error) {
      logLevel.error(`There is something wrong with log file(writing) =>`);
      logLevel.error(error);
    }
  }

}
