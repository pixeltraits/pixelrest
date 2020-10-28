import Repository from 'node-rest/repository';
import Logger from 'node-rest/logger';


export default class UsersRepository extends Repository {

  async createDataBase(user) {
    try {
      await this.query(
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
    let userAdded;

    try {
      userAdded = await this.query(
        `
          INSERT INTO users 
          VALUES (null, ~firstname, ~lastname, ~email, ~password, ~roles);
        `,
        user
      );
    } catch (error) {
      Logger.handleSQLError(error);
    }

    return userAdded;
  }

  async findAll() {
    let users;

    try {
      users = await this.query(
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

  async findById(id) {
    let user;

    try {
      user = await this.query(
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

  async findByMail(email) {
    let user;

    try {
      user = await this.query(
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

  async findPasswordById(id) {
    let password;

    try {
      password = await this.query(
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
    let updatedUser;

    try {
      updatedUser = await this.query(
        `
          UPDATE users 
          SET lastname = ~lastname, firstname = ~firstname, email = ~email 
          WHERE id = ~id;
          SELECT LAST_INSERT_ID();
        `,
        user
      );
    } catch (error) {
      Logger.handleSQLError(error);
    }

    return updatedUser;
  }

  async updatePassword(user) {
    let userId;

    try {
      userId = await this.query(
        `
          UPDATE users 
          SET password = ~password
          WHERE id = ~id;
          SELECT LAST_INSERT_ID();
        `,
        user
      );
    } catch (error) {
      Logger.handleSQLError(error);
    }

    return userId;
  }

}
