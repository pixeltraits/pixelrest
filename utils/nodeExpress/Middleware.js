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

    if (body.length === 0) {
      next();
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
   * @return {void}
   */
  static multer(req, res, multerConfig) {
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

    multerMiddleware[multerConfig.multerMethodName](multerConfig.documentFieldName);
  }
}
