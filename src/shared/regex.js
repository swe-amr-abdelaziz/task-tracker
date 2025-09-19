/**
 * Regular expression to match ANSI escape sequences.
 * @constant
 * @type {RegExp}
 */
export const ANSI_ESCAPE_REGEX = /\x1B\[[0-9;]*m/g;

/**
 * Regular expression to match prefixes of CLI arguments.
 * @constant
 * @type {RegExp}
 */
export const CLI_ARGS_PREFIX_REGEX = /^-{1,2}/;

/**
 * Regular expression to match newlines at the start of a string.
 * @constant
 * @type {RegExp}
 */
export const STARTS_WITH_NEWLINE_REGEX = /^\n/;

/**
 * Regular expression to match whitespace characters.
 * @constant
 * @type {RegExp}
 */
export const WHITESPACE_REGEX = /\s/g;
