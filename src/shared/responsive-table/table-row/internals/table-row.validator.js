import { HorizontalAlignment } from '../../../enums.js';
import { messages } from '../../../messages.js';

/**
 * Validator class for table row properties.
 *
 * @internal
 */
export class TableRowValidator {
  /**
   * Validates the widths of a table row.
   *
   * @static
   * @param {number[]} widths - The widths of the table row.
   * @throws {TypeError} If the widths is not an array.
   * @throws {RangeError} If the widths is empty.
   */
  static validateCellsWidths(widths) {
    if (!Array.isArray(widths)) {
      throw new TypeError(messages.error.INVALID_TABLE_ROW_WIDTHS_TYPE);
    }
    if (widths.length === 0) {
      throw new RangeError(messages.error.REQUIRED_TABLE_DATA_ROWS_WIDTHS);
    }
  }

  /**
   * Validates the options of a table row.
   *
   * @static
   * @param {CellOptions[]} cells - The options of the table row.
   * @throws {TypeError} If the cells is not an array.
   * @throws {RangeError} If the cells is empty.
   * @throws {TypeError} If the cell options are invalid.
   */
  static validateCellsOptions(cells) {
    if (!Array.isArray(cells))
      throw new TypeError(messages.error.INVALID_TABLE_ROW_CELLS_TYPE);
    if (cells.length === 0)
      throw new RangeError(messages.error.REQUIRED_TABLE_DATA_ROWS_CELLS);
    cells.forEach((cell) => TableRowValidator.#validateCellOptions(cell));
  }

  /**
   * Validates the options of each cell in a table row.
   *
   * @static
   * @param {CellOptions} cell - The options of the table cell.
   * @throws {TypeError} If the cell buffer is not defined.
   * @throws {TypeError} If the cell width is not defined.
   * @throws {TypeError} If the cell width is not a number.
   * @throws {RangeError} If the cell width is negative.
   * @throws {TypeError} If the cell textAlign is not a valid horizontal alignment.
   */
  static #validateCellOptions({ buffer, width, textAlign }) {
    if (buffer === undefined)
      throw new TypeError(messages.error.REQUIRED_TABLE_ROW_BUFFER);

    if (width === undefined)
      throw new TypeError(messages.error.REQUIRD_TABLE_ROW_WIDTH);
    if (isNaN(width))
      throw new TypeError(messages.error.INVALID_TABLE_ROW_WIDTH);
    if (width < 0)
      throw new RangeError(messages.error.INVALID_TABLE_ROW_WIDTH_RANGE);

    const validHorizontalAlignments = Object.values(HorizontalAlignment);
    if (textAlign && !validHorizontalAlignments.includes(textAlign))
      throw new TypeError(messages.error.INVALID_TABLE_ROW_TEXT_ALIGN);
  }
}
