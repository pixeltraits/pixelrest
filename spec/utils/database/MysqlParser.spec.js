process.env.NODE_ENV = 'test';
import MysqlParser from 'node-rest/mysqlParser';


describe('MysqlParser', () => {

  const mysqlParser = new MysqlParser();

  describe('parse should', () => {

    it('remove line break and useless spaces from request', () => {
      const request = `
        SELECT *
        FROM test;
      `;
      const expectedRequest = 'SELECT * FROM test;';
      const parameters = {};

      const formatedObject = mysqlParser.parse(request, parameters);

      expect(expectedRequest).toEqual(formatedObject.sqlRequest);
    });

    it('if there is no parameters remove line break and useless spaces from request and return with the request an empty array', () => {
      const request = `
        SELECT *
        FROM test;
      `;
      const expectedRequest = 'SELECT * FROM test;';
      const parameters = {};
      const expectedParameters = [];

      const formatedObject = mysqlParser.parse(request, parameters);

      expect(expectedRequest).toEqual(formatedObject.sqlRequest);
      expect(expectedParameters).toEqual(formatedObject.sqlParameters);
    });

    it('if there is parameters change params identifier by ? and return an array of params in order of params in the request', () => {
      const request = `
        SELECT * 
        FROM test 
        WHERE id=~id
        AND status=~status;
      `;
      const expectedRequest = 'SELECT * FROM test WHERE id=? AND status=?;';
      const parameters = {
        status: false,
        id: 5
      };
      const expectedParameters = [
        5,
        false
      ];

      const formatedObject = mysqlParser.parse(request, parameters);

      expect(expectedRequest).toEqual(formatedObject.sqlRequest);
      expect(expectedParameters).toEqual(formatedObject.sqlParameters);
    });

  });

});
