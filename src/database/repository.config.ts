export interface DbConnection {
  execute(sqlRequest: string, sqlParameters: unknown[] | Record<string, unknown>): Promise<unknown>;
}
