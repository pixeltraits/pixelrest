import camelcase from 'camelcase';

/**
 * @class SnakeToCamelParser
 */
export default class SnakeToCamelParser {
  /**
   * parse
   * @public
   * @method parse
   * @param {any} snakecaseData - data to parse
   * @return {any} parsed data
   */
  static parse(snakecaseData) {
    if (snakecaseData === null) {
      return null;
    }

    if (Array.isArray(snakecaseData)) {
      return SnakeToCamelParser.parseArray(snakecaseData);
    }

    if (snakecaseData instanceof Date) {
      return snakecaseData;
    }

    if (typeof snakecaseData === `object`) {
      return SnakeToCamelParser.parseObject(snakecaseData);
    }

    return snakecaseData;
  }
  /**
   * parseArray
   * @private
   * @method parseArray
   * @param {array<any>} snakecaseArray - array to parse
   * @return {array<any>} parsed array
   */
  static parseArray(snakecaseArray) {
    return snakecaseArray.map(SnakeToCamelParser.parse);
  }
  /**
   * parseObject
   * @private
   * @method parseObject
   * @param {object} snakecaseObject - array to parse
   * @return {object} parsed object
   */
  static parseObject(snakecaseObject) {
    const camelcaseObject = {};

    Object.keys(snakecaseObject).forEach(snakecaseObjectKey => {
      camelcaseObject[camelcase(snakecaseObjectKey)] = SnakeToCamelParser.parse(snakecaseObject[snakecaseObjectKey]);
    });

    return camelcaseObject;
  }
}
