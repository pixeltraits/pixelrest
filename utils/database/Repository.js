export default class Repository {

  constructor(db, parser) {
    this.db = db;
    this.parser = parser;
  }

  async query(sqlRequest, sqlParameters) {
    const sqlParsed = this.parser(sqlRequest, sqlParameters);
    return await this.db.query(sqlParsed.sqlRequest, sqlParsed.sqlParameters);
  }

}
