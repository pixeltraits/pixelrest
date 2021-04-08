import Logger from 'node-rest/logger';

import {
  HTTP_ERRORS,
  HTTP_CODES,
  DEFAULT_LOG_CONFIG,
  LOGGER_ERRORS
} from './logger.config.js';

/**
 * @class HttpResolver
 */
export default class HttpResolver {
  /**
   * handle
   * @public
   * @method handle
   * @param {object} error - error object
   * @param {string} where
   * @param {object} res - express http response
   * @param {string} filePath - file log path
   * @param {number} date
   * @return {void}
   */
  static async handle(error, where, res, filePath = DEFAULT_LOG_CONFIG.LOG_FILE, date = new Date().getTime()) {
    if (error.code === HTTP_CODES.UNAUTHORIZED) {
      return HttpResolver.unauthorized(where, error.message, res, filePath, date);
    }
    if (error.code === HTTP_CODES.ALREADY_EXIST) {
      return HttpResolver.contentAlreadyExists(where, error.message, res, filePath, date);
    }
    if (error.code === HTTP_CODES.TOKEN_EXPIRED) {
      return HttpResolver.tokenExpired(where, error.message, res, filePath, date);
    }
    if (error.code === HTTP_CODES.NO_CONTENT) {
      return HttpResolver.noContent(res, filePath, date);
    }

    return HttpResolver.serviceUnavailable(where, error.message, res, filePath, date);
  }
  /**
   * noContent
   * @public
   * @method noContent
   * @param {object} res - express http response
   * @param {string} filePath - file log path
   * @param {number} date
   * @return {void}
   */
  static noContent(res, filePath = DEFAULT_LOG_CONFIG.LOG_FILE, date = new Date().getTime()) {
    Logger.handleError(`[${date}] -- ${HTTP_CODES.NO_CONTENT}\n`, filePath);
    return res.status(HTTP_CODES.NO_CONTENT).send({
      code: HTTP_CODES.NO_CONTENT,
      message: HTTP_ERRORS.NO_CONTENT
    });
  }
  /**
   * badRequest
   * @public
   * @method badRequest
   * @param {object} res - express http response
   * @param {string} filePath - file log path
   * @param {number} date
   * @return {void}
   */
  static badRequest(res, filePath = DEFAULT_LOG_CONFIG.LOG_FILE, date = new Date().getTime()) {
    Logger.handleError(`[${date}] -- ${HTTP_CODES.BAD_REQUEST}\n`, filePath);
    return res.status(HTTP_CODES.BAD_REQUEST).send({
      code: HTTP_CODES.BAD_REQUEST,
      message: HTTP_ERRORS.BAD_REQUEST
    });
  }
  /**
   * unauthorized
   * @public
   * @method unauthorized
   * @param {string} where
   * @param {string} message
   * @param {object} res - express http response
   * @param {string} filePath - file log path
   * @param {number} date
   * @return {void}
   */
  static unauthorized(where, message, res, filePath = DEFAULT_LOG_CONFIG.LOG_FILE, date = new Date().getTime()) {
    Logger.handleError(`[${date}] -- ${HTTP_CODES.UNAUTHORIZED} -- ${res.req.method}\n${LOGGER_ERRORS.ERROR_ON} ${where}\n${message}\n`, filePath);
    return res.status(HTTP_CODES.UNAUTHORIZED).send({
      code: HTTP_CODES.UNAUTHORIZED,
      message: HTTP_ERRORS.UNAUTHORIZED
    });
  }
  /**
   * tokenExpired
   * @public
   * @method tokenExpired
   * @param {string} where
   * @param {string} message
   * @param {object} res - express http response
   * @param {string} filePath - file log path
   * @param {number} date
   * @return {void}
   */
  static tokenExpired(where, message, res, filePath = DEFAULT_LOG_CONFIG.LOG_FILE, date = new Date().getTime()) {
    Logger.handleError(`[${date}] -- ${HTTP_CODES.TOKEN_EXPIRED} -- ${res.req.method}\n${LOGGER_ERRORS.ERROR_ON} ${where}\n${message}\n`, filePath);
    return res.status(HTTP_CODES.UNAUTHORIZED).send({
      code: HTTP_CODES.TOKEN_EXPIRED,
      message: HTTP_ERRORS.TOKEN_EXPIRED
    });
  }
  /**
   * contentAlreadyExists
   * @public
   * @method contentAlreadyExists
   * @param {string} where
   * @param {string} message
   * @param {object} res - express http response
   * @param {string} filePath - file log path
   * @param {number} date
   * @return {void}
   */
  static contentAlreadyExists(where, message, res, filePath = DEFAULT_LOG_CONFIG.LOG_FILE, date = new Date().getTime()) {
    Logger.handleError(`[${date}] -- ${HTTP_CODES.ALREADY_EXIST} -- ${res.req.method}\n${LOGGER_ERRORS.ERROR_ON} ${where}\n${message}\n`, filePath);
    return res.status(HTTP_CODES.ALREADY_EXIST).send({
      code: HTTP_CODES.ALREADY_EXIST,
      message: HTTP_ERRORS.CONTENT_ALREADY_EXISTS
    });
  }
  /**
   * serviceUnavailable
   * @public
   * @method serviceUnavailable
   * @param {string} where
   * @param {string} message
   * @param {object} res - express http response
   * @param {string} filePath - file log path
   * @param {number} date
   * @return {void}
   */
  static serviceUnavailable(where, message, res, filePath = DEFAULT_LOG_CONFIG.LOG_FILE, date = new Date().getTime()) {
    Logger.handleError(`[${date}] -- ${HTTP_CODES.UNAVAILABLE} -- ${res.req.method}\n${LOGGER_ERRORS.ERROR_ON} ${where}\n${message}\n`, filePath);
    return res.status(HTTP_CODES.UNAVAILABLE).send({
      code: HTTP_CODES.UNAVAILABLE,
      message: HTTP_ERRORS.UNAVAILABLE
    });
  }
}
