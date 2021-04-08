/**
 * @class Controller
 */
export default class Controller {
  /**
   * isNullOrNumber
   * @public
   * @method isNullOrNumber
   * @param {any} value
   * @return {boolean}
   */
  static isNullOrNumber(value) {
    return value === null || (typeof value === `number`);
  }
}
