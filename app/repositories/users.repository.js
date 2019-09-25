const Repository = require('../../utils/database/Repository');


class UsersRepository extends Repository {

  async add(user) {
    const userAdded = await this.query(
      `
        INSERT INTO users (firstname, lastname, email, password, roles) 
        VALUES (~firstname, ~lastname, ~email, ~password, ~roles);
        SELECT LAST_INSERT_ID();
      `,
      user
    );

    return userAdded;
  }

  async findAll() {
    const users = await this.query(
      `
        SELECT id, firstname, lastname, email, roles 
        FROM users
        ORDER BY lastname;
      `
    );

    return users;
  }

  async findById(id) {
    const user = await this.query(
      `
        SELECT id, firstname, lastname, email, roles
        FROM users
        WHERE id = ~id;
      `,
      {
        id: id
      }
    );

    return user;
  }

  async findByMail(email) {
    const user = await this.query(
      `
        SELECT id, roles, password
        FROM users
        WHERE email = ~email;
      `,
      {
        email: email
      }
    );

    return user;
  }

  async findPasswordById(id) {
    const password = await this.query(
      `
        SELECT password
        FROM users
        WHERE id = ~id;
      `,
      {
        id: id
      }
    );

    return password;
  }

  async updateInformations(user) {
    const updatedUser = await this.query(
      `
        UPDATE users 
        SET lastname = ~lastname, firstname = ~firstname, email = ~email 
        WHERE id = ~id;
        SELECT LAST_INSERT_ID();
      `,
      user
    );

    return updatedUser;
  }

  async updatePassword(user) {
    const userId = await this.query(
      `
        UPDATE users 
        SET password = ~password
        WHERE id = ~id;
        SELECT LAST_INSERT_ID();
      `,
      user
    );

    return userId;
  }

}

module.exports = UsersRepository;
