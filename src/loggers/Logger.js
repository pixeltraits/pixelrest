import logLevel from 'loglevel';
import fsPromises from 'fs/promises';

import {
  DEFAULT_LOG_CONFIG,
  LOGGER_ERRORS,
  FILE_ERROR_CODES
} from './logger.config.js';

/**
 * @class Logger
 */
export default class Logger {
  /**
   * handleLog
   * @public
   * @method handleLog
   * @param {string} log
   * @param {string} logFilePath - file log path
   * @return {void}
   */
  static async handleLog(log, logFilePath = DEFAULT_LOG_CONFIG.LOG_FILE) {
    logLevel.info(log);
    await Logger.addLogToFile(log, logFilePath);
  }
  /**
   * handleError
   * @public
   * @method handleError
   * @param {string} error
   * @param {string} logFilePath - file log path
   * @return {void}
   */
  static async handleError(error, logFilePath = DEFAULT_LOG_CONFIG.LOG_FILE) {
    logLevel.debug(error);
    await Logger.addLogToFile(error, logFilePath);
  }
  /**
   * handleSQLError
   * @public
   * @method handleSQLError
   * @param {string} error
   * @param {string} logFilePath - file log path
   * @return {void}
   */
  static async handleSQLError(error, logFilePath = DEFAULT_LOG_CONFIG.LOG_FILE) {
    logLevel.debug(error);
    await Logger.addLogToFile(error, logFilePath);
  }
  /**
   * addLogToFile
   * @public
   * @method addLogToFile
   * @param {string} newLogs
   * @param {string} logFilePath - file log path
   * @return {void}
   */
  static async addLogToFile(newLogs, logFilePath = DEFAULT_LOG_CONFIG.LOG_FILE) {
    const logDirPath = new URL(logFilePath.href.substring(0, logFilePath.href.lastIndexOf('/')));

    try {
      const existingLogs = await fsPromises.readFile(logFilePath, DEFAULT_LOG_CONFIG.ENCODING);
      await Logger.updateLogFile(existingLogs, newLogs, logFilePath);
    } catch (error) {
      if (error.code === FILE_ERROR_CODES.NOT_FOUND) {
        try {
          await fsPromises.mkdir(logDirPath);
          await Logger.updateLogFile(``, newLogs, logFilePath);
        } catch (errorDir) {
          if (errorDir.code === FILE_ERROR_CODES.ALREADY_EXIST) {
            await Logger.updateLogFile(``, newLogs, logFilePath);
          } else {
            logLevel.error(LOGGER_ERRORS.DIR_ERROR);
            logLevel.error(errorDir);
          }
        }
      } else {
        logLevel.error(LOGGER_ERRORS.READ_FILE_ERROR);
        logLevel.error(error);
      }
    }
  }
  /**
   * updateLogFile
   * @private
   * @method updateLogFile
   * @param {string} existingLogs
   * @param {string} newLogs
   * @param {string} logFilePath - file log path
   * @return {void}
   */
  static async updateLogFile(existingLogs, newLogs, logFilePath = DEFAULT_LOG_CONFIG.LOG_FILE) {
    try {
      await fsPromises.writeFile(logFilePath, `${existingLogs}${newLogs}`, DEFAULT_LOG_CONFIG.ENCODING);
    } catch (error) {
      logLevel.error(LOGGER_ERRORS.WRITE_FILE_ERROR);
      logLevel.error(error);
    }
  }
}
