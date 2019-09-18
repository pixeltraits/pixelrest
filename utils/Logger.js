const fs = require('fs');
const rfs = require('rotating-file-stream');

const SERVER_CONFIG = require('../business/config/server');


class Logger {

  static handleLog(log) {
    console.log(log);
    Logger.addLogToFile(log);
    rfs(
      SERVER_CONFIG.LOG_FILE,
      {
        interval: '1M'
      }
    );
  }

  static handleError(error) {
    console.error(error);
    Logger.addLogToFile(error);
    rfs(
      SERVER_CONFIG.LOG_FILE,
      {
        interval: '1M'
      }
    );
  }

  static addLogToFile(newLog) {
    fs.readFile(SERVER_CONFIG.LOG_FILE, 'utf-8', (readingError, data) => {
      if (readingError) throw readingError;
      fs.writeFile(
        SERVER_CONFIG.LOG_FILE,
        `${data}${newLog}`,
        'utf-8',
        (writingError) => {
          if (writingError) throw writingError;
        }
      );
    });
  }

}

module.exports = Logger;
