const ConnectionSchemas = require('./connection.schemas');
const UsersSchemas = require('./users.schemas');

const SCHEMAS = {
  ...ConnectionSchemas,
  ...UsersSchemas
};

module.exports = SCHEMAS;
