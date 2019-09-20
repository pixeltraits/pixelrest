const express = require('express');
const { celebrate } = require('celebrate');

const Auth = require('./Auth');
const HttpResolver = require('./HttpResolver');
const ERRORS = require('../app/constants/errors');
const { TOKEN_ERROR_CODES } = require('../app/constants/errorCodes');


/**
 * Abstract class Service
 * @class Service
 */
class Service {

  /**
   * Constructor
   * @method constructor
   * @return {void}
   */
  constructor() {
    this.router = express.Router();
    this.routesConfig = [];
    this.tokenData = null;

    this.router.use((req, res, next) => {
      next();
    });

    this.initRoute();
    this.initModel();

    this.routesConfig.forEach((routeConfig, index) => {
      if (!routeConfig.schema) {
        this.routesConfig[index].schema = celebrate({ body: {} });
      }
      this.router[routeConfig.method](routeConfig.route, routeConfig.schema, (req, res) => {
        if (this.authorizationControl(req, res, routeConfig)) {
          this[routeConfig.execute](req, res);
        }
      });
    });
  }

  /**
   * Define route of the service
   * @method initRoute
   * @return {void}
   */
  initRoute() {
    throw new Error(`${ERRORS.INIT_ROUTE}${this.constructor.name}`);
  }

  /**
   * Transmit databaseGateway instance to models of the service
   * @method initModel
   * @return {void}
   */
  initModel() {
  }

  /**
   * Get router instance
   * @method getRouter
   * @return {expressRouter} - Express router instance
   */
  getRouter() {
    return this.router;
  }

  /**
   * Notify token error
   * @method tokenError
   * @param {HttpResponse} res
   * @param {object} error - JWT token error object
   * @return {void}
   */
  tokenError(res, error) {
    if (error.name === TOKEN_ERROR_CODES.EXPIRED) {
      HttpResolver.tokenExpired(res)
    }

    return HttpResolver.unauthorized(res);
  }

  /**
   * Acces route control
   * @method authorizationControl
   * @param {HttpRequest} req
   * @param {HttpResponse} res
   * @param {routeConfig} routeConfig - Route configuration
   * @return {boolean} authorization value
   */
  authorizationControl(req, res, routeConfig) {
    const token = req.headers.authorization;
    const userRoles = this.tokenData.roles;
    const authorizedRoles = routeConfig.roles;

    if (Auth.hasPublicRole(routeConfig.roles)) {
      return true;
    }

    if (!token) {
      HttpResolver.unauthorized(res);
      return false;
    }

    try {
      this.tokenData = Auth.verify(token);
    } catch (error) {
      this.tokenError(res, error);
      return false;
    }

    if (!Auth.checkMultiRoles(authorizedRoles, userRoles)) {
      HttpResolver.unauthorized(res);
      return false;
    }

    return true;
  }

}

module.exports = Service;
