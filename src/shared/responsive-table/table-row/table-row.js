import { ContentCell, SeparatorCell } from '../table-cell/table-cell.js';
import { HorizontalAlignment, VerticalAlignment } from '../../enums.js';
import { Utils } from '../../utils.js';
import { messages } from '../../messages.js';

/**
 * Represents a row in a table with visual properties.
 * @class
 * @abstract
 */
export class TableRow {
  constructor() {
    if (new.target === TableRow) {
      const message = messages.error.ABSTRACT_CLASS_OBJECT_CREATION.replace('{0}', 'TableRow');
      throw new Error(message);
    }
  }

  /**
   * Prints the row to the console.
   * @abstract
   */
  print() {
    throw new Error(messages.error.ABSTRACT_METHOD_CALL);
  }
}

/**
 * Represents a separator row in a table.
 * @class
 * @extends TableRow
 */
export class SeparatorRow extends TableRow {
  #cells;

  /**
   * @param {object} [options={}] - The options for the table row.
   * @param {number[]} [options.cellsWidths=[]] - The widths of the cells in the row.
   * @param {number} [options.cellPaddingLeft=0] - The left padding of each cell.
   * @param {number} [options.cellPaddingRight=0] - The right padding of each cell.
   * @param {VerticalAlignment} [options.yPosition=VerticalAlignment.CENTER] -
   *   The vertical position of the row relative to the table.
   */
  constructor(options = {}) {
    super();
    this.#buildCells({
      cellsWidths: options.cellsWidths ?? [],
      cellPaddingLeft: options.cellPaddingLeft ?? 0,
      cellPaddingRight: options.cellPaddingRight ?? 0,
      yPosition: options.yPosition ?? VerticalAlignment.CENTER,
    });
  }

  /**
   * Prints the separator row to the console.
   * @override
   */
  print() {
    const row = this.#cells.map((cell) => cell.toString()).join('');
    if (row) console.log(row);
  }

  /**
   * @param {object} [options] - The options for the table row.
   * @param {number[]} [options.cellsWidths] - The widths of the cells in the row.
   * @param {number} [options.cellPaddingLeft] - The left padding of each cell.
   * @param {number} [options.cellPaddingRight] - The right padding of each cell.
   * @param {VerticalAlignment} [options.yPosition] -
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
   * Gets the x position of a cell in the table row.
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
 * Represents a content row in a table.
 * @class
 * @extends TableRow
 */
export class ContentRow extends TableRow {
  #widths;
  #buffer;
  #paddingLeft;
  #paddingRight;
  #isHeader;

  /**
   * @param {object} [options={}] - The options for the table row.
   * @param {number[]} [options.widths=[]] - The widths of the cells in the row.
   * @param {unknown[]} [options.buffer=[]] - The contents of the cells in the row.
   * @param {number} [options.cellPaddingLeft=0] - The left padding of each cell.
   * @param {number} [options.cellPaddingRight=0] - The right padding of each cell.
   * @param {boolean} [options.isHeader=false] - Whether the row is a header row.
   */
  constructor(options = {}) {
    super();
    this.#widths = Array.isArray(options.widths) ? options.widths : [];
    this.#buffer = Array.isArray(options.buffer) ? options.buffer : [];
    this.#paddingLeft = options.cellPaddingLeft ?? 0;
    this.#paddingRight = options.cellPaddingRight ?? 0;
    this.#isHeader = options.isHeader ?? false;
  }

  /**
   * Prints the content row to the console.
   * @override
   */
  print() {
    while (this.#hasBuffer(this.#buffer)) {
      const cells = this.#buildCells();
      const row = cells.map((cell) => cell.toString()).join('');
      console.log(row);
    }
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
   * Gets the x position of a cell in the table row.
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

  /**
   * Checks if the buffer has any content.
   *
   * @param {unknown[]} buffer - The buffer to check.
   * @returns {boolean} Whether the buffer has any content.
   * @private
   */
  #hasBuffer(buffer) {
    return buffer.some((item) => `${item}`.length > 0);
  }
}
