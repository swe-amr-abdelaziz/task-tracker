/**
 * Provides utility methods for working with CLI arguments.
 */
export class CliUtils {
  /**
   * Retrieves CLI arguments passed to the Node.js process, excluding the
   * first two default values (`node` executable path and script path).
   *
   * @static
   * @returns {string[]} An array of CLI arguments, or an empty array if none.
   *
   * @example
   * // Command: node main.js arg1 arg2
   * CliUtils.getAppArgs(); // ['arg1', 'arg2']
   */
  static getAppArgs() {
    const userDefinedArgsStartIndex = 2;
    return process.argv.slice(userDefinedArgsStartIndex);
  }
}
