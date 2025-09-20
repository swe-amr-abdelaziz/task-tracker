import { CLI_ARGS_PREFIX_REGEX } from './regex.js';
import { Utils } from './utils.js';
import { messages } from './messages.js';

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

  /**
   * Parses and validates CLI arguments into a structured object.
   *
   * @static
   * @param {string[]} args - The raw CLI arguments (e.g., `["--status=done", "-p=1"]`).
   * @param {string[]} validArgs - A list of valid argument keys (e.g., `["status", "page", "limit"]`).
   * @param {Record<string, string>} [aliases={}] - A mapping of shorthand aliases to their full keys
   * (e.g., `{ st: "status", p: "page", l: "limit" }`).
   * @returns {Record<string, string|boolean>} An object of parsed arguments, where flags without values
   * default to `true`.
   *
   * @throws {Error} If an invalid or duplicate argument is provided.
   *
   * @example
   * const args = ["--status=done", "-p=1"];
   * const validArgs = ["status", "page", "limit"];
   * const aliases = { s: "status", p: "page" };
   *
   * CliArgs.parseArgs(args, validArgs, aliases);
   * // { status: "done", page: "1" }
   */
  static parseArgs(args, validArgs, aliases = {}) {
    CliUtils.#validateParseArgsParams(args, validArgs, aliases);

    return args.reduce((parsed, arg) => {
      let [key, value] = arg.replace(CLI_ARGS_PREFIX_REGEX, '').split('=');
      if (!key)
        throw new SyntaxError(messages.error.EMPTY_CLI_ARG);

      const isAlias = aliases.hasOwnProperty(key);
      if (isAlias) {
        key = aliases[key];
      } else {
        key = key.replace(CLI_ARGS_PREFIX_REGEX, '');
      }
      key = Utils.toCamelCase(key);

      if (!validArgs.includes(key))
        throw new SyntaxError(messages.error.INVALID_CLI_ARG.replace('{0}', key));
      if (parsed.hasOwnProperty(key))
        throw new SyntaxError(messages.error.DUPLICATE_CLI_ARG.replace('{0}', key));

      parsed[key] = value ?? true;
      return parsed;
    }, {});
  }

  static #validateParseArgsParams(args, validArgs, aliases) {
    /* Validate args */
    if (!args)
      throw new TypeError(messages.error.REQUIRED_ARGS);
    if (!Array.isArray(args))
      throw new TypeError(messages.error.INVALID_ARGS_TYPE);
    if (args.some((arg) => typeof arg !== 'string'))
      throw new TypeError(messages.error.INVALID_ARGS_TYPE);

    /* Validate validArgs */
    if (!validArgs)
      throw new TypeError(messages.error.REQUIRED_VALID_ARGS);
    if (!Array.isArray(validArgs))
      throw new TypeError(messages.error.INVALID_VALID_ARGS_TYPE);
    if (validArgs.some((arg) => typeof arg !== 'string'))
      throw new TypeError(messages.error.INVALID_VALID_ARGS_TYPE);

    /* Validate aliases */
    if (!aliases || aliases.constructor !== Object)
      throw new TypeError(messages.error.INVALID_ARGS_ALIASES_TYPE);
    if (Object.values(aliases).some((value) => !validArgs.includes(value)))
      throw new SyntaxError(messages.error.ARGS_ALIASES_NOT_MATCHIING_VALID_ARGS);
  }
}
