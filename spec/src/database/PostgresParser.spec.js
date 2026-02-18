import { describe, it, expect } from 'vitest';
import PostgresParser from 'pixelrest/postgresParser';


describe('PostgresParser', () => {

  const postgresParser = new PostgresParser();

  describe('parse should', () => {

    it('if there is no parameters remove line break and useless spaces and return object with empty parameters', () => {
      const request = `
        SELECT *
        FROM test;
      `;
      const expectedRequest = 'SELECT * FROM test;';
      const parameters = {};

      const formatedObject = postgresParser.parse(request, parameters);

      expect(formatedObject.sqlRequest).toEqual(expectedRequest);
      expect(formatedObject.sqlParameters).toEqual({});
    });

    it('if there is parameters remove line break and useless spaces, change params identifier and return parameters', () => {
      const request = `
        SELECT *
        FROM test
        WHERE id=~id;
      `;
      const expectedRequest = 'SELECT * FROM test WHERE id=${id};';
      const parameters = { id: 5 };

      const formatedObject = postgresParser.parse(request, parameters);

      expect(formatedObject.sqlRequest).toEqual(expectedRequest);
      expect(formatedObject.sqlParameters).toEqual(parameters);
    });

  });

});
