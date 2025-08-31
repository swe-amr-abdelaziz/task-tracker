import { ContentCell, SeparatorCell } from '../../table-cell/table-cell.js';
import { HorizontalAlignment } from '../../../enums.js';
import { Utils } from '../../../utils.js';

/**
 * Responsive table separator row builder class.
 * Builds a separator row with responsive layout.
 * @class
 */
export class SeparatorRowBuilder {
  #cells;

  /**
   * @param {object} options - The options for the separator row.
   * @param {number[]} options.cellsWidths - The widths of the cells in the row.
   * @param {number} options.cellPaddingLeft - The left padding of each cell.
   * @param {number} options.cellPaddingRight - The right padding of each cell.
   * @param {VerticalAlignment} options.yPosition -
   *   The vertical position of the row relative to the table.
   */
  constructor(options) {
    this.#buildCells({
      cellsWidths: options.cellsWidths,
      cellPaddingLeft: options.cellPaddingLeft,
      cellPaddingRight: options.cellPaddingRight,
      yPosition: options.yPosition,
    });
  }

  /**
   * @returns {string} The separator row as a string.
   */
  build() {
    return this.#cells.map((cell) => cell.toString()).join('');
  }

  /**
   * @param {object} options - The options for the separator row.
   * @param {number[]} options.cellsWidths - The widths of the cells in the row.
   * @param {number} options.cellPaddingLeft - The left padding of each cell.
   * @param {number} options.cellPaddingRight - The right padding of each cell.
   * @param {VerticalAlignment} [options.yPosition -
   *   The vertical position of the row relative to the table.
   *
   * @private
   */
  #buildCells(options) {
    this.#cells = options.cellsWidths.map((width, index) =>
      new SeparatorCell({
        width: width,
        paddingLeft: options.cellPaddingLeft,
        paddingRight: options.cellPaddingRight,
        xPosition: this.#getCellXPosition(
          index,
          options.cellsWidths.length - 1,
        ),
        yPosition: options.yPosition,
        singleColumn: options.cellsWidths.length === 1,
      })
    );
  }

  /**
   * Gets the x position of a cell in the separator row.
   *
   * @param {number} index - The index of the cell to get the x position for.
   * @param {number} lastIndex - The index of the last cell in the row.
   * @returns {HorizontalAlignment} The x position of the cell.
   * @private
   */
  #getCellXPosition(index, lastIndex) {
    if (index === 0)
      return HorizontalAlignment.LEFT;
    if (index === lastIndex)
      return HorizontalAlignment.RIGHT;

    return HorizontalAlignment.CENTER;
  }
}

/**
 * Responsive table content row builder class.
 * Builds a content row with responsive layout.
 * @class
 */
export class ContentRowBuilder {
  #widths;
  #buffer;
  #paddingLeft;
  #paddingRight;
  #isHeader;

  /**
   * @param {object} options - The options for the content row.
   * @param {number[]} options.widths - The widths of the cells in the row.
   * @param {unknown[]} options.buffer - The contents of the cells in the row.
   * @param {number} options.cellPaddingLeft - The left padding of each cell.
   * @param {number} options.cellPaddingRight - The right padding of each cell.
   * @param {boolean} options.isHeader - Whether the row is a header row.
   */
  constructor(options) {
    this.#widths = options.widths;
    this.#buffer = options.buffer;
    this.#paddingLeft = options.cellPaddingLeft;
    this.#paddingRight = options.cellPaddingRight;
    this.#isHeader = options.isHeader;
  }

  /**
   * @returns {string} the next content row to print.
   * @override
   */
  build() {
    const cells = this.#buildCells();
    const row = cells.map((cell) => cell.toString()).join('');
    return row;
  }

  /**
   * @returns {boolean} Whether the buffer has any content left.
   */
  hasBuffer() {
    return this.#buffer.some((item) => `${item}`.length > 0);
  }

  /**
   * Builds the cells for the table row.
   *
   * @private
   */
  #buildCells() {
    return this.#buffer.map((content, index) => {
      const width = this.#widths[index];
      const [buffer, remaining] = Utils.getBufferSplit(content, width);
      this.#buffer[index] = remaining;
      const cell = new ContentCell({
        width,
        paddingLeft: this.#paddingLeft,
        paddingRight: this.#paddingRight,
        xPosition: this.#getCellXPosition(
          index,
          this.#buffer.length - 1,
        ),
        content: buffer,
        isHeader: this.#isHeader,
        singleColumn: this.#buffer.length === 1,
      })
      return cell;
    });
  }

  /**
   * Gets the x position of a cell in the content row.
   *
   * @param {number} index - The index of the cell to get the x position for.
   * @param {number} lastIndex - The index of the last cell in the row.
   * @returns {HorizontalAlignment} The x position of the cell.
   * @private
   */
  #getCellXPosition(index, lastIndex) {
    if (index === 0)
      return HorizontalAlignment.LEFT;
    if (index === lastIndex)
      return HorizontalAlignment.RIGHT;

    return HorizontalAlignment.CENTER;
  }
}
