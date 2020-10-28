import BddParser from './BddParser.js';
import { MYSQL_PARSER_IDENTIFIER } from "./mysql-parser.config.js";


export default class MysqlParser extends BddParser {

  static parse(sqlRequest, sqlParameters) {
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

  static normalizeParameterFormat(parameterStringIdentifier, sqlRequest) {
    return sqlRequest.replace(
      `${MYSQL_PARSER_IDENTIFIER.FIRST_CHAR}${parameterStringIdentifier}`,
      `?`
    );
  }

  static getParameterSize(firstCharIndex, sqlRequest) {
    const parameterSize = sqlRequest.substring(firstCharIndex).
    search(MYSQL_PARSER_IDENTIFIER.END_CHAR);
    return parameterSize;
  }

  static getParametersCount(sqlRequest) {
    const parametersCount = sqlRequest.split(MYSQL_PARSER_IDENTIFIER.FIRST_CHAR).length - 1;

    return parametersCount;
  }

  static removeUselessSpaces(originalString) {
    const stringWithoutUselessSpaces = originalString.replace(/\s+/g, ` `).replace(
      /(\r\n|\n|\r)/gm,
      ``
    );

    return stringWithoutUselessSpaces;
  }

}
