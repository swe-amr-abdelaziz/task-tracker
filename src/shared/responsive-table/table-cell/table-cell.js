import { ConsoleStringBuilder } from '../../console-string.builder.js';
import { ContentCellBuilder, SeparatorCellBuilder } from './internals/table-cell.builder.js';
import { ContentCellStyler } from './internals/table-cell.styler.js';
import { HorizontalAlignment, PADDING_DEFAULT, VerticalAlignment } from '../../enums.js';
import { TableCellValidator } from './internals/table-cell.validator.js';
import { messages } from '../../messages.js';

/**
 * Represents a cell in a table with visual properties.
 *
 * @abstract
 * @internal
 */
export class TableCell {
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
   * Whether the table contains only one column.
   * @type {boolean}
   * @private
   */
  #singleColumn;

  /**
   * Initializes the properties of the table cell.
   *
   * @constructor
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
   * Gets the width of the cell.
   *
   * @type {number}
   */
  get width() {
    return this.#width;
  }

  /**
   * Sets and validates the width of the cell.
   *
   * @param {number} width - The new width of the cell.
   */
  set width(width) {
    TableCellValidator.validateWidth(width);
    this.#width = width;
  }

  /**
   * Gets the left padding of the cell.
   *
   * @type {number}
   */
  get paddingLeft() {
    return this.#paddingLeft;
  }

  /**
   * Sets and validates the left padding of the cell.
   *
   * @param {number} paddingLeft - The new left padding of the cell.
   */
  set paddingLeft(paddingLeft) {
    TableCellValidator.validatePaddingLeft(paddingLeft);
    this.#paddingLeft = paddingLeft;
  }

  /**
   * Gets the right padding of the cell.
   *
   * @type {number}
   */
  get paddingRight() {
    return this.#paddingRight;
  }

  /**
   * Sets and validates the right padding of the cell.
   *
   * @param {number} paddingRight - The new right padding of the cell.
   */
  set paddingRight(paddingRight) {
    TableCellValidator.validatePaddingRight(paddingRight);
    this.#paddingRight = paddingRight;
  }

  /**
   * Gets the horizontal position of the cell relative to the table.
   *
   * @type {HorizontalAlignment}
   */
  get xPosition() {
    return this.#xPosition;
  }

  /**
   * Sets and validates the horizontal position of the cell relative to the table.
   *
   * @param {HorizontalAlignment} xPosition - The new horizontal position.
   */
  set xPosition(xPosition) {
    TableCellValidator.validateXPosition(xPosition);
    this.#xPosition = xPosition;
  }

  /**
   * Gets whether the table contains only one column.
   *
   * @type {boolean}
   */
  get singleColumn() {
    return this.#singleColumn;
  }

  /**
   * Sets and validates whether the table contains only one column.
   *
   * @param {boolean} singleColumn - Whether the table contains only one column.
   */
  set singleColumn(singleColumn) {
    TableCellValidator.validateSingleColumn(singleColumn);
    this.#singleColumn = singleColumn;
  }

  /**
   * Creates a copy of the table cell properties.
   *
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
 *
 * @extends TableCell
 */
export class SeparatorCell extends TableCell {
  /**
   * The vertical position of the cell relative to the table.
   * @type {VerticalAlignment}
   * @private
   */
  #yPosition;

  /**
   * Creates a new instance of the SeparatorCell class.
   *
   * @constructor
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
   * Gets the vertical position of the cell relative to the table.
   *
   * @type {VerticalAlignment}
   */
  get yPosition() {
    return this.#yPosition;
  }

  /**
   * Sets and validates the vertical position of the cell relative to the table.
   *
   * @param {VerticalAlignment} yPosition - The new vertical position of the cell.
   */
  set yPosition(yPosition) {
    TableCellValidator.validateYPosition(yPosition);
    this.#yPosition = yPosition;
  }

  /**
   * Gets the string representation of the separator cell.
   *
   * @returns {string} The separator cell as a string.
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
   * Creates a copy of the separator cell properties.
   *
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
 *
 * @extends TableCell
 */
export class ContentCell extends TableCell {
  /**
   * The ConsoleStringBuilder instance representing the cell content.
   * @type {ConsoleStringBuilder}
   * @private
   */
  #content;

  /**
   * Whether the cell is a header cell.
   * @type {boolean}
   * @private
   */
  #isHeader;

  /**
   * The text align property of the cell.
   * @type {HorizontalAlignment}
   * @private
   */
  #textAlign;

  /**
   * Creates a new ContentCell instance.
   *
   * @constructor
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
   * Gets the content of the cell as ConsoleStringBuilder instance.
   *
   * @type {ConsoleStringBuilder}
   */
  get content() {
    return this.#content;
  }

  /**
   * Sets and validates the content of the cell.
   *
   * @param {unknown} content - The new content of the cell.
   */
  set content(content) {
    TableCellValidator.validateContent(content, this.width);
    const styler = new ContentCellStyler({ content, isHeader: this.#isHeader });
    this.#content = styler.build();
  }

  /**
   * Gets the horizontal alignment of the text content of the cell.
   *
   * @type {HorizontalAlignment}
   */
  get textAlign() {
    return this.#textAlign;
  }

  /**
   * Sets and validates the horizontal alignment of the text content of the cell.
   *
   * @param {HorizontalAlignment} textAlign - The new horizontal alignment of the text content.
   */
  set textAlign(textAlign) {
    TableCellValidator.validateTextAlign(textAlign);
    this.#textAlign = textAlign;
  }

  /**
   * Gets the string representation of the content cell.
   *
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
   * Creates a copy of the content cell properties.
   *
   * @returns {ContentCell} A copy of the separator cell.
   */
  clone() {
    return {
      ...super.clone(),
      content: this.content,
    };
  }
}
