import {
  HorizontalAlignment,
  TEXT_ALIGN_DEFAULT,
  VerticalAlignment,
} from '../../enums.js';
import { ContentRow, SeparatorRow } from '../table-row/table-row.js';

/**
 * Responsive table builder class.
 * Builds a responsive table from the given data and header data.
 *
 * @internal
 */
export class ResponsiveTableBuilder {
  /**
   * The data to be displayed in the table.
   * @type {object[]}
   * @private
   */
  #data;

  /**
   * The list of header labels to be used in the table.
   * @type {TableHeader[]}
   * @private
   */
  #headerData;

  /**
   * The options of the table.
   * @type {TableOptions}
   * @private
   */
  #tableOptions;

  /**
   * The options of the responsive table layout.
   * @type {LayoutOptions}
   * @private
   */
  #layoutOptions;

  /**
   * @typedef {Object} TableHeader
   * @property {string} key - The name of the row item property.
   * @property {string} label - The name of the header label to be displayed.
   * @property {boolean} isFixed - Whether the header label's width is fixed or not.
   * @property {HorizontalAlignment} textAlign - The horizontal alignment of the column.
   * @property {number} minWidth - The minimum width of the column.
   * @property {number} maxWidth - The maximum width of the column.
   */

  /**
   * @typedef {Object} TableOptions
   * @property {number} paddingLeft - The left padding of each cell.
   * @property {number} paddingRight - The right padding of each cell.
   */

  /**
   * Creates a new ResponsiveTableBuilder instance.
   *
   * @constructor
   * @param {object[]} data - The table data.
   * @param {TableHeader[]} headerData - The list of header labels.
   * @param {TableOptions} options - The options for the table.
   */
  constructor(data, headerData, options) {
    this.#data = data;
    this.#headerData = headerData;
    this.#tableOptions = options;
  }

  /**
   * @typedef {Object} LayoutOptions - The options for the responsive table layout.
   * @property {boolean} isSmallViewPort - Whether the screen width is small.
   * @property {number[]} widths - The widths of each column.
   */

  /**
   * Builds the content of the responsive table.
   *
   * @param {LayoutOptions} layoutOptions - The options for the responsive table layout.
   * @returns {string} The responsive table as a string.
   */
  build(layoutOptions) {
    this.#layoutOptions = layoutOptions;
    if (layoutOptions.isSmallViewPort) {
      return this.#buildSmallTable();
    }
    return this.#buildNormalTable();
  }

  /**
   * Builds the content of the responsive table for small view port mode.
   *
   * @private
   * @returns {string} The responsive table content in a string format.
   */
  #buildSmallTable() {
    const rows = [];

    const topSeparator = this.#makeSeparatorRow(VerticalAlignment.TOP);
    const middleSeparator = this.#makeSeparatorRow(VerticalAlignment.CENTER);
    const bottomSeparator = this.#makeSeparatorRow(VerticalAlignment.BOTTOM);
    const whitespace = this.#makeWhitespaceRow();

    rows.push(topSeparator.build());

    this.#data.forEach((row, rowIndex) => {
      this.#headerData.forEach((header, headerIndex) => {
        if (headerIndex === 0) {
          if (rowIndex !== 0) {
            rows.push(middleSeparator.build());
          }
        }
        rows.push(whitespace.build());

