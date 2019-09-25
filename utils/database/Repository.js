class Repository {

  constructor(dbPool, parser) {
    this.dbPool = dbPool;
    this.parser = parser;
  }

  async query(sqlRequest, sqlParameters) {
    const sqlParsed = this.parser(sqlRequest, sqlParameters);
    return await this.dbPool.query(sqlParsed.sqlRequest, sqlParsed.sqlParameters);
  }

}

module.exports = Repository;
