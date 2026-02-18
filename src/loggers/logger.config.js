export const HTTP_ERRORS = {
  TOKEN_EXPIRED: `The token has expired`,
  CONTENT_ALREADY_EXISTS: `The content already exists`,
  UNAUTHORIZED: `Wrong login`,
  BAD_REQUEST: `Bad request`,
  NO_CONTENT: `No content`,
  UNAVAILABLE: `Service unavailable`
};

export const LOGGER_ERRORS = {
  DIR_ERROR: `There is something wrong with log directory =>`,
  READ_FILE_ERROR: `There is something wrong with log file(reading) =>`,
  WRITE_FILE_ERROR: `There is something wrong with log file(writing) =>`,
  ERROR_ON: `Error on`
};

export const SQL_ERROR_CODES = {
  NO_RESULT: 0,
  CONNEXION_REFUSED: `ECONNREFUSED`,
  DEFAULT: `Erreur inconnu`
};

export const HTTP_CODES = {
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  UNAVAILABLE: 503,
  ALREADY_EXIST: 409
};

export const ERROR_TYPES = {
  NO_CONTENT: `NO_CONTENT`,
  UNAUTHORIZED: `UNAUTHORIZED`,
  TOKEN_EXPIRED: `TOKEN_EXPIRED`,
  ALREADY_EXIST: `ALREADY_EXIST`
};

export const DEFAULT_LOG_CONFIG = {
  LOG_FILE: new URL(`../../log/serverLog.log`, import.meta.url),
  LOG_DIR: new URL(`../../log`, import.meta.url),
  ENCODING: `utf-8`
};

export const FILE_ERROR_CODES = {
  ALREADY_EXIST: `EEXIST`,
  NOT_FOUND: `ENOENT`,
  ENCODING: `utf-8`
};
