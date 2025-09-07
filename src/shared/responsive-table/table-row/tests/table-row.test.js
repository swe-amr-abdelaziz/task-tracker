import { equal, rejects } from 'node:assert';
import { after, beforeEach, describe, it, mock } from 'node:test';

import { ContentRow, SeparatorRow, TableRow } from '../table-row.js';
import { TableBorder, VerticalAlignment } from '../../../enums.js';
import { TableRowValidator } from '../internals/table-row.validator.js';
import { TestUtils } from '../../../test-utils.js';
import { Utils } from '../../../utils.js';
import { messages } from '../../../messages.js';

class TestTableRow extends TableRow {}

describe('TableRow', () => {
  describe('constructor', () => {
    it('should prevent object creation of TableRow abstract class', async () => {
      const errorMessage = messages.error.ABSTRACT_CLASS_OBJECT_CREATION.replace("{0}", "TableRow");

      await rejects(
        async () => new TableRow(),
        { message: errorMessage },
      );
    });

    it('should throw error if abstract method build() is called', async () => {
      const row = new TestTableRow();

      await rejects(
        async () => row.build(),
        { message: messages.error.ABSTRACT_METHOD_CALL },
      );
    });
  });
});

describe('SeparatorRow', () => {
  describe('constructor', () => {
    it('should validate cellsWidths', () => {
      const validateCellsWidthsFn = mock.method(
        TableRowValidator,
        'validateCellsWidths',
        () => {},
      );
      const cellsWidths = [];

      new SeparatorRow({ cellsWidths });

      equal(validateCellsWidthsFn.mock.callCount(), 1);
      equal(validateCellsWidthsFn.mock.calls[0].arguments[0], cellsWidths);

      validateCellsWidthsFn.mock.restore();
    });
  });

  describe('build', () => {
    it('should build the middle separator row to the console (all cases are tested in the builder class))', () => {
      const cellsWidths = [
        TestUtils.generateRandomInt(1, 5),
        TestUtils.generateRandomInt(1, 5),
      ];
      const padding = 1;
      const row = new SeparatorRow({
        cellsWidths,
        cellPaddingLeft: padding,
        cellPaddingRight: padding,
        yPosition: VerticalAlignment.CENTER,
      });
      const expectedRow = [
        TableBorder.CENTER_LEFT,
        TableBorder.HORIZONTAL.repeat(cellsWidths[0] + 2 * padding),
        TableBorder.CENTER_CENTER,
        TableBorder.HORIZONTAL.repeat(cellsWidths[1] + 2 * padding),
        TableBorder.CENTER_RIGHT,
      ].join('');

      const actual = row.build();

      equal(actual, expectedRow);
    });

    it('should set default options values if not provided', () => {
      const row = new SeparatorRow({ cellsWidths: [1] });

      row.build();
    });
  });
});

describe('ContentRow', () => {
  describe('constructor', () => {
    const validateCellsOptionsFn = mock.method(
      TableRowValidator,
      'validateCellsOptions',
      () => {},
    );

    beforeEach(() => {
      validateCellsOptionsFn.mock.resetCalls();
    });

    after(() => {
      validateCellsOptionsFn.mock.restore();
    });

    it('should validate cellsOptions', () => {
      const cells = [];

      new ContentRow({ cells });

      equal(validateCellsOptionsFn.mock.callCount(), 1);
      equal(validateCellsOptionsFn.mock.calls[0].arguments[0], cells);
    });
  });

  describe('build', () => {
    it('should build content row to the console (all cases are tested in the builder class)', () => {
      const cells = [
        { width: 5, buffer: TestUtils.generateRandomString({ minLength: 5 }) },
        { width: 10, buffer: TestUtils.generateRandomString({ minLength: 10 }) },
        { width: 15, buffer: TestUtils.generateRandomString({ minLength: 15 }) },
      ];
      const padding = 1;
      const row = new ContentRow({
        cells,
        cellPaddingLeft: padding,
        cellPaddingRight: padding,
        isHeader: false,
        isSmallViewPort: false,
      });
      const expected = [
        TableBorder.VERTICAL,
        cells[0].buffer,
        TableBorder.VERTICAL,
        cells[1].buffer,
        TableBorder.VERTICAL,
        cells[2].buffer,
        TableBorder.VERTICAL,
      ].join(' ');

      const actual = Utils.clearAnsiSequences(
        row.build()
      );
      equal(actual, expected);
    });
  });
});