        const cells = [
          { width: this.#layoutOptions.widths[0], buffer: header.label },
          { width: this.#layoutOptions.widths[1], buffer: row[header.key] ?? '' },
        ];
        const contentRow = this.#makeContentRow(cells, false);
        rows.push(contentRow.build());

        if (headerIndex === this.#headerData.length - 1) {
          rows.push(whitespace.build());
        }
      });
    });

    rows.push(bottomSeparator.build());

    return rows.join('\n');
  }

  /**
   * Builds the content of the responsive table for normal view port mode.
   *
   * @private
   * @returns {string} The responsive table content in a string format.
   */
  #buildNormalTable() {
    const header = this.#buildTableHeader();
    const body = this.#buildTableBody();
    return [
      header,
      body,
    ].join('\n');
  }

  /**
   * Builds the header of the responsive table in normal view port mode.
   *
   * @private
   * @param {LayoutOptions} layoutOptions - The options for the responsive table layout.
   * @returns {string} The responsive table header as a string.
   */
  #buildTableHeader() {
    const topSeparator = this.#makeSeparatorRow(VerticalAlignment.TOP);
    const middleSeparator = this.#makeSeparatorRow(VerticalAlignment.CENTER);

    const cells = this.#headerData.map((header, index) => ({
      width: this.#layoutOptions.widths[index],
      buffer: header.label,
      textAlign: HorizontalAlignment.CENTER,
    }));
    const headerContent = this.#makeContentRow(cells, true);

    return [
      topSeparator.build(),
      headerContent.build(),
      middleSeparator.build(),
    ].join('\n');
  }

  /**
   * Builds the body of the responsive table in normal view port mode.
   *
   * @private
   * @returns {string} The responsive table body as a string.
   */
  #buildTableBody() {
    const rows = [];

    const middleSeparator = this.#makeSeparatorRow(VerticalAlignment.CENTER);
    const bottomSeparator = this.#makeSeparatorRow(VerticalAlignment.BOTTOM);

    this.#data.forEach((row, rowIndex) => {
      if (rowIndex !== 0) {
        rows.push(middleSeparator.build());
      }

      const cells = this.#headerData.map((header, index) => ({
        width: this.#layoutOptions.widths[index],
        buffer: row[header.key] ?? '',
        textAlign: header.textAlign,
      }));
      const contentRow = this.#makeContentRow(cells, false);

      rows.push(contentRow.build());
    });

    rows.push(bottomSeparator.build());

    return rows.join('\n');
  }

  /**
   * Creates a content row with the given cells and isHeader property.
   *
   * @private
   * @param {CellOptions[]} cells - The cells of the content row.
   * @param {boolean} isHeader - Whether the content row is a header row.
   * @returns {ContentRow} The content row.
   */
  #makeContentRow(cells, isHeader) {
    return new ContentRow({
      cells: cells,
      cellPaddingLeft: this.#tableOptions.paddingLeft,
      cellPaddingRight: this.#tableOptions.paddingRight,
      isHeader: isHeader,
      isSmallViewPort: this.#layoutOptions.isSmallViewPort,
    })
  }

  /**
   * Creates a separator row of the given vertical position.
   *
   * @private
   * @param {VerticalAlignment} yPosition - The vertical position of the separator row.
   * @returns {SeparatorRow} The separator row.
   */
  #makeSeparatorRow(yPosition) {
    return new SeparatorRow({
      cellsWidths: this.#layoutOptions.widths,
      cellPaddingLeft: this.#tableOptions.paddingLeft,
      cellPaddingRight: this.#tableOptions.paddingRight,
      yPosition: yPosition,
    });
  }

  /**
   * Creates a row of whitespace (no content).
   *
   * @private
   * @returns {ContentRow} A whitespace row.
   */
  #makeWhitespaceRow() {
    const cells = this.#layoutOptions.widths.map((width) => ({
      width: width,
      buffer: '',
    }));
    return new ContentRow({
      cells: cells,
      cellPaddingLeft: this.#tableOptions.paddingLeft,
      cellPaddingRight: this.#tableOptions.paddingRight,
      isHeader: false,
      isSmallViewPort: this.#layoutOptions.isSmallViewPort,
    });
  }

  /**
   * Formalizes the header data for the responsive table.
   *
   * @static
   * @param {object[]} data - The table data.
   * @param {TableHeader[]} headerData - The list of header labels.
   * @returns {TableHeader[]} The formalized header data.
   */
  static formalizeHeaderData(data, headerData) {
    if (!Array.isArray(headerData) || headerData.length === 0) {
      return this.#createHeaderDataFromTableData(data);
    }
    return this.#createDefaultHeaderData(headerData);
  }

  /**
   * Creates header data from a given table data.
   *
   * @static
   * @private
   * @param {object[]} data - The table data.
   * @returns {TableHeader[]} The header data.
   */
  static #createHeaderDataFromTableData(data) {
    const headerKeys = new Set();
    data.forEach((row) => {
      Object.keys(row).forEach((key) => {
        if (!headerKeys.has(key)) {
          headerKeys.add(key);
        }
      });
    });
    return Array.from(headerKeys).map((key) => ({
      key,
      label: key,
      isFixed: false,
      textAlign: TEXT_ALIGN_DEFAULT,
    }));
  }

  /**
   * Creates header data with default options.
   *
   * @static
   * @private
   * @param {TableHeader[]} headerData - The list of header labels.
   * @returns {TableHeader[]} The header data with default options.
   */
  static #createDefaultHeaderData(headerData) {
    return headerData.map((header) => ({
      ...header,
      textAlign: header.textAlign ?? TEXT_ALIGN_DEFAULT,
    }));
  }
}
