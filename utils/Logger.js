const fs = require('fs');
const rfs = require('rotating-file-stream');

const SERVER = require('../business/config/server');


class Logger {

  static handleLog(log) {
    Logger.addLogToFile(log);
    rfs(
      SERVER.LOG_FILE,
      {
        interval: '1M'
      }
    );
  }

  static handleError(error) {
    Logger.addLogToFile(error);
    rfs(
      SERVER.LOG_FILE,
      {
        interval: '1M'
      }
    );
  }

  static addLogToFile(newLogs) {
    fs.readFile(
      SERVER.LOG_FILE,
      'utf-8',
      (readingError, existingLogs) => {
        if (readingError) {
          if (readingError.code === 'ENOENT') {
            fs.mkdir(
              SERVER.LOG_DIR,
              (error) => {
                if (!error || (error && error.code !== 'EEXIST')) {
                  Logger.updateLogFile(existingLogs, newLogs);
                }
              }
            );
          } else {
            throw readingError;
          }
        } else {
          Logger.updateLogFile(existingLogs, newLogs);
        }
      }
    );
  }

  static updateLogFile(existingLogs, newLogs) {
    fs.writeFile(
      SERVER.LOG_FILE,
      `${existingLogs}${newLogs}`,
      'utf-8',
      (writingError) => {
        if (writingError) {
          throw writingError;
        }
      }
    );
  }

}

module.exports = Logger;
