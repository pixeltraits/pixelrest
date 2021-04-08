process.env.NODE_ENV = 'test';
import BddParserAbstractClassMock from '../../mocks/BddParserAbstractClassMock.js';
import { MYSQL_PARSER_IDENTIFIER } from '../../../src/database/mysql-parser.config.js';


describe('BddParser', () => {

  describe(`parse should`, () => {

    it(`throw an error if is not override`, () => {
      const bddParser = new BddParserAbstractClassMock();
      const error = new Error(MYSQL_PARSER_IDENTIFIER.PARSER_ERROR);

      expect(() => {
        bddParser.parse();
      }).toThrow(error);
    });

  });

});
