import { describe, it, expect, vi } from 'vitest';
import HttpResolver from 'pixelrest/httpResolver';
import Logger from 'pixelrest/logger';

import { DEFAULT_LOG_CONFIG, HTTP_ERRORS } from "../Logger/logger.config.js";
import { HTTP_CODES, ERROR_TYPES } from "../Logger/logger.config.js";


describe('HttpResolver', () => {

  const sendMock = {
    send: () => {}
  };
  const res = {
    req: {
      method: 'GET'
    },
    status: () => {
      return sendMock;
    }
  };
  const filePath = DEFAULT_LOG_CONFIG.LOG_FILE;
  const date = new Date().getTime();
  const where = `I'm here`;
  const message = `There is an error`;

  describe(`handle should`, () => {

    it(`if error type is UNAUTHORIZED call unauthorized method of HttpResolver`, () => {
      const error = {
        type: ERROR_TYPES.UNAUTHORIZED,
        message: `test`
      }
      vi.spyOn(HttpResolver, 'unauthorized').mockImplementation(() => {});

      HttpResolver.handle(error, where, res, filePath, date);

      expect(HttpResolver.unauthorized).toHaveBeenCalledWith(where, error.message, res, filePath, date);

      vi.restoreAllMocks();
    });

    it(`if error type is ALREADY_EXIST call contentAlreadyExists method of HttpResolver`, () => {
      const error = {
        type: ERROR_TYPES.ALREADY_EXIST,
        message: `test`
      }
      vi.spyOn(HttpResolver, 'contentAlreadyExists').mockImplementation(() => {});

      HttpResolver.handle(error, where, res, filePath, date);

      expect(HttpResolver.contentAlreadyExists).toHaveBeenCalledWith(where, error.message, res, filePath, date);

      vi.restoreAllMocks();
    });

    it(`if error type is TOKEN_EXPIRED call tokenExpired method of HttpResolver`, () => {
      const error = {
        type: ERROR_TYPES.TOKEN_EXPIRED,
        message: `test`
      }
      vi.spyOn(HttpResolver, 'tokenExpired').mockImplementation(() => {});

      HttpResolver.handle(error, where, res, filePath, date);

      expect(HttpResolver.tokenExpired).toHaveBeenCalledWith(where, error.message, res, filePath, date);

      vi.restoreAllMocks();
    });

    it(`if error type is NO_CONTENT call noContent method of HttpResolver`, () => {
      const error = {
        type: ERROR_TYPES.NO_CONTENT,
        message: `test`
      }
      vi.spyOn(HttpResolver, 'noContent').mockImplementation(() => {});

      HttpResolver.handle(error, where, res, filePath, date);

      expect(HttpResolver.noContent).toHaveBeenCalledWith(res, filePath, date);

      vi.restoreAllMocks();
    });

    it(`if error type is unknown call serviceUnavailable method of HttpResolver`, () => {
      const error = {
        type: null,
        message: `test`
      }
      vi.spyOn(HttpResolver, 'serviceUnavailable').mockImplementation(() => {});

      HttpResolver.handle(error, where, res, filePath, date);

      expect(HttpResolver.serviceUnavailable).toHaveBeenCalledWith(where, error.message, res, filePath, date);

      vi.restoreAllMocks();
    });

  });

  describe(`noContent should`, () => {

    it(`call handleError method of Logger and send http response no content`, () => {
      vi.spyOn(Logger, 'handleError').mockImplementation(() => {});
      vi.spyOn(res, 'status').mockReturnValue(sendMock);
      vi.spyOn(sendMock, 'send');

      HttpResolver.noContent(res, filePath, date);

      expect(Logger.handleError).toHaveBeenCalledWith(`[${date}] -- ${HTTP_CODES.NO_CONTENT}\n`, filePath);
      expect(res.status).toHaveBeenCalledWith(HTTP_CODES.NO_CONTENT);
      expect(sendMock.send).toHaveBeenCalledWith({
        code: HTTP_CODES.NO_CONTENT,
        message: HTTP_ERRORS.NO_CONTENT
      });

      vi.restoreAllMocks();
    });

  });

  describe(`badRequest should`, () => {

    it(`call handleError method of Logger and send http response badRequest`, () => {
      vi.spyOn(Logger, 'handleError').mockImplementation(() => {});
      vi.spyOn(res, 'status').mockReturnValue(sendMock);
      vi.spyOn(sendMock, 'send');

      HttpResolver.badRequest(res, filePath, date);

      expect(Logger.handleError).toHaveBeenCalledWith(`[${date}] -- ${HTTP_CODES.BAD_REQUEST}\n`, filePath);
      expect(res.status).toHaveBeenCalledWith(HTTP_CODES.BAD_REQUEST);
      expect(sendMock.send).toHaveBeenCalledWith({
        code: HTTP_CODES.BAD_REQUEST,
        message: HTTP_ERRORS.BAD_REQUEST
      });

      vi.restoreAllMocks();
    });

  });

  describe(`unauthorized should`, () => {

    it(`call handleError method of Logger and send http response unauthorized`, () => {
      vi.spyOn(Logger, 'handleError').mockImplementation(() => {});
      vi.spyOn(res, 'status').mockReturnValue(sendMock);
      vi.spyOn(sendMock, 'send');

      HttpResolver.unauthorized(where, message, res, filePath, date);

      expect(Logger.handleError).toHaveBeenCalledWith(
        `[${date}] -- ${HTTP_CODES.UNAUTHORIZED} -- ${res.req.method}\nError on ${where}\n${message}\n`,
        filePath
      );
      expect(res.status).toHaveBeenCalledWith(HTTP_CODES.UNAUTHORIZED);
      expect(sendMock.send).toHaveBeenCalledWith({
        code: HTTP_CODES.UNAUTHORIZED,
        message: HTTP_ERRORS.UNAUTHORIZED
      });

      vi.restoreAllMocks();
    });

  });

  describe(`tokenExpired should`, () => {

    it(`call handleError method of Logger and send http response tokenExpired`, () => {
      vi.spyOn(Logger, 'handleError').mockImplementation(() => {});
      vi.spyOn(res, 'status').mockReturnValue(sendMock);
      vi.spyOn(sendMock, 'send');

      HttpResolver.tokenExpired(where, message, res, filePath, date);

      expect(Logger.handleError).toHaveBeenCalledWith(
        `[${date}] -- ${HTTP_CODES.UNAUTHORIZED} -- ${res.req.method}\nError on ${where}\n${message}\n`,
        filePath
      );
      expect(res.status).toHaveBeenCalledWith(HTTP_CODES.UNAUTHORIZED);
      expect(sendMock.send).toHaveBeenCalledWith({
        code: HTTP_CODES.UNAUTHORIZED,
        message: HTTP_ERRORS.TOKEN_EXPIRED
      });

      vi.restoreAllMocks();
    });

  });

  describe(`contentAlreadyExists should`, () => {

    it(`call handleError method of Logger and send http response contentAlreadyExists`, () => {
      vi.spyOn(Logger, 'handleError').mockImplementation(() => {});
      vi.spyOn(res, 'status').mockReturnValue(sendMock);
      vi.spyOn(sendMock, 'send');

      HttpResolver.contentAlreadyExists(where, message, res, filePath, date);

      expect(Logger.handleError).toHaveBeenCalledWith(
        `[${date}] -- ${HTTP_CODES.ALREADY_EXIST} -- ${res.req.method}\nError on ${where}\n${message}\n`,
        filePath
      );
      expect(res.status).toHaveBeenCalledWith(HTTP_CODES.ALREADY_EXIST);
      expect(sendMock.send).toHaveBeenCalledWith({
        code: HTTP_CODES.ALREADY_EXIST,
        message: HTTP_ERRORS.CONTENT_ALREADY_EXISTS
      });

      vi.restoreAllMocks();
    });

  });

  describe(`serviceUnavailable should`, () => {

    it(`call handleError method of Logger and send http response serviceUnavailable`, () => {
      vi.spyOn(Logger, 'handleError').mockImplementation(() => {});
      vi.spyOn(res, 'status').mockReturnValue(sendMock);
      vi.spyOn(sendMock, 'send');

      HttpResolver.serviceUnavailable(where, message, res, filePath, date);

      expect(Logger.handleError).toHaveBeenCalledWith(
        `[${date}] -- ${HTTP_CODES.UNAVAILABLE} -- ${res.req.method}\nError on ${where}\n${message}\n`,
        filePath
      );
      expect(res.status).toHaveBeenCalledWith(HTTP_CODES.UNAVAILABLE);
      expect(sendMock.send).toHaveBeenCalledWith({
        code: HTTP_CODES.UNAVAILABLE,
        message: HTTP_ERRORS.UNAVAILABLE
      });

      vi.restoreAllMocks();
    });

  });

});
