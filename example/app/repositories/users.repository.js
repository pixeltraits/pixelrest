import Repository from 'pixelrest/repository';
import Logger from 'pixelrest/logger';


export default class UsersRepository extends Repository {

  async createTable(user) {
    try {
      await this.any(
        `
          CREATE TABLE users
          (
            id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
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
    }
  }

  async add(user) {
    let userId;

    try {
      userId = await this.insertAndGetLastInsertId(
        `
          INSERT INTO users 
          VALUES (null, ~firstname, ~lastname, ~email, ~password, ~roles);
        `,
        user
      );
    } catch (error) {
      Logger.handleSQLError(error);
    }

    return userId;
  }

  async getAll() {
    let users;

    try {
      users = await this.any(
        `
          SELECT id, firstname, lastname, email, roles 
          FROM users
          ORDER BY lastname;
        `
      );
    } catch (error) {
      Logger.handleSQLError(error);
    }

    return users;
  }

  async getById(id) {
    let user;

    try {
      user = await this.one(
        `
          SELECT id, firstname, lastname, email, roles
          FROM users
          WHERE id = ~id;
        `,
        {
          id: id
        }
      );
    } catch (error) {
      Logger.handleSQLError(error);
    }

    return user;
  }

  async getByMail(email) {
    let user;

    try {
      user = await this.one(
        `
          SELECT id, roles, firstname, lastname, email
          FROM users
          WHERE email = ~email;
        `,
        {
          email: email
        }
      );
    } catch (error) {
      Logger.handleSQLError(error);
    }

    return user;
  }

  async getByMailWithPassword(email) {
    let user;

    try {
      user = await this.one(
        `
          SELECT id, roles, firstname, lastname, email, password
          FROM users
          WHERE email = ~email;
        `,
        {
          email: email
        }
      );
    } catch (error) {
      Logger.handleSQLError(error);
    }

    return user;
  }

  async getPasswordById(id) {
    let password;

    try {
      password = await this.one(
        `
          SELECT password
          FROM users
          WHERE id = ~id;
        `,
        {
          id: id
        }
      );
    } catch (error) {
      Logger.handleSQLError(error);
    }

    return password;
  }

  async updateInformations(user) {
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
    }
  }

  async updatePassword(user) {
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
    }
  }

}
