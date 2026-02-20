import { User } from './users.repository.config.js';
import Repository from 'pixelrest/repository';
import BddParser from 'pixelrest/bddParser';
import { DbConnection } from 'pixelrest/dbConnection';
import Logger from 'pixelrest/logger';
import { isPostgres } from '../config/dbConfig.js';

export default class UsersRepository extends Repository {

  constructor(db: DbConnection, parser: BddParser) {
    super(db, parser);
  }

  async createTable(user: User = {}): Promise<void> {
    const idColumn = isPostgres
      ? 'id SERIAL PRIMARY KEY'
      : 'id INT PRIMARY KEY NOT NULL AUTO_INCREMENT';

    try {
      await this.any(
        `
          CREATE TABLE IF NOT EXISTS users
          (
            ${idColumn},
            firstname VARCHAR(100) NOT NULL,
            lastname VARCHAR(100) NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            password VARCHAR(100) NOT NULL,
            roles VARCHAR(100) NOT NULL
          );
        `,
        user
      );
    } catch (error) {
      Logger.handleSQLError(error);
      throw error;
    }
  }

  async add(user: User): Promise<number | null> {
    try {
      return await this.insertAndGetLastInsertId(
        `
          INSERT INTO users (firstname, lastname, email, password, roles)
          VALUES (~firstname, ~lastname, ~email, ~password, ~roles);
        `,
        user
      );
    } catch (error) {
      Logger.handleSQLError(error);
      throw error;
    }
  }

  async getAll(): Promise<unknown> {
    try {
      return await this.any(
        `
          SELECT id, firstname, lastname, email, roles
          FROM users
          ORDER BY lastname;
        `
      );
    } catch (error) {
      Logger.handleSQLError(error);
      throw error;
    }
  }

  async getById(id: number | string): Promise<unknown> {
    try {
      return await this.one(
        `
          SELECT id, firstname, lastname, email, roles
          FROM users
          WHERE id = ~id;
        `,
        { id }
      );
    } catch (error) {
      Logger.handleSQLError(error);
      throw error;
    }
  }

  async getByMail(email: string): Promise<unknown> {
    try {
      return await this.one(
        `
          SELECT id, roles, firstname, lastname, email
          FROM users
          WHERE email = ~email;
        `,
        { email }
      );
    } catch (error) {
      Logger.handleSQLError(error);
      throw error;
    }
  }

  async getByMailWithPassword(email: string): Promise<User & { id: number; password: string }> {
    try {
      return await this.one(
        `
          SELECT id, roles, firstname, lastname, email, password
          FROM users
          WHERE email = ~email;
        `,
        { email }
      ) as User & { id: number; password: string };
    } catch (error) {
      Logger.handleSQLError(error);
      throw error;
    }
  }

  async getPasswordById(id: number): Promise<{ password: string }> {
    try {
      return await this.one(
        `
          SELECT password
          FROM users
          WHERE id = ~id;
        `,
        { id }
      ) as { password: string };
    } catch (error) {
      Logger.handleSQLError(error);
      throw error;
    }
  }

  async updateInformations(user: User): Promise<void> {
    try {
      await this.one(
        `
          UPDATE users
          SET lastname = ~lastname, firstname = ~firstname, email = ~email
          WHERE id = ~id;
        `,
        user
      );
    } catch (error) {
      Logger.handleSQLError(error);
      throw error;
    }
  }

  async updatePassword(user: User): Promise<void> {
    try {
      await this.one(
        `
          UPDATE users
          SET password = ~password
          WHERE id = ~id;
        `,
        user
      );
    } catch (error) {
      Logger.handleSQLError(error);
      throw error;
    }
  }

}
