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
   * any
   * @public
   * @method any
   * @param {string} sqlRequest - sql request
   * @param {string} sqlParameters - sql parameters
   * @return {any} sql result
   */
  async any(sqlRequest, sqlParameters) {
    const sqlParsed = this.parser.parse(sqlRequest, sqlParameters);
    const [rows, fields] = await this.db.execute(sqlParsed.sqlRequest, sqlParsed.sqlParameters);

    return rows;
  }
  /**
   * one
   * @public
   * @method one
   * @param {string} sqlRequest - sql request
   * @param {string} sqlParameters - sql parameters
   * @return {any} sql result
   */
  async one(sqlRequest, sqlParameters) {
    const sqlParsed = this.parser.parse(sqlRequest, sqlParameters);
    const [rows, fields] = await this.db.execute(sqlParsed.sqlRequest, sqlParsed.sqlParameters);

    return rows[0];
  }
  /**
   * insertAndGetLastInsertId
   * @public
   * @method insertAndGetLastInsertId
   * @param {string} sqlRequest - sql request
   * @param {string} sqlParameters - sql parameters
   * @return {number} last insert id
   */
  async insertAndGetLastInsertId(sqlRequest, sqlParameters) {
    const sqlParsed = this.parser.parse(sqlRequest, sqlParameters);
    const mysqlResult = await this.db.execute(sqlParsed.sqlRequest, sqlParsed.sqlParameters);

    return mysqlResult[0].insertId;
  }
}
