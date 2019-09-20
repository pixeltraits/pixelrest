const path = require('path');

const SERVER = {
  HOST: 'localhost',
  PORT: 1338,
  LOG_DIR: path.join(__dirname, '../../log'),
  LOG_FILE: path.join(__dirname, '../../log/serverLog.log'),
  URL_DOCUMENTS: 'documents'
};

module.exports = SERVER;
