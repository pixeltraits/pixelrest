const passwordHash = require('password-hash');

class ConnexionController {
  static verifyPassword(requestPassword, bddPassword) {
    return passwordHash.verify(requestPassword, bddPassword);
  }
}

module.exports = ConnexionController;
