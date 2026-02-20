export default class Controller {
  static isNullOrNumber(value: unknown): boolean {
    return value === null || (typeof value === 'number');
  }
}
