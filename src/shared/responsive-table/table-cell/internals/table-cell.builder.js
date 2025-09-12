import { ConsoleStringBuilder } from '../../../console-string.builder.js';
import { HorizontalAlignment, TableBorder } from '../../../enums.js';

/**
 * Builder class for creating cell separator.
 *
 * @internal
 */
export class SeparatorCellBuilder {
  /**
   * The width of the cell.
   * @type {number}
   * @private
   */
  #width;

  /**
   * The left padding of the cell.
   * @type {number}
   * @private
   */
  #paddingLeft;

  /**
   * The right padding of the cell.
   * @type {number}
   * @private
   */
  #paddingRight;

  /**
   * The horizontal position of the cell relative to the table.
   * @type {HorizontalAlignment}
   * @private
   */
  #xPosition;

  /**
   * The vertical position of the cell relative to the table.
   * @type {VerticalAlignment}
   * @private
   */
  #yPosition;

  /**
   * Whether the table contains only one column.
   * @type {boolean}
   * @private
   */
  #singleColumn;

  /**
   * Creates a new SeparatorCellBuilder instance.
   *
   * @constructor
   * @param {object} options - The options for the table cell.
   * @param {number} options.width - The width of the cell.
   * @param {number} options.paddingLeft - The left padding of the cell.
   * @param {number} options.paddingRight - The right padding of the cell.
   * @param {HorizontalAlignment} options.xPosition - The horizontal position of the cell relative to the table.
   * @param {VerticalAlignment} options.yPosition - The vertical position of the cell relative to the table.
   * @param {boolean} options.singleColumn - Whether the table contains only one column.
   */
  constructor(options) {
    this.#width = options.width;
    this.#paddingLeft = options.paddingLeft;
    this.#paddingRight = options.paddingRight;
    this.#xPosition = options.xPosition;
    this.#yPosition = options.yPosition;
    this.#singleColumn = options.singleColumn;
  }

  /**
   * Builds the string representation of the separator cell.
   *
   * @returns {string} The separator cell as a string.
   */
  build() {
    const leftBorder = this.#generateLeftCorner();
    const rightBorder = this.#generateRightCorner();
    const cellWidth = this.#width + this.#paddingLeft + this.#paddingRight;
    const midBorder = TableBorder.HORIZONTAL.repeat(cellWidth);
    return leftBorder + midBorder + rightBorder;
  }

  /**
   * Generates the left corner of the separator cell.
   *
   * @private
   * @returns {string} The cell left corner.
   */
  #generateLeftCorner() {
    if (this.#xPosition === HorizontalAlignment.LEFT) {
      const key = `${this.#yPosition}_${this.#xPosition}`
      return TableBorder[key];
    }
    return '';
  }

  /**
   * Generates the right corner of the separator cell.
   *
   * @private
   * @returns {string} The cell right corner.
   */
  #generateRightCorner() {
    const isLastColumn =
      this.#xPosition === HorizontalAlignment.RIGHT ||
        this.#singleColumn;
    const key = isLastColumn
      ? `${this.#yPosition}_RIGHT`
      : `${this.#yPosition}_CENTER`;
    return TableBorder[key];
  }
}

/**
 * Builder class for creating cell content.
 *
 * @internal
 */
export class ContentCellBuilder {
  /**
   * The width of the cell.
   * @type {number}
   * @private
   */
  #width;

  /**
   * The ConsoleStringBuilder instance representing the cell content.
   * @type {ConsoleStringBuilder}
   * @private
   */
  #content;

  /**
   * The left padding of the cell.
   * @type {number}
   * @private
   */
  #paddingLeft;

  /**
   * The right padding of the cell.
   * @type {number}
   * @private
   */
  #paddingRight;

  /**
   * The horizontal position of the cell relative to the table.
   * @type {HorizontalAlignment}
   * @private
   */
  #xPosition;

  /**
   * The text align property of the cell.
   * @type {HorizontalAlignment}
   * @private
   */
  #textAlign;

  /**
   * Whether to include the console style in the string representation.
   * @type {boolean}
   * @private
   */
  #withStyle;

  /**
   * The whitespace to the left of the cell content, used to adjust text alignment.
   * @type {string}
   * @private
   */
  #whitespaceLeft = '';

  /**
   * The whitespace to the right of the cell content, used to adjust text alignment.
   * @type {string}
   * @private
   */
  #whitespaceRight = '';

  /**
   * Creates a new ContentCellBuilder instance.
   *
   * @constructor
   * @param {object} options - The options for the content cell builder.
   * @param {number} options.width - The width of the cell.
   * @param {ConsoleStringBuilder} options.content - The content of the cell.
   * @param {number} options.paddingLeft - The left padding of the cell.
   * @param {number} options.paddingRight - The right padding of the cell.
   * @param {HorizontalAlignment} options.xPosition - The horizontal position of the cell.
   * @param {HorizontalAlignment} options.textAlign - The text align property of the cell.
   * @param {boolean} options.withStyle - Whether to include the console style in the string representation.
   */
  constructor(options) {
    this.#width = options.width;
    this.#content = options.content;
    this.#paddingLeft = options.paddingLeft;
    this.#paddingRight = options.paddingRight;
    this.#xPosition = options.xPosition;
    this.#textAlign = options.textAlign;
    this.#withStyle = options.withStyle;
  }

  /**
   * Builds the string representation of the content cell.
   *
   * @returns {string} The content cell as a string.
   */
  build() {
    let content = this.#generateContent();
    content = this.#whitespaceLeft + content + this.#whitespaceRight;
    const leftBorder = this.#generateLeftCorner();
    const rightBorder = this.#generateRightCorner();
    return leftBorder + content + rightBorder;
  }

  /**
   * Generates the content of the cell as a string.
   *
   * @private
   * @returns {string} The cell content.
   */
  #generateContent() {
    this.#addWhitespaceToContent();
    const content = this.#withStyle ? this.#content.build() : this.#content.plainText;
    const paddingLeft = ' '.repeat(this.#paddingLeft);
    const paddingRight = ' '.repeat(this.#paddingRight);
    return paddingLeft + content + paddingRight;
  }

  /**
   * Generates the left corner of the content cell.
   *
   * @private
   * @returns {string} The cell left corner.
   */
  #generateLeftCorner() {
    return this.#xPosition === HorizontalAlignment.LEFT
      ? TableBorder.VERTICAL
      : '';
  }

  /**
   * Generates the right corner of the content cell.
   *
   * @private
   * @returns {string} The cell right corner.
   */
  #generateRightCorner() {
    return TableBorder.VERTICAL;
  }

  /**
   * Adds whitespace to the content of the cell if the cell width is greater than the content width.
   * Takes into account the text alignment of the content.
   *
   * @private
   */
  #addWhitespaceToContent() {
    const whitespaceCount = this.#width - this.#content.textLength();
    const whitespace = ' '.repeat(whitespaceCount);

    switch (this.#textAlign) {
      case HorizontalAlignment.LEFT:
        this.#whitespaceRight = whitespace;
        break;
      case HorizontalAlignment.RIGHT:
        this.#whitespaceLeft = whitespace;
        break;
      case HorizontalAlignment.CENTER:
        const halfWhitespaceCount = Math.floor(whitespaceCount / 2);
        this.#whitespaceLeft = ' '.repeat(halfWhitespaceCount);
        this.#whitespaceRight = ' '.repeat(whitespaceCount - halfWhitespaceCount);
        break;
    }
  }
}
