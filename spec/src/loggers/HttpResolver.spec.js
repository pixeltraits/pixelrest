process.env.NODE_ENV = 'test';
import HttpResolver from 'pixelrest/httpResolver';
import Logger from 'pixelrest/logger';

import {DEFAULT_LOG_CONFIG, HTTP_ERRORS, SQL_ERROR_CODES} from "../../../src/loggers/logger.config.js";
import { HTTP_CODES } from "../../../src/loggers/logger.config.js";


describe('HttpResolver', () => {

  const sendMock = {
    send: (error) => {}
  };
  const res = {
    req: {
      method: 'GET'
    },
    status: (status) => {
      return sendMock;
    }
  };
  const filePath = DEFAULT_LOG_CONFIG.LOG_FILE;
  const date = new Date().getTime();
  const where = `I'm here`;
  const message = `There is an error`;

  describe(`handle should`, () => {

    it(`if http error code is 401 call unauthorized method of HttpResolver`, () => {
      const error = {
        code: HTTP_CODES.UNAUTHORIZED,
        message: `test`
      }
      spyOn(HttpResolver, 'unauthorized');

      HttpResolver.handle(error, where, res, filePath, date);

      expect(HttpResolver.unauthorized).toHaveBeenCalledWith(where, error.message, res, filePath, date);
    });

    it(`if http error code is 409 call contentAlreadyExists method of HttpResolver`, () => {
      const error = {
        code: HTTP_CODES.ALREADY_EXIST,
        message: `test`
      }
      spyOn(HttpResolver, 'contentAlreadyExists');

      HttpResolver.handle(error, where, res, filePath, date);

      expect(HttpResolver.contentAlreadyExists).toHaveBeenCalledWith(where, error.message, res, filePath, date);
    });

    it(`if http error code is 4012 call tokenExpired method of HttpResolver`, () => {
      const error = {
        code: HTTP_CODES.TOKEN_EXPIRED,
        message: `test`
      }
      spyOn(HttpResolver, 'tokenExpired');

      HttpResolver.handle(error, where, res, filePath, date);

      expect(HttpResolver.tokenExpired).toHaveBeenCalledWith(where, error.message, res, filePath, date);
    });

    it(`if Http error code is 0 call noContent method of HttpResolver`, () => {
      const error = {
        code: HTTP_CODES.NO_CONTENT,
        message: `test`
      }
      spyOn(HttpResolver, 'noContent');

      HttpResolver.handle(error, where, res, filePath, date);

      expect(HttpResolver.noContent).toHaveBeenCalledWith(res, filePath, date);
    });

    it(`if error code is unknown call serviceUnavailable method of HttpResolver`, () => {
      const error = {
        code: null,
        message: `test`
      }
      spyOn(HttpResolver, 'serviceUnavailable');

      HttpResolver.handle(error, where, res, filePath, date);

      expect(HttpResolver.serviceUnavailable).toHaveBeenCalledWith(where, error.message, res, filePath, date);
    });

  });

  describe(`noContent should`, () => {

    it(`call handleError method of Logger and send http response no content`, () => {
      spyOn(Logger, 'handleError');
      spyOn(res, 'status').and.callThrough();
      spyOn(sendMock, 'send').and.callThrough();

      HttpResolver.noContent(res, filePath, date);

      expect(Logger.handleError).toHaveBeenCalledWith(`[${date}] -- ${HTTP_CODES.NO_CONTENT}\n`, filePath);
      expect(res.status).toHaveBeenCalledWith(HTTP_CODES.NO_CONTENT);
      expect(res.status().send).toHaveBeenCalledWith({
        code: HTTP_CODES.NO_CONTENT,
        message: HTTP_ERRORS.NO_CONTENT
      });
    });

  });

  describe(`badRequest should`, () => {

    it(`call handleError method of Logger and send http response badRequest`, () => {
      spyOn(Logger, 'handleError');
      spyOn(res, 'status').and.callThrough();
      spyOn(sendMock, 'send').and.callThrough();

      HttpResolver.badRequest(res, filePath, date);

      expect(Logger.handleError).toHaveBeenCalledWith(`[${date}] -- ${HTTP_CODES.BAD_REQUEST}\n`, filePath);
      expect(res.status).toHaveBeenCalledWith(HTTP_CODES.BAD_REQUEST);
      expect(res.status().send).toHaveBeenCalledWith({
        code: HTTP_CODES.BAD_REQUEST,
        message: HTTP_ERRORS.BAD_REQUEST
      });
    });

  });

  describe(`unauthorized should`, () => {

    it(`call handleError method of Logger and send http response unauthorized`, () => {
      spyOn(Logger, 'handleError');
      spyOn(res, 'status').and.callThrough();
      spyOn(sendMock, 'send').and.callThrough();

      HttpResolver.unauthorized(where, message, res, filePath, date);

      expect(Logger.handleError).toHaveBeenCalledWith(
        `[${date}] -- ${HTTP_CODES.UNAUTHORIZED} -- ${res.req.method}\nError on ${where}\n${message}\n`,
        filePath
      );
      expect(res.status).toHaveBeenCalledWith(HTTP_CODES.UNAUTHORIZED);
      expect(res.status().send).toHaveBeenCalledWith({
        code: HTTP_CODES.UNAUTHORIZED,
        message: HTTP_ERRORS.UNAUTHORIZED
      });
    });

  });

  describe(`tokenExpired should`, () => {

    it(`call handleError method of Logger and send http response tokenExpired`, () => {
      spyOn(Logger, 'handleError');
      spyOn(res, 'status').and.callThrough();
      spyOn(sendMock, 'send').and.callThrough();

      HttpResolver.tokenExpired(where, message, res, filePath, date);

      expect(Logger.handleError).toHaveBeenCalledWith(
        `[${date}] -- ${HTTP_CODES.TOKEN_EXPIRED} -- ${res.req.method}\nError on ${where}\n${message}\n`,
        filePath
      );
      expect(res.status).toHaveBeenCalledWith(HTTP_CODES.UNAUTHORIZED);
      expect(res.status().send).toHaveBeenCalledWith({
        code: HTTP_CODES.TOKEN_EXPIRED,
        message: HTTP_ERRORS.TOKEN_EXPIRED
      });
    });

  });

  describe(`contentAlreadyExists should`, () => {

    it(`call handleError method of Logger and send http response contentAlreadyExists`, () => {
      spyOn(Logger, 'handleError');
      spyOn(res, 'status').and.callThrough();
      spyOn(sendMock, 'send').and.callThrough();

      HttpResolver.contentAlreadyExists(where, message, res, filePath, date);

      expect(Logger.handleError).toHaveBeenCalledWith(
        `[${date}] -- ${HTTP_CODES.ALREADY_EXIST} -- ${res.req.method}\nError on ${where}\n${message}\n`,
        filePath
      );
      expect(res.status).toHaveBeenCalledWith(HTTP_CODES.ALREADY_EXIST);
      expect(res.status().send).toHaveBeenCalledWith({
        code: HTTP_CODES.ALREADY_EXIST,
        message: HTTP_ERRORS.CONTENT_ALREADY_EXISTS
      });
    });

  });

  describe(`serviceUnavailable should`, () => {

    it(`call handleError method of Logger and send http response serviceUnavailable`, () => {
      spyOn(Logger, 'handleError');
      spyOn(res, 'status').and.callThrough();
      spyOn(sendMock, 'send').and.callThrough();

      HttpResolver.serviceUnavailable(where, message, res, filePath, date);

      expect(Logger.handleError).toHaveBeenCalledWith(
        `[${date}] -- ${HTTP_CODES.UNAVAILABLE} -- ${res.req.method}\nError on ${where}\n${message}\n`,
        filePath
      );
      expect(res.status).toHaveBeenCalledWith(HTTP_CODES.UNAVAILABLE);
      expect(res.status().send).toHaveBeenCalledWith({
        code: HTTP_CODES.UNAVAILABLE,
        message: HTTP_ERRORS.UNAVAILABLE
      });
    });

  });

});
