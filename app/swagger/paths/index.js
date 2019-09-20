const ConnectionPaths = require('./connection.paths');
const UsersPaths = require('./users.paths');

const PATHS = {
  ...ConnectionPaths,
  ...UsersPaths
};

module.exports = PATHS;
