import type { DocumentData } from './documents.repository.config.js';
import Repository from 'pixelrest/repository';
import { DbConnection } from 'pixelrest/dbConnection';
import BddParser from 'pixelrest/bddParser';
import Logger from 'pixelrest/logger';
import { isPostgres } from '../config/dbConfig.js';

export default class DocumentsRepository extends Repository {

  constructor(db: DbConnection, parser: BddParser) {
    super(db, parser);
  }

  async createTable(document: DocumentData = {}): Promise<void> {
    const idColumn = isPostgres
      ? 'id SERIAL PRIMARY KEY'
      : 'id INT PRIMARY KEY NOT NULL AUTO_INCREMENT';

    try {
      await this.any(
        `
          CREATE TABLE IF NOT EXISTS documents
          (
            ${idColumn},
            name VARCHAR(100) NOT NULL,
            description VARCHAR(500) NOT NULL,
            filename VARCHAR(100) NOT NULL
          );
        `,
        document
      );
    } catch (error) {
      Logger.handleSQLError(error);
      throw error;
    }
  }

  async add(document: DocumentData): Promise<number | null> {
    try {
      return await this.insertAndGetLastInsertId(
        `
          INSERT INTO documents (name, description, filename)
          VALUES (~name, ~description, ~filename);
        `,
        document
      );
    } catch (error) {
      Logger.handleSQLError(error);
      throw error;
    }
  }

  async getById(id: number | null): Promise<unknown> {
    try {
      return await this.one(
        `
          SELECT id, name, description, filename
          FROM documents
          WHERE id = ~id;
        `,
        { id }
      );
    } catch (error) {
      Logger.handleSQLError(error);
      throw error;
    }
  }

  async updateInformations(document: DocumentData): Promise<void> {
    try {
      await this.one(
        `
          UPDATE documents
          SET name = ~name, description = ~description, filename = ~filename
          WHERE id = ~id;
        `,
        document
      );
    } catch (error) {
      Logger.handleSQLError(error);
      throw error;
    }
  }

}
