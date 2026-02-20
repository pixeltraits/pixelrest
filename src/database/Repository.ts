import type { DbConnection } from './repository.config.js';
import BddParser from './BddParser.js';

export default abstract class Repository {
  db: DbConnection;
  parser: BddParser;

  constructor(db: DbConnection, parser: BddParser) {
    this.db = db;
    this.parser = parser;
  }

  async any(sqlRequest: string, sqlParameters: Record<string, unknown>): Promise<unknown> {
    const sqlParsed = this.parser.parse(sqlRequest, sqlParameters);
    const [rows] = await this.db.execute(sqlParsed.sqlRequest, sqlParsed.sqlParameters) as [unknown[], unknown[]];

    return rows;
  }

  async one(sqlRequest: string, sqlParameters: Record<string, unknown>): Promise<unknown> {
    const sqlParsed = this.parser.parse(sqlRequest, sqlParameters);
    const [rows] = await this.db.execute(sqlParsed.sqlRequest, sqlParsed.sqlParameters) as [unknown[], unknown[]];

    return rows[0];
  }

  async insertAndGetLastInsertId(sqlRequest: string, sqlParameters: Record<string, unknown>): Promise<number | null> {
    const sqlParsed = this.parser.parse(sqlRequest, sqlParameters);
    const result = await this.db.execute(sqlParsed.sqlRequest, sqlParsed.sqlParameters);

    // MySQL: result[0].insertId
    if (Array.isArray(result) && (result[0] as Record<string, unknown>)?.insertId !== undefined) {
      return (result[0] as { insertId: number }).insertId;
    }

    // PostgreSQL (with RETURNING id): result.rows[0].id
    const rows = (result as { rows?: unknown[] }).rows ?? (result as unknown[]);
    if (Array.isArray(rows) && (rows[0] as Record<string, unknown>)?.id !== undefined) {
      return (rows[0] as { id: number }).id;
    }

    return null;
  }
}
