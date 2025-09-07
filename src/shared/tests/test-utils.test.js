import { describe, it } from 'node:test';
import { deepStrictEqual, ok, rejects } from 'node:assert';

import { MAX_INT32 } from '../enums.js';
import { TestUtils } from '../test-utils.js';
import { messages } from '../messages.js';

describe('TestUtils', () => {
  describe('generateRandomString', () => {
    function buildAllowedCharset() {
      const ranges = [
        ['a'.charCodeAt(0), 26],
        ['A'.charCodeAt(0), 26],
        ['0'.charCodeAt(0), 10],
        ['!'.charCodeAt(0), 10],
      ];

      const set = new Set();
      for (const [start, count] of ranges) {
        for (let i = 0; i < count; i++) {
          set.add(String.fromCharCode(start + i));
        }
      }
      return set;
    }

    const allowedCharset = buildAllowedCharset();

    it('should return a random string within the specified length bounds', () => {
      const options = { minLength: 5, maxLength: 10 };

      const str = TestUtils.generateRandomString(options);

      ok(
        str.length >= options.minLength && str.length <= options.maxLength,
        `String length ${str.length} is not within bounds`,
      );
    });

    it('should return a random string of exact length when passing minimum length only', () => {
      const options = { minLength: 5 };

      const str = TestUtils.generateRandomString(options);

      ok(str.length === options.minLength, `String length ${str.length} not equal to ${options.minLength}`);
    });

    it('should set min and max lengths to 8 characters if not provided', () => {
      const defaultLength = 8;

      const str = TestUtils.generateRandomString();

      ok(str.length === defaultLength, `String length ${str.length} not equal to ${defaultLength}`);
    });

    it('should throw an error if min length is greater than max length', async () => {
      const options = { minLength: 10, maxLength: 5 };

      await rejects(
        async () => TestUtils.generateRandomString(options),
        { message: messages.error.INVALID_MIN_MAX_LENGTH_RANGE },
      );
    });

    it('should generate strings using only allowed ASCII ranges', () => {
      const str = TestUtils.generateRandomString();

      for (const ch of str) {
        ok(allowedCharset.has(ch), `unexpected character "${ch}"`);
      }
    });

    it('should produce varied results across multiple calls', () => {
      const runs = 10;
      const options = { minLength: 12 };
      const set = new Set();

      for (let i = 0; i < runs; i++) {
        set.add(TestUtils.generateRandomString(options));
      }

      ok(set.size > 1, 'expected variation across multiple generated strings');
    });
  });

  describe('generateRandomInt', () => {
    it('should return a random integer within the specified bounds', () => {
      const minValue = 5;
      const maxValue = 10;

      const value = TestUtils.generateRandomInt(minValue, maxValue);

      ok(value >= minValue && value <= maxValue, `Number ${value} is not within bounds`);
    });

    it('should return a random integer greater than or equal to minValue if maxValue is not provided', () => {
      const minValue = 5;

      const value = TestUtils.generateRandomInt(minValue);

      ok(value >= minValue, `Number ${value} is less than minValue: ${minValue}`);
    });

    it('should throw an error if min value is greater than max value', async () => {
      const minValue = 10;
      const maxValue = 5;

      await rejects(
        async () => TestUtils.generateRandomInt(minValue, maxValue),
        { message: messages.error.INVALID_MIN_MAX_VALUE_RANGE },
      );
    });

    it('should set result to 0 if arguments are not provided', () => {
      const defaultMinValue = 0;
      const defaultMaxValue = MAX_INT32;

      const value = TestUtils.generateRandomInt();

      ok(
        value >= defaultMinValue && value <= defaultMaxValue,
        `Number ${value} is not within default bounds`,
      );
    });

    it('should produce varied results across multiple calls', () => {
      const runs = 10;
      const minValue = 0;
      const maxValue = 1_000_000;
      const set = new Set();

      for (let i = 0; i < runs; i++) {
        set.add(TestUtils.generateRandomInt(minValue, maxValue));
      }

      ok(set.size > 1, 'expected variation across multiple generated numbers');
    });
  });

  describe('generateRandomStringArray', () => {
    it('should return an empty array if no length is provided', () => {
      const arr = TestUtils.generateRandomStringArray();

      deepStrictEqual(arr, []);
    });

    it('should return an array of random strings of ASCII characters', () => {
      const arrLength = 5;
      const defaultStringLength = 8;

      const arr = TestUtils.generateRandomStringArray(arrLength);

      ok(arr.length === arrLength);
      for (const str of arr) {
        ok(str.length === defaultStringLength);
      }
    });

    it('should return an array of random strings with specified string lengths', () => {
      const arrLength = 5;
      const options = { minLength: 12 };

      const arr = TestUtils.generateRandomStringArray(arrLength, options);

      ok(arr.length === arrLength);
      for (const str of arr) {
        ok(str.length === options.minLength);
      }
    });

    it('should return an array of random strings with specified string length bounds', () => {
      const arrLength = 5;
      const options = { minLength: 8, maxLength: 16 };

      const arr = TestUtils.generateRandomStringArray(arrLength, options);

      ok(arr.length === arrLength);
      for (const str of arr) {
        ok(str.length >= options.minLength && str.length <= options.maxLength);
      }
    });
  });
});
