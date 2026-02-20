import BddParser from './BddParser.js';
import { POSTGRES_PARSER_IDENTIFIER } from './postgres-parser.config.js';
import type { SqlParseResult } from './bdd-parser.config.js';

export default class PostgresParser extends BddParser {
  parse(sqlRequest: string, sqlParameters: Record<string, unknown>): SqlParseResult {
    const parsedSqlRequest = PostgresParser.removeUselessSpaces(sqlRequest);
    const parametersCount = PostgresParser.getParametersCount(parsedSqlRequest);

    if (parametersCount <= 0) {
      return {
        sqlRequest: parsedSqlRequest,
        sqlParameters: sqlParameters || {}
      };
    }

    return {
      sqlRequest: PostgresParser.normalizeParametersFormat(parsedSqlRequest),
      sqlParameters: sqlParameters || {}
    };
  }

  private static normalizeParametersFormat(sqlRequest: string): string {
    let normalizedSqlRequest = sqlRequest;
    let prevParamLastCharIndex = 0;
    const parametersCount = PostgresParser.getParametersCount(normalizedSqlRequest);

    for (let x = 0; x < parametersCount; x++) {
      const firstCharParamIndex = normalizedSqlRequest.indexOf(POSTGRES_PARSER_IDENTIFIER.FIRST_CHAR, prevParamLastCharIndex);
      const parameterSize = PostgresParser.getParameterSize(firstCharParamIndex, normalizedSqlRequest);
      const lastCharParamIndex = firstCharParamIndex + parameterSize;
      const parameterStringIdentifier = normalizedSqlRequest.substring(firstCharParamIndex + 1, lastCharParamIndex);
      normalizedSqlRequest = PostgresParser.normalizeParameterFormat(parameterStringIdentifier, normalizedSqlRequest);
      prevParamLastCharIndex = lastCharParamIndex;
    }

    return normalizedSqlRequest;
  }

  private static normalizeParameterFormat(parameterStringIdentifier: string, sqlRequest: string): string {
    return sqlRequest.replace(
      `${POSTGRES_PARSER_IDENTIFIER.FIRST_CHAR}${parameterStringIdentifier}`,
      `\${${parameterStringIdentifier}}`
    );
  }

  private static getParameterSize(firstCharIndex: number, sqlRequest: string): number {
    return sqlRequest.substring(firstCharIndex).search(POSTGRES_PARSER_IDENTIFIER.END_CHAR);
  }

  private static getParametersCount(sqlRequest: string): number {
    return sqlRequest.split(POSTGRES_PARSER_IDENTIFIER.FIRST_CHAR).length - 1;
  }

  private static removeUselessSpaces(originalString: string): string {
    return originalString.replace(/\s+/g, ' ').trim();
  }
}
