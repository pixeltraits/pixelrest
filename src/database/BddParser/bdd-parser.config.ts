export interface SqlParseResult {
  sqlRequest: string;
  sqlParameters: unknown[] | Record<string, unknown>;
}
