/**
 * @abstract
 * @class Repository
 */
export default class Repository {
  /**
   * constructor
   * @public
   * @method constructor
   * @param {object} db - db pool
   * @param {object} parser - Parser class instance
   * @return {void}
   */
  constructor(db, parser) {
    this.db = db;
    this.parser = parser;
  }
  /**
   * query
   * @public
   * @method query
   * @param {string} sqlRequest - sql request
   * @param {string} sqlParameters - sql parameters
   * @return {any} sql result
   */
  async query(sqlRequest, sqlParameters) {
    const sqlParsed = this.parser.parse(sqlRequest, sqlParameters);
    const mysqlResult = await this.db.execute(sqlParsed.sqlRequest, sqlParsed.sqlParameters);

    return mysqlResult[0];
  }
}
