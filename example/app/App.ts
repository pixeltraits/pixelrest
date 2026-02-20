import express, { type Application, type Request, type Response, type NextFunction } from 'express';
import { serve, setup } from 'swagger-ui-express';
import morgan from 'morgan';
import type { Server as HttpServer } from 'http';

import { JWT } from './config/secret.js';
import { REPOSITORIES } from './repositories/index.js';
import { serverConfig, type ServerConfig } from './config/serverConfig.js';
import { SERVICES } from './services/index.js';
import { SWAGGER_CONFIG } from './config/swagger.js';
import Server from 'pixelrest/server';
import Logger from 'pixelrest/logger';
import { DbConnection } from 'pixelrest/dbConnection';
import BddParser from 'pixelrest/bddParser';


export default class App {
  private expressApp: Application;
  private serverConfig: ServerConfig;
  private repositories: Record<string, unknown>;
  private parser: BddParser;

  constructor(dbConnection: DbConnection, config: ServerConfig, parser: BddParser) {
    this.expressApp = express();
    this.serverConfig = config;
    this.repositories = {};
    this.parser = parser;
    const httpServer: HttpServer = this.expressApp.listen(this.serverConfig.port);
    httpServer.on('error', (error: NodeJS.ErrnoException) => Server.onError(error, this.serverConfig.port));
    httpServer.on('listening', () => Server.onListening(this.serverConfig.host, this.serverConfig.port));

    try {
      this.makeJsonParser();
      this.makeLogger();
      this.makeSwagger();
      this.makeHeaders();
      this.makeRepositories(dbConnection);
      this.makeRoutes();
      this.makeErrorHandler();
    } catch (error) {
      console.error(error);
    }
  }

  private makeErrorHandler(): void {
    this.expressApp.use((error: { status?: number }, _req: Request, res: Response, next: NextFunction) => {
      if (res.headersSent) {
        return next(error);
      }
      Logger.handleError(String(error));
      return res.status(error.status ?? 500).send({ message: error });
    });
  }

  private makeRepositories(dbConnection: DbConnection): void {
    const repositoryKeys = Object.keys(REPOSITORIES) as (keyof typeof REPOSITORIES)[];

    repositoryKeys.forEach(repositoryKey => {
      this.repositories[repositoryKey] = new REPOSITORIES[repositoryKey](
        dbConnection as unknown as Parameters<typeof REPOSITORIES[typeof repositoryKey]>[0],
        this.parser
      );
    });
  }

  private makeRoutes(): void {
    for (let x = 0; x < SERVICES.length; x++) {
      const service = new SERVICES[x](JWT.SECRET);
      service.setRepositories(this.repositories);
      this.expressApp.use('/', service.getRouter());
    }
  }

  private makeJsonParser(): void {
    this.expressApp.use(express.json({ limit: serverConfig.maxJsonRequestSize }));
    this.expressApp.use(express.urlencoded({ extended: false }));
  }

  private makeSwagger(): void {
    this.expressApp.use(
      '/api-docs',
      ...serve,
      setup(SWAGGER_CONFIG)
    );
  }

  private makeHeaders(): void {
    this.expressApp.use((req: Request, res: Response, next: NextFunction) => {
      res.header('Access-Control-Allow-Origin', this.serverConfig.corsOrigin);
      res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, PATCH, DELETE, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
      res.header('Content-Type', 'application/json');
      next();
    });
  }

  private makeLogger(): void {
    this.expressApp.use(morgan('dev'));
  }

  getExpressApp(): Application {
    return this.expressApp;
  }

}
