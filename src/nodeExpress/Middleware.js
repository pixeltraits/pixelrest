import multer from "multer";
import HttpResolver from 'node-rest/httpResolver';

import { SERVICE_ERRORS } from './service-errors.config.js';

/**
 * @class Middleware
 */
export default class Middleware {
  /**
   * Multer body parser
   * @public
   * @method parseMulterBody
   * @param {Object} req
   * @param {Object} res
   * @param {function} next
   * @return {void}
   */
  static parseMulterBody(req, res, next) {
    const body = req.body;

    if (!body || body.length === 0) {
      next();
      return;
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

    next();
  }
  /**
   * Joi Middleware
   * @public
   * @method joi
   * @param {Object} req
   * @param {Object} res
   * @param {function} next
   * @param {Object} schema
   * @return {void}
   */
  static joi(req, res, next, schema) {
    if (schema) {
      let validationStatus = true;
      if (schema.body && !Middleware.joiValidation(req.body, schema.body, res)) {
        validationStatus = false;
      }
      if (schema.params && !Middleware.joiValidation(req.params, schema.params, res)) {
        validationStatus = false;
      }
      if (schema.query && !Middleware.joiValidation(req.query, schema.query, res)) {
        validationStatus = false;
      }
      if (validationStatus) {
        next();
      }
    } else {
      next();
    }
  }
  /**
   * Joi request validation
   * @private
   * @method joiValidation
   * @param {Object} requestSegment
   * @param {Object} schemaSegment
   * @param {Object} res
   * @return boolean
   */
  static joiValidation(requestSegment, schemaSegment, res) {
    const { error } = schemaSegment.validate(requestSegment);

    if (error) {
      HttpResolver.serviceUnavailable(`Joi`, `${SERVICE_ERRORS.JOI_VALIDATION}${error}`, res);
      return false;
    }

    return true;
  }
  /**
   * Multer middleware
   * @public
   * @method multer
   * @param {Object} req
   * @param {Object} res
   * @param {function} next
   * @param {Object} multerConfig
   * @return {function} - multer middleware
   */
  static multer(req, res, next, multerConfig) {
    const multerMiddleware = multer({
      dest: multerConfig.uploadDirectory,
      limits: multerConfig.limits,
      fileFilter: Middleware.controlMimeType(multerConfig)
    });
    const multerFunctionMiddleware = multerMiddleware[multerConfig.multerMethodName](multerConfig.documentFieldName);

    return multerFunctionMiddleware(req, res, next);
  }
  /**
   * controlMimeType for multer
   * @private
   * @method controlMimeType
   * @param {Object} multerConfig
   * @return {function}
   */
  static controlMimeType(multerConfig) {
    return (req, file, cb) => {
      if (multerConfig.allowedMimeTypes.findIndex(allowedMimeType => allowedMimeType === file.mimetype) === -1) {
        return cb(new Error(SERVICE_ERRORS.MIME_TYPE_ERROR));
      }
      return cb(null, true);
    };
  }
}
