import { HorizontalAlignment } from '../../enums.js';

/**
 * Manages and calculates responsive table layouts
 * (e.g., column widths for normal and small viewports).
 *
 * @internal
 */
export class ResponsiveLayoutManager {
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
   * The last updated view port width.
   * @type {number}
   * @private
   */
  #lastViewPortWidth;

  /**
   * Whether the table is in small view port mode.
   * @type {boolean}
   * @private
   */
  #isSmallViewPort;

  /**
   * The widths of each column.
   * @type {number[]}
   * @private
   */
  #widths;

  /**
   * The width of the each border between cells.
   * @type {number}
   * @private
   */
  #borderWidth = 1;

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
  * Creates a new ResponsiveLayoutManager instance.
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
   * Gets the layout options for the responsive table.
   *
   * @readonly
   * @type {LayoutOptions}
   */
  get layoutOptions() {
    const didScreenWidthChange = this.#lastViewPortWidth !== this.#currentViewPortWidth;
    if (didScreenWidthChange) {
      this.#updateCellWidths();
      this.#calculateIsSmallViewPort();
      this.#calculateWidths();
    }

    return {
      isSmallViewPort: this.#isSmallViewPort,
      widths: this.#widths,
    };
  }

  /**
   * Gets the current view port width of the console.
   *
   * @readonly
   * @private
   * @type {number}
   */
  get #currentViewPortWidth() {
    return (process && process.stdout && Number(process.stdout.columns)) || 80;
  }

  /**
   * Updates the cell widths based on the current view port width.
   *
   * @private
   */
  #updateCellWidths() {
    this.#lastViewPortWidth = this.#currentViewPortWidth;
    this.#calculateCellWidths();
  }

  /**
   * Calculates the cell widths based on the current view port width.
   *
   * @private
   */
  #calculateCellWidths() {
    this.#calculateHeaderCellWidths();
    this.#calculateDataCellWidths();
  }

  /**
   * Calculates the header cell widths based on the current view port width.
   *
   * @private
   */
  #calculateHeaderCellWidths() {
    this.#headerData.forEach((header) => {
      header.minWidth = header.label.length;
      header.maxWidth = header.minWidth;
    });
  }

  /**
   * Calculates the width of each data cell in the table.
   *
   * @private
   */
  #calculateDataCellWidths() {
    this.#data.forEach((row) => {
      this.#headerData.forEach((header) => {
        const cellValue = row[header.key] ?? '';
        const cellWidth = cellValue.toString().length;
        header.maxWidth = Math.max(header.maxWidth, cellWidth);
        if (header.isFixed) {
          header.minWidth = header.maxWidth;
        }
      });
    });
  }

  /**
   * Calculates whether the table is in small view port mode.
   *
   * @private
   */
  #calculateIsSmallViewPort() {
    const minTableWidth = this.#calculateTableWidth(true);
    this.#isSmallViewPort = this.#currentViewPortWidth < minTableWidth;
  }

  /**
   * Calculates the total width of the table for the given view port width.
   * The width includes the border width and padding.
   *
   * @private
   * @param {boolean} forMinWidth - Whether to calculate the minimum width of the table.
   * @returns {number} The total table width.
   */
  #calculateTableWidth(forMinWidth) {
    const firstBorderWidth = this.#borderWidth;
    return firstBorderWidth + this.#headerData.reduce((tableWidth, header) => {
      const { paddingLeft, paddingRight } = this.#tableOptions;
      const innerCellWidth = forMinWidth ? header.minWidth : header.maxWidth;
      const cellWidth = paddingLeft + innerCellWidth + paddingRight + this.#borderWidth;
      return tableWidth + cellWidth;
    }, 0);
  }

  /**
   * Calculates the final widths of the table cells.
   *
   * @private
   */
  #calculateWidths() {
    if (this.#isSmallViewPort)
      this.#calculateSmallViewPortWidths();
    else
      this.#calculateNormalViewPortWidths();
  }

  /**
   * Calculates the final widths of the table cells for small view port mode.
   * Small view port mode consists of two columns: label and value.
   *
   * @private
   */
  #calculateSmallViewPortWidths() {
    const { paddingLeft, paddingRight } = this.#tableOptions;
    let headerWidth = this.#headerData.reduce((accWidth, header) => {
      const width = header.label.length;
      if (width > accWidth) {
        return width;
      }
      return accWidth;
    }, 0);

    const netColumnsWidth = this.#currentViewPortWidth
      - paddingLeft * 2
      - paddingRight * 2
      - this.#borderWidth * 3;

    if (netColumnsWidth < headerWidth * 2) {
      headerWidth = Math.floor(netColumnsWidth / 2);
    }
    const valueWidth = netColumnsWidth - headerWidth;

    this.#widths = [headerWidth, valueWidth];
  }

  /**
   * Calculates the final widths of the table cells for normal view port mode.
   *
   * @private
   */
  #calculateNormalViewPortWidths() {
    const maxTableWidth = this.#calculateTableWidth(false);
    const widths = this.#headerData.map(h => h.maxWidth);

    if (this.#currentViewPortWidth >= maxTableWidth) {
      this.#widths = widths;
      return;
    }

    const diff = maxTableWidth - this.#currentViewPortWidth;

    // gather resizable columns with their index and shrink capacity
    const resizable = this.#headerData
      .map((h, i) => ({ i, min: h.minWidth, max: h.maxWidth, capacity: Math.max(0, h.maxWidth - h.minWidth), isFixed: !!h.isFixed }))
      .filter(r => !r.isFixed && r.capacity > 0);

    const totalCapacity = resizable.reduce((s, r) => s + r.capacity, 0);
    let toRemove = Math.min(diff, totalCapacity);

    // proportional float shares
    const floatShares = resizable.map(r => (r.capacity / totalCapacity) * toRemove);
    const intShares = floatShares.map(Math.floor);
    let distributed = intShares.reduce((s, v) => s + v, 0);
    let leftover = Math.round(toRemove - distributed);

    // distribute leftover by largest fractional parts
    const fracParts = floatShares.map((f, idx) => ({ idx, frac: f - Math.floor(f) }));
    fracParts.sort((a, b) => b.frac - a.frac);
    for (let k = 0; k < leftover; k++) {
      intShares[fracParts[k].idx] += 1;
    }

    // apply shares to widths (ensure we don't go below min)
    for (let j = 0; j < resizable.length; j++) {
      const r = resizable[j];
      const shrink = intShares[j];
      widths[r.i] = Math.max(r.min, r.max - shrink);
    }

    this.#widths = widths;
  }
}
