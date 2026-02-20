import { describe, it, expect } from 'vitest';
import BddParserAbstractClassMock from './BddParserAbstractClassMock.js';
import { MYSQL_PARSER_IDENTIFIER } from '../MysqlParser/mysql-parser.config.js';


describe('BddParser', () => {

  describe(`parse should`, () => {

    it(`throw an error if is not override`, () => {
      const bddParser = new BddParserAbstractClassMock();

      expect(() => {
        bddParser.parse();
      }).toThrow(MYSQL_PARSER_IDENTIFIER.PARSER_ERROR);
    });

  });

});
