import fs from 'fs';
import rfs from 'rotating-file-stream';

import {
  DEFAULT_LOG_CONFIG
} from './logger.config.js';


export default class Logger {

  static handleLog(log, logFilePath = DEFAULT_LOG_CONFIG.LOG_FILE) {
    Logger.addLogToFile(log);
    rfs.createStream(
      logFilePath.pathname,
      {
        size: `100M`
      }
    );
  }

  static handleError(error, logFilePath = DEFAULT_LOG_CONFIG.LOG_FILE) {
    console.log(error);
    Logger.addLogToFile(error);
    rfs.createStream(
      logFilePath.pathname,
      {
        size: `100M`
      }
    );
  }

  static addLogToFile(newLogs, logFilePath = DEFAULT_LOG_CONFIG.LOG_FILE, logDirPath = DEFAULT_LOG_CONFIG.LOG_DIR) {
    fs.readFile(
      logFilePath,
      `utf-8`,
      (readingError, existingLogs) => {
        if (readingError) {
          if (readingError.code === `ENOENT`) {
            fs.mkdir(
              logDirPath,
              (error) => {
                if (!error || (error && error.code !== `EEXIST`)) {
                  Logger.updateLogFile(existingLogs, newLogs, logFilePath);
                }
              }
            );
          } else {
            throw readingError;
          }
        } else {
          Logger.updateLogFile(existingLogs, newLogs, logFilePath);
        }
      }
    );
  }

  static updateLogFile(existingLogs, newLogs, logFilePath = DEFAULT_LOG_CONFIG.LOG_FILE) {
    fs.writeFile(
      logFilePath,
      `${existingLogs}${newLogs}`,
      `utf-8`,
      writingError => {
        if (writingError) {
          throw writingError;
        }
      }
    );
  }

  static handleSQLError(error, logFilePath = DEFAULT_LOG_CONFIG.LOG_FILE) {
    console.log(error);
    Logger.addLogToFile(error);
    rfs.createStream(
      logFilePath.pathname,
      {
        size: `100M`
      }
    );
    throw new Error(`SQL ERROR`);
  }

}
