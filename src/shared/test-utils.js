import { randomInt } from "node:crypto";

/**
 * Utility class providing helper methods for unit tests.
 * @class
 */
export class TestUtils {
  /**
   * Generates a random string of ASCII characters.
   *
   * @static
   * @param {number} [minLength=8] - The minimum length of the generated string.
   * @param {number} [maxLength=minLength] - The maximum length of the generated string.
   * @returns {string} A random string of ASCII characters.
   */
  static generateRandomString(minLength, maxLength) {
    if (minLength === undefined)
      minLength = 8;
    if (maxLength === undefined)
      maxLength = minLength;

    const smallLetters = TestUtils.#getCharactersRange('a', 26);
    const capitalLetters = TestUtils.#getCharactersRange('A', 26);
    const numbers = TestUtils.#getCharactersRange('0', 10);
    const specialCharacters = TestUtils.#getCharactersRange('!', 10);

    const charset = smallLetters
      .concat(capitalLetters)
      .concat(numbers)
      .concat(specialCharacters);

    const randomStringLength = randomInt(minLength, maxLength + 1);
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
   * @param {number} [minStringLength=8] - The minimum length of each generated string.
   * @param {number} [maxStringLength=minStringLength] - The maximum length of each generated string.
   * @returns {string[]} An array of random strings of ASCII characters.
   */
  static generateRandomStringArray(arrayLength, minStringLength, maxStringLength) {
    const randomStringArray = [];
    const length = arrayLength ?? 0;
    for (let i = 0; i < length; i++) {
      randomStringArray.push(TestUtils.generateRandomString(minStringLength, maxStringLength));
    }
    return randomStringArray;
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
