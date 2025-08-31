import { messages } from '../../../messages.js';

export class TableRowValidator {
  static validateCellsWidths(widths) {
    if (!Array.isArray(widths)) {
      throw new TypeError(messages.error.INVALID_TABLE_ROW_WIDTHS_TYPE);
    }
    if (widths.length === 0) {
      throw new RangeError(messages.error.REQUIRED_TABLE_DATA_ROWS_WIDTHS);
    }
  }

  static validateCellsBuffer(buffer, widths) {
    if (!Array.isArray(buffer)) {
      throw new TypeError(messages.error.INVALID_TABLE_ROW_BUFFER_TYPE);
    }
    if (buffer.length === 0) {
      throw new RangeError(messages.error.REQUIRED_TABLE_DATA_ROWS_BUFFER);
    }
    if (buffer.length !== widths.length) {
      throw new RangeError(messages.error.INVALID_TABLE_DATA_ROWS_BUFFER_LENGTH);
    }
  }
}
