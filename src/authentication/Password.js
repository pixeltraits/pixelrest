import bcrypt from 'bcrypt';

/**
 * @class Password
 */
export default class Password {
  /**
   * hash
   * @public
   * @method hash
   * @param {string} password - password to hash
   * @return {string} password hash
   */
  static async hash(password) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    return hashedPassword;
  }
  /**
   * validate
   * @public
   * @method validate
   * @param {string} userSendPassword - clear password
   * @param {string} userBddPassword - password hash
   * @return {boolean}
   */
  static async validate(userSendPassword, userBddPassword) {
    if (await bcrypt.compare(userSendPassword, userBddPassword)) {
      return true;
    }
    return false;
  }
}
