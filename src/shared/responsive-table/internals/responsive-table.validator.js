import { HorizontalAlignment } from '../../enums.js';
import { messages } from '../../messages.js';

/**
 * Responsive table validator class.
 * Validates the data and header labels of a responsive table.
 *
 * @internal
 */
export class ResponsiveTableValidator {
  /**
   * Validates the data and header labels of a responsive table.
   *
   * @static
   * @param {object[]} data - The table data.
   * @throws {Error} If data is not provided.
   * @throws {TypeError} If data is not an array.
   * @throws {RangeError} If data is an empty array.
   * @throws {TypeError} If data is not an array of objects.
   */
  static validateData(data) {
    if (!data)
      throw new Error(messages.error.REQUIRED_TABLE_DATA);

    if (!Array.isArray(data))
      throw new TypeError(messages.error.INVALID_RESPONSIVE_TABLE_DATA);

    if (data.length === 0)
      throw new RangeError(messages.error.REQUIRED_TABLE_DATA_ROWS);

    if (data.some((item) => typeof item !== 'object'))
      throw new TypeError(messages.error.INVALID_RESPONSIVE_TABLE_DATA_ROW);
  }

  /**
   * Validates the header data of a responsive table.
   *
   * @static
   * @param {object[]} headerData - The header data of the table.
   * @param {object[]} data - The data of the table.
   * @throws {TypeError} If headerData is not an array.
   * @throws {RangeError} If headerData length is not equal to data length.
   * @throws {TypeError} If headerData contains a non-object item.
   * @throws {TypeError} If headerData item name is not a string.
   * @throws {TypeError} If headerData item isFixed is provided and it is not a boolean.
   */
  static validateHeaderData(headerData) {
    if (!Array.isArray(headerData))
      throw new TypeError(messages.error.INVALID_RESPONSIVE_TABLE_HEADER_DATA);

    if (headerData.length === 0)
      throw new RangeError(messages.error.INVALID_RESPONSIVE_TABLE_HEADER_DATA_RANGE);

    headerData.forEach(
      (header) => ResponsiveTableValidator.#validateHeaderDataItem(header)
    );

    this.#validateHeaderDataUniqueness(headerData);
  }

 /**
  * @typedef {Object} TableOptions
  * @property {number} [paddingLeft=1] - The left padding of each cell.
  * @property {number} [paddingRight=1] - The right padding of each cell.
  */

  /**
   * Validates the options of a responsive table.
   *
   * @static
   * @param {TableOptions} options - The options of the table.
   * @throws {TypeError} If the options is not an object.
   * @throws {TypeError} If the paddingLeft is not a number.
   * @throws {RangeError} If the paddingLeft is negative.
   * @throws {TypeError} If the paddingRight is not a number.
   * @throws {RangeError} If the paddingRight is negative.
   */
  static validateOptions(options) {
    if (typeof options !== 'object')
      throw new TypeError(messages.error.INVALID_RESPONSIVE_TABLE_OPTIONS);

    if (typeof options.paddingLeft !== 'number')
      throw new TypeError(messages.error.INVALID_RESPONSIVE_TABLE_OPTIONS_PADDING_LEFT);
    if (options.paddingLeft < 0)
      throw new RangeError(messages.error.INVALID_RESPONSIVE_TABLE_OPTIONS_PADDING_LEFT);

    if (typeof options.paddingRight !== 'number')
      throw new TypeError(messages.error.INVALID_RESPONSIVE_TABLE_OPTIONS_PADDING_RIGHT);
    if (options.paddingRight < 0)
      throw new RangeError(messages.error.INVALID_RESPONSIVE_TABLE_OPTIONS_PADDING_RIGHT);
  }

  /**
   * Validates a single header data item of a responsive table.
   *
   * @static
   * @private
   * @param {object} header - The header data item of the table.
   * @throws {TypeError} If header is not an object.
   * @throws {TypeError} If header name is not a string.
   * @throws {TypeError} If header isFixed is provided and it is not a boolean.
   * @throws {TypeError} If header key is missing.
   * @throws {TypeError} If header key is not a string.
   * @throws {TypeError} If header textAlign is not a HorizontalAlignment.
   */
  static #validateHeaderDataItem(header) {
    if (typeof header !== 'object')
      throw new TypeError(messages.error.INVALID_RESPONSIVE_TABLE_HEADER_DATA_ROW);

    if (typeof header.label !== 'string')
      throw new TypeError(messages.error.INVALID_RESPONSIVE_TABLE_HEADER_DATA_ROW_LABEL);

    if (header.isFixed !== undefined && typeof header.isFixed !== 'boolean')
      throw new TypeError(messages.error.INVALID_RESPONSIVE_TABLE_HEADER_DATA_ROW_IS_FIXED);

    if (header.key === undefined)
      throw new TypeError(messages.error.INVALID_RESPONSIVE_TABLE_HEADER_DATA_ROW_MISSING_KEY);
    if (typeof header.key !== 'string')
      throw new TypeError(messages.error.INVALID_RESPONSIVE_TABLE_HEADER_DATA_ROW_KEY);

    const allowedHorizontalAlignments = Object.values(HorizontalAlignment);
    if (!allowedHorizontalAlignments.includes(header.textAlign))
      throw new TypeError(messages.error.INVALID_RESPONSIVE_TABLE_HEADER_DATA_ROW_TEXT_ALIGN);
  }

  /**
   * Validates the uniqueness of the keys of a responsive table header data.
   *
   * @static
   * @private
   * @param {object[]} headerData - The header data of the table.
   * @throws {Error} If a header data item has a duplicate key.
   */
  static #validateHeaderDataUniqueness(headerData) {
    const keys = new Set();
    headerData.forEach((header) => {
      if (keys.has(header.key)) {
        throw new Error(messages.error.DUPLICATE_HEADER_DATA_ROW_KEY);
      }
      keys.add(header.key);
    });
  }
}
