import { equal } from 'node:assert';
import { describe, it } from 'node:test';

import { SeparatorRowBuilder } from '../table-row.builder.js';
import { TableBorder, VerticalAlignment } from '../../../../enums.js';
import { TestUtils } from '../../../../test-utils.js';

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
