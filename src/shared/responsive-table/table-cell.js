import { ConsoleStringBuilder } from "../console-string.builder.js";
import { HorizontalAlignment, TableBorder, VerticalAlignment } from "../enums.js";
import { messages } from "../messages.js";

/**
 * Represents a cell in a table with visual properties.
 * @class
 * @abstract
 */
export class TableCell {
  #width;
  #paddingLeft;
  #paddingRight;
  #xPosition;
  #singleColumn;

  /**
   * @param {object} [options={}] = The options for the table cell.
   * @param {number} [options.width=0] - The width of the cell.
   * @param {number} [options.paddingLeft=0] - The left padding of the cell.
   * @param {number} [options.paddingRight=0] - The right padding of the cell.
   * @param {HorizontalAlignment} [options.xPosition=HorizontalAlignment.CENTER] -
   *   The horizontal position of the cell relative to the table.
   * @param {boolean} [options.singleColumn=false] - Whether the table contains only one column.
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
    this.singleColumn = options.singleColumn ?? false;
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

  /**
   * @returns {boolean} Whether the table contains only one column.
   */
  get singleColumn() {
    return this.#singleColumn;
  }

  /**
   * @param {boolean} singleColumn - Whether the table contains only one column.
   */
  set singleColumn(singleColumn) {
    if (typeof singleColumn !== 'boolean') {
      throw new Error(messages.error.INVALID_TABLE_CELL_SINGLE_COLUMN);
    }
    this.#singleColumn = singleColumn;
  }


  /**
   * @returns {TableCell} A copy of the table cell.
   */
  clone() {
    return {
      width: this.width,
      paddingLeft: this.paddingLeft,
      paddingRight: this.paddingRight,
      xPosition: this.xPosition,
    };
  }
}

/**
 * Represents a separator cell in a table.
 * @class
 * @extends TableCell
 */
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
   * @param {boolean} [options.singleColumn=false] - Whether the table contains only one column.
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
   * @returns {SeparatorCell} A copy of the separator cell.
   */
  clone() {
    return {
      ...super.clone(),
      yPosition: this.yPosition,
    };
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
    const isLastColumn =
      this.xPosition === HorizontalAlignment.RIGHT ||
        this.singleColumn;
    const key = isLastColumn
      ? `${this.yPosition}_RIGHT`
      : `${this.yPosition}_CENTER`;
    return TableBorder[key];
  }
}

/**
 * Represents a content cell in a table.
 * @class
 * @extends TableCell
 */
export class ContentCell extends TableCell {
  #content;
  #isHeader;
  #textAlign;
  #whitespaceLeft = '';
  #whitespaceRight = '';

  // TODO: Add feature of print extra spaces after content, if width is greater than content
  // TODO: Text alignment for content

  /**
   * @param {object} [options={}] = The options for the table cell.
   * @param {number} [options.width=0] - The width of the cell.
   * @param {number} [options.paddingLeft=0] - The left padding of the cell.
   * @param {number} [options.paddingRight=0] - The right padding of the cell.
   * @param {HorizontalAlignment} [options.xPosition=HorizontalAlignment.CENTER] -
   *   The horizontal position of the cell relative to the table.
   * @param {unknown} [options.content=''] - The text content of the cell.
   * @param {HorizontalAlignment} [options.textAlign=HorizontalAlignment.LEFT] -
   *   The horizontal alignment of the text content of the cell.
   * @param {boolean} [options.isHeader=false] - Whether the cell is a header cell.
   * @param {boolean} [options.singleColumn=false] - Whether the table contains only one column.
   */
  constructor(options = {}) {
    super(options);
    this.#isHeader = options.isHeader ?? false;
    this.content = options.content ?? '';
    this.textAlign = options.textAlign ?? HorizontalAlignment.LEFT;
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

  get textAlign() {
    return this.#textAlign;
  }

  set textAlign(textAlign) {
    const validPositions = Object.keys(HorizontalAlignment);
    if (!validPositions.includes(textAlign)) {
      throw new Error(messages.error.INVALID_TABLE_CELL_TEXT_ALIGN);
    }
    this.#textAlign = textAlign;
  }

  /**
   * @param {boolean} [withStyle=true] - Whether to include the console style in the string representation.
   * @returns {string} The string representation of the content cell.
   */
  toString(withStyle = true) {
    let content = this.#generateContent(withStyle);
    content = this.#whitespaceLeft + content + this.#whitespaceRight;
    const leftBorder = this.#generateLeftCorner();
    const rightBorder = this.#generateRightCorner();
    return leftBorder + content + rightBorder;
  }

  /**
   * @returns {ContentCell} A copy of the separator cell.
   */
  clone() {
    return {
      ...super.clone(),
      content: this.content,
    };
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
    this.#addWhitespaceToContent();
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

  /**
   * Adds whitespace to the content of the cell if the cell width is greater than the content width.
   * Takes into account the text alignment of the content.
   *
   * @returns {string} The content with whitespace added.
   * @private
   */
  #addWhitespaceToContent() {
    const whitespaceCount = this.width - this.content.textLength();
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
