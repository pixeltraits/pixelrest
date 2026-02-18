import { describe, it, expect, vi } from 'vitest';
import Server from 'pixelrest/server';
import Logger from 'pixelrest/logger';
import { SERVER_ERROR_CODES } from "../../../src/nodeExpress/server-errors.config.js";


describe('Server', () => {

  describe(`onError should`, () => {

    const port = 1339;

    it(`if error code is Port already in use should call handleError and exit process`, () => {
      const error = {
        code: SERVER_ERROR_CODES.PORT_ALREADY_IN_USE
      };
      vi.spyOn(Logger, 'handleError').mockImplementation(() => {});
      vi.spyOn(process, 'exit').mockImplementation(() => {});

      Server.onError(error, port);

      expect(Logger.handleError).toHaveBeenCalledWith(`Port ${port} already in use`);
      expect(process.exit).toHaveBeenCalledWith(1);

      vi.restoreAllMocks();
    });

    it(`if error code is unknown should call throw error`, () => {
      const error = {
        code: 'unknown'
      };

      expect(() => {
        Server.onError(error, port);
      }).toThrow();
    });

  });

  describe(`onListening should`, () => {

    const host = `localhost`;
    const port = 1339;

    it(`On listening call Logger handleLog`, () => {
      vi.spyOn(Logger, 'handleLog').mockImplementation(() => {});

      Server.onListening(host, port);

      expect(Logger.handleLog).toHaveBeenCalledWith(`Listening on ${host}:${port}`);

      vi.restoreAllMocks();
    });

  });

});
