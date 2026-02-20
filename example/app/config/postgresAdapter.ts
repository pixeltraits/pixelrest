import type { IDatabase } from 'pg-promise';
import type { DbConnection } from 'pixelrest/dbConnection';

export default class PostgresAdapter implements DbConnection {
  private db: IDatabase<object>;

  constructor(db: IDatabase<object>) {
    this.db = db;
  }

  async execute(sqlRequest: string, sqlParameters: unknown[] | Record<string, unknown>): Promise<unknown> {
    const trimmed = sqlRequest.trimStart().toUpperCase();
    const isInsert = trimmed.startsWith('INSERT');

    if (isInsert) {
      const sql = this.ensureReturningId(sqlRequest);
      const result = await this.db.result(sql, sqlParameters);
      return { rows: result.rows };
    }

    const result = await this.db.result(sqlRequest, sqlParameters);
    return [result.rows, null];
  }

  async end(): Promise<void> {
    this.db.$pool.end();
  }

  private ensureReturningId(sql: string): string {
    if (!/RETURNING\s/i.test(sql)) {
      return sql.replace(/;\s*$/, '') + ' RETURNING id;';
    }
    return sql;
  }
}
