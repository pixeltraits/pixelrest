const passwordHash = require('password-hash');

class ConnexionController {

  static hash(password) {
    return passwordHash.generate(password);
  }

  static validate(userSendPassword, userBddPassword) {
    if (passwordHash.verify(userSendPassword, userBddPassword)) {
      return true;
    }
    return false;
  }

}

module.exports = ConnexionController;
