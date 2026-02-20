import BddParser from './BddParser.js';
import { MYSQL_PARSER_IDENTIFIER } from './mysql-parser.config.js';
import type { SqlParseResult } from './bdd-parser.config.js';

export default class MysqlParser extends BddParser {
  parse(sqlRequest: string, sqlParameters: Record<string, unknown>): SqlParseResult {
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

  private static normalizeParametersFormat(sqlRequest: string, sqlParameters: Record<string, unknown>): { sqlRequest: string; sqlParameters: unknown[] } {
    let normalizedSqlRequest = sqlRequest;
    const parametersArray: unknown[] = [];
    const parametersCount = MysqlParser.getParametersCount(normalizedSqlRequest);

    for (let x = 0; x < parametersCount; x++) {
      const firstCharParamIndex = normalizedSqlRequest.indexOf(MYSQL_PARSER_IDENTIFIER.FIRST_CHAR, 0);
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

  private static normalizeParameterFormat(parameterStringIdentifier: string, sqlRequest: string): string {
    return sqlRequest.replace(
      `${MYSQL_PARSER_IDENTIFIER.FIRST_CHAR}${parameterStringIdentifier}`,
      '?'
    );
  }

  private static getParameterSize(firstCharIndex: number, sqlRequest: string): number {
    return sqlRequest.substring(firstCharIndex).search(MYSQL_PARSER_IDENTIFIER.END_CHAR);
  }

  private static getParametersCount(sqlRequest: string): number {
    return sqlRequest.split(MYSQL_PARSER_IDENTIFIER.FIRST_CHAR).length - 1;
  }

  private static removeUselessSpaces(originalString: string): string {
    return originalString.replace(/\s+/g, ' ').trim();
  }
}
