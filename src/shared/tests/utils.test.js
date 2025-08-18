import { after, afterEach, describe, it, mock } from 'node:test';
import { deepStrictEqual, equal } from 'node:assert';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { TestUtils } from '../test-utils.js';
import { Utils } from '../utils.js';

describe('Utils', () => {
  describe('getArgs', () => {
    const originalArgv = process.argv;

    afterEach(() => {
      process.argv = originalArgv;
    });

    it('should return an empty array if no arguments are provided', () => {
      process.argv = TestUtils.generateRandomStringArray(2);

      const args = Utils.getArgs();

      deepStrictEqual(args, []);
    });

    it('should return cli arguments passed by the user', () => {
      process.argv = TestUtils.generateRandomStringArray(5);

      const args = Utils.getArgs();

      deepStrictEqual(args, process.argv.slice(2));
    });
  });

  describe('logErrorMsg', () => {
    const consoleErrorMock = mock.method(console, 'error', () => {}).mock;
    const processExitMock = mock.method(process, 'exit', () => {}).mock;

    afterEach(() => {
      consoleErrorMock.resetCalls();
      processExitMock.resetCalls();
    });

    after(() => {
      mock.restoreAll();
    });

    it('should print the error message to the console', () => {
      const errorMsg = TestUtils.generateRandomString();
      const exitProcess = false;

      Utils.logErrorMsg(errorMsg, exitProcess);

      equal(consoleErrorMock.callCount(), 1);
      deepStrictEqual(consoleErrorMock.calls[0].arguments, [errorMsg]);
    });

    it('should exit the process if specified to do so', () => {
      const errorMsg = TestUtils.generateRandomString();
      const exitProcess = true;
      const expectedExitCode = -1;

      Utils.logErrorMsg(errorMsg, exitProcess);

      equal(processExitMock.callCount(), 1);
      deepStrictEqual(processExitMock.calls[0].arguments, [expectedExitCode]);
    });

    it('should not exit the process if specified not to do so', () => {
      const errorMsg = TestUtils.generateRandomString();
      const exitProcess = false;

      Utils.logErrorMsg(errorMsg, exitProcess);

      equal(processExitMock.callCount(), 0);
    });
  });

  describe('isValidDate', () => {
    it('should return true for a valid date', () => {
      const date = new Date();

      const isValidDate = Utils.isValidDate(date);

      equal(isValidDate, true);
    });

    it('should return false for date in a string format', () => {
      const date = "2025-08-15";

      const isValidDate = Utils.isValidDate(date);

      equal(isValidDate, false);
    });

    it('should return false for an invalid date instance', () => {
      const date = new Date("invalid");

      const isValidDate = Utils.isValidDate(date);

      equal(isValidDate, false);
    });
  });

  describe('isTestEnvironment', () => {
    it('should return true as the test environment is already set', () => {
      const isTestEnv = Utils.isTestEnvironment();

      equal(isTestEnv, true);
    });
  });

  describe('filename', () => {
    it('should return the current file name with its absolute path', () => {
      const metaUrl = import.meta.url;
      const expectedFilename = fileURLToPath(metaUrl);

      const actualFilename = Utils.filename(metaUrl);

      equal(actualFilename, expectedFilename);
    });
  });

  describe('dirname', () => {
    it('should return the current file directory as an absolute path', () => {
      const metaUrl = import.meta.url;
      const expectedDirname = dirname(fileURLToPath(metaUrl));

      const actualDirname = Utils.dirname(metaUrl);

      equal(actualDirname, expectedDirname);
    });
  });
});
