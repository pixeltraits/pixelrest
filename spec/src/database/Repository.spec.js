process.env.NODE_ENV = 'test';
import Repository from 'pixelrest/repository';
import MysqlParser from 'pixelrest/mysqlParser';


describe('Repository', () => {

  const db = {
    execute: (sqlRequest, sqlParameters) => {
      return [
        [
          {
            value: "result"
          },
          5
        ],
        []
      ]
    }
  };
  const parser = new MysqlParser();

  describe('constructor should', () => {

    it('set db and parser', () => {
      const repository = new Repository(db, parser);

      expect(db).toBe(repository.db);
      expect(parser).toBe(repository.parser);
    });

  });

  describe('one should', () => {

    it('call parser.parse method with sql request and parameters and execute request with parsed parameters and request', async () => {
      const request = `
        SELECT * 
        FROM test 
        WHERE id=~id
        AND status=~status;
      `;
      const parsedRequest = 'SELECT * FROM test WHERE id=? AND status=?;';
      const parameters = {
        status: false,
        id: 5
      };
      const parsedParameters = [
        5,
        false
      ];
      const expectedSqlResult = {
        value: "result"
      };
      const repository = new Repository(db, parser);
      spyOn(parser, 'parse').and.callThrough();
      spyOn(db, 'execute').and.callThrough();

      const sqlResult = await repository.one(request, parameters);

      expect(parser.parse).toHaveBeenCalledWith(request, parameters);
      expect(db.execute).toHaveBeenCalledWith(parsedRequest, parsedParameters);
      expect(expectedSqlResult).toEqual(sqlResult);
    });

  });

  describe('any should', () => {

    it('call parser.parse method with sql request and parameters and execute request with parsed parameters and request', async () => {
      const request = `
        SELECT * 
        FROM test 
        WHERE id=~id
        AND status=~status;
      `;
      const parsedRequest = 'SELECT * FROM test WHERE id=? AND status=?;';
      const parameters = {
        status: false,
        id: 5
      };
      const parsedParameters = [
        5,
        false
      ];
      const expectedSqlResult = [
        {
          value: "result"
        },
        5
      ];
      const repository = new Repository(db, parser);
      spyOn(parser, 'parse').and.callThrough();
      spyOn(db, 'execute').and.callThrough();

      const sqlResult = await repository.any(request, parameters);

      expect(parser.parse).toHaveBeenCalledWith(request, parameters);
      expect(db.execute).toHaveBeenCalledWith(parsedRequest, parsedParameters);
      expect(expectedSqlResult).toEqual(sqlResult);
    });

  });

});
