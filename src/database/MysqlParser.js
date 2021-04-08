import BddParser from './BddParser.js';

import { MYSQL_PARSER_IDENTIFIER } from "./mysql-parser.config.js";

/**
 * @class MysqlParser
 */
export default class MysqlParser extends BddParser {
  /**
   * parse
   * @public
   * @method parse
   * @param {string} sqlRequest - mysql request
   * @param {object} sqlParameters - mysql parameters
   * @return {object} parsed request and parameters for mysqlPromise lib
   */
  parse(sqlRequest, sqlParameters) {
    const parsedSqlRequest = MysqlParser.removeUselessSpaces(sqlRequest);

    const parametersCount = MysqlParser.getParametersCount(parsedSqlRequest);

    if (parametersCount <= 0) {
      return {
        sqlRequest: parsedSqlRequest,
        sqlParameters: []
      };
    }

    const formatedSql = MysqlParser.normalizeParametersFormat(parsedSqlRequest, sqlParameters);

    return {
      sqlRequest: formatedSql.sqlRequest,
      sqlParameters: formatedSql.sqlParameters
    };
  }
  /**
   * normalizeParametersFormat
   * @private
   * @method normalizeParametersFormat
   * @param {string} sqlRequest - mysql request
   * @param {object} sqlParameters - mysql parameters
   * @return {object}
   */
  static normalizeParametersFormat(sqlRequest, sqlParameters) {
    let normalizedSqlRequest = sqlRequest;
    let parametersArray = [];
    const parametersCount = MysqlParser.getParametersCount(normalizedSqlRequest);

    for (let x = 0; x < parametersCount; x++) {
      const firstCharParamIndex = normalizedSqlRequest.indexOf(
        MYSQL_PARSER_IDENTIFIER.FIRST_CHAR,
        0
      );

      const parameterSize = MysqlParser.getParameterSize(firstCharParamIndex, normalizedSqlRequest);
      const lastCharParamIndex = firstCharParamIndex + parameterSize;
      const parameterStringIdentifier = normalizedSqlRequest.substring(firstCharParamIndex + 1, lastCharParamIndex);
      normalizedSqlRequest = MysqlParser.normalizeParameterFormat(parameterStringIdentifier, normalizedSqlRequest);
      parametersArray.push(sqlParameters[parameterStringIdentifier]);
    }

    return {
      sqlRequest: normalizedSqlRequest,
      sqlParameters: parametersArray
    };
  }
  /**
   * normalizeParameterFormat
   * @private
   * @method normalizeParameterFormat
   * @param {string} parameterStringIdentifier
   * @param {object} sqlRequest - mysql request
   * @return {string}
   */
  static normalizeParameterFormat(parameterStringIdentifier, sqlRequest) {
    return sqlRequest.replace(
      `${MYSQL_PARSER_IDENTIFIER.FIRST_CHAR}${parameterStringIdentifier}`,
      `?`
    );
  }
  /**
   * getParameterSize
   * @private
   * @method getParameterSize
   * @param {number} firstCharIndex
   * @param {string} sqlRequest - mysql request
   * @return {number}
   */
  static getParameterSize(firstCharIndex, sqlRequest) {
    return sqlRequest.substring(firstCharIndex).search(MYSQL_PARSER_IDENTIFIER.END_CHAR);
  }
  /**
   * getParametersCount
   * @private
   * @method getParametersCount
   * @param {string} sqlRequest - mysql request
   * @return {number}
   */
  static getParametersCount(sqlRequest) {
    return sqlRequest.split(MYSQL_PARSER_IDENTIFIER.FIRST_CHAR).length - 1;
  }
  /**
   * removeUselessSpaces
   * @private
   * @method removeUselessSpaces
   * @param {string} originalString - mysql request
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
