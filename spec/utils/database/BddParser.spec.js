process.env.NODE_ENV = 'test';
import BddParserAbstractClassMock from '../../mocks/BddParserAbstractClassMock.js';


describe('BddParser', () => {

  describe(`parse should`, () => {

    it(`throw an error if is not override`, () => {
      const bddParser = new BddParserAbstractClassMock();
      const error = new Error(`Un parser doit contenir une methode parse.`);

      expect(() => {
        bddParser.parse();
      }).toThrow(error);
    });

  });

});
