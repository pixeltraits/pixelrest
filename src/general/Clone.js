/**
 * @class Clone
 */
export default class Clone {
  /**
   * simpleObject
   * @public
   * @method simpleObject
   * @param {object} objectReference - object to clone
   * @return {object} cloned object
   */
  static simpleObject(objectReference) {
    return structuredClone(objectReference);
  }
}
