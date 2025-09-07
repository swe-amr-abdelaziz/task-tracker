import {
  HorizontalAlignment,
  TEXT_ALIGN_DEFAULT,
  VerticalAlignment,
} from '../../enums.js';
import { ContentRow, SeparatorRow } from '../table-row/table-row.js';

export class ResponsiveTableBuilder {
  #data;
  #headerData;
  #tableOptions;
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
   * @returns {string} The responsive table as a string for small view port mode.
   * @private
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
   * @returns {string} The responsive table as a string for normal view port mode.
   * @private
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
   * @param {LayoutOptions} layoutOptions - The options for the responsive table layout.
   * @returns {string} The responsive table header as a string.
   * @private
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
   * @returns {string} The responsive table body as a string in normal view port mode.
   * @private
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
   * @param {CellOptions[]} cells - The cells of the content row.
   * @param {boolean} isHeader - Whether the content row is a header row.
   * @returns {ContentRow} The content row.
   * @private
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
   * Creates a separator row with the given vertical position.
   * @param {VerticalAlignment} yPosition - The vertical position of the separator row.
   * @returns {SeparatorRow} The separator row.
   * @private
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
   * @returns {ContentRow} A row of whitespace (No content).
   * @private
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
   * @param {object[]} data - The table data.
   * @param {TableHeader[]} headerData - The list of header labels.
   * @returns {TableHeader[]} The formalized header data.
   * @static
   */
  static formalizeHeaderData(data, headerData) {
    if (!Array.isArray(headerData) || headerData.length === 0) {
      return this.#createHeaderDataFromTableData(data);
    }
    return this.#createDefaultHeaderData(headerData);
  }

  /**
   * Creates header data from the table data.
   * @param {object[]} data - The table data.
   * @returns {TableHeader[]} The header data.
   * @static
   * @private
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
   * @param {TableHeader[]} headerData - The list of header labels.
   * @returns {TableHeader[]} The header data with default options.
   * @static
   * @private
   */
  static #createDefaultHeaderData(headerData) {
    return headerData.map((header) => ({
      ...header,
      textAlign: header.textAlign ?? TEXT_ALIGN_DEFAULT,
    }));
  }
}
