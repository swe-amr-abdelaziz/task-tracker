import { ContentRowBuilder, SeparatorRowBuilder } from './internals/table-row.builder.js';
import { PADDING_DEFAULT, VerticalAlignment } from '../../enums.js';
import { TableRowValidator } from './internals/table-row.validator.js';
import { messages } from '../../messages.js';

/**
 * Represents a row in a table with visual properties.
 *
 * @abstract
 * @internal
 */
export class TableRow {
  /**
   * Initialize the properties of the table row.
   *
   * @constructor
   * @throws {Error} If called directly on TableRow (abstract class)
   */
  constructor() {
    if (new.target === TableRow) {
      const message = messages.error.ABSTRACT_CLASS_OBJECT_CREATION.replace('{0}', 'TableRow');
      throw new Error(message);
    }
  }

  /**
   * Prints the row to the console.
   *
   * @abstract
   */
  build() {
    throw new Error(messages.error.ABSTRACT_METHOD_CALL);
  }
}

/**
 * Represents a separator row in a table.
 *
 * @extends TableRow
 */
export class SeparatorRow extends TableRow {
  /**
   * The builder instance for the separator row.
   * @type {SeparatorRowBuilder}
   * @private
   */
  #builder;

  /**
   * Creates a new SeparatorRow instance.
   *
   * @constructor
   * @param {object} [options] - The options for the separator row.
   * @param {number[]} [options.cellsWidths] - The widths of the cells in the row.
   * @param {number} [options.cellPaddingLeft=1] - The left padding of each cell.
   * @param {number} [options.cellPaddingRight=1] - The right padding of each cell.
   * @param {VerticalAlignment} [options.yPosition=VerticalAlignment.CENTER] -
   *   The vertical position of the row relative to the table.
   */
  constructor(options) {
    super();
    TableRowValidator.validateCellsWidths(options.cellsWidths);
    this.#builder = new SeparatorRowBuilder({
      cellsWidths: options.cellsWidths,
      cellPaddingLeft: options.cellPaddingLeft ?? PADDING_DEFAULT,
      cellPaddingRight: options.cellPaddingRight ?? PADDING_DEFAULT,
      yPosition: options.yPosition ?? VerticalAlignment.CENTER,
    });
  }

  /**
   * Builds the string representation of the separator row.
   *
   * @override
   * @returns {string} The separator row as a string.
   */
  build() {
    return this.#builder.build();
  }
}

/**
 * Represents a content row in a table.
 *
 * @extends TableRow
 */
export class ContentRow extends TableRow {
  /**
   * The builder instance for the content row.
   * @type {ContentRowBuilder}
   * @private
   */
  #builder;

  /**
   * @typedef {Object} CellOptions - The options for the table cell.
   * @property {number} width - The width of the table cell.
   * @property {unknown} buffer - The content of the table cell.
   * @property {HorizontalAlignment} textAlign - The text alignment of the table cell.
   */

  /**
   * Creates a new ContentRow instance.
   *
   * @constructor
   * @param {object} [options] - The options for the content row.
   * @param {CellOptions[]} [options.cells] - The options of the cells in the row.
   * @param {number} [options.cellPaddingLeft=1] - The left padding of each cell.
   * @param {number} [options.cellPaddingRight=1] - The right padding of each cell.
   * @param {boolean} [options.isHeader=false] - Whether the row is a header row.
   * @param {boolean} [options.isSmallViewPort=false] - Whether the table is in small view port mode.
   */
  constructor(options) {
    super();
    TableRowValidator.validateCellsOptions(options.cells);
    this.#builder = new ContentRowBuilder({
      cells: options.cells,
      cellPaddingLeft: options.cellPaddingLeft ?? PADDING_DEFAULT,
      cellPaddingRight: options.cellPaddingRight ?? PADDING_DEFAULT,
      isHeader: options.isHeader ?? false,
      isSmallViewPort: options.isSmallViewPort ?? false,
    });
  }

  /**
   * Builds the string representation of the content row.
   *
   * @override
   * @returns {string} The content row as a string.
   */
  build() {
    const buffer = [];
    let firstIteration = true;
    while (this.#builder.hasBuffer() || firstIteration) {
      const row = this.#builder.build();
      buffer.push(row);
      firstIteration = false;
    }
    return buffer.join('\n');
  }
}
