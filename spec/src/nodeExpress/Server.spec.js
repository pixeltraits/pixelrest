process.env.NODE_ENV = 'test';
import nodemon from "nodemon";
import Server from 'node-rest/server';
import Logger from 'node-rest/logger';
import { SERVER_ERROR_CODES } from "../../../src/nodeExpress/server-errors.config.js";


describe('Server', () => {

  describe(`onError should`, () => {

    const port = 1339;

    it(`if error code is Port already in use should call handleError and exit nodedemon`, () => {
      const error = {
        code: SERVER_ERROR_CODES.PORT_ALREADY_IN_USE
      };
      const emitMock = {
        emit: (testArg) => {

        }
      }
      nodemon.once = (exit, handler) => {
        return emitMock;
      }
      spyOn(nodemon, 'once').and.callThrough();
      spyOn(emitMock, 'emit');
      spyOn(Logger, 'handleError');

      Server.onError(error, port);

      expect(nodemon.once).toHaveBeenCalled();
      expect(emitMock.emit).toHaveBeenCalledWith('quit');
      expect(Logger.handleError).toHaveBeenCalledWith(`Port ${port} already in use`);
    });

    it(`if error code is unknown should call throw error`, () => {
      const error = {
        code: 'unknown'
      };

      expect(() => {
        Server.onError(error, port);
      }).toThrow(error);
    });

  });

  describe('Server', () => {

    describe(`onListening should`, () => {

      const host = `localhost`;
      const port = 1339;

      it(`On listening call Logger handleLog`, () => {
        spyOn(Logger, 'handleLog');

        Server.onListening(host, port);

        expect(Logger.handleLog).toHaveBeenCalledWith(`Listening on ${host}:${port}`);
      });

    });

  });

});
