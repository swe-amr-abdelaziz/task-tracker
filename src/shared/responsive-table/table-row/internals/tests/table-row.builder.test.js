import { doesNotMatch, equal, match } from 'node:assert';
import { describe, it } from 'node:test';

import { AnsiCodes, TableBorder, VerticalAlignment } from '../../../../enums.js';
import { ContentRowBuilder, SeparatorRowBuilder } from '../table-row.builder.js';
import { TestUtils } from '../../../../test-utils.js';
import { Utils } from '../../../../utils.js';

describe('SeparatorRowBuilder', () => {
  describe('build', () => {
    it('should return the top separator row', () => {
      const cellsWidths = [
        TestUtils.generateRandomInt(1, 5),
      ];
      const padding = 1;
      const builder = new SeparatorRowBuilder({
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

      const actualRow = builder.build();

      equal(actualRow, expectedRow);
    });

    it('should return the middle separator row', () => {
      const cellsWidths = [
        TestUtils.generateRandomInt(1, 5),
        TestUtils.generateRandomInt(1, 5),
      ];
      const padding = 1;
      const builder = new SeparatorRowBuilder({
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

      const actualRow = builder.build();

      equal(actualRow, expectedRow);
    });

    it('should return the bottom separator row', () => {
      const cellsWidths = [
        TestUtils.generateRandomInt(1, 5),
        TestUtils.generateRandomInt(1, 5),
        TestUtils.generateRandomInt(1, 5),
      ];
      const padding = 1;
      const builder = new SeparatorRowBuilder({
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

      const actualRow = builder.build();

      equal(actualRow, expectedRow);
    });
  });
});

describe('ContentRowBuilder', () => {
  describe('build', () => {
    it('should print content row to the console', () => {
      const cells = [
        { width: 5, buffer: TestUtils.generateRandomString({ minLength: 5 }) },
        { width: 10, buffer: TestUtils.generateRandomString({ minLength: 10 }) },
        { width: 15, buffer: TestUtils.generateRandomString({ minLength: 15 }) },
      ];
      const padding = 1;
      const row = new ContentRowBuilder({
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

      const actual = Utils.clearAnsiSequences(row.build());
      equal(actual, expected);
    });

    it('should wrap long content into multiple lines', () => {
      const width1 = 5;
      const width2 = 10;
      const width3 = 15;
      const cells = [
        { width: width1, buffer: TestUtils.generateRandomString({ minLength: width1 }) },
        { width: width2, buffer: TestUtils.generateRandomString({ minLength: width2 }) },
        { width: width3, buffer: TestUtils.generateRandomString({ minLength: 40 }) },
      ];
      const padding = 1;
      const row = new ContentRowBuilder({
        cells,
        cellPaddingLeft: padding,
        cellPaddingRight: padding,
        isHeader: false,
        isSmallViewPort: false,
      });
      const expectedRow1 = [
        TableBorder.VERTICAL,
        cells[0].buffer,
        TableBorder.VERTICAL,
        cells[1].buffer,
        TableBorder.VERTICAL,
        cells[2].buffer.slice(0, width3),
        TableBorder.VERTICAL,
      ].join(' ');
      const expectedRow2 = [
        TableBorder.VERTICAL,
        ' '.repeat(width1),
        TableBorder.VERTICAL,
        ' '.repeat(width2),
        TableBorder.VERTICAL,
        cells[2].buffer.slice(width3, width3 * 2),
        TableBorder.VERTICAL,
      ].join(' ');
      const expectedRow3 = [
        TableBorder.VERTICAL,
        ' '.repeat(width1),
        TableBorder.VERTICAL,
        ' '.repeat(width2),
        TableBorder.VERTICAL,
        cells[2].buffer.slice(width3 * 2) + ' '.repeat(width3 * 3 - 40),
        TableBorder.VERTICAL,
      ].join(' ');

      const actualRow1 = Utils.clearAnsiSequences(
        row.build()
      );
      const actualRow2 = Utils.clearAnsiSequences(
        row.build()
      );
      const actualRow3 = Utils.clearAnsiSequences(
        row.build()
      );
      equal(actualRow1, expectedRow1);
      equal(actualRow2, expectedRow2);
      equal(actualRow3, expectedRow3);
    });

    it('should include header cells in the content row if isHeader is true', () => {
      const cells = [
        { width: 5, buffer: TestUtils.generateRandomString({ minLength: 5 }) },
        { width: 10, buffer: TestUtils.generateRandomString({ minLength: 10 }) },
        { width: 15, buffer: TestUtils.generateRandomString({ minLength: 15 }) },
      ];
      const padding = 1;
      const row = new ContentRowBuilder({
        cells,
        cellPaddingLeft: padding,
        cellPaddingRight: padding,
        isHeader: true,
        isSmallViewPort: false,
      });

      const green = AnsiCodes.FG.GREEN.replace('[', '\\[');
      const [, actual1, actual2, actual3] = row.build().split(TableBorder.VERTICAL);
      match(actual1, new RegExp(green));
      match(actual2, new RegExp(green));
      match(actual3, new RegExp(green));
    });

    it('should include a header cell (first cell only) in the content row if isSmallViewPort is true', () => {
      const cells = [
        { width: 5, buffer: TestUtils.generateRandomString({ minLength: 5 }) },
        { width: 10, buffer: TestUtils.generateRandomString({ minLength: 10 }) },
        { width: 15, buffer: TestUtils.generateRandomString({ minLength: 15 }) },
      ];
      const padding = 1;
      const row = new ContentRowBuilder({
        cells,
        cellPaddingLeft: padding,
        cellPaddingRight: padding,
        isHeader: false,
        isSmallViewPort: true,
      });

      const green = AnsiCodes.FG.GREEN.replace('[', '\\[');
      const [, actual1, actual2, actual3] = row.build().split(TableBorder.VERTICAL);
      match(actual1, new RegExp(green));
      doesNotMatch(actual2, new RegExp(green));
      doesNotMatch(actual3, new RegExp(green));
    });
  });

  describe('hasBuffer', () => {
    it('should return true if buffer has any content left', () => {
      const cells = [
        { width: 5, buffer: '' },
        { width: 10, buffer: '' },
        { width: 15, buffer: TestUtils.generateRandomString({ minLength: 15 }) },
      ];
      const padding = 1;
      const row = new ContentRowBuilder({
        cells,
        cellPaddingLeft: padding,
        cellPaddingRight: padding,
        isHeader: false,
        isSmallViewPort: false,
      });

      equal(row.hasBuffer(), true);
    });

    it('should return false if buffer has no content left', () => {
      const cells = [
        { width: 5, buffer: '' },
        { width: 10, buffer: '' },
        { width: 15, buffer: '' },
      ];
      const padding = 1;
      const row = new ContentRowBuilder({
        cells,
        cellPaddingLeft: padding,
        cellPaddingRight: padding,
        isHeader: false,
        isSmallViewPort: false,
      });

      equal(row.hasBuffer(), false);
    });
  });
});
