import { randomInt } from 'node:crypto';

import { MAX_INT32 } from './enums.js';
import { messages } from './messages.js';

/**
 * Utility class providing helper methods for unit tests.
 * @class
 */
export class TestUtils {
  /**
   * Generates a random string of ASCII characters.
   *
   * @static
   * @param {object} [options={}] - An object containing options for generating the string.
   * @param {number} [options.minLength=8] - The minimum length of the generated string.
   * @param {number} [options.maxLength=minLength] - The maximum length of the generated string.
   * @param {boolean} [options.excludeSmallLetters=false] - Whether to exclude small letters from the generated string.
   * @param {boolean} [options.excludeCapitalLetters=false] - Whether to exclude capital letters from the generated string.
   * @param {boolean} [options.excludeNumbers=false] - Whether to exclude numbers from the generated string.
   * @param {boolean} [options.excludeSpecialCharacters=false] - Whether to exclude special characters from the generated string.
   * @returns {string} A random string of ASCII characters.
   */
  static generateRandomString(options = {}) {
    if (options.minLength > options.maxLength)
      throw new Error(messages.error.INVALID_MIN_MAX_LENGTH_RANGE);

    if (options.minLength === undefined)
      options.minLength = 8;
    if (options.maxLength === undefined)
      options.maxLength = options.minLength;

    const smallLetters = TestUtils.#getCharactersRange('a', 26);
    const capitalLetters = TestUtils.#getCharactersRange('A', 26);
    const numbers = TestUtils.#getCharactersRange('0', 10);
    const specialCharacters = TestUtils.#getCharactersRange('!', 10);

    const charset = [];
    if (!options?.excludeSmallLetters)
      charset.push(...smallLetters);
    if (!options?.excludeCapitalLetters)
      charset.push(...capitalLetters);
    if (!options?.excludeNumbers)
      charset.push(...numbers);
    if (!options?.excludeSpecialCharacters)
      charset.push(...specialCharacters);

    const randomStringLength = randomInt(options.minLength, options.maxLength + 1);
    const stringBuilder = [];

    Array.from({ length: randomStringLength }).forEach(() => {
      const randomIndex = Math.floor(Math.random() * charset.length);
      stringBuilder.push(charset[randomIndex]);
    });
    return stringBuilder.join('');
  }

  /**
   * Generates an array of random strings of ASCII characters.
   *
   * @static
   * @param {number} [arrayLength=0] - The number of strings to generate.
   * @param {object} [options] - An object containing options for generating the string.
   * @param {number} [options.minLength=8] - The minimum length of the generated string.
   * @param {number} [options.maxLength=minLength] - The maximum length of the generated string.
   * @param {boolean} [options.excludeSmallLetters=false] - Whether to exclude small letters from the generated string.
   * @param {boolean} [options.excludeCapitalLetters=false] - Whether to exclude capital letters from the generated string.
   * @param {boolean} [options.excludeNumbers=false] - Whether to exclude numbers from the generated string.
   * @param {boolean} [options.excludeSpecialCharacters=false] - Whether to exclude special characters from the generated string.
   * @returns {string[]} An array of random strings of ASCII characters.
   */
  static generateRandomStringArray(arrayLength, options) {
    const randomStringArray = [];
    const length = arrayLength ?? 0;
    for (let i = 0; i < length; i++) {
      randomStringArray.push(TestUtils.generateRandomString(options));
    }
    return randomStringArray;
  }

  /**
   * Generates a random integer within a specified range.
   *
   * @static
   * @param {number} minValue
   * @param {number} maxValue
   * @returns {number} A random integer between minValue and maxValue (inclusive).
   */
  static generateRandomInt(minValue, maxValue) {
    if (minValue > maxValue)
      throw new Error(messages.error.INVALID_MIN_MAX_VALUE_RANGE);

    if (minValue === undefined)
      minValue = 0;
    if (maxValue === undefined)
      maxValue = MAX_INT32;

    return randomInt(minValue, maxValue + 1);
  }

  /**
   * Generates a range of ASCII characters.
   *
   * @static
   * @param {string} startChar - The first character in the range.
   * @param {number} length - The number of characters in the range.
   * @returns {string[]} An array of sequential ASCII characters.
   */
  static #getCharactersRange(startChar, length) {
    return Array.from(
      { length },
      (_, i) => String.fromCharCode(startChar.charCodeAt(0) + i),
    );
  }
}
