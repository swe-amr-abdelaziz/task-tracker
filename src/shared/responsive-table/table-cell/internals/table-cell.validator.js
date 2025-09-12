import { HorizontalAlignment, VerticalAlignment } from '../../../enums.js';
import { messages } from '../../../messages.js';

/**
 * Validator class for table cell properties.
 *
 * @internal
 */
export class TableCellValidator {
  /**
   * Validates the width of a table cell.
   *
   * @static
   * @param {number} width - The width of the table cell.
   * @throws {TypeError} If the width is not a number.
   * @throws {RangeError} If the width is negative.
   */
  static validateWidth(width) {
    if (typeof width !== 'number') {
      throw new TypeError(messages.error.INVALID_TABLE_CELL_WIDTH);
    }
    if (width < 0) {
      throw new RangeError(messages.error.NEGATIVE_TABLE_CELL_WIDTH);
    }
  }

  /**
   * Validates the left padding of a table cell.
   *
   * @static
   * @param {number} paddingLeft - The left padding of the table cell.
   * @throws {TypeError} If the paddingLeft is not a number.
   * @throws {RangeError} If the paddingLeft is negative.
   */
  static validatePaddingLeft(paddingLeft) {
    if (typeof paddingLeft !== 'number') {
      throw new TypeError(messages.error.INVALID_TABLE_CELL_PADDING_LEFT);
    }
    if (paddingLeft < 0) {
      throw new RangeError(messages.error.NEGATIVE_TABLE_CELL_PADDING_LEFT);
    }
  }

  /**
   * Validates the right padding of a table cell.
   *
   * @static
   * @param {number} paddingRight - The right padding of the table cell.
   * @throws {TypeError} If the paddingRight is not a number.
   * @throws {RangeError} If the paddingRight is negative.
   */
  static validatePaddingRight(paddingRight) {
    if (typeof paddingRight !== 'number') {
      throw new TypeError(messages.error.INVALID_TABLE_CELL_PADDING_RIGHT);
    }
    if (paddingRight < 0) {
      throw new RangeError(messages.error.NEGATIVE_TABLE_CELL_PADDING_RIGHT);
    }
  }

  /**
   * Validates the horizontal position of a table cell.
   *
   * @static
   * @param {HorizontalAlignment} xPosition - The horizontal position of the table cell.
   * @throws {TypeError} If the xPosition is not a valid horizontal position.
   */
  static validateXPosition(xPosition) {
    const validPositions = Object.keys(HorizontalAlignment);
    if (!validPositions.includes(xPosition)) {
      throw new TypeError(messages.error.INVALID_TABLE_CELL_X_POSITION);
    }
  }

  /**
   * Validates the vertical position of a table cell.
   *
   * @static
   * @param {VerticalAlignment} yPosition - The vertical position of the table cell.
   * @throws {TypeError} If the yPosition is not a valid vertical position.
   */
  static validateYPosition(yPosition) {
    const validPositions = Object.keys(VerticalAlignment);
    if (!validPositions.includes(yPosition)) {
      throw new TypeError(messages.error.INVALID_TABLE_CELL_Y_POSITION);
    }
  }

  /**
   * Validates the single column property of a table cell.
   *
   * @static
   * @param {boolean} singleColumn - The single column property of the table cell.
   * @throws {TypeError} If the singleColumn is not a boolean.
   */
  static validateSingleColumn(singleColumn) {
    if (typeof singleColumn !== 'boolean') {
      throw new TypeError(messages.error.INVALID_TABLE_CELL_SINGLE_COLUMN);
    }
  }

  /**
   * Validates the content of a table cell.
   *
   * @static
   * @param {unknown} content - The content of the table cell.
   * @param {number} width - The width of the table cell.
   * @throws {RangeError} If the content length exceeds the cell width.
   */
  static validateContent(content, width) {
    TableCellValidator.validateWidth(width);
    if (content.toString().length > width) {
      throw new RangeError(messages.error.CELL_CONTENT_EXCEEDS_CELL_WIDTH);
    }
  }

  /**
   * Validates the text align property of a table cell.
   *
   * @static
   * @param {HorizontalAlignment} textAlign - The text align property of the table cell.
   * @throws {TypeError} If the textAlign is not a valid horizontal position.
   */
  static validateTextAlign(textAlign) {
    const validPositions = Object.keys(HorizontalAlignment);
    if (!validPositions.includes(textAlign)) {
      throw new TypeError(messages.error.INVALID_TABLE_CELL_TEXT_ALIGN);
    }
  }
}
