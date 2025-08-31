import { doesNotReject, rejects } from 'node:assert';
import { describe, it } from 'node:test';

import { TableRowValidator } from '../table-row.validator.js';
import { TestUtils } from '../../../../test-utils.js';
import { messages } from '../../../../messages.js';

describe('TableRowValidator', () => {
  describe('validateCellsWidths', () => {
    it('should throw a TypeError if cellsWidths is not an array', async () => {
      const widths = TestUtils.generateRandomString();

      await rejects(
        async () => TableRowValidator.validateCellsWidths(widths),
        {
          name: 'TypeError',
          message: messages.error.INVALID_TABLE_ROW_WIDTHS_TYPE,
        },
      );
    });

    it('should throw a RangeError if cellsWidths is empty', async () => {
      const widths = [];

      await rejects(
        async () => TableRowValidator.validateCellsWidths(widths),
        {
          name: 'RangeError',
          message: messages.error.REQUIRED_TABLE_DATA_ROWS_WIDTHS,
        },
      );
    });

    it('should not throw any error if cellsWidths is not empty', async () => {
      const widths = [TestUtils.generateRandomInt(1, 10)];

      await doesNotReject(
        async () => TableRowValidator.validateCellsWidths(widths),
      );
    });
  });

  describe('validateCellsBuffer', () => {
    const widths = [TestUtils.generateRandomInt(), TestUtils.generateRandomInt()];

    it('should throw a TypeError if cellsBuffer is not an array', async () => {
      const buffer = TestUtils.generateRandomString();

      await rejects(
        async () => TableRowValidator.validateCellsBuffer(buffer, widths),
        {
          name: 'TypeError',
          message: messages.error.INVALID_TABLE_ROW_BUFFER_TYPE,
        },
      );
    });

    it('should throw a RangeError if cellsBuffer is empty', async () => {
      const buffer = [];

      await rejects(
        async () => TableRowValidator.validateCellsBuffer(buffer, widths),
        {
          name: 'RangeError',
          message: messages.error.REQUIRED_TABLE_DATA_ROWS_BUFFER,
        },
      );
    });

    it('should throw a RangeError if cellsBuffer length is less than cellsWidths length', async () => {
      const buffer = [TestUtils.generateRandomString()];

      await rejects(
        async () => TableRowValidator.validateCellsBuffer(buffer, widths),
        {
          name: 'RangeError',
          message: messages.error.INVALID_TABLE_DATA_ROWS_BUFFER_LENGTH,
        },
      );
    });

    it('should throw a RangeError if cellsBuffer length is greater than cellsWidths length', async () => {
      const buffer = [
        TestUtils.generateRandomString(),
        TestUtils.generateRandomString(),
        TestUtils.generateRandomString(),
      ];

      await rejects(
        async () => TableRowValidator.validateCellsBuffer(buffer, widths),
        {
          name: 'RangeError',
          message: messages.error.INVALID_TABLE_DATA_ROWS_BUFFER_LENGTH,
        },
      );
    });

    it('should not throw any error if cellsBuffer length is equal to cellsWidths length', async () => {
      const buffer = [
        TestUtils.generateRandomString(),
        TestUtils.generateRandomString(),
      ];

      await doesNotReject(
        async () => TableRowValidator.validateCellsBuffer(buffer, widths),
      );
    });
  });
});
