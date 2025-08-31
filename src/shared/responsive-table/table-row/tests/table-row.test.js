import { equal, rejects } from 'node:assert';
import { after, afterEach, beforeEach, describe, it, mock } from 'node:test';

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

    it('should throw error if abstract method print() is called', async () => {
      const row = new TestTableRow();

      await rejects(
        async () => row.print(),
        { message: messages.error.ABSTRACT_METHOD_CALL },
      );
    });
  });
});

const consoleLogFn = mock.method(console, 'log', () => {});

describe('SeparatorRow', () => {
  afterEach(() => {
    consoleLogFn.mock.resetCalls();
  });

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

  describe('print', () => {
    it('should print the top separator row to the console', () => {
      const cellsWidths = [
        TestUtils.generateRandomInt(1, 5),
      ];
      const padding = 1;
      const row = new SeparatorRow({
        cellsWidths,
        cellPaddingLeft: padding,
        cellPaddingRight: padding,
        yPosition: VerticalAlignment.TOP,
      });
      const expectedRow = [
        TableBorder.TOP_LEFT,
        TableBorder.HORIZONTAL.repeat(cellsWidths[0] + 2 * padding),
        TableBorder.TOP_RIGHT,
      ].join('');

      row.print();

      equal(consoleLogFn.mock.callCount(), 1);
      equal(consoleLogFn.mock.calls[0].arguments[0], expectedRow);
    });

    it('should print the middle separator row to the console', () => {
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

      row.print();

      equal(consoleLogFn.mock.callCount(), 1);
      equal(consoleLogFn.mock.calls[0].arguments[0], expectedRow);
    });

    it('should print the bottom separator row to the console', () => {
      const cellsWidths = [
        TestUtils.generateRandomInt(1, 5),
        TestUtils.generateRandomInt(1, 5),
        TestUtils.generateRandomInt(1, 5),
      ];
      const padding = 1;
      const row = new SeparatorRow({
        cellsWidths,
        cellPaddingLeft: padding,
        cellPaddingRight: padding,
        yPosition: VerticalAlignment.BOTTOM,
      });
      const expectedRow = [
        TableBorder.BOTTOM_LEFT,
        TableBorder.HORIZONTAL.repeat(cellsWidths[0] + 2 * padding),
        TableBorder.BOTTOM_CENTER,
        TableBorder.HORIZONTAL.repeat(cellsWidths[1] + 2 * padding),
        TableBorder.BOTTOM_CENTER,
        TableBorder.HORIZONTAL.repeat(cellsWidths[2] + 2 * padding),
        TableBorder.BOTTOM_RIGHT,
      ].join('');

      row.print();

      equal(consoleLogFn.mock.callCount(), 1);
      equal(consoleLogFn.mock.calls[0].arguments[0], expectedRow);
    });

    it('should set default options values if not provided', () => {
      const row = new SeparatorRow({ cellsWidths: [1] });

      row.print();

      equal(consoleLogFn.mock.callCount(), 1);
    });
  });
});

describe('ContentRow', () => {
  afterEach(() => {
    consoleLogFn.mock.resetCalls();
  });

  after(() => {
    consoleLogFn.mock.restore();
  });

  describe('constructor', () => {
    const validateCellsWidthsFn = mock.method(
      TableRowValidator,
      'validateCellsWidths',
      () => {},
    );
    const validateCellsBufferFn = mock.method(
      TableRowValidator,
      'validateCellsBuffer',
      () => {},
    );

    beforeEach(() => {
      validateCellsWidthsFn.mock.resetCalls();
      validateCellsBufferFn.mock.resetCalls();
    });

    after(() => {
      validateCellsWidthsFn.mock.restore();
      validateCellsBufferFn.mock.restore();
    });

    it('should validate cellsWidths', () => {
      const widths = [];

      new ContentRow({ widths });

      equal(validateCellsWidthsFn.mock.callCount(), 1);
      equal(validateCellsWidthsFn.mock.calls[0].arguments[0], widths);
    });

    it('should validate cellsBuffer', () => {
      const widths = [];
      const buffer = [];

      new ContentRow({ widths, buffer });

      equal(validateCellsBufferFn.mock.callCount(), 1);
      equal(validateCellsBufferFn.mock.calls[0].arguments[0], buffer);
      equal(validateCellsBufferFn.mock.calls[0].arguments[1], widths);
    });
  });

  describe('print', () => {
    beforeEach(() => {
      consoleLogFn.mock.resetCalls();
    });

    after(() => {
      consoleLogFn.mock.restore();
    });

    it('should print content row to the console', () => {
      const widths = [5, 10, 15];
      const buffer = [
        TestUtils.generateRandomString({ minLength: 5 }),
        TestUtils.generateRandomString({ minLength: 10 }),
        TestUtils.generateRandomString({ minLength: 15 }),
      ];
      const padding = 1;
      const row = new ContentRow({
        widths,
        buffer,
        cellPaddingLeft: padding,
        cellPaddingRight: padding,
        isHeader: false,
      });
      const expected = [
        TableBorder.VERTICAL,
        buffer[0],
        TableBorder.VERTICAL,
        buffer[1],
        TableBorder.VERTICAL,
        buffer[2],
        TableBorder.VERTICAL,
      ].join(' ');

      row.print();

      const actual = Utils.clearAnsiSequences(
        consoleLogFn.mock.calls[0].arguments[0]
      );
      equal(consoleLogFn.mock.callCount(), 1);
      equal(actual, expected);
    });

    it('should wrap long content into multiple lines', () => {
      const width1 = 5;
      const width2 = 10;
      const width3 = 15;
      const widths = [width1, width2, width3];
      const buffer = [
        TestUtils.generateRandomString({ minLength: width1 }),
        TestUtils.generateRandomString({ minLength: width2 }),
        TestUtils.generateRandomString({ minLength: 40 }),
      ];
      const padding = 1;
      const row = new ContentRow({
        widths,
        buffer,
        cellPaddingLeft: padding,
        cellPaddingRight: padding,
        isHeader: false,
      });
      const expectedRow1 = [
        TableBorder.VERTICAL,
        buffer[0],
        TableBorder.VERTICAL,
        buffer[1],
        TableBorder.VERTICAL,
        buffer[2].slice(0, width3),
        TableBorder.VERTICAL,
      ].join(' ');
      const expectedRow2 = [
        TableBorder.VERTICAL,
        ' '.repeat(width1),
        TableBorder.VERTICAL,
        ' '.repeat(width2),
        TableBorder.VERTICAL,
        buffer[2].slice(width3, width3 * 2),
        TableBorder.VERTICAL,
      ].join(' ');
      const expectedRow3 = [
        TableBorder.VERTICAL,
        ' '.repeat(width1),
        TableBorder.VERTICAL,
        ' '.repeat(width2),
        TableBorder.VERTICAL,
        buffer[2].slice(width3 * 2) + ' '.repeat(width3 * 3 - 40),
        TableBorder.VERTICAL,
      ].join(' ');

      row.print();

      const actualRow1 = Utils.clearAnsiSequences(
        consoleLogFn.mock.calls[0].arguments[0]
      );
      const actualRow2 = Utils.clearAnsiSequences(
        consoleLogFn.mock.calls[1].arguments[0]
      );
      const actualRow3 = Utils.clearAnsiSequences(
        consoleLogFn.mock.calls[2].arguments[0]
      );
      equal(consoleLogFn.mock.callCount(), 3);
      equal(actualRow1, expectedRow1);
      equal(actualRow2, expectedRow2);
      equal(actualRow3, expectedRow3);
    });
  });
});
