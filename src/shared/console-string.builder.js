import { AnsiCodes } from './enums.js';

/**
 * Builder class for creating formatted console strings with ANSI escape codes.
 * Uses the builder pattern for fluent method chaining.
 *
 * @example
 * const message = new ConsoleStringBuilder()
 *   .text('Hello')
 *   .bold()
 *   .red()
 *   .text(' World!')
 *   .reset()
 *   .blue()
 *   .text(' - Success')
 *   .build();
 */
export class ConsoleStringBuilder {
  /**
   * The text buffer for the console string builder.
   * @type {string[]}
   * @private
   */
  #buffer = [];

  /**
   * The plain text representation (without ANSI escape codes) of the console string builder.
   * @type {string}
   * @private
   */
  #plainText = '';

  /**
   * Whether to automatically reset the ANSI escape codes at the end of the build.
   * @type {boolean}
   * @private
   */
  #autoReset = true;

  /**
   * Creates a new ConsoleStringBuilder instance.
   *
   * @constructor
   */
  constructor() {
    this.#buffer = [];
    this.#plainText = '';
  }

  /**
   * Gets the plain text of the builder.
   *
   * @readonly
   * @type {string}
   */
  get plainText() {
    return this.#plainText;
  }

  /**
   * Add text to the buffer
   *
   * @param {string} text - Text to add
   * @returns {ConsoleStringBuilder} - Builder instance for chaining
   */
  text(text) {
    this.#buffer.push(text);
    this.#plainText += text;
    return this;
  }

  /**
   * Add a newline character to the buffer.
   *
   * @returns {ConsoleStringBuilder} - Builder instance for chaining
   */
  newline() {
    this.#buffer.push('\n');
    return this;
  }

  /**
   * Add multiple newlines to the buffer.
   *
   * @param {number} [count=1] - Number of newlines to add
   * @returns {ConsoleStringBuilder} - Builder instance for chaining
   */
  newlines(count = 1) {
    this.#buffer.push('\n'.repeat(count));
    return this;
  }

  /**
   * Add spaces to the buffer.
   *
   * @param {number} [count=1] - Number of spaces to add
   * @returns {ConsoleStringBuilder} - Builder instance for chaining
   */
  spaces(count = 1) {
    const spaces = ' '.repeat(count);
    this.#buffer.push(spaces);
    this.#plainText += spaces;
    return this;
  }

  /**
   * Add tabs to the buffer.
   *
   * @param {number} [count=1] - Number of tabs to add
   * @returns {ConsoleStringBuilder} - Builder instance for chaining
   */
  tabs(count = 1) {
    this.#buffer.push('\t'.repeat(count));
    return this;
  }

  // === FORMATTING METHODS ===

  /**
   * Apply bold formatting
   *
   * @returns {ConsoleStringBuilder} - Builder instance for chaining
   */
  bold() {
    this.#buffer.push(AnsiCodes.BOLD);
    return this;
  }

  /**
   * Apply dim formatting
   *
   * @returns {ConsoleStringBuilder} - Builder instance for chaining
   */
  dim() {
    this.#buffer.push(AnsiCodes.DIM);
    return this;
  }

  /**
   * Apply italic formatting
   *
   * @returns {ConsoleStringBuilder} - Builder instance for chaining
   */
  italic() {
    this.#buffer.push(AnsiCodes.ITALIC);
    return this;
  }

  /**
   * Apply underline formatting
   *
   * @returns {ConsoleStringBuilder} - Builder instance for chaining
   */
  underline() {
    this.#buffer.push(AnsiCodes.UNDERLINE);
    return this;
  }

  /**
   * Apply reverse formatting
   *
   * @returns {ConsoleStringBuilder} - Builder instance for chaining
   */
  reverse() {
    this.#buffer.push(AnsiCodes.REVERSE);
    return this;
  }

  /**
   * Apply strikethrough formatting
   *
   * @returns {ConsoleStringBuilder} - Builder instance for chaining
   */
  strikeThrough() {
    this.#buffer.push(AnsiCodes.STRIKE_THROUGH);
    return this;
  }

  // === FOREGROUND COLORS ===

