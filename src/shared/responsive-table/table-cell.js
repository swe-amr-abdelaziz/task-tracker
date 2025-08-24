import { ConsoleStringBuilder } from "../console-string.builder.js";
import { HorizontalAlignment, TableBorder, VerticalAlignment } from "../enums.js";
import { messages } from "../messages.js";

export class TableCell {
  #width;
  #paddingLeft;
  #paddingRight;
  #xPosition;

  /**
   * @param {object} [options={}] = The options for the table cell.
   * @param {number} [options.width=0] - The width of the cell.
   * @param {number} [options.paddingLeft=0] - The left padding of the cell.
   * @param {number} [options.paddingRight=0] - The right padding of the cell.
   * @param {HorizontalAlignment} [options.xPosition=HorizontalAlignment.CENTER] -
   *   The horizontal position of the cell relative to the table.
   */
  constructor(options = {}) {
    if (new.target === TableCell) {
      const message = messages.error.ABSTRACT_CLASS_OBJECT_CREATION.replace("{0}", "TableCell");
      throw new Error(message);
    }
    this.width = options.width ?? 0;
    this.paddingLeft = options.paddingLeft ?? 0;
    this.paddingRight = options.paddingRight ?? 0;
    this.xPosition = options.xPosition ?? HorizontalAlignment.CENTER;
  }

  /**
   * @returns {number} The width of the cell.
   */
  get width() {
    return this.#width;
  }

  /**
   * @param {number} width - The new width of the cell.
   */
  set width(width) {
    if (typeof width !== 'number') {
      throw new Error(messages.error.INVALID_TABLE_CELL_WIDTH);
    }
    if (width < 0) {
      throw new Error(messages.error.NEGATIVE_TABLE_CELL_WIDTH);
    }
    this.#width = width;
  }

  /**
   * @returns {number} The left padding of the cell.
   */
  get paddingLeft() {
    return this.#paddingLeft;
  }

  /**
   * @param {number} paddingLeft - The new left padding of the cell.
   */
  set paddingLeft(paddingLeft) {
    if (typeof paddingLeft !== 'number') {
      throw new Error(messages.error.INVALID_TABLE_CELL_PADDING_LEFT);
    }
    if (paddingLeft < 0) {
      throw new Error(messages.error.NEGATIVE_TABLE_CELL_PADDING_LEFT);
    }
    this.#paddingLeft = paddingLeft;
  }

  /**
   * @returns {number} The right padding of the cell.
   */
  get paddingRight() {
    return this.#paddingRight;
  }

  /**
   * @param {number} paddingRight - The new right padding of the cell.
   */
  set paddingRight(paddingRight) {
    if (typeof paddingRight !== 'number') {
      throw new Error(messages.error.INVALID_TABLE_CELL_PADDING_RIGHT);
    }
    if (paddingRight < 0) {
      throw new Error(messages.error.NEGATIVE_TABLE_CELL_PADDING_RIGHT);
    }
    this.#paddingRight = paddingRight;
  }

  /**
   * @returns {HorizontalAlignment} The horizontal position of the cell relative to the table.
   */
  get xPosition() {
    return this.#xPosition;
  }

  /**
   * @param {HorizontalAlignment} xPosition - The new horizontal position of the cell relative to the table.
   */
  set xPosition(xPosition) {
    const validPositions = Object.keys(HorizontalAlignment);
    if (!validPositions.includes(xPosition)) {
      throw new Error(messages.error.INVALID_TABLE_CELL_X_POSITION);
    }
    this.#xPosition = xPosition;
  }
}

export class SeparatorCell extends TableCell {
  #yPosition;

  /**
   * @param {object} [options={}] = The options for the table cell.
   * @param {number} [options.width=0] - The width of the cell.
   * @param {number} [options.paddingLeft=0] - The left padding of the cell.
   * @param {number} [options.paddingRight=0] - The right padding of the cell.
   * @param {HorizontalAlignment} [options.xPosition=HorizontalAlignment.CENTER] -
   *   The horizontal position of the cell relative to the table.
   * @param {VerticalAlignment} [options.yPosition=VerticalAlignment.CENTER] -
   *   The vertical position of the cell relative to the table.
   */
  constructor(options = {}) {
    super(options);
    this.yPosition = options.yPosition ?? VerticalAlignment.CENTER;
  }

  /**
   * @returns {VerticalAlignment} The vertical position of the cell relative to the table.
   */
  get yPosition() {
    return this.#yPosition;
  }

