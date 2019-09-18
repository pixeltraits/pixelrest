const { PrettyPostgres } = require('../../utils/PrettyPostgres');


class UsersRepository {

  constructor(db) {
    this.db = db;
  }

  add(user) {
    return this.db.one(
      PrettyPostgres.parse(`
        INSERT INTO utilisateur (prenom, nom, mail, mot_de_passe, role, statut) 
        VALUES (~prenom, ~nom, ~mail, ~mot_de_passe, ~role, ~statut) 
        RETURNING *;
      `),
      user
    );
  }

  findAll() {
    return this.db.any(
      PrettyPostgres.parse(`
        SELECT id, prenom, nom, mail, role, statut AS status 
        FROM utilisateur 
        ORDER BY NOM;
      `)
    );
  }

  findById(id) {
    return this.db.oneOrNone(
      PrettyPostgres.parse(`
        SELECT id, prenom, nom, mail, role, statut AS status
        FROM utilisateur 
        WHERE utilisateur.id = ~id;
      `),
      {
        id: +id
      }
    );
  }

  findByMail(mail) {
    return this.db.oneOrNone(
      PrettyPostgres.parse(`
        SELECT id, role, mot_de_passe AS password
        FROM utilisateur
        WHERE mail = ~mail;
      `),
      {
        mail: mail
      }
    );
  }

  findPasswordById(id) {
    return this.db.oneOrNone(
      PrettyPostgres.parse(`
        SELECT mot_de_passe
        FROM utilisateur
        WHERE id = ~id;
      `),
      {
        id: +id
      }
    );
  }

  updateStatut(user) {
    return this.db.one(
      PrettyPostgres.parse(`
        UPDATE utilisateur 
        SET prenom = ~prenom, nom = ~nom, mail = ~mail 
        WHERE id = ~id
        RETURNING id, prenom, nom, mail;
      `),
      user
    );
  }

  updateInformations(user) {
    return this.db.one(
      PrettyPostgres.parse(`
        UPDATE utilisateur
        SET statut = ~statut
        WHERE id = ~id
        RETURNING id, statut;
      `),
      user
    );
  }

  updatePassword(user) {
    return this.db.one(
      PrettyPostgres.parse(`
        UPDATE utilisateur 
        SET mot_de_passe = ~password
        WHERE id = ~id
        RETURNING id, statut;
      `),
      user
    );
  }

}

module.exports = UsersRepository;
