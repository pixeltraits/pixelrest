export default class Controller {

  static isNullOrNumber(value) {
    return value === null || (typeof value === `number`);
  }

}