  /**
   * @param {VerticalAlignment} yPosition - The new vertical position of the cell relative to the table.
   */
  set yPosition(yPosition) {
    const validPositions = Object.keys(VerticalAlignment);
    if (!validPositions.includes(yPosition)) {
      throw new Error(messages.error.INVALID_TABLE_CELL_Y_POSITION);
    }
    this.#yPosition = yPosition;
  }

  /**
   * @returns {string} The string representation of the separator cell.
   */
  toString() {
    const leftBorder = this.#generateLeftCorner();
    const rightBorder = this.#generateRightCorner();
    const cellWidth = this.width + this.paddingLeft + this.paddingRight;
    const midBorder = TableBorder.HORIZONTAL.repeat(cellWidth);
    return leftBorder + midBorder + rightBorder;
  }

  /**
   * Generates the left corner of the separator cell.
   *
   * @returns {string} The left corner of the separator cell.
   * @private
   */
  #generateLeftCorner() {
    if (this.xPosition === HorizontalAlignment.LEFT) {
      const key = `${this.yPosition}_${this.xPosition}`
      return TableBorder[key];
    }
    return '';
  }

  /**
   * Generates the right corner of the separator cell.
   *
   * @returns {string} The right corner of the separator cell.
   * @private
   */
  #generateRightCorner() {
    const key = this.xPosition === HorizontalAlignment.RIGHT
      ? `${this.yPosition}_RIGHT`
      : `${this.yPosition}_CENTER`;
    return TableBorder[key];
  }
}

export class ContentCell extends TableCell {
  #content;
  #isHeader;

  /**
   * @param {object} [options={}] = The options for the table cell.
   * @param {number} [options.width=0] - The width of the cell.
   * @param {number} [options.paddingLeft=0] - The left padding of the cell.
   * @param {number} [options.paddingRight=0] - The right padding of the cell.
   * @param {HorizontalAlignment} [options.xPosition=HorizontalAlignment.CENTER] -
   *   The horizontal position of the cell relative to the table.
   * @param {unknown} [options.content=''] - The text content of the cell.
   * @param {boolean} [options.isHeader=false] - Whether the cell is a header cell.
   */
  constructor(options = {}) {
    super(options);
    this.#isHeader = options.isHeader ?? false;
    this.content = options.content ?? '';
  }

  /**
   * @returns {ConsoleStringBuilder} The content of the cell as ConsoleStringBuilder instance.
   */
  get content() {
    return this.#content;
  }

  /**
   * @param {unknown} content - The new text content of the cell.
   */
  set content(content) {
    this.#validateContent(content);
    const builder = ConsoleStringBuilder.create();
    this.#setStyle(builder, content);
    this.#content = builder.text(content.toString());
  }

  /**
   * @param {boolean} [withStyle=true] - Whether to include the console style in the string representation.
   * @returns {string} The string representation of the content cell.
   */
  toString(withStyle = true) {
    const content = this.#generateContent(withStyle);
    const leftBorder = this.#generateLeftCorner();
    const rightBorder = this.#generateRightCorner();
    return leftBorder + content + rightBorder;
  }

  /**
   * Validates the content of the cell.
   *
   * @param {unknown} content - The content to validate.
   * @private
   */
  #validateContent(content) {
    if (content.toString().length > this.width) {
      throw new Error(messages.error.CELL_CONTENT_EXCEEDS_CELL_WIDTH);
    }
  }

  /**
   * Sets the style for the content of the cell based on its content type.
   *
   * @param {ConsoleStringBuilder} builder - The builder to set the style for.
   * @private
   */
  #setStyle(builder, content) {
    if (this.#isHeader) {
      builder.green().bold();
    } else if (typeof content === 'number') {
      builder.magenta();
    } else {
      builder.yellow();
    }
  }

  /**
   * Generates the content of the cell.
   *
   * @param {boolean} [withStyle] - Whether to include the console style in the string representation.
   * @returns {string} The content (text) of the cell.
   * @private
   */
  #generateContent(withStyle) {
    const content = withStyle ? this.content.build() : this.content.plainText;
    const paddingLeft = ' '.repeat(this.paddingLeft);
    const paddingRight = ' '.repeat(this.paddingRight);
    return paddingLeft + content + paddingRight;
  }

  /**
   * Generates the left corner of the content cell.
   *
   * @returns {string} The left corner of the content cell.
   * @private
   */
  #generateLeftCorner() {
    return this.xPosition === HorizontalAlignment.LEFT
      ? TableBorder.VERTICAL
      : '';
  }

  /**
   * Generates the right corner of the content cell.
   *
   * @returns {string} The right corner of the content cell.
   * @private
   */
  #generateRightCorner() {
    return TableBorder.VERTICAL;
  }
}
