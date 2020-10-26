export const HTTP_ERRORS = {
  TOKEN_EXPIRED: `Le token est expiré`,
  CONTENT_ALREADY_EXISTS: `Le contenu existe déjà.`,
  UNAUTHORIZED: `Le mot de passe et l'identifiant utilisateur ne correspondent pas`,
  BAD_REQUEST: `Bad request`
};

export const SQL_ERROR_CODES = {
  NO_RESULT: 0,
  CONNEXION_REFUSED: `ECONNREFUSED`,
  DEFAULT: `Erreur inconnu`
};

export const HTTP_CODES = {
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  TOKEN_EXPIRED: 4012,
  UNAUTHORIZED: 401,
  UNAVAILABLE: 503,
  ALREADY_EXIST: 409
};

export const DEFAULT_LOG_CONFIG = {
  LOG_FILE: new URL(`../../log/serverLog.log`, import.meta.url),
  LOG_DIR: new URL(`../../log`, import.meta.url)
};
