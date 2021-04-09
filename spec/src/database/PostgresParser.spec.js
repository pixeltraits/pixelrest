process.env.NODE_ENV = 'test';
import PostgresParser from 'pixelrest/postgresParser';


describe('PostgresParser', () => {

  const postgresParser = new PostgresParser();

  describe('parse should', () => {

    it('if there is no parameters remove line break and useless spaces', () => {
      const request = `
        SELECT * 
        FROM test;
      `;
      const expectedRequest = 'SELECT * FROM test;';

      const formatedRequest = postgresParser.parse(request);

      expect(expectedRequest).toEqual(formatedRequest);
    });

    it('if there is parameters remove line break and useless spaces and change params identifier', () => {
      const request = `
        SELECT * 
        FROM test 
        WHERE id=~id;
      `;
      const expectedRequest = 'SELECT * FROM test WHERE id=${id};';

      const formatedRequest = postgresParser.parse(request);

      expect(expectedRequest).toEqual(formatedRequest);
    });

  });

});
