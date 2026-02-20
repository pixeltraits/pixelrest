import { describe, it, expect, vi, afterEach } from 'vitest';
import fsPromises from 'fs/promises';
import logLevel from 'loglevel';

import Logger from 'pixelrest/logger';
import { DEFAULT_LOG_CONFIG } from "./logger.config.js";


describe('Logger', () => {

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe(`handleLog should`, () => {

    const log = `Test log`;
    const filePath = DEFAULT_LOG_CONFIG.LOG_FILE;

    it(`call info method of loglevel lib and call addLogToFile`, () => {
      vi.spyOn(logLevel, 'enableAll').mockImplementation(() => {});
      vi.spyOn(logLevel, 'info').mockImplementation(() => {});
      vi.spyOn(Logger, 'addLogToFile').mockImplementation(() => {});

      Logger.handleLog(log, filePath);

      expect(logLevel.enableAll).toHaveBeenCalled();
      expect(logLevel.info).toHaveBeenCalledWith(log);
      expect(Logger.addLogToFile).toHaveBeenCalledWith(log, filePath);
    });

  });

  describe(`handleError should`, () => {

    const log = `Test error log`;
    const filePath = DEFAULT_LOG_CONFIG.LOG_FILE;

    it(`call debug method of loglevel lib and call addLogToFile`, () => {
      vi.spyOn(logLevel, 'enableAll').mockImplementation(() => {});
      vi.spyOn(logLevel, 'debug').mockImplementation(() => {});
      vi.spyOn(Logger, 'addLogToFile').mockImplementation(() => {});

      Logger.handleError(log, filePath);

      expect(logLevel.enableAll).toHaveBeenCalled();
      expect(logLevel.debug).toHaveBeenCalledWith(log);
      expect(Logger.addLogToFile).toHaveBeenCalledWith(log, filePath);
    });

  });

  describe(`handleSQLError should`, () => {

    const log = `Test error sql log`;
    const filePath = DEFAULT_LOG_CONFIG.LOG_FILE;

    it(`call debug method of loglevel lib and call addLogToFile`, () => {
      vi.spyOn(logLevel, 'enableAll').mockImplementation(() => {});
      vi.spyOn(logLevel, 'debug').mockImplementation(() => {});
      vi.spyOn(Logger, 'addLogToFile').mockImplementation(() => {});

      Logger.handleSQLError(log, filePath);

      expect(logLevel.enableAll).toHaveBeenCalled();
      expect(logLevel.debug).toHaveBeenCalledWith(log);
      expect(Logger.addLogToFile).toHaveBeenCalledWith(log, filePath);
    });

  });

  describe(`addLogToFile should`, () => {

    const oldContentFile = `Old logs, `;
    const newLogs = `Test error sql log`;
    const finalContentFile = `Old logs, Test error sql log`;

    it(`add logs for the first time without directory`, async () => {
      const dirPath = new URL(`../../testDir`, import.meta.url);
      const filePath = new URL(`../../testDir/serverLog.log`, import.meta.url);

      await Logger.addLogToFile(newLogs, filePath);
      const processedContentFile = await fsPromises.readFile(filePath, `utf-8`);

      expect(processedContentFile).toEqual(newLogs);

      await fsPromises.unlink(filePath);
      await fsPromises.rmdir(dirPath);
    });

    it(`add logs for the first time with directory`, async () => {
      const dirPath = new URL(`../../testDir2`, import.meta.url);
      const filePath = new URL(`../../testDir2/serverLog.log`, import.meta.url);

      await fsPromises.mkdir(dirPath, { recursive: true });

      await Logger.addLogToFile(newLogs, filePath);
      const processedContentFile = await fsPromises.readFile(filePath, `utf-8`);

      expect(processedContentFile).toEqual(newLogs);

      await fsPromises.unlink(filePath);
      await fsPromises.rmdir(dirPath);
    });

    it(`add newLogs to file`, async () => {
      const dirPath = new URL(`../../testDir3`, import.meta.url);
      const filePath = new URL(`../../testDir3/serverLog.log`, import.meta.url);

      await fsPromises.mkdir(dirPath, { recursive: true });
      await fsPromises.writeFile(filePath, oldContentFile, `utf-8`);

      await Logger.addLogToFile(newLogs, filePath);

      const processedContentFile = await fsPromises.readFile(filePath, `utf-8`);

      expect(processedContentFile).toEqual(finalContentFile);

      await fsPromises.unlink(filePath);
      await fsPromises.rmdir(dirPath);
    });

  });

});
