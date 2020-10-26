import jwt from 'jsonwebtoken';

import { ROLES } from './auth.config.js';


export default class Auth {

  static sign(data, secret, timeLimit) {
    return jwt.sign(
      data,
      secret,
      { expiresIn: timeLimit }
    );
  }

  static verify(token, secret) {
    return jwt.verify(token, secret);
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
    return authorizedRoles.find(authorizedRole => authorizedRole === ROLES.PUBLIC);
  }

}
