import { afterEach, beforeEach, describe, it, mock } from 'node:test';
import { deepStrictEqual, equal } from 'node:assert';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { Utils } from '../utils.js';

describe('Utils', () => {
  describe('getArgs', () => {
    const originalArgv = process.argv;

    afterEach(() => {
      process.argv = originalArgv;
    });

    it('should return cli arguments passed by the user - no arguments', () => {
      process.argv = ["one", "two"];
      const args = Utils.getArgs();
      deepStrictEqual(args, []);
    });

    it('should return cli arguments passed by the user - two arguments', () => {
      process.argv = ["one", "two", "three", "four"];
      const args = Utils.getArgs();
      deepStrictEqual(args, ["three", "four"]);
    });
  });

  describe('logErrorMsg', () => {
    const errorMsg = 'Error Message';
    const exitCode = -1;

    let consoleErrorMock;
    let processExitMock;

    beforeEach(() => {
      consoleErrorMock = mock.method(console, 'error', () => {});
      processExitMock = mock.method(process, 'exit', () => {});
    });

    afterEach(() => {
      consoleErrorMock.mock.restore();
      processExitMock.mock.restore();
    });

    it('should log an error message to the console and exit the process with status = -1', () => {
      Utils.logErrorMsg(errorMsg, true);

      equal(consoleErrorMock.mock.callCount(), 1);
      deepStrictEqual(consoleErrorMock.mock.calls[0].arguments, [errorMsg]);

      equal(processExitMock.mock.callCount(), 1);
      deepStrictEqual(processExitMock.mock.calls[0].arguments, [exitCode]);
    });

    it('should log an error message to the console and don\'t exit the process', () => {
      Utils.logErrorMsg(errorMsg, false);

      equal(consoleErrorMock.mock.callCount(), 1);
      deepStrictEqual(consoleErrorMock.mock.calls[0].arguments, [errorMsg]);

      equal(processExitMock.mock.callCount(), 0);
    });
  });

  describe('isValidDate', () => {
    it('should return true for a valid date', () => {
      const date = new Date();
      equal(Utils.isValidDate(date), true);
    });

    it('should return false for an invalid date - test case 1', () => {
      const date = "2025-08-15";
      equal(Utils.isValidDate(date), false);
    });

    it('should return false for an invalid date - test case 2', () => {
      const date = new Date("invalid");
      equal(Utils.isValidDate(date), false);
    });
  });

  describe('isTestEnvironment', () => {
    it('should return true as the test environment is set', () => {
      const isTestEnv = Utils.isTestEnvironment();
      equal(isTestEnv, true);
    });
  });

  describe('__filename', () => {
    it('should return the current file path with filename', () => {
      const __filename = fileURLToPath(import.meta.url);
      equal(Utils.filename(import.meta.url), __filename);
    });
  });

  describe('__dirname', () => {
    it('should return the current file directory', () => {
      const __dirname = dirname(fileURLToPath(import.meta.url))
      equal(Utils.dirname(import.meta.url), __dirname);
    });
  });
});
