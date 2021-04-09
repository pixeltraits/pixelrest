import Repository from 'pixelrest/repository';
import Logger from 'pixelrest/logger';


export default class DocumentsRepository extends Repository {

  async createTable(user) {
    try {
      await this.query(
        `
          CREATE TABLE documents
          (
            id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
            name VARCHAR(100) NOT NULL,
            description VARCHAR(500) NOT NULL,
            filename VARCHAR(100) NOT NULL
          );
        `,
        user
      );
    } catch (error) {
      Logger.handleSQLError(error);
    }
  }

  async add(document) {
    let documentId;

    try {
      documentId = await this.insertAndGetLastInsertId(
        `
          INSERT INTO documents
          VALUES (null, ~name, ~description, ~filename);
        `,
        document
      );
    } catch (error) {
      Logger.handleSQLError(error);
    }

    return documentId;
  }

  async getById(id) {
    let document;

    try {
      document = await this.one(
        `
          SELECT id, name, description, filename
          FROM documents
          WHERE id = ~id;
        `,
        {
          id
        }
      );
    } catch (error) {
      Logger.handleSQLError(error);
    }

    return document;
  }

  async updateInformations(document) {
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
    }
  }

}
