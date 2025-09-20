import { dirname } from 'path';
import { fileURLToPath } from 'url';

import {
  ANSI_ESCAPE_REGEX,
  LEADING_NON_ALNUM,
  SEPARATOR_AND_NEXT,
  WHITESPACE_REGEX,
} from './regex.js';
import { ConsoleStringBuilder } from './console-string.builder.js';
import { messages } from './messages.js';

/**
 * Utility class providing helper methods for various tasks.
 */
export class Utils {
  /**
   * Logs a success message to the console.
   *
   * @static
   * @param {string} message - The success message to display.
   *
   * @example
   * Utils.logSuccessMsg('Task added successfully');
   */
  static logSuccessMsg(message) {
    ConsoleStringBuilder.create().successMsg(message).log();
  }

  /**
   * Logs an error message to the console, and optionally exits the process.
   *
   * @static
   * @param {string} message - The error message to display.
   * @param {boolean} [exit=true] - Whether to terminate the process after logging.
   *                                If `true`, the process exits with status code `-1`.
   *
   * @example
   * Utils.logErrorMsg('Invalid input');        // Logs message and exits
   * Utils.logErrorMsg('Invalid input', false); // Logs message, does not exit
   */
  static logErrorMsg(message, exit = true) {
    ConsoleStringBuilder.create().errorMsg(message).error();
    if (exit) {
      process.exit(-1);
    }
  }

  /**
   * Logs an info message to the console.
   *
   * @static
   * @param {string} message - The info message to display.
   *
   * @example
   * Utils.logInfoMsg('No tasks found');
   */
  static logInfoMsg(message) {
    ConsoleStringBuilder.create().infoMsg(message).log();
  }

  /**
   * Checks if the provided value is a valid `Date` object.
   *
   * @static
   * @param {*} date - The value to validate.
   * @returns {boolean} `true` if the value is a valid `Date`, otherwise `false`.
   *
   * @example
   * Utils.isValidDate(new Date());          // true
   * Utils.isValidDate('2025-08-15');        // false
   * Utils.isValidDate(new Date('invalid')); // false
   */
  static isValidDate(date) {
    return date instanceof Date && !isNaN(date.getTime());
  }

  /**
   * Determines if the current runtime environment is Node's built-in test runner.
   *
   * This method checks for the presence of the `NODE_TEST_CONTEXT` environment variable,
   * which Node.js sets when executing code under the `node --test` runner.
   *
   * @static
   * @returns {boolean} `true` if running inside Node's test environment, otherwise `false`.
   *
   * @example
   * // Run with: node --test
   * Utils.isTestEnvironment(); // true
   *
   * // Run normally
   * Utils.isTestEnvironment(); // false
   */
  static isTestEnvironment() {
    return process.env.NODE_TEST_CONTEXT !== undefined;
  }

  /**
   * Convert a module `import.meta.url` into a file path.
   *
   * @static
   * @param {string} moduleUrl - The `import.meta.url` of the calling module.
   * @returns {string} Absolute file path of the calling module.
   */
  static filename(metaUrl) {
    return fileURLToPath(metaUrl);
  }

  /**
   * Convert a module `import.meta.url` into its directory path.
   *
   * @static
   * @param {string} moduleUrl - The `import.meta.url` of the calling module.
   * @returns {string} Absolute directory path of the calling module.
   */
  static dirname(metaUrl) {
    return dirname(Utils.filename(metaUrl));
  }

  /**
   * Split a string-like buffer into two parts. Splitting logic always works
   * on the string representation (prefers last whitespace before splitSize).
   *
   * If the original `buffer` was a number, the returned tuple will contain
   * numbers (or null). Otherwise it returns strings (or null).
   *
   * @static
   * @param {string|number|*} buffer - The string-like buffer to split.
   * @param {number} splitSize - The size to start splitting at.
   * @returns {[string|number, string|number]} A tuple containing the split parts.
   *
   * @example
   * // Split a string at whitespace
   * const [left, right] = Utils.getBufferSplit('Hello world, this is a test', 12);
   * console.log(left);  // 'Hello world,'
   * console.log(right); // 'this is a test'
   */
  static getBufferSplit(buffer, splitSize) {
    if (typeof splitSize !== 'number' || Number.isNaN(splitSize)) {
      throw new TypeError(messages.error.INVALID_SPLIT_SIZE_TYPE);
    }
    if (splitSize < 0) {
      throw new RangeError(messages.error.INVALID_SPLIT_SIZE_RANGE);
    }

    const wasNumber = typeof buffer === 'number';
    const str = String(buffer);

    if (str.length <= splitSize && splitSize !== 0) {
      const wholeBuffer = wasNumber ? buffer : str;
      return [wholeBuffer, ''];
    }

    // Find last whitespace within [0, splitSize + 1]
    let splitIndex = splitSize;
    const head = str.slice(0, splitSize + 1);
    for (let i = head.length - 1; i >= 0; i--) {
      const isWhitespace = WHITESPACE_REGEX.test(head[i]);
      if (isWhitespace) {
        splitIndex = i;
        break;
      }
    }

    let leftStr = str.substring(0, splitIndex).trimEnd();
    let rightStr = str.substring(splitIndex).trimStart();

    if (wasNumber) {
      leftStr = Number(leftStr);
      rightStr = Number(rightStr);
    }

    return [leftStr, rightStr];
  }

  /**
   * Removes ANSI escape sequences (color/style codes) from a string.
   *
   * @static
   * @param {string} str - The input string potentially containing ANSI sequences.
   * @returns {string} The cleaned string with ANSI sequences removed.
   *
   * @example
   * Utils.clearAnsiSequences('\x1b[31mHello\x1b[0m');
   * // => 'Hello'
   */
  static clearAnsiSequences(str) {
    return str.replace(ANSI_ESCAPE_REGEX, '');
  }

  /**
   * Formats a `Date` object as a string in the format 'Month Day, Year, Time'.
   *
   * @static
   * @param {Date} date - The `Date` object to format.
   * @returns {string} Formatted date string.
   *
   * @example
   * // Format a specific date
   * const date = new Date('2023-12-25T15:30:00');
   * const formatted = Utils.formatDate(date);
   * console.log(formatted); // 'Dec 25, 2023, 3:30:00 PM'
   */
  static formatDate(date) {
    return new Date(date).toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'medium',
    });
  }

  /**
   * Converts a string to camelCase.
   * Examples:
   *   "user-name"   -> "userName"
   *   "user_name"   -> "userName"
   *   "UserName"    -> "userName"
   *   "User Name"   -> "userName"
   *   "--user-name" -> "userName"
   *   "userName"    -> "userName" (idempotent)
   *
   * @static
   * @param {string} str - The string to convert to camelCase.
   * @returns {string} - The camelCased string.
   */
  static toCamelCase(str) {
    if (typeof str !== 'string') return str;

    str = str.replace(LEADING_NON_ALNUM, '');
    str = str.charAt(0).toLowerCase() + str.slice(1);
    return str.replace(SEPARATOR_AND_NEXT, (_, chr) => (chr ? chr.toUpperCase() : ''));
  }
}
