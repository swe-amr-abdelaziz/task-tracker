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
export const CLI_ARGS_PREFIX_REGEX = /^-/;

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

/**
 * Regular expression to match leading non-alphanumeric characters
 * at the start of a string.
 * @constant
 * @type {RegExp}
 */
export const LEADING_NON_ALNUM = /^[^a-zA-Z0-9]+/;

/**
 * Regular expression to match separators (hyphen, underscore, or whitespace)
 * followed by an optional character, used for camelCase conversion.
 * @constant
 * @type {RegExp}
 */
export const SEPARATOR_AND_NEXT = /[-_\s]+(.)?/g;
