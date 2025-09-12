import { ContentCell, SeparatorCell } from '../../table-cell/table-cell.js';
import { HorizontalAlignment } from '../../../enums.js';
import { Utils } from '../../../utils.js';

/**
 * Responsive table separator row builder class.
 * Builds a separator row with responsive layout.
 *
 * @internal
 */
export class SeparatorRowBuilder {
  /**
   * The cells of the separator row.
   * @type {SeparatorCell[]}
   * @private
   */
  #cells;

  /**
   * Creates a new SeparatorRowBuilder instance.
   *
   * @constructor
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
   * Builds the string representation of the separator row.
   *
   * @returns {string} The separator row as a string.
   */
  build() {
    return this.#cells.map((cell) => cell.toString()).join('');
  }

  /**
   * Builds the internal cells of the separator row.
   *
   * @private
   * @param {object} options - The options for the separator row.
   * @param {number[]} options.cellsWidths - The widths of the cells in the row.
   * @param {number} options.cellPaddingLeft - The left padding of each cell.
   * @param {number} options.cellPaddingRight - The right padding of each cell.
   * @param {VerticalAlignment} [options.yPosition -
   *   The vertical position of the row relative to the table.
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
   * Gets the horizontal position of a cell in the separator row.
   *
   * @private
   * @param {number} index - The index of the cell to get the x position for.
   * @param {number} lastIndex - The index of the last cell in the row.
   * @returns {HorizontalAlignment} The horizontal position of the cell.
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
 *
 * @internal
 */
export class ContentRowBuilder {
  /**
   * The options of the cells in the row.
   * @type {CellOptions[]}
   * @private
   */
  #cellsOptions;

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
   * Whether the row is a header row.
   * @type {boolean}
   * @private
   */
  #isHeader;

  /**
   * Whether the table is in small view port mode.
   * @type {boolean}
   * @private
   */
  #isSmallViewPort;

  /**
   * @typedef {Object} CellOptions - The options for the table cell.
   * @property {number} width - The width of the table cell.
   * @property {unknown} buffer - The content of the table cell.
   * @property {HorizontalAlignment} [textAlign=HorizontalAlignment.LEFT]
   *   - The text alignment of the table cell.
   */

  /**
   * Creates a new ContentRowBuilder instance.
   *
   * @constructor
   * @param {object} options - The options for the content row.
   * @param {CellOptions[]} options.cells - The options of the cells in the row.
   * @param {number} options.cellPaddingLeft - The left padding of each cell.
   * @param {number} options.cellPaddingRight - The right padding of each cell.
   * @param {boolean} options.isHeader - Whether the row is a header row.
   * @param {boolean} options.isSmallViewPort - Whether the table is in small view port mode.
   */
  constructor(options) {
    this.#cellsOptions = options.cells;
    this.#paddingLeft = options.cellPaddingLeft;
    this.#paddingRight = options.cellPaddingRight;
    this.#isHeader = options.isHeader;
    this.#isSmallViewPort = options.isSmallViewPort;
  }

  /**
  * Builds the string representation of the content row.
  *
  * @returns {string} The next content row to print.
  */
  build() {
    const cells = this.#buildCells();
    const row = cells.map((cell) => cell.toString()).join('');
    return row;
  }

  /**
   * Checks if the buffer has any content left to print.
   *
   * @returns {boolean} Whether the buffer has any content left.
   */
  hasBuffer() {
    return this.#cellsOptions
      .map((cell) => cell.buffer)
      .some((buffer) => `${buffer}`.length > 0);
  }

  /**
   * Builds the cells for the next content row to print.
   *
   * @private
   * @returns {ContentCell[]} The next cells row.
   */
  #buildCells() {
    return this.#cellsOptions.map((cell, index) => {
      const isHeader = this.#isHeader || (this.#isSmallViewPort && index === 0);
      const [buffer, remaining] = Utils.getBufferSplit(cell.buffer, cell.width);
      cell.buffer = remaining;
      const contentCell = new ContentCell({
        width: cell.width,
        paddingLeft: this.#paddingLeft,
        paddingRight: this.#paddingRight,
        xPosition: this.#getCellXPosition(
          index,
          this.#cellsOptions.length - 1,
        ),
        content: buffer,
        textAlign: cell.textAlign ?? HorizontalAlignment.LEFT,
        isHeader,
        singleColumn: this.#cellsOptions.length === 1,
      })
      return contentCell;
    });
  }

  /**
   * Gets the horizontal position of a cell in the content row.
   *
   * @private
   * @param {number} index - The index of the cell to get the x position for.
   * @param {number} lastIndex - The index of the last cell in the row.
   * @returns {HorizontalAlignment} The horizontal position of the cell.
   */
  #getCellXPosition(index, lastIndex) {
    if (index === 0)
      return HorizontalAlignment.LEFT;
    if (index === lastIndex)
      return HorizontalAlignment.RIGHT;

    return HorizontalAlignment.CENTER;
  }
}
