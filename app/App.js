const express = require('express');
const swaggerUi = require('swagger-ui-express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');

const SERVICES = require('./services');
const SWAGGER_CONFIG = require('./config/swagger');
const Logger = require('../utils/Logger');
const CamelCasify = require('../utils/CamelCasify');


class App {

  constructor() {
    this.routes = [];
    this.app = express();

    try {
      this.makeBodyParser();
      this.makeLogger();
      this.makeSwagger();
      this.makeCelebrate();
      this.makeHeaders();
      this.makeCamelCaseResponseKeys();
      this.makeRoutes();
      this.makeErrorHandler();
    } catch (error) {
      console.error(error);
    }
  }

  makeErrorHandler() {
    this.app.use((err, req, res, next) => {
      if (res.headersSent) {
        return next(err);
      }
      Logger.console.error(err.stack);
      return res.status(err.status || 500).send({ message: err });
    });
  }

  makeRoutes() {
    for (let index = 0; index < SERVICES.length; index++) {
      this.routes.push(new SERVICES[index]());
      this.app.use('/', this.routes[index].getRouter());
    }
  }

  makeBodyParser() {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
  }

  makeCamelCaseResponseKeys() {
    this.app.use(CamelCasify.forExpress);
  }

  makeCelebrate() {
    this.app.use(errors());
  }

  makeSwagger() {
    this.app.use(
      '/api-docs',
      swaggerUi.serve,
      swaggerUi.setup(SWAGGER_CONFIG)
    );
  }

  makeHeaders() {
    this.app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
      res.header('Content-Type', 'application/json');
      next();
    });
  }

  makeLogger() {
    this.app.use(morgan('dev'));
  }

  getExpressApp() {
    return this.app;
  }

}

module.exports = App;
