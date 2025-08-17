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
      // Arrange
      process.argv = ["one", "two"];

      // Act
      const args = Utils.getArgs();

      // Assert
      deepStrictEqual(args, []);
    });

    it('should return cli arguments passed by the user - two arguments', () => {
      // Arrange
      process.argv = ["one", "two", "three", "four"];

      // Act
      const args = Utils.getArgs();

      // Assert
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
      // Arrange

      // Act
      Utils.logErrorMsg(errorMsg, true);

      // Assert
      equal(consoleErrorMock.mock.callCount(), 1);
      deepStrictEqual(consoleErrorMock.mock.calls[0].arguments, [errorMsg]);
      equal(processExitMock.mock.callCount(), 1);
      deepStrictEqual(processExitMock.mock.calls[0].arguments, [exitCode]);
    });

    it('should log an error message to the console and don\'t exit the process', () => {
      // Arrange

      // Act
      Utils.logErrorMsg(errorMsg, false);

      // Assert
      equal(consoleErrorMock.mock.callCount(), 1);
      deepStrictEqual(consoleErrorMock.mock.calls[0].arguments, [errorMsg]);
      equal(processExitMock.mock.callCount(), 0);
    });
  });

  describe('isValidDate', () => {
    it('should return true for a valid date', () => {
      // Arrange
      const date = new Date();

      // Act
      const isValidDate = Utils.isValidDate(date);

      // Assert
      equal(isValidDate, true);
    });

    it('should return false for an invalid date - test case 1', () => {
      // Arrange
      const date = "2025-08-15";

      // Act
      const isValidDate = Utils.isValidDate(date);

      // Assert
      equal(isValidDate, false);
    });

    it('should return false for an invalid date - test case 2', () => {
      // Arrange
      const date = new Date("invalid");

      // Act
      const isValidDate = Utils.isValidDate(date);

      // Assert
      equal(isValidDate, false);
    });
  });

  describe('isTestEnvironment', () => {
    it('should return true as the test environment is set', () => {
      // Arrange

      // Act
      const isTestEnv = Utils.isTestEnvironment();

      // Assert
      equal(isTestEnv, true);
    });
  });

  describe('__filename', () => {
    it('should return the current file path with filename', () => {
      // Arrange
      const metaUrl = import.meta.url;
      const expectedFilename = fileURLToPath(metaUrl);

      // Act
      const actualFilename = Utils.filename(metaUrl);

      // Assert
      equal(actualFilename, expectedFilename);
    });
  });

  describe('__dirname', () => {
    it('should return the current file directory', () => {
      // Arrange
      const metaUrl = import.meta.url;
      const expectedDirname = dirname(fileURLToPath(metaUrl));

      // Act
      const actualDirname = Utils.dirname(metaUrl);

      // Assert
      equal(actualDirname, expectedDirname);
    });
  });
});
