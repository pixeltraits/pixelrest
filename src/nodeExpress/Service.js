import express from 'express';

import Auth from 'node-rest/auth';
import Middleware from 'node-rest/middleware';
import HttpResolver from 'node-rest/httpResolver';

import { HTTP_METHODS } from './http-methods.config.js';
import { SERVICE_ERRORS, TOKEN_ERROR_CODES } from './service-errors.config.js';

/**
 * @abstract
 * @class Service
 */
export default class Service {
  /**
   * Constructor
   * @method constructor
   * @param {string} tokenSecret - Token password
   * @return {void}
   */
  constructor(tokenSecret) {
    this.router = express.Router();
    this.routesConfig = [];
    this.tokenData = null;
    this.tokenSecret = tokenSecret;
    this.HTTP_METHODS = HTTP_METHODS;

    this.initRoute();

    this.routesConfig.forEach((routeConfig, index) => {
      this.addRoute(routeConfig);
    });
  }
  /**
   * Define all service routes
   * This methode must be override
   * In the override version this.routesConfig must be setted
   * This method is called in constructor before Express router configuration
   * @private
   * @method initRoute
   * @return {void}
   */
  initRoute() {
    throw new Error(`${SERVICE_ERRORS.INIT_ROUTE}${this.constructor.name}`);
  }
  /**
   * Set all repositories instances
   * @public
   * @method setRepositories
   * @param {object<Repository>} repositories
   * @return {void}
   */
  setRepositories(repositories) {
    this.repositories = repositories;
  }
  /**
   * Get express router instance
   * @public
   * @method getRouter
   * @return {object<Router>} - Express router instance
   */
  getRouter() {
    return this.router;
  }
  /**
   * Add route
   * @private
   * @method addRouteWithoutFileUpload
   * @param {object} routeConfig
   * @return {void}
   */
  addRoute(routeConfig) {
    const multerMiddlewares = [
      (req, res, next) => Middleware.multer(req, res, next, routeConfig.multerConfig),
      (req, res, next) => Middleware.parseMulterBody(req, res, next)
    ];
    const commonMiddlewares = [
      (req, res, next) => Middleware.joi(req, res, next, routeConfig.schema),
      (req, res, next) => this.authorizationMiddleware(req, res, next, routeConfig.roles),
      (req, res) => this.serviceMethodExecution(req, res, routeConfig.execute)
    ];
    let middlewares = commonMiddlewares;

    if (routeConfig.multerConfig) {
      middlewares = [
        ...multerMiddlewares,
        ...commonMiddlewares
      ]
    }

    this.router[routeConfig.method](
      routeConfig.route,
      ...middlewares
    );
  }
  /**
   * Middleware - Acces route control, with token and roles
   * @private
   * @method authorizationMiddleware
   * @param {object} req
   * @param {object} res
   * @param {function} next
   * @param {string[]} authorizedRoles
   * @return {void}
   */
  authorizationMiddleware(req, res, next, authorizedRoles) {
    const token = req.headers.authorization;

    if (Auth.hasPublicRole(authorizedRoles)) {
      next();
    }

    if (!token) {
      Service.sendEmptyTokenError(res);
    }

    try {
      this.tokenData = Auth.verify(token, this.tokenSecret);
    } catch (error) {
      Service.sendTokenError(res, error);
    }

    if (!Auth.checkMultiRoles(authorizedRoles, this.tokenData.roles)) {
      Service.sendRoleError(res);
    }

    next();
  }
  /**
   * Tool - Service code execution
   * @private
   * @method serviceMethodExecution
   * @param {object} req
   * @param {object} res
   * @param {string} methodeName
   * @return {void}
   */
  serviceMethodExecution(req, res, methodeName) {
    this[methodeName](req, res);
  }
  /**
   * Tool - Send empty token http error
   * @private
   * @method sendEmptyTokenError
   * @param {Object} res
   * @return {void}
   */
  static sendEmptyTokenError(res) {
    HttpResolver.unauthorized(
      SERVICE_ERRORS.SERVICE_TOKEN_ERROR,
      SERVICE_ERRORS.ANY_TOKEN,
      res
    );
  }
  /**
   * Tool - Send token http error
   * @private
   * @method sendTokenError
   * @param {object} res
   * @param {object} error
   * @return {void}
   */
  static sendTokenError(res, error) {
    if (error.message === TOKEN_ERROR_CODES.EXPIRED) {
      return HttpResolver.tokenExpired(
        SERVICE_ERRORS.SERVICE_TOKEN_ERROR,
        SERVICE_ERRORS.EXPIRED_TOKEN,
        res
      );
    }

    return HttpResolver.unauthorized(
      SERVICE_ERRORS.SERVICE_TOKEN_ERROR,
      SERVICE_ERRORS.UNAUTHORIZED_USER,
      res
    );
  }
  /**
   * Tool - Send role http error
   * @private
   * @method sendRoleError
   * @param {object} res
   * @return {void}
   */
  static sendRoleError(res) {
    HttpResolver.unauthorized(
      SERVICE_ERRORS.SERVICE_TOKEN_ERROR,
      SERVICE_ERRORS.RIGHTS_ERROR,
      res
    );
  }
}
