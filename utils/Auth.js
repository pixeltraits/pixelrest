const jwt = require('jsonwebtoken');

const JWT_CONFIG = require('../app/config/jwt');
const ROLES = require('../app/constants/roles');


class Auth {

  static sign(data) {
    return jwt.sign(
      data,
      JWT_CONFIG.SECRET,
      {
        expiresIn: JWT_CONFIG.EXPIRES_IN
      }
    );
  }

  static verify(token) {
    return jwt.verify(token, JWT_CONFIG.SECRET);
  }

  static checkMultiRoles(authorizedRoles, userRoles) {
    const a = new Set(authorizedRoles);
    const b = new Set(userRoles);
    const intersection = new Set(
      [...a].filter(x => b.has(x))
    );
    return intersection.size !== 0;
  }

  static hasPublicRole(authorizedRoles) {
    return authorizedRoles.find((role) => {
      return role === ROLES.PUBLIC;
    });
  }

}

module.exports = Auth;
