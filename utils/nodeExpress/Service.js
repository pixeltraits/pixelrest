import express from 'express';
import multer from 'multer';

import Auth from 'node-rest/auth';
import HttpResolver from 'node-rest/httpResolver';

import { HTTP_METHODS } from './http-methods.config.js';
import { SERVICE_ERRORS, TOKEN_ERROR_CODES } from './service-errors.config.js';


export default class Service {
  /**
   * Constructor
   * @method constructor
   * @param {DatabaseGateway} databaseGateway - DatabaseGateway instance
   * @return {void}
   */
  constructor(poolBdd, tokenSecret) {
    this.router = express.Router();
    this.routesConfig = [];
    this.tokenData = null;
    this.tokenSecret = tokenSecret;
    this.HTTP_METHODS = HTTP_METHODS;

    this.router.use((req, res, next) => {
      next();
    });

    this.poolBdd = poolBdd;
    this.initRoute();
    this.initModel();

    this.routesConfig.forEach((routeConfig, index) => {
      if (!routeConfig.schema) {
        this.routesConfig[index].schema = [];
      }

      if (routeConfig.multerConfig) {
        this.routeWithFileUpload(routeConfig);
      } else {
        this.routeWithoutFileUpload(routeConfig);
      }
    });
  }

  routeWithFileUpload(routeConfig) {
    const multerConfig = routeConfig.multerConfig;
    const multerMiddleware = multer({
      dest: multerConfig.uploadDirectory,
      limits: multerConfig.limits,
      fileFilter: (req, file, cb) => {
        if (multerConfig.allowedMimeTypes.findIndex(allowedMimeType => allowedMimeType === file.mimetype) === -1) {
          return cb(new Error(`Ce mime type n'est pas autorisé`));
        }
        return cb(null, true);
      }
    });

    this.router[routeConfig.method](
      routeConfig.route,
      multerMiddleware[multerConfig.multerMethodName](multerConfig.documentFieldName),
      Service.parseBodyMulter,
      (req, res, next) => this.joiMiddleware(req, res, next, routeConfig.schema),
      (req, res) => {
        if (this.authorizationControl(req, res, routeConfig)) {
          this[routeConfig.execute](req, res);
        }
      }
    );
  }

  static parseBodyMulter(req, res, next) {
    const body = req.body;

    if (body.length === 0) {
      return next();
    }

    Object.keys(req.body).forEach(bodyProperty => {
      if (
        body[bodyProperty][0] === '{' &&
        body[bodyProperty][body[bodyProperty].length - 1] === '}'
      ) {
        body[bodyProperty] = JSON.parse(body[bodyProperty]);
      }
    });

    req.body = body;
    return next();
  }

  routeWithoutFileUpload(routeConfig) {
    this.router[routeConfig.method](
      routeConfig.route,
      (req, res, next) => this.joiMiddleware(req, res, next, routeConfig.schema),
      (req, res) => {
        if (this.authorizationControl(req, res, routeConfig)) {
          this[routeConfig.execute](req, res);
        }
      }
    );
  }

  joiMiddleware(req, res, next, schema) {
    if (schema) {
      if (schema.body) {
        const error = this.joiValidation(req.body, schema.body, res);
        if (error) {
          return this.getValidationErrorResponse(error, res);
        }
      }
      if (schema.params) {
        const error = this.joiValidation(req.params, schema.params, res);
        if (error) {
          return this.getValidationErrorResponse(error, res);
        }
      }
      if (schema.query) {
        const error = this.joiValidation(req.query, schema.query, res);
        if (error) {
          return this.getValidationErrorResponse(error, res);
        }
      }
    }

    next();
  }

  joiValidation(requestSegment, schemaSegment) {
    const { error } = schemaSegment.validate(requestSegment);
    return error;
  }

  getValidationErrorResponse(error, res) {
    return HttpResolver.serviceUnavailable(
      new Date().getTime(),
      `Joi`,
      `Erreur lors de la validation des paramètres de la requète:\n ${error}`,
      res
    );
  }

  /**
   * Define route of the service
   * @method initRoute
   * @return {void}
   */
  initRoute() {
    throw new Error(`${SERVICE_ERRORS.INIT_ROUTE}${this.constructor.name}`);
  }

  /**
   * Transmit db instance to models of the service !!! Retro Compatibilité, finir la derniere revision des services
   * @method initModel
   * @return {void}
   */
  initModel() {
  }

  /**
   * Transmit db instance to models of the service
   * @method setModel
   * @return {void}
   */
  setModel(db) {
    this.db = db;
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
   * Notify empty token error
   * @method emptyTokenError
   * @param {HttpResponse} res
   * @param {routeConfig} routeConfig - Route configuration
   * @return {void}
   */
  emptyTokenError(res) {
    HttpResolver.unauthorized(
      new Date().getTime(),
      `Service token control`,
      `Aucun token reçu`,
      res
    );
  }

  /**
   * Notify token error
   * @method tokenError
   * @param {HttpResponse} res
   * @param {object} error - JWT token error object
   * @param {routeConfig} routeConfig - Route configuration
   * @return {void}
   */
  tokenError(error, res) {
    if (error.name === TOKEN_ERROR_CODES.EXPIRED) {
      return HttpResolver.tokenExpired(
        new Date().getTime(),
        `Service token control`,
        `Le token a expiré`,
        res
      );
    }

    return HttpResolver.unauthorized(
      new Date().getTime(),
      `Service token control`,
      `Utilisateur non autorisé`,
      res
    );
  }

  /**
   * Notify role error
   * @method roleError
   * @param {HttpResponse} res
   * @param {routeConfig} routeConfig - Route configuration
   * @param {string[]} userRoles - User's roles
   * @return {void}
   */
  roleError(res) {
    HttpResolver.unauthorized(
      new Date().getTime(),
      `Service token control`,
      `Utilisateur n'a pas les droits suffisant`,
      res
    );
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
    if (Auth.hasPublicRole(routeConfig.roles)) {
      return true;
    }

    const token = req.headers.authorization;
    if (!token) {
      this.emptyTokenError(res);
      return false;
    }

    try {
      this.tokenData = Auth.verify(token, this.tokenSecret);
    } catch (error) {
      this.tokenError(error, res);
      return false;
    }

    const userRoles = this.tokenData.roles;
    const authorizedRoles = routeConfig.roles;
    if (!Auth.checkMultiRoles(authorizedRoles, userRoles)) {
      this.roleError(res);
      return false;
    }

    return true;
  }

}
