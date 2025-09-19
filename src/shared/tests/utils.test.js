import { after, afterEach, describe, it, mock } from 'node:test';
import { deepStrictEqual, equal, rejects } from 'node:assert';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { AnsiCodes } from '../enums.js';
import { ConsoleStringBuilder } from '../console-string.builder.js';
import { TestUtils } from '../test-utils.js';
import { Utils } from '../utils.js';
import { messages } from '../messages.js';

describe('Utils', () => {
  const processExitFn = mock.method(process, 'exit', () => {});
  const errorFn = mock.fn();
  const errorMsgFn = mock.fn(() => ({ error: errorFn }));
  const logFn = mock.fn();
  const successMsgFn = mock.fn(() => ({ log: logFn }));
  const infoMsgFn = mock.fn(() => ({ log: logFn }));
  const createFn = mock.method(ConsoleStringBuilder, 'create', () => ({
    errorMsg: errorMsgFn,
    successMsg: successMsgFn,
    infoMsg: infoMsgFn,
  }));

  after(() => {
    mock.restoreAll();
  });

  describe('logSuccessMsg', () => {
    afterEach(() => {
      logFn.mock.resetCalls();
      successMsgFn.mock.resetCalls();
      createFn.mock.resetCalls();
    });

    it('should print the success message to the console', () => {
      const fakeMessage = TestUtils.generateRandomString();

      Utils.logSuccessMsg(fakeMessage);

      equal(createFn.mock.callCount(), 1);
      equal(successMsgFn.mock.callCount(), 1);
      equal(successMsgFn.mock.calls[0].arguments[0], fakeMessage);
      equal(logFn.mock.callCount(), 1);
    });
  });

  describe('logErrorMsg', () => {
    afterEach(() => {
      errorFn.mock.resetCalls();
      errorMsgFn.mock.resetCalls();
      createFn.mock.resetCalls();
      processExitFn.mock.resetCalls();
    });

    it('should print the error message to the console', () => {
      const fakeMessage = TestUtils.generateRandomString();

      Utils.logErrorMsg(fakeMessage);

      equal(createFn.mock.callCount(), 1);
      equal(errorMsgFn.mock.callCount(), 1);
      equal(errorMsgFn.mock.calls[0].arguments[0], fakeMessage);
      equal(errorFn.mock.callCount(), 1);
    });

    it('should exit the process if specified to do so', () => {
      const errorMsg = TestUtils.generateRandomString();
      const exitProcess = true;
      const expectedExitCode = -1;

      Utils.logErrorMsg(errorMsg, exitProcess);

      equal(processExitFn.mock.callCount(), 1);
      deepStrictEqual(processExitFn.mock.calls[0].arguments, [expectedExitCode]);
    });

    it('should not exit the process if specified not to do so', () => {
      const errorMsg = TestUtils.generateRandomString();
      const exitProcess = false;

      Utils.logErrorMsg(errorMsg, exitProcess);

      equal(processExitFn.mock.callCount(), 0);
    });
  });

  describe('logInfoMsg', () => {
    afterEach(() => {
      logFn.mock.resetCalls();
      infoMsgFn.mock.resetCalls();
      createFn.mock.resetCalls();
    });

    it('should print the info message to the console', () => {
      const fakeMessage = TestUtils.generateRandomString();

      Utils.logInfoMsg(fakeMessage);

      equal(createFn.mock.callCount(), 1);
      equal(infoMsgFn.mock.callCount(), 1);
      equal(infoMsgFn.mock.calls[0].arguments[0], fakeMessage);
      equal(logFn.mock.callCount(), 1);
    });
  });

  describe('isValidDate', () => {
    it('should return true for a valid date', () => {
      const date = new Date();

      const isValidDate = Utils.isValidDate(date);

      equal(isValidDate, true);
    });

    it('should return false for date in a string format', () => {
      const date = '2025-08-15';

      const isValidDate = Utils.isValidDate(date);

      equal(isValidDate, false);
    });

    it('should return false for an invalid date instance', () => {
      const date = new Date('invalid');

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

  describe('getBufferSplit', () => {
    describe('(strings)', () => {
      it('returns original buffer and empty string when length <= splitSize', () => {
        const inputBuffer = TestUtils.generateRandomString({ minLength: 10 });
        const splitSize = inputBuffer.length;

        const [buffer, remaining] = Utils.getBufferSplit(inputBuffer, splitSize);

        equal(buffer, inputBuffer);
        equal(remaining, '');
      });

      it('returns an empty string for left when splitIndex is 0', () => {
        const inputBuffer = TestUtils.generateRandomString({ minLength: 10 });
        const splitSize = 0;

        const [buffer, remaining] = Utils.getBufferSplit(inputBuffer, splitSize);

        equal(buffer, '');
        equal(remaining, inputBuffer);
      });

      it('returns an empty string for right when splitIndex equals string length', () => {
        const inputBuffer = 'InputBuffer';
        const splitSize = 11;

        const [buffer, remaining] = Utils.getBufferSplit(inputBuffer, splitSize);

        equal(buffer, inputBuffer);
        equal(remaining, '');
      });

      it('splits at splitSize when no whitespace exists before splitSize', () => {
        const inputBuffer = 'InputBuffer';
        const splitSize = 5;

        const [buffer, remaining] = Utils.getBufferSplit(inputBuffer, splitSize);

        equal(buffer, 'Input');
        equal(remaining, 'Buffer');
      });

      it('splits at the whitespace just after splitSize', () => {
        const inputBuffer = 'Input Buffer';
        const splitSize = 5;

        const [buffer, remaining] = Utils.getBufferSplit(inputBuffer, splitSize);

        equal(buffer, 'Input');
        equal(remaining, 'Buffer');
      });

      it('splits at last space before splitSize', () => {
        const inputBuffer = 'InputBuffer with whitespace';
        const splitSize = 15;

        const [buffer, remaining] = Utils.getBufferSplit(inputBuffer, splitSize);

        equal(buffer, 'InputBuffer');
        equal(remaining, 'with whitespace');
      });

      it('splits at last newline before splitSize', () => {
        const inputBuffer = 'InputBuffer\nwith whitespace';
        const splitSize = 15;

        const [buffer, remaining] = Utils.getBufferSplit(inputBuffer, splitSize);

        equal(buffer, 'InputBuffer');
        equal(remaining, 'with whitespace');
      });

      it('splits at last tab before splitSize', () => {
        const inputBuffer = 'InputBuffer\twith whitespace';
        const splitSize = 15;

        const [buffer, remaining] = Utils.getBufferSplit(inputBuffer, splitSize);

        equal(buffer, 'InputBuffer');
        equal(remaining, 'with whitespace');
      });
    });

    describe('(numbers)', () => {
      it('returns original number and an empty string when length <= splitSize', () => {
        const inputBuffer = 12345;
        const splitSize = inputBuffer.toString().length;

        const [buffer, remaining] = Utils.getBufferSplit(inputBuffer, splitSize);

        equal(buffer, inputBuffer);
        equal(remaining, '');
      });

      it('splits number at splitSize into two numbers', () => {
        const inputBuffer = 123456789;
        const splitSize = 5;

        const [buffer, remaining] = Utils.getBufferSplit(inputBuffer, splitSize);

        equal(buffer, 12345);
        equal(remaining, 6789);
      });

      it('returns an empty string for left when splitIndex is 0', () => {
        const inputBuffer = 12345;
        const splitSize = 0;

        const [buffer, remaining] = Utils.getBufferSplit(inputBuffer, splitSize);

        equal(buffer, '');
        equal(remaining, inputBuffer);
      });

      it('handles negative sign and decimals (converts back to numbers)', () => {
        const inputBuffer = -12345.678;
        const splitSize = 6;

        const [buffer, remaining] = Utils.getBufferSplit(inputBuffer, splitSize);

        deepStrictEqual([buffer, remaining], [-12345, 0.678]);
      });
    });

    describe('(edge validations)', () => {
      it('should throw a TypeError when splitSize is not a number', async () => {
        const inputBuffer = TestUtils.generateRandomString();
        const splitSize = 'not a number';

        await rejects(
          async () => Utils.getBufferSplit(inputBuffer, splitSize),
          {
            name: 'TypeError',
            message: messages.error.INVALID_SPLIT_SIZE_TYPE,
          },
        );
      });

      it('should throw a RangeError when splitSize is not a number', async () => {
        const inputBuffer = TestUtils.generateRandomString();
        const splitSize = -1;

        await rejects(
          async () => Utils.getBufferSplit(inputBuffer, splitSize),
          {
            name: 'RangeError',
            message: messages.error.INVALID_SPLIT_SIZE_RANGE,
          },
        );
      });
    });
  });

  describe('clearAnsiSequences', () => {
    it('should return the same string if no ANSI sequences are present', () => {
      const input = TestUtils.generateRandomString();

      const actual = Utils.clearAnsiSequences(input);
      const expected = input;

      equal(actual, expected);
    });

    it('should remove ANSI sequences from a string', () => {
      const ansiSequences = Object.values(AnsiCodes).map(
        (item) => typeof item === 'object' ? Object.values(item) : item,
      ).flat();
      const str1 = TestUtils.generateRandomString();
      const str2 = TestUtils.generateRandomString();
      const input = str1 + ansiSequences.join('') + str2;

      const actual = Utils.clearAnsiSequences(input);
      const expected = str1 + str2;

      equal(actual, expected);
    });
  });

  describe('formatDate', () => {
    it('should return a formatted date string', () => {
      const date = new Date('2025-01-01T08:45:00');

      const actualDate = Utils.formatDate(date);

      const expectedDate = 'Jan 1, 2025, 8:45:00 AM';
      equal(actualDate, expectedDate);
    });
  });
});
