import jwt from 'jsonwebtoken';

import { ROLES } from './auth.config.js';

/**
 * @class Auth
 */
export default class Auth {
  /**
   * sign
   * @public
   * @method sign
   * @param {object} data - token data
   * @param {string} secret - token password
   * @param {number} timeLimit - token duration validity
   * @return {string} token
   */
  static sign(data, secret, timeLimit) {
    return jwt.sign(
      data,
      secret,
      { expiresIn: timeLimit }
    );
  }
  /**
   * verify
   * @public
   * @method verify
   * @param {string} token - token data
   * @param {string} secret - token password
   * @return {object} token data
   */
  static verify(token, secret) {
    return jwt.verify(token, secret);
  }
  /**
   * checkMultiRoles
   * @public
   * @method checkMultiRoles
   * @param {array} authorizedRoles - list of authorized roles
   * @param {array} userRoles - list of user roles
   * @return {boolean} true if authorized
   */
  static checkMultiRoles(authorizedRoles, userRoles) {
    const a = new Set(authorizedRoles);
    const b = new Set(userRoles);
    const intersection = new Set(
      [...a].filter(x => b.has(x))
    );

    return intersection.size !== 0;
  }
  /**
   * hasPublicRole
   * @public
   * @method hasPublicRole
   * @param {array} authorizedRoles - list of authorized roles
   * @return {boolean} true if has public roles
   */
  static hasPublicRole(authorizedRoles) {
    return authorizedRoles.find(authorizedRole => authorizedRole === ROLES.PUBLIC);
  }
}
