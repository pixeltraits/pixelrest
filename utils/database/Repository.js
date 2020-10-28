export default class Repository {

  constructor(db, parser) {
    this.db = db;
    this.parser = parser;
  }

  async query(sqlRequest, sqlParameters) {
    const sqlParsed = this.parser.parse(sqlRequest, sqlParameters);
    const mysqlResult = await this.db.execute(sqlParsed.sqlRequest, sqlParsed.sqlParameters);

    return mysqlResult[0];
  }

}
