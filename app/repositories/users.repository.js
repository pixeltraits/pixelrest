import Repository from 'node-rest/repository';
import Logger from 'node-rest/logger';


export default class UsersRepository extends Repository {

  async add(user) {
    let userAdded;

    try {
      userAdded = await this.query(
        `
        INSERT INTO users (firstname, lastname, email, password, roles) 
        VALUES (~firstname, ~lastname, ~email, ~password, ~roles);
        SELECT LAST_INSERT_ID();
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
          SELECT id, roles, password
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
