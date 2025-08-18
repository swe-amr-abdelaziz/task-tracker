import { afterEach, beforeEach, describe, it, mock } from 'node:test';
import { deepStrictEqual, equal, ok } from 'node:assert';

import { TestUtils } from '../test-utils.js';

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
      const minLength = 5;
      const maxLength = 10;

      const str = TestUtils.generateRandomString(minLength, maxLength);

      ok(str.length >= minLength && str.length <= maxLength, `String length ${str.length} not within bounds`);
    });

    it('should return a random string of exact length when passing one length', () => {
      const length = 5;

      const str = TestUtils.generateRandomString(length);

      ok(str.length === length, `String length ${str.length} not equal to ${length}`);
    });

    it('should set min and max lengths to 8 characters if not provided', () => {
      const defaultLength = 8;
      const str = TestUtils.generateRandomString();

      ok(str.length === defaultLength, `String length ${str.length} not equal to ${defaultLength}`);
    });

    it('should generate strings using only allowed ASCII ranges', () => {
      const str = TestUtils.generateRandomString();

      for (const ch of str) {
        ok(allowedCharset.has(ch), `unexpected character "${ch}"`);
      }
    });

    it('should produce varied results across multiple calls', () => {
      const runs = 10;
      const length = 12;
      const set = new Set();

      for (let i = 0; i < runs; i++) {
        set.add(TestUtils.generateRandomString(length));
      }

      ok(set.size > 1, 'expected variation across multiple generated strings');
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
      const stringLength = 12;

      const arr = TestUtils.generateRandomStringArray(arrLength, stringLength);

      ok(arr.length === arrLength);
      for (const str of arr) {
        ok(str.length === stringLength);
      }
    });

    it('should return an array of random strings with specified string length bounds', () => {
      const arrLength = 5;
      const stringMinLength = 8;
      const stringMaxLength = 16;

      const arr = TestUtils.generateRandomStringArray(arrLength, stringMinLength, stringMaxLength);

      ok(arr.length === arrLength);
      for (const str of arr) {
        ok(str.length >= stringMinLength && str.length <= stringMaxLength);
      }
    });
  });
});
