const { PrettyPostgres } = require('../../utils/PrettyPostgres');


class UsersRepository {

  constructor(db) {
    this.db = db;
  }

  async add(user) {
    const userAdded = await this.db.one(
      PrettyPostgres.parse(`
        INSERT INTO user (firstname, lastname, mail, password, role) 
        VALUES (~firstname, ~lastname, ~mail, ~password, ~role) 
        RETURNING *;
      `),
      user
    );

    return userAdded;
  }

  async findAll() {
    const users = await this.db.any(
      PrettyPostgres.parse(`
        SELECT id, firstname, lastname, mail, role 
        FROM user 
        ORDER BY lastname;
      `)
    );

    return users;
  }

  async findById(id) {
    const user = await this.db.oneOrNone(
      PrettyPostgres.parse(`
        SELECT id, firstname, lastname, mail, role
        FROM user 
        WHERE user.id = ~id;
      `),
      {
        id: id
      }
    );

    return user;
  }

  async findByMail(mail) {
    const user = await this.db.oneOrNone(
      PrettyPostgres.parse(`
        SELECT id, role, password
        FROM user
        WHERE mail = ~mail;
      `),
      {
        mail: mail
      }
    );

    return user;
  }

  async findPasswordById(id) {
    const password = await this.db.oneOrNone(
      PrettyPostgres.parse(`
        SELECT password
        FROM user
        WHERE id = ~id;
      `),
      {
        id: id
      }
    );

    return password;
  }

  async updateInformations(user) {
    const updatedUser = await this.db.one(
      PrettyPostgres.parse(`
        UPDATE user 
        SET lastname = ~lastname, firstname = ~firstname, mail = ~mail 
        WHERE id = ~id
        RETURNING id, lastname, firstname, mail;
      `),
      user
    );

    return updatedUser;
  }

  async updatePassword(user) {
    const userId = await this.db.one(
      PrettyPostgres.parse(`
        UPDATE user 
        SET password = ~password
        WHERE id = ~id
        RETURNING id;
      `),
      user
    );

    return userId;
  }

}

module.exports = UsersRepository;
