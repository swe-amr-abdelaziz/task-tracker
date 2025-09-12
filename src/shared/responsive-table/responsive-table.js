import { HorizontalAlignment, PADDING_DEFAULT } from '../enums.js';
import { ResponsiveLayoutManager } from './internals/responsive-layout-manager.js';
import { ResponsiveTableBuilder } from './internals/responsive-table.builder.js';
import { ResponsiveTableValidator } from './internals/responsive-table.validator.js';

/**
 * Responsive table class.
 * Prints a table with responsive layout.
 */
export class ResponsiveTable {
  /**
   * The builder instance for the responsive table.
   * @type {ResponsiveTableBuilder}
   * @private
   */
  #builder;

  /**
   * The layout manager instance for the responsive table.
   * @type {ResponsiveLayoutManager}
   * @private
   */
  #layoutManager;

  /**
   * @typedef {Object} TableHeader
   * @property {string} key - The name of the row item property.
   * @property {string} label - The name of the header label to be displayed.
   * @property {boolean} isFixed - Whether the header label's width is fixed or not.
   * @property {HorizontalAlignment} [textAlign=HorizontalAlignment.LEFT] - The horizontal alignment of the column.
   */

  /**
   * @typedef {Object} TableOptions
   * @property {number} [paddingLeft=1] - The left padding of each cell.
   * @property {number} [paddingRight=1] - The right padding of each cell.
   */

  /**
   * Creates a new ResponsiveTable instance.
   *
   * @constructor
   * @param {object[]} data - The table data.
   * @param {TableHeader[]} [headerData=[]] - The list of header labels.
   * @param {TableOptions} [options={}] - The options for the table.
   */
  constructor(data, headerData = [], options = {}) {
    options = this.#setDefaultOptions(options);
    ResponsiveTableValidator.validateData(data);
    const formalizedHeaderData = ResponsiveTableBuilder.formalizeHeaderData(data, headerData);
    ResponsiveTableValidator.validateHeaderData(formalizedHeaderData);
    ResponsiveTableValidator.validateOptions(options);

    this.#builder = new ResponsiveTableBuilder(data, formalizedHeaderData, options);
    this.#layoutManager = new ResponsiveLayoutManager(data, formalizedHeaderData, options);
  }

  /**
   * Prints the responsive table to the console.
   */
  print() {
    const layoutOptions = this.#layoutManager.layoutOptions;
    const table = this.#builder.build(layoutOptions);
    console.log(table);
  }

  /**
   * Sets the default options for the table if not provided.
   *
   * @private
   * @param {TableOptions} options - The options for the table.
   * @returns {TableOptions} The default options for the table.
   */
  #setDefaultOptions(options) {
    const defaultOptions = {
      paddingLeft: PADDING_DEFAULT,
      paddingRight: PADDING_DEFAULT,
    };
    return { ...defaultOptions, ...options };
  }
}
