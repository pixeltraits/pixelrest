import express from 'express';
import swaggerUi from 'swagger-ui-express';
import morgan from 'morgan';

import Logger from 'node-rest/logger';
import Server from 'node-rest/server';
import MysqlParser from 'node-rest/mysqlParser';

import { JWT } from './config/secret.js';
import { REPOSITORIES } from './repositories/index.js';
import { SERVER } from './config/server.js';
import { SERVICES } from './services/index.js';
import { SWAGGER_CONFIG } from './config/swagger.js';


export default class App {
  /**
   * Constructor
   * @method constructor
   * @param {object} expressApp - Express App instance
   * @param {object} serverConfig - Server config
   * @return {void}
   */
  constructor(mysqlConnection, serverConfig) {
    this.expressApp = express();
    this.serverConfig = serverConfig;
    this.repositories = {};
    this.expressApp.listen(this.serverConfig.PORT);
    this.expressApp.on('error', error => Server.onError(error, this.serverConfig.PORT));
    this.expressApp.on('listening', event => Server.onListening(this.serverConfig.HOST, this.serverConfig.PORT));

    try {
      this.makeJsonParser();
      this.makeLogger();
      this.makeSwagger();
      this.makeHeaders();
      this.makeRepositories(mysqlConnection);
      this.makeRoutes();
      this.makeErrorHandler();
    } catch (error) {
      console.error(error);
    }
  }

  makeErrorHandler() {
    this.expressApp.use((error, req, res, next) => {
      if (res.headersSent) {
        return next(error);
      }
      Logger.handleError(error.stack);
      return res.status(error.status || 500).send({ message: error });
    });
  }

  makeRepositories(mysqlConnection) {
    const repositoryKeys = Object.keys(REPOSITORIES);

    repositoryKeys.forEach(repositoryKey => {
      this.repositories[repositoryKey] = new REPOSITORIES[repositoryKey](mysqlConnection, new MysqlParser());
    });
  }

  makeRoutes() {
    for (let x = 0; x < SERVICES.length; x++) {
      const service = new SERVICES[x](JWT.SECRET);
      service.setRepositories(this.repositories);
      this.expressApp.use('/', service.getRouter());
    }
  }

  makeJsonParser() {
    this.expressApp.use(express.json({ limit: SERVER.MAX_JSON_REQUEST_SIZE }));
    this.expressApp.use(express.urlencoded({ extended: false }));
  }

  makeSwagger() {
    this.expressApp.use(
      '/api-docs',
      swaggerUi.serve,
      swaggerUi.setup(SWAGGER_CONFIG)
    );
  }

  makeHeaders() {
    this.expressApp.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, PATCH, DELETE, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
      res.header('Content-Type', 'application/json');
      next();
    });
  }

  makeLogger() {
    this.expressApp.use(morgan('dev'));
  }

  getExpressApp() {
    return this.expressApp;
  }

}
