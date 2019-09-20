# node-rest
API REST exemple on node.js


# SECURITE
Ne jamais mettre les credentials sur le git.

# Credentials
Il est nécessaire de créer un fichier de configuration pour
dbCredentials.js dans le dossier config.
Le fichier doit contenir les données suivantes:

const DB_CREDENTIALS = {
  DATABASE: '',
  HOST: '',
  PORT: 5432,
  USERNAME: '',
  PASSWORD: ''
};

module.exports = DB_CREDENTIALS;

Un autre fichier pour configurer json web token.
Vous devez créer dans le dossier config un fichier jwt.js contenant:

const JWT = {
  SECRET: '',
  EXPIRES_IN: 14400
};

module.exports = JWT;

Ces fichier sont renseignés dans le gitignore par sécurité.
