import { POSTGRES_PARSER_IDENTIFIER } from './postgres-parser.config.js';
import BddParser from './BddParser.js';


export default class PostgresParser extends BddParser {

  static parse(sqlRequest) {
    const parsedSqlRequest = PostgresParser.removeUselessSpaces(sqlRequest);
    const parametersCount = PostgresParser.getParametersCount(parsedSqlRequest);

    if (parametersCount <= 0) {
      return parsedSqlRequest;
    }

    return PostgresParser.normalizeParametersFormat(parsedSqlRequest);
  }

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

  static normalizeParameterFormat(parameterStringIdentifier, sqlRequest) {
    return sqlRequest.replace(
      `${POSTGRES_PARSER_IDENTIFIER.FIRST_CHAR}${parameterStringIdentifier}`,
      `\${${parameterStringIdentifier}}`
    );
  }

  static getParameterSize(firstCharIndex, sqlRequest) {
    const parameterSize = sqlRequest.substring(firstCharIndex).
    search(POSTGRES_PARSER_IDENTIFIER.END_CHAR);
    return parameterSize;
  }

  static getParametersCount(sqlRequest) {
    const parametersCount = sqlRequest.split(POSTGRES_PARSER_IDENTIFIER.FIRST_CHAR).length - 1;

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
