const PATHS = require('../swagger/paths');
const SCHEMAS = require('../swagger/schemas');
const TAGS = require('../swagger/tags');

const SWAGGER_CONFIG = {
  openapi: '3.13.0',
  info: {
    title: 'Swagger node-rest',
    description: 'Documentation de l\'API REST',
    version: '1.0.0'
  },
  tags: TAGS,
  paths: PATHS,
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'apiKey',
        name: 'Authorization',
        in: 'header'
      }
    },
    schemas: SCHEMAS
  }
};

module.exports = SWAGGER_CONFIG;
