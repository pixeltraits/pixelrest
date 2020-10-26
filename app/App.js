import express from 'express';
import swaggerUi from 'swagger-ui-express';
import morgan from 'morgan';

import Logger from 'node-rest/logger';
import MysqlParser from 'node-rest/mysqlParser';

import { JWT } from './config/secret.js';
import { REPOSITORIES } from './repositories/index.js';
import { mysql } from './config/mysqlDb.js';
import { SERVER } from './config/server.js';
import { SERVICES } from './services/index.js';
import { SWAGGER_CONFIG } from './config/swagger.js';


export default class App {

  constructor() {
    this.app = express();
    this.repositories = {};

    try {
      this.makeJsonParser();
      this.makeLogger();
      this.makeSwagger();
      this.makeHeaders();
      this.makeRepositories();
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
      Logger.handleError(err.stack);
      return res.status(err.status || 500).send({ message: err });
    });
  }

  makeRepositories() {
    const repositoryKeys = Object.keys(REPOSITORIES);

    repositoryKeys.forEach(repositoryKey => {
      const RepositoryClass = REPOSITORIES[repositoryKey];

      this.repositories[repositoryKey] = new RepositoryClass(mysql, MysqlParser);
    });
  }

  makeRoutes() {
    for (let x = 0; x < SERVICES.length; x++) {
      const service = new SERVICES[x](this.repositories.pool, JWT.SECRET);
      service.setModel(this.repositories);
      this.app.use('/', service.getRouter());
    }
  }

  makeJsonParser() {
    this.app.use(express.json({ limit: SERVER.MAX_JSON_REQUEST_SIZE }));
    this.app.use(express.urlencoded({ extended: false }));
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
      res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, PATCH, DELETE, OPTIONS');
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
