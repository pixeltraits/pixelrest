import BddParser from './BddParser.js';

import { POSTGRES_PARSER_IDENTIFIER } from './postgres-parser.config.js';

/**
 * @class PostgresParser
 */
export default class PostgresParser extends BddParser {
  /**
   * parse
   * @public
   * @method parse
   * @param {string} sqlRequest - postgresql request
   * @return {string} - parsed postgresql request
   */
  parse(sqlRequest) {
    const parsedSqlRequest = PostgresParser.removeUselessSpaces(sqlRequest);
    const parametersCount = PostgresParser.getParametersCount(parsedSqlRequest);

    if (parametersCount <= 0) {
      return parsedSqlRequest;
    }

    return PostgresParser.normalizeParametersFormat(parsedSqlRequest);
  }
  /**
   * normalizeParametersFormat
   * @private
   * @method normalizeParametersFormat
   * @param {string} sqlRequest - postgresql request
   * @return {string}
   */
  static normalizeParametersFormat(sqlRequest) {
    let normalizedSqlRequest = sqlRequest;
    let prevParamLastCharIndex = 0;
    const parametersCount = PostgresParser.getParametersCount(normalizedSqlRequest);

    for (let x = 0; x < parametersCount; x++) {
      const firstCharParamIndex = normalizedSqlRequest.indexOf(
        POSTGRES_PARSER_IDENTIFIER.FIRST_CHAR,
        prevParamLastCharIndex
      );

      const parameterSize = PostgresParser.getParameterSize(firstCharParamIndex, normalizedSqlRequest);
      const lastCharParamIndex = firstCharParamIndex + parameterSize;

      const parameterStringIdentifier = normalizedSqlRequest.substring(firstCharParamIndex + 1, lastCharParamIndex);
      normalizedSqlRequest = PostgresParser.normalizeParameterFormat(parameterStringIdentifier, normalizedSqlRequest);

      prevParamLastCharIndex = lastCharParamIndex;
    }

    return normalizedSqlRequest;
  }
  /**
   * normalizeParameterFormat
   * @private
   * @method normalizeParameterFormat
   * @param {string} parameterStringIdentifier
   * @param {string} sqlRequest - postgresql request
   * @return {string}
   */
  static normalizeParameterFormat(parameterStringIdentifier, sqlRequest) {
    return sqlRequest.replace(
      `${POSTGRES_PARSER_IDENTIFIER.FIRST_CHAR}${parameterStringIdentifier}`,
      `\${${parameterStringIdentifier}}`
    );
  }
  /**
   * getParameterSize
   * @private
   * @method getParameterSize
   * @param {number} firstCharIndex
   * @param {string} sqlRequest - postgresql request
   * @return {number}
   */
  static getParameterSize(firstCharIndex, sqlRequest) {
    return sqlRequest.substring(firstCharIndex).search(POSTGRES_PARSER_IDENTIFIER.END_CHAR);
  }
  /**
   * getParametersCount
   * @private
   * @method getParametersCount
   * @param {string} sqlRequest - postgresql request
   * @return {number}
   */
  static getParametersCount(sqlRequest) {
    return sqlRequest.split(POSTGRES_PARSER_IDENTIFIER.FIRST_CHAR).length - 1;
  }
  /**
   * removeUselessSpaces
   * @private
   * @method removeUselessSpaces
   * @param {string} originalString - postgresql request
   * @return {string}
   */
  static removeUselessSpaces(originalString) {
    let stringWithoutUselessSpaces = originalString.replace(/\s+/g, ` `).replace(
      /(\r\n|\n|\r)/gm,
      ``
    );

    if (stringWithoutUselessSpaces[0] === ` `) {
      stringWithoutUselessSpaces = stringWithoutUselessSpaces.substring(1, stringWithoutUselessSpaces.length - 1);
    }

    if (stringWithoutUselessSpaces[stringWithoutUselessSpaces.length - 1] === ` `) {
      stringWithoutUselessSpaces = stringWithoutUselessSpaces.substring(0, stringWithoutUselessSpaces.length - 2);
    }

    return stringWithoutUselessSpaces;
  }
}
