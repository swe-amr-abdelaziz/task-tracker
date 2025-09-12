import { ConsoleStringBuilder } from '../../../console-string.builder.js';

/**
 * Styler class for creating cell content visual styles.
 *
 * @internal
 */
export class ContentCellStyler {
  /**
   * The content of the cell in any format.
   * @type {unknown}
   * @private
   */
  #content

  /**
   * Whether the cell is a header cell.
   * @type {boolean}
   * @private
   */
  #isHeader

  /**
   * Creates a new ContentCellStyler instance.
   *
   * @constructor
   * @param {object} options - The options for the content cell styler.
   * @param {unknown} options.content - The content of the cell.
   * @param {boolean} options.isHeader - Whether the cell is a header cell.
   */
  constructor(options) {
    this.#content = options.content;
    this.#isHeader = options.isHeader;
  }

  /**
   * Builds the {@Link ConsoleStringBuilder} instance with visual styles representing the content cell.
   *
   * @returns {ConsoleStringBuilder} The content of the cell.
   */
  build() {
    const builder = ConsoleStringBuilder.create();
    this.#setStyle(builder);
    return builder.text(this.#content.toString());
  }

  /**
   * Sets the style for the content of the cell based on its content type.
   *
   * @private
   * @param {ConsoleStringBuilder} builder - The builder instance to set the style for.
   */
  #setStyle(builder) {
    if (this.#isHeader) {
      builder.green().bold();
    } else if (typeof this.#content === 'number') {
      builder.magenta();
    } else {
      builder.white();
    }
  }
}
