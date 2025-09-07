import { ConsoleStringBuilder } from '../../../console-string.builder.js';

/**
 * Styler class for creating cell content with visual styles.
 * @class
 */
export class ContentCellStyler {
  #content
  #isHeader

  /**
   * @param {object} options - The options for the content cell styler.
   * @param {unknown} options.content - The content of the cell.
   * @param {boolean} options.isHeader - Whether the cell is a header cell.
   */
  constructor(options) {
    this.#content = options.content;
    this.#isHeader = options.isHeader;
  }

  /**
   * @returns {ConsoleStringBuilder} The string representation of the content cell.
   */
  build() {
    const builder = ConsoleStringBuilder.create();
    this.#setStyle(builder);
    return builder.text(this.#content.toString());
  }

  /**
   * Sets the style for the content of the cell based on its content type.
   *
   * @param {ConsoleStringBuilder} builder - The builder to set the style for.
   * @private
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