  black() { this.#buffer.push(AnsiCodes.FG.BLACK); return this; }
  red() { this.#buffer.push(AnsiCodes.FG.RED); return this; }
  green() { this.#buffer.push(AnsiCodes.FG.GREEN); return this; }
  yellow() { this.#buffer.push(AnsiCodes.FG.YELLOW); return this; }
  blue() { this.#buffer.push(AnsiCodes.FG.BLUE); return this; }
  magenta() { this.#buffer.push(AnsiCodes.FG.MAGENTA); return this; }
  cyan() { this.#buffer.push(AnsiCodes.FG.CYAN); return this; }
  white() { this.#buffer.push(AnsiCodes.FG.WHITE); return this; }

  // === BRIGHT FOREGROUND COLORS ===

  brightBlack() { this.#buffer.push(AnsiCodes.FG.BRIGHT_BLACK); return this; }
  brightRed() { this.#buffer.push(AnsiCodes.FG.BRIGHT_RED); return this; }
  brightGreen() { this.#buffer.push(AnsiCodes.FG.BRIGHT_GREEN); return this; }
  brightYellow() { this.#buffer.push(AnsiCodes.FG.BRIGHT_YELLOW); return this; }
  brightBlue() { this.#buffer.push(AnsiCodes.FG.BRIGHT_BLUE); return this; }
  brightMagenta() { this.#buffer.push(AnsiCodes.FG.BRIGHT_MAGENTA); return this; }
  brightCyan() { this.#buffer.push(AnsiCodes.FG.BRIGHT_CYAN); return this; }
  brightWhite() { this.#buffer.push(AnsiCodes.FG.BRIGHT_WHITE); return this; }

  // === Aliases for common colors ===

  gray() { return this.brightBlack(); }
  grey() { return this.brightBlack(); }

  // === BACKGROUND COLORS ===

  bgBlack() { this.#buffer.push(AnsiCodes.BG.BLACK); return this; }
  bgRed() { this.#buffer.push(AnsiCodes.BG.RED); return this; }
  bgGreen() { this.#buffer.push(AnsiCodes.BG.GREEN); return this; }
  bgYellow() { this.#buffer.push(AnsiCodes.BG.YELLOW); return this; }
  bgBlue() { this.#buffer.push(AnsiCodes.BG.BLUE); return this; }
  bgMagenta() { this.#buffer.push(AnsiCodes.BG.MAGENTA); return this; }
  bgCyan() { this.#buffer.push(AnsiCodes.BG.CYAN); return this; }
  bgWhite() { this.#buffer.push(AnsiCodes.BG.WHITE); return this; }

  // === BRIGHT BACKGROUND COLORS ===

  bgBrightBlack() { this.#buffer.push(AnsiCodes.BG.BRIGHT_BLACK); return this; }
  bgBrightRed() { this.#buffer.push(AnsiCodes.BG.BRIGHT_RED); return this; }
  bgBrightGreen() { this.#buffer.push(AnsiCodes.BG.BRIGHT_GREEN); return this; }
  bgBrightYellow() { this.#buffer.push(AnsiCodes.BG.BRIGHT_YELLOW); return this; }
  bgBrightBlue() { this.#buffer.push(AnsiCodes.BG.BRIGHT_BLUE); return this; }
  bgBrightMagenta() { this.#buffer.push(AnsiCodes.BG.BRIGHT_MAGENTA); return this; }
  bgBrightCyan() { this.#buffer.push(AnsiCodes.BG.BRIGHT_CYAN); return this; }
  bgBrightWhite() { this.#buffer.push(AnsiCodes.BG.BRIGHT_WHITE); return this; }

  // === UTILITY METHODS ===

  /**
   * Reset all formatting
   *
   * @returns {ConsoleStringBuilder} - Builder instance for chaining
   */
  reset() {
    this.#buffer.push(AnsiCodes.RESET);
    return this;
  }

  /**
   * Set auto-reset behavior (automatically reset at end of build)
   *
   * @param {boolean} [autoReset=true] - Whether to auto-reset
   * @returns {ConsoleStringBuilder} - Builder instance for chaining
   */
  autoReset(autoReset = true) {
    this.#autoReset = autoReset;
    return this;
  }

  /**
   * Add custom ANSI code
   *
   * @param {string} code - ANSI escape code
   * @returns {ConsoleStringBuilder} - Builder instance for chaining
   */
  ansi(code) {
    this.#buffer.push(code);
    return this;
  }

  /**
   * Clear the current buffer
   *
   * @returns {ConsoleStringBuilder} - Builder instance for chaining
   */
  clear() {
    this.#buffer = [];
    this.#plainText = '';
    return this;
  }

  /**
   * Get the current text length
   *
   * @returns {number} - Buffer length
   */
  textLength() {
    return this.#plainText.length;
  }

  /**
   * Get the current buffer length
   *
   * @returns {number} - Buffer length
   */
  bufferLength() {
    return this.#buffer.length;
  }

  /**
   * Check if buffer is empty
   *
   * @returns {boolean} - True if buffer is empty
   */
  isEmpty() {
    return this.#buffer.length === 0;
  }

  /**
   * Build the final string
   *
   * @returns {string} - Formatted console string
   */
  build() {
    let result = this.#buffer.join('');
    if (this.#autoReset && result.length > 0) {
      result += AnsiCodes.RESET;
    }
    return result;
  }

  /**
   * Build and automatically log to console
   *
   * @returns {ConsoleStringBuilder} - Builder instance for chaining
   */
  log() {
    console.log(this.build());
    return this;
  }

  /**
   * Build and automatically error to console
   *
   * @returns {ConsoleStringBuilder} - Builder instance for chaining
   */
  error() {
    console.error(this.build());
    return this;
  }

  /**
   * Build and automatically warn to console
   *
   * @returns {ConsoleStringBuilder} - Builder instance for chaining
   */
  warn() {
    console.warn(this.build());
    return this;
  }

  // === CONVENIENCE METHODS ===

  /**
   * Add success message with green color and checkmark
   *
   * @param {string} message - Success message
   * @returns {ConsoleStringBuilder} - Builder instance for chaining
   */
  successMsg(message) {
    return this.green().text('✅ ').text(message);
  }

  /**
   * Add error message with red color and X mark
   *
   * @param {string} message - Error message
   * @returns {ConsoleStringBuilder} - Builder instance for chaining
   */
  errorMsg(message) {
    return this.red().text('❌ ').text(message);
  }

  /**
   * Add warning message with yellow color and warning sign
   *
   * @param {string} message - Warning message
   * @returns {ConsoleStringBuilder} - Builder instance for chaining
   */
  warningMsg(message) {
    return this.yellow().text('⚠️ ').text(message);
  }

  /**
   * Add info message with blue color and info icon
   *
   * @param {string} message - Info message
   * @returns {ConsoleStringBuilder} - Builder instance for chaining
   */
  infoMsg(message) {
    return this.blue().text('ℹ️ ').text(message);
  }

  /**
   * Create a new builder instance (static factory method)
   *
   * @static
   * @returns {ConsoleStringBuilder} - New builder instance
   */
  static create() {
    return new ConsoleStringBuilder();
  }
}
