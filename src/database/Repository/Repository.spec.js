import { describe, it, expect, vi } from 'vitest';
import Repository from 'pixelrest/repository';
import MysqlParser from 'pixelrest/mysqlParser';


describe('Repository', () => {

  const db = {
    execute: () => {
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
      vi.spyOn(parser, 'parse');
      vi.spyOn(db, 'execute');

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
      vi.spyOn(parser, 'parse');
      vi.spyOn(db, 'execute');

      const sqlResult = await repository.any(request, parameters);

      expect(parser.parse).toHaveBeenCalledWith(request, parameters);
      expect(db.execute).toHaveBeenCalledWith(parsedRequest, parsedParameters);
      expect(expectedSqlResult).toEqual(sqlResult);
    });

  });

  describe('insertAndGetLastInsertId should', () => {

    it('return insertId from MySQL-style result', async () => {
      const mysqlDb = {
        execute: vi.fn().mockResolvedValue([{ insertId: 42 }, []])
      };
      const repository = new Repository(mysqlDb, parser);
      const request = `INSERT INTO test (status) VALUES (~status)`;
      const parameters = { status: 'active' };

      const result = await repository.insertAndGetLastInsertId(request, parameters);

      expect(result).toBe(42);
    });

    it('return id from PostgreSQL-style result with rows', async () => {
      const pgDb = {
        execute: vi.fn().mockResolvedValue({ rows: [{ id: 99 }] })
      };
      const repository = new Repository(pgDb, parser);
      const request = `INSERT INTO test (status) VALUES (~status)`;
      const parameters = { status: 'active' };

      const result = await repository.insertAndGetLastInsertId(request, parameters);

      expect(result).toBe(99);
    });

    it('return null if no insertId or id found', async () => {
      const unknownDb = {
        execute: vi.fn().mockResolvedValue({ rows: [{}] })
      };
      const repository = new Repository(unknownDb, parser);
      const request = `INSERT INTO test (status) VALUES (~status)`;
      const parameters = { status: 'active' };

      const result = await repository.insertAndGetLastInsertId(request, parameters);

      expect(result).toBeNull();
    });

  });

});
