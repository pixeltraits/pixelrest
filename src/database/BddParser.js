import { MYSQL_PARSER_IDENTIFIER } from './mysql-parser.config.js';

/**
 * @abstract
 * @class BddParser
 */
export default class BddParser {
  /**
   * parse
   * @public
   * @method parse
   * @return {void}
   */
  parse() {
    throw new Error(MYSQL_PARSER_IDENTIFIER.PARSER_ERROR);
  }
}
