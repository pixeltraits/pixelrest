import type { Response } from 'express';

import Logger from './Logger.js';
import type { ErrorObject } from './http-resolver.config.js';
import {
  HTTP_ERRORS,
  HTTP_CODES,
  ERROR_TYPES,
  DEFAULT_LOG_CONFIG,
  LOGGER_ERRORS
} from './logger.config.js';

export default class HttpResolver {
  static async handle(error: ErrorObject, where: string, res: Response, filePath: URL = DEFAULT_LOG_CONFIG.LOG_FILE, date: number = new Date().getTime()): Promise<void> {
    if (error.type === ERROR_TYPES.TOKEN_EXPIRED) {
      return HttpResolver.tokenExpired(where, error.message, res, filePath, date);
    }
    if (error.type === ERROR_TYPES.UNAUTHORIZED) {
      return HttpResolver.unauthorized(where, error.message, res, filePath, date);
    }
    if (error.type === ERROR_TYPES.ALREADY_EXIST) {
      return HttpResolver.contentAlreadyExists(where, error.message, res, filePath, date);
    }
    if (error.type === ERROR_TYPES.NO_CONTENT) {
      return HttpResolver.noContent(res, filePath, date);
    }

    return HttpResolver.serviceUnavailable(where, error.message, res, filePath, date);
  }

  static noContent(res: Response, filePath: URL = DEFAULT_LOG_CONFIG.LOG_FILE, date: number = new Date().getTime()): void {
    Logger.handleError(`[${date}] -- ${HTTP_CODES.NO_CONTENT}\n`, filePath);
    res.status(HTTP_CODES.NO_CONTENT).send({
      code: HTTP_CODES.NO_CONTENT,
      message: HTTP_ERRORS.NO_CONTENT
    });
  }

  static badRequest(res: Response, filePath: URL = DEFAULT_LOG_CONFIG.LOG_FILE, date: number = new Date().getTime()): void {
    Logger.handleError(`[${date}] -- ${HTTP_CODES.BAD_REQUEST}\n`, filePath);
    res.status(HTTP_CODES.BAD_REQUEST).send({
      code: HTTP_CODES.BAD_REQUEST,
      message: HTTP_ERRORS.BAD_REQUEST
    });
  }

  static unauthorized(where: string, message: string, res: Response, filePath: URL = DEFAULT_LOG_CONFIG.LOG_FILE, date: number = new Date().getTime()): void {
    Logger.handleError(`[${date}] -- ${HTTP_CODES.UNAUTHORIZED} -- ${res.req.method}\n${LOGGER_ERRORS.ERROR_ON} ${where}\n${message}\n`, filePath);
    res.status(HTTP_CODES.UNAUTHORIZED).send({
      code: HTTP_CODES.UNAUTHORIZED,
      message: HTTP_ERRORS.UNAUTHORIZED
    });
  }

  static tokenExpired(where: string, message: string, res: Response, filePath: URL = DEFAULT_LOG_CONFIG.LOG_FILE, date: number = new Date().getTime()): void {
    Logger.handleError(`[${date}] -- ${HTTP_CODES.UNAUTHORIZED} -- ${res.req.method}\n${LOGGER_ERRORS.ERROR_ON} ${where}\n${message}\n`, filePath);
    res.status(HTTP_CODES.UNAUTHORIZED).send({
      code: HTTP_CODES.UNAUTHORIZED,
      message: HTTP_ERRORS.TOKEN_EXPIRED
    });
  }

  static contentAlreadyExists(where: string, message: string, res: Response, filePath: URL = DEFAULT_LOG_CONFIG.LOG_FILE, date: number = new Date().getTime()): void {
    Logger.handleError(`[${date}] -- ${HTTP_CODES.ALREADY_EXIST} -- ${res.req.method}\n${LOGGER_ERRORS.ERROR_ON} ${where}\n${message}\n`, filePath);
    res.status(HTTP_CODES.ALREADY_EXIST).send({
      code: HTTP_CODES.ALREADY_EXIST,
      message: HTTP_ERRORS.CONTENT_ALREADY_EXISTS
    });
  }

  static serviceUnavailable(where: string, message: string, res: Response, filePath: URL = DEFAULT_LOG_CONFIG.LOG_FILE, date: number = new Date().getTime()): void {
    Logger.handleError(`[${date}] -- ${HTTP_CODES.UNAVAILABLE} -- ${res.req.method}\n${LOGGER_ERRORS.ERROR_ON} ${where}\n${message}\n`, filePath);
    res.status(HTTP_CODES.UNAVAILABLE).send({
      code: HTTP_CODES.UNAVAILABLE,
      message: HTTP_ERRORS.UNAVAILABLE
    });
  }
}
