const ConnexionService = require('./connexion/connexion.service');
const UserService = require('./user/user.service');

const SERVICES = [
  ConnexionService,
  UserService
];

module.exports = SERVICES;
