import { ContentRowBuilder, SeparatorRowBuilder } from './internals/table-row.builder.js';
import { TableRowValidator } from './internals/table-row.validator.js';
import { VerticalAlignment } from '../../enums.js';
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
  #builder;

  /**
   * @param {object} [options] - The options for the separator row.
   * @param {number[]} [options.cellsWidths] - The widths of the cells in the row.
   * @param {number} [options.cellPaddingLeft=0] - The left padding of each cell.
   * @param {number} [options.cellPaddingRight=0] - The right padding of each cell.
   * @param {VerticalAlignment} [options.yPosition=VerticalAlignment.CENTER] -
   *   The vertical position of the row relative to the table.
   */
  constructor(options) {
    super();
    TableRowValidator.validateCellsWidths(options.cellsWidths);
    this.#builder = new SeparatorRowBuilder({
      cellsWidths: options.cellsWidths,
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
    const row = this.#builder.build();
    console.log(row);
  }
}

/**
 * Represents a content row in a table.
 * @class
 * @extends TableRow
 */
export class ContentRow extends TableRow {
  #builder;

  /**
   * @param {object} [options] - The options for the content row.
   * @param {number[]} [options.widths] - The widths of the cells in the row.
   * @param {unknown[]} [options.buffer] - The contents of the cells in the row.
   * @param {number} [options.cellPaddingLeft=0] - The left padding of each cell.
   * @param {number} [options.cellPaddingRight=0] - The right padding of each cell.
   * @param {boolean} [options.isHeader=false] - Whether the row is a header row.
   */
  constructor(options) {
    super();
    TableRowValidator.validateCellsWidths(options.widths);
    TableRowValidator.validateCellsBuffer(options.buffer, options.widths);
    this.#builder = new ContentRowBuilder({
      widths: options.widths,
      buffer: options.buffer,
      cellPaddingLeft: options.cellPaddingLeft ?? 0,
      cellPaddingRight: options.cellPaddingRight ?? 0,
      isHeader: options.isHeader ?? false,
    });
  }

  /**
   * Prints the content row to the console.
   * @override
   */
  print() {
    while (this.#builder.hasBuffer()) {
      const row = this.#builder.build();
      console.log(row);
    }
  }
}
