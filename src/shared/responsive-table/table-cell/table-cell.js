import { ConsoleStringBuilder } from '../../console-string.builder.js';
import { ContentCellBuilder, SeparatorCellBuilder } from './internals/table-cell.builder.js';
import { ContentCellStyler } from './internals/table-cell.styler.js';
import { HorizontalAlignment, PADDING_DEFAULT, VerticalAlignment } from '../../enums.js';
import { TableCellValidator } from './internals/table-cell.validator.js';
import { messages } from '../../messages.js';

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
   * @param {number} [options.paddingLeft=1] - The left padding of the cell.
   * @param {number} [options.paddingRight=1] - The right padding of the cell.
   * @param {HorizontalAlignment} [options.xPosition=HorizontalAlignment.CENTER] -
   *   The horizontal position of the cell relative to the table.
   * @param {boolean} [options.singleColumn=false] - Whether the table contains only one column.
   */
  constructor(options = {}) {
    if (new.target === TableCell) {
      const message = messages.error.ABSTRACT_CLASS_OBJECT_CREATION.replace('{0}', 'TableCell');
      throw new Error(message);
    }
    this.width = options.width ?? 0;
    this.paddingLeft = options.paddingLeft ?? PADDING_DEFAULT;
    this.paddingRight = options.paddingRight ?? PADDING_DEFAULT;
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
    TableCellValidator.validateWidth(width);
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
    TableCellValidator.validatePaddingLeft(paddingLeft);
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
    TableCellValidator.validatePaddingRight(paddingRight);
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
    TableCellValidator.validateXPosition(xPosition);
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
    TableCellValidator.validateSingleColumn(singleColumn);
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
   * @param {number} [options.paddingLeft=1] - The left padding of the cell.
   * @param {number} [options.paddingRight=1] - The right padding of the cell.
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
    TableCellValidator.validateYPosition(yPosition);
    this.#yPosition = yPosition;
  }

  /**
   * @returns {string} The string representation of the separator cell.
   */
  toString() {
    const builder = new SeparatorCellBuilder({
       width: this.width,
       paddingLeft: this.paddingLeft,
       paddingRight: this.paddingRight,
       xPosition: this.xPosition,
       yPosition: this.yPosition,
       singleColumn: this.singleColumn,
    });
    return builder.build();
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

  /**
   * @param {object} [options={}] = The options for the table cell.
   * @param {number} [options.width=0] - The width of the cell.
   * @param {number} [options.paddingLeft=1] - The left padding of the cell.
   * @param {number} [options.paddingRight=1] - The right padding of the cell.
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
    TableCellValidator.validateContent(content, this.width);
    const styler = new ContentCellStyler({ content, isHeader: this.#isHeader });
    this.#content = styler.build();
  }

  /**
   * @returns {HorizontalAlignment} The horizontal alignment of the text content of the cell.
   */
  get textAlign() {
    return this.#textAlign;
  }

  /**
   * @param {HorizontalAlignment} textAlign - The new horizontal alignment of the text content of the cell.
   */
  set textAlign(textAlign) {
    TableCellValidator.validateTextAlign(textAlign);
    this.#textAlign = textAlign;
  }

  /**
   * @param {boolean} [withStyle=true] - Whether to include the console style in the string representation.
   * @returns {string} The string representation of the content cell.
   */
  toString(withStyle = true) {
    const builder = new ContentCellBuilder({
      width: this.width,
      content: this.content,
      paddingLeft: this.paddingLeft,
      paddingRight: this.paddingRight,
      xPosition: this.xPosition,
      textAlign: this.textAlign,
      withStyle,
    });
    return builder.build();
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
}
