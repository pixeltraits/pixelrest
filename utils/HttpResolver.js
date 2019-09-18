const Loggers = require('./Logger');

const ERRORS = require('../business/config/errors');
const { SQL_ERROR_CODES, HTTP_ERROR_CODES } = require('../business/config/errorCodes');

class HttpResolver {

  static handle(error, where, res) {
    const date = new Date().getTime();
    let httpStatus = null;

    if (error.code === HTTP_ERROR_CODES.UNAUTHORIZED) {
      httpStatus = 401;
      return HttpResolver.unauthorized(res);
    }
    if (error.code === HTTP_ERROR_CODES.TOKEN_EXPIRED) {
      httpStatus = 401;
      return HttpResolver.tokenExpired(res);
    }
    if (error.code === SQL_ERROR_CODES.NO_RESULT) {
      httpStatus = 404;
      return HttpResolver.noContent(res);
    }
    if (!httpStatus) {
      httpStatus = 503;
    }

    Loggers.handleError(`[${date}] -- ${httpStatus} -- ${res.req.method}\nError on ${where}\n${error.message}\n`);

    return HttpResolver.serviceUnavailable(res);
  }

  static noContent(res) {
    res.status(204).send({
      message: 'No content'
    });
  }

  static badRequest(res) {
    res.status(400)
      .send(new Error(ERRORS.BAD_REQUEST));
  }

  static unauthorized(res) {
    res.status(401).send({
      code: HTTP_ERROR_CODES.UNAUTHORIZED,
      message: ERRORS.UNAUTHORIZED
    });
  }

  static tokenExpired(response) {
    return response.status(401).send({
      code: HTTP_ERROR_CODES.TOKEN_EXPIRED,
      message: ERRORS.TOKEN_EXPIRED
    });
  }

  static serviceUnavailable(res) {
    res.status(503).send(new Error(ERRORS.SERVICE_UNAVAILABLE));
  }
}

module.exports = HttpResolver;
