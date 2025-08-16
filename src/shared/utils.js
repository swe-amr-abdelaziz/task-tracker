import { dirname } from 'path';
import { fileURLToPath } from 'url';

/**
 * Utility class providing helper methods for various tasks.
 * @class
 */
export class Utils {
  /**
   * Retrieves CLI arguments passed to the Node.js process, excluding the
   * first two default values (`node` executable path and script path).
   *
   * @static
   * @returns {string[]} An array of CLI arguments, or an empty array if none.
   *
   * @example
   * // Command: node main.js arg1 arg2
   * Utils.getArgs(); // ["arg1", "arg2"]
   */
  static getArgs() {
    const cliArgsStartIndex = 2;
    return process.argv.slice(cliArgsStartIndex);
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
   * Utils.logErrorMsg("Invalid input");        // Logs message and exits
   * Utils.logErrorMsg("Invalid input", false); // Logs message, does not exit
   */
  static logErrorMsg(message, exit = true) {
    console.error(message);
    if (exit) {
      process.exit(-1);
    }
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
   * Utils.isValidDate("2025-08-15");        // false
   * Utils.isValidDate(new Date("invalid")); // false
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
}
