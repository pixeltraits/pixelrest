import Loggers from 'node-rest/logger';

import {
  HTTP_ERRORS,
  SQL_ERROR_CODES,
  HTTP_CODES,
  DEFAULT_LOG_CONFIG
} from './logger.config.js';


export default class HttpResolver {

  static async handle(error, where, res, filePath = DEFAULT_LOG_CONFIG.LOG_FILE) {
    const date = new Date().getTime();

    if (error.code === HTTP_CODES.UNAUTHORIZED) {
      return HttpResolver.unauthorized(date, where, error.message, res, filePath);
    }
    if (error.code === HTTP_CODES.ALREADY_EXIST) {
      return HttpResolver.contentAlreadyExists(date, where, error.message, res, filePath);
    }
    if (error.code === HTTP_CODES.TOKEN_EXPIRED) {
      return HttpResolver.tokenExpired(date, where, error.message, res, filePath);
    }
    if (error.code === SQL_ERROR_CODES.NO_RESULT) {
      return HttpResolver.noContent(date, where, error.message, res, filePath);
    }

    return HttpResolver.serviceUnavailable(date, where, error.message, res, filePath);
  }

  static noContent(res) {
    return res.status(HTTP_CODES.NO_CONTENT).send({
      message: `No content`
    });
  }

  static badRequest(res) {
    return res.status(HTTP_CODES.BAD_REQUEST).send(new Error(HTTP_ERRORS.BAD_REQUEST));
  }

  static unauthorized(date, where, message, res, filePath = DEFAULT_LOG_CONFIG.LOG_FILE) {
    Loggers.handleError(`[${date}] -- ${HTTP_CODES.UNAUTHORIZED} -- ${res.req.method}\nError on ${where}\n${message}\n`, filePath);
    return res.status(HTTP_CODES.UNAUTHORIZED).send({
      code: HTTP_CODES.UNAUTHORIZED,
      message: HTTP_ERRORS.UNAUTHORIZED
    });
  }

  static tokenExpired(date, where, message, res, filePath = DEFAULT_LOG_CONFIG.LOG_FILE) {
    Loggers.handleError(`[${date}] -- ${HTTP_CODES.TOKEN_EXPIRED} -- ${res.req.method}\nError on ${where}\n${message}\n`, filePath);
    return res.status(HTTP_CODES.UNAUTHORIZED).send({
      code: HTTP_CODES.TOKEN_EXPIRED,
      message: HTTP_ERRORS.TOKEN_EXPIRED
    });
  }

  static contentAlreadyExists(date, where, message, res, filePath = DEFAULT_LOG_CONFIG.LOG_FILE) {
    Loggers.handleError(`[${date}] -- ${HTTP_CODES.ALREADY_EXIST} -- ${res.req.method}\nError on ${where}\n${message}\n`, filePath);
    return res.status(HTTP_CODES.ALREADY_EXIST).send({
      code: HTTP_CODES.ALREADY_EXIST,
      message: HTTP_ERRORS.CONTENT_ALREADY_EXISTS
    });
  }

  static serviceUnavailable(date, where, message, res, filePath = DEFAULT_LOG_CONFIG.LOG_FILE) {
    Loggers.handleError(`[${date}] -- ${HTTP_CODES.ALREADY_EXIST} -- ${res.req.method}\nError on ${where}\n${message}\n`, filePath);
    return res.status(HTTP_CODES.UNAVAILABLE).send(new Error(HTTP_ERRORS.SERVICE_UNAVAILABLE));
  }

}
