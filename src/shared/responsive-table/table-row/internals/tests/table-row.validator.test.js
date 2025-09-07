import { doesNotReject, rejects } from 'node:assert';
import { describe, it } from 'node:test';

import { HorizontalAlignment } from '../../../../enums.js';
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

  describe('validateCellsOptions', () => {
    function generateCells() {
      return [
        {
          width: 5,
          buffer: TestUtils.generateRandomString({ minLength: 5 }),
          textAlign: HorizontalAlignment.LEFT,
        },
        {
          width: 10,
          buffer: TestUtils.generateRandomString({ minLength: 10 }),
          textAlign: HorizontalAlignment.CENTER,
        },
        {
          width: 15,
          buffer: TestUtils.generateRandomString({ minLength: 15 }),
          textAlign: HorizontalAlignment.RIGHT,
        },
      ];
    }

    it('should throw a TypeError if cells is not an array', async () => {
      const cells = TestUtils.generateRandomString();

      await rejects(
        async () => TableRowValidator.validateCellsOptions(cells),
        {
          name: 'TypeError',
          message: messages.error.INVALID_TABLE_ROW_CELLS_TYPE,
        },
      );
    });

    it('should throw a RangeError if cells array is empty', async () => {
      const cells = [];

      await rejects(
        async () => TableRowValidator.validateCellsOptions(cells),
        {
          name: 'RangeError',
          message: messages.error.REQUIRED_TABLE_DATA_ROWS_CELLS,
        },
      );
    });

    it('should throw a TypeError if buffer is not provided', async () => {
      const cells = generateCells();
      delete cells[0].buffer;

      await rejects(
        async () => TableRowValidator.validateCellsOptions(cells),
        {
          name: 'TypeError',
          message: messages.error.REQUIRED_TABLE_ROW_BUFFER,
        },
      );
    });

    it('should throw a TypeError if width is not provided', async () => {
      const cells = generateCells();
      delete cells[0].width;

      await rejects(
        async () => TableRowValidator.validateCellsOptions(cells),
        {
          name: 'TypeError',
          message: messages.error.REQUIRD_TABLE_ROW_WIDTH,
        },
      );
    });

    it('should throw a TypeError if width is not a number', async () => {
      const cells = generateCells();
      cells[0].width = TestUtils.generateRandomString();

      await rejects(
        async () => TableRowValidator.validateCellsOptions(cells),
        {
          name: 'TypeError',
          message: messages.error.INVALID_TABLE_ROW_WIDTH,
        },
      );
    });

    it('should throw a RangeError if width is negative', async () => {
      const cells = generateCells();
      cells[0].width = -1;

      await rejects(
        async () => TableRowValidator.validateCellsOptions(cells),
        {
          name: 'RangeError',
          message: messages.error.INVALID_TABLE_ROW_WIDTH_RANGE,
        },
      );
    });

    it('should throw a TypeError if textAlign is not a valid horizontal alignment', async () => {
      const cells = generateCells();
      cells[0].textAlign = TestUtils.generateRandomString();

      await rejects(
        async () => TableRowValidator.validateCellsOptions(cells),
        {
          name: 'TypeError',
          message: messages.error.INVALID_TABLE_ROW_TEXT_ALIGN,
        },
      );
    });

    it('should not throw any error if provided cells options are valid', async () => {
      const cells = generateCells();

      await doesNotReject(
        async () => TableRowValidator.validateCellsOptions(cells),
      );
    });
  });
});
