import { deepStrictEqual, equal } from 'node:assert';
import { afterEach, beforeEach, describe, it } from 'node:test';

import { Utils } from '../utils.js';

describe('Utils', () => {
  describe('getArgs', () => {
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
    const originalError = console.error;
    const originalExit = process.exit;

    const errorMsg = 'Error Message';
    const exitCode = -1;

    let errorCalledWith;
    let exitCalledWith;

    beforeEach(() => {
      errorCalledWith = null;
      exitCalledWith = null;

      console.error = (msg) => errorCalledWith = msg;
      process.exit = (code) => exitCalledWith = code;
    });

    afterEach(() => {
      console.error = originalError;
      process.exit = originalExit;
    });

    it('should log an error message to the console and exit the process with status = -1', () => {
      Utils.logErrorMsg(errorMsg, true);

      equal(errorCalledWith, errorMsg);
      equal(exitCalledWith, exitCode);
    });

    it('should log an error message to the console and don\'t exit the process', () => {
      Utils.logErrorMsg(errorMsg, false);

      equal(errorCalledWith, errorMsg);
      equal(exitCalledWith, null);
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
});
