const ERRORS = {
  PAGE_NOT_FOUND: 'La ressource demandée n\'a pas pu être trouvée',
  PAGE_LOAD_ERROR: 'Une erreur s\'est produite',
  SERVICE_UNAVAILABLE: 'Service indisponible',
  INIT_ROUTE: 'Vous devez obligatoirement initialiser une route pour le service => ',
  TOKEN_VERIFICATION: 'Une erreur c\'est produite lors de la vérification du token',
  TOKEN_DECRYPT: 'Une erreur s\'est produite lors de la lecture du token',
  GIVE_WRONG_TOKEN: ' a donné un token illisible',
  WRONG_ROLE: ' n\'a pas les roles suffisant pour accéder a cette route',
  TOKEN_EXPIRED: 'Le token est expiré',
  NEED_TO_RECONNECT: ' doit se reconnecté, token expiré',
  NEED_TO_CONNECT: ' doit se connecté, aucun token n\'a été fourni',
  DEFAULT_ERROR_SQL: 'Une erreur SQL s\'est produite',
  NO_RESULT_SQL: 'La requête SQL n\'a pas renvoyé de résultat',
  NO_RELATION_ROUTE: 'Cette route ne correspond a aucun service',
  UNEXPECTED_ERROR: 'Une erreur inattendue est survenue.',
  CONNEXION_REFUSED_SQL: 'Impossible de se connecter à la base de données',
  IN_USE: ' is already in use',
  LISTENING_ON: 'Listening on ',
  ERROR_DETAILS: 'Détail de l\'erreur : ',
  NOT_EXIST: ' n\'éxiste pas',
  USER_NOT_EXIST: 'Cet utilisateur n\'éxiste pas',
  EMPTY_USERS: 'Aucun utilisateur n\'a été trouvé',
  UNAUTHORIZED: 'Le mot de passe et l\'identifiant utilisateur ne correspondent pas',
  BAD_REQUEST: 'Bad request'
};

module.exports = ERRORS;
