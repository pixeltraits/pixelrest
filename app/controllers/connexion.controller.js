const bcrypt = require('bcrypt');

class ConnexionController {

  static async hash(password) {
    const hashedPassword = bcrypt.generate(password);
    return hashedPassword;
  }

  static async validate(userSendPassword, userBddPassword) {
    if (await bcrypt.compare(userSendPassword, userBddPassword)) {
      return true;
    }
    return false;
  }

}

module.exports = ConnexionController;
