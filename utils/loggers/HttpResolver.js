import Logger from 'node-rest/logger';

import {
  HTTP_ERRORS,
  SQL_ERROR_CODES,
  HTTP_CODES,
  DEFAULT_LOG_CONFIG
} from './logger.config.js';


export default class HttpResolver {

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

  static noContent(res, filePath = DEFAULT_LOG_CONFIG.LOG_FILE, date = new Date().getTime()) {
    Logger.handleError(`[${date}] -- ${HTTP_CODES.NO_CONTENT}\n`, filePath);
    return res.status(HTTP_CODES.NO_CONTENT).send({
      code: HTTP_CODES.NO_CONTENT,
      message: HTTP_ERRORS.NO_CONTENT
    });
  }

  static badRequest(res, filePath = DEFAULT_LOG_CONFIG.LOG_FILE, date = new Date().getTime()) {
    Logger.handleError(`[${date}] -- ${HTTP_CODES.BAD_REQUEST}\n`, filePath);
    return res.status(HTTP_CODES.BAD_REQUEST).send({
      code: HTTP_CODES.BAD_REQUEST,
      message: HTTP_ERRORS.BAD_REQUEST
    });
  }

  static unauthorized(where, message, res, filePath = DEFAULT_LOG_CONFIG.LOG_FILE, date = new Date().getTime()) {
    Logger.handleError(`[${date}] -- ${HTTP_CODES.UNAUTHORIZED} -- ${res.req.method}\nError on ${where}\n${message}\n`, filePath);
    return res.status(HTTP_CODES.UNAUTHORIZED).send({
      code: HTTP_CODES.UNAUTHORIZED,
      message: HTTP_ERRORS.UNAUTHORIZED
    });
  }

  static tokenExpired(where, message, res, filePath = DEFAULT_LOG_CONFIG.LOG_FILE, date = new Date().getTime()) {
    Logger.handleError(`[${date}] -- ${HTTP_CODES.TOKEN_EXPIRED} -- ${res.req.method}\nError on ${where}\n${message}\n`, filePath);
    return res.status(HTTP_CODES.UNAUTHORIZED).send({
      code: HTTP_CODES.TOKEN_EXPIRED,
      message: HTTP_ERRORS.TOKEN_EXPIRED
    });
  }

  static contentAlreadyExists(where, message, res, filePath = DEFAULT_LOG_CONFIG.LOG_FILE, date = new Date().getTime()) {
    Logger.handleError(`[${date}] -- ${HTTP_CODES.ALREADY_EXIST} -- ${res.req.method}\nError on ${where}\n${message}\n`, filePath);
    return res.status(HTTP_CODES.ALREADY_EXIST).send({
      code: HTTP_CODES.ALREADY_EXIST,
      message: HTTP_ERRORS.CONTENT_ALREADY_EXISTS
    });
  }

  static serviceUnavailable(where, message, res, filePath = DEFAULT_LOG_CONFIG.LOG_FILE, date = new Date().getTime()) {
    Logger.handleError(`[${date}] -- ${HTTP_CODES.UNAVAILABLE} -- ${res.req.method}\nError on ${where}\n${message}\n`, filePath);
    return res.status(HTTP_CODES.UNAVAILABLE).send({
      code: HTTP_CODES.UNAVAILABLE,
      message: HTTP_ERRORS.UNAVAILABLE
    });
  }

}
