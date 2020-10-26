import camelcase from 'camelcase';


export default class SnakeToCamelParser {

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

  static parseArray(snakecaseArray) {
    return snakecaseArray.map(SnakeToCamelParser.parse);
  }

  static parseObject(snakecaseObject) {
    const camelcaseObject = {};

    Object.keys(snakecaseObject).forEach(snakecaseObjectKey => {
      camelcaseObject[camelcase(snakecaseObjectKey)] = SnakeToCamelParser.parse(snakecaseObject[snakecaseObjectKey]);
    });

    return camelcaseObject;
  }

}
