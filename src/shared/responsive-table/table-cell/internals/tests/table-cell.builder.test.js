import { doesNotMatch, equal, match } from 'node:assert';
import { describe, it } from 'node:test';

import { AnsiCodes, HorizontalAlignment, TableBorder, VerticalAlignment } from '../../../../enums.js';
import { ConsoleStringBuilder } from '../../../../console-string.builder.js';
import { ContentCellBuilder, SeparatorCellBuilder } from '../table-cell.builder.js';
import { TestUtils } from '../../../../test-utils.js';

describe('SeparatorCellBuilder', () => {
  describe('build', () => {
    let options = {
      width: 5,
      paddingLeft: 1,
      paddingRight: 1,
      xPosition: HorizontalAlignment.LEFT,
      yPosition: VerticalAlignment.TOP,
      singleColumn: false,
    };

    const cellWidth = options.width + options.paddingLeft + options.paddingRight;

    const equalCellSeparator = (cellStr, rightCorner) => {
      equal(
        cellStr.slice(0, -1),
        TableBorder.HORIZONTAL.repeat(cellWidth),
      );
      equal(
        cellStr[cellStr.length - 1],
        rightCorner,
      );
    }

    it('should return the top left separator', () => {
      options.yPosition = VerticalAlignment.TOP;
      options.xPosition = HorizontalAlignment.LEFT;
      const builder = new SeparatorCellBuilder(options);

      const [borderLeft, ...rest] = builder.build();

      equal(borderLeft, TableBorder.TOP_LEFT);
      equalCellSeparator(rest.join(''), TableBorder.TOP_CENTER);
    });

    it('should return the top center separator', () => {
      options.yPosition = VerticalAlignment.TOP;
      options.xPosition = HorizontalAlignment.CENTER;
      const builder = new SeparatorCellBuilder(options);

      const actual = builder.build();

      equalCellSeparator(actual, TableBorder.TOP_CENTER);
    });

    it('should return the top right separator', () => {
      options.yPosition = VerticalAlignment.TOP;
      options.xPosition = HorizontalAlignment.RIGHT;
      const builder = new SeparatorCellBuilder(options);

      const actual = builder.build();

      equalCellSeparator(actual, TableBorder.TOP_RIGHT);
    });

    it('should return the center left separator', () => {
      options.yPosition = VerticalAlignment.CENTER;
      options.xPosition = HorizontalAlignment.LEFT;
      const builder = new SeparatorCellBuilder(options);

      const [borderLeft, ...rest] = builder.build();

      equal(borderLeft, TableBorder.CENTER_LEFT);
      equalCellSeparator(rest.join(''), TableBorder.CENTER_CENTER);
    });

    it('should return the center center separator', () => {
      options.yPosition = VerticalAlignment.CENTER;
      options.xPosition = HorizontalAlignment.CENTER;
      const builder = new SeparatorCellBuilder(options);

      const actual = builder.build();

      equalCellSeparator(actual, TableBorder.CENTER_CENTER);
    });

    it('should return the center right separator', () => {
      options.yPosition = VerticalAlignment.CENTER;
      options.xPosition = HorizontalAlignment.RIGHT;
      const builder = new SeparatorCellBuilder(options);

      const actual = builder.build();

      equalCellSeparator(actual, TableBorder.CENTER_RIGHT);
    });

    it('should return the bottom left separator', () => {
      options.yPosition = VerticalAlignment.BOTTOM;
      options.xPosition = HorizontalAlignment.LEFT;
      const builder = new SeparatorCellBuilder(options);

      const [borderLeft, ...rest] = builder.build();

      equal(borderLeft, TableBorder.BOTTOM_LEFT);
      equalCellSeparator(rest.join(''), TableBorder.BOTTOM_CENTER);
    });

    it('should return the bottom center separator', () => {
      options.yPosition = VerticalAlignment.BOTTOM;
      options.xPosition = HorizontalAlignment.CENTER;
      const builder = new SeparatorCellBuilder(options);

      const actual = builder.build();

      equalCellSeparator(actual, TableBorder.BOTTOM_CENTER);
    });

    it('should return the bottom right separator', () => {
      options.yPosition = VerticalAlignment.BOTTOM;
      options.xPosition = HorizontalAlignment.RIGHT;
      const builder = new SeparatorCellBuilder(options);

      const actual = builder.build();

      equalCellSeparator(actual, TableBorder.BOTTOM_RIGHT);
    });

    it('should return the correct separator for a single column table', () => {
      options.yPosition = VerticalAlignment.BOTTOM;
      options.xPosition = HorizontalAlignment.LEFT;
      options.singleColumn = true;
      const builder = new SeparatorCellBuilder(options);

      const actual = builder.build();
      const leftCorner = actual[0];
      const rightCorner = actual[actual.length - 1];

      equal(leftCorner, TableBorder.BOTTOM_LEFT);
      equal(rightCorner, TableBorder.BOTTOM_RIGHT);
    });
  });
});

describe('ContentCellBuilder', () => {
  describe('build', () => {
    const width = TestUtils.generateRandomInt(1, 10);
    const text = TestUtils.generateRandomString({ minLength: width });

    let options = {
      width,
      content: ConsoleStringBuilder.create().text(text),
      paddingLeft: 1,
      paddingRight: 1,
      xPosition: HorizontalAlignment.LEFT,
      textAlign: HorizontalAlignment.LEFT,
      withStyle: false,
    };

    it('should return the left content cell', () => {
      options.xPosition = HorizontalAlignment.LEFT;

      const builder = new ContentCellBuilder(options);
      const actual = builder.build();
      const expected = `${TableBorder.VERTICAL} ${text} ${TableBorder.VERTICAL}`;

      equal(actual, expected);
    });

    it('should return the center content cell', () => {
      options.xPosition = HorizontalAlignment.CENTER;

      const builder = new ContentCellBuilder(options);
      const actual = builder.build();
      const expected = ` ${text} ${TableBorder.VERTICAL}`;

      equal(actual, expected);
    });

    it('should return the right content cell', () => {
      options.xPosition = HorizontalAlignment.RIGHT;

      const builder = new ContentCellBuilder(options);
      const actual = builder.build();
      const expected = ` ${text} ${TableBorder.VERTICAL}`;

      equal(actual, expected);
    });

    it('should return the content with style', () => {
      options.withStyle = true;

      const builder = new ContentCellBuilder(options);
      const actual = builder.build();

      const reset = AnsiCodes.RESET.replace('[', '\\[');
      match(actual, new RegExp(reset));
    });

    it('should return the content without style if withStyle is set to false', () => {
      options.withStyle = false;

      const builder = new ContentCellBuilder(options);
      const actual = builder.build();

      const reset = AnsiCodes.RESET.replace('[', '\\[');
      doesNotMatch(actual, new RegExp(reset));
    });

    function buildExpectedCellText(content, width, contentWidth, alignment) {
      const totalWhitespace = width - contentWidth;

      let leftWhitespace = 0;
      let rightWhitespace = 0;

      if (alignment === HorizontalAlignment.LEFT) {
        rightWhitespace = totalWhitespace;
      } else if (alignment === HorizontalAlignment.RIGHT) {
        leftWhitespace = totalWhitespace;
      } else if (alignment === HorizontalAlignment.CENTER) {
        leftWhitespace = Math.floor(totalWhitespace / 2);
        rightWhitespace = totalWhitespace - leftWhitespace;
      }

      const inner = ' '.repeat(leftWhitespace) + content.plainText + ' '.repeat(rightWhitespace);

      return TableBorder.VERTICAL + ' ' + inner + ' ' + TableBorder.VERTICAL;
    }

    it('should return the content with whitespace - left aligned', () => {
      options.xPosition = HorizontalAlignment.LEFT;
      options.textAlign = HorizontalAlignment.LEFT;
      options.width = TestUtils.generateRandomInt(10, 20);
      const contentWidth = Math.floor(options.width / 2);
      const text = TestUtils.generateRandomString({
        minLength: contentWidth,
      });
      options.content = ConsoleStringBuilder.create().text(text);
      const builder = new ContentCellBuilder(options);

      const actual = builder.build();
      const expected = buildExpectedCellText(options.content, options.width, contentWidth, options.textAlign);

      equal(actual, expected);
    });

    it('should return the content with whitespace - right aligned', () => {
      options.xPosition = HorizontalAlignment.LEFT;
      options.textAlign = HorizontalAlignment.RIGHT;
      options.width = TestUtils.generateRandomInt(10, 20);
      const contentWidth = Math.floor(options.width / 2);
      const text = TestUtils.generateRandomString({
        minLength: contentWidth,
      });
      options.content = ConsoleStringBuilder.create().text(text);
      const builder = new ContentCellBuilder(options);

      const actual = builder.build();
      const expected = buildExpectedCellText(options.content, options.width, contentWidth, options.textAlign);

      equal(actual, expected);
    });

    it('should return the content with whitespace - center aligned - even amount of whitespace', () => {
      options.xPosition = HorizontalAlignment.LEFT;
      options.textAlign = HorizontalAlignment.CENTER;
      options.width = 20;
      const contentWidth = 10;
      const text = TestUtils.generateRandomString({
        minLength: contentWidth,
      });
      options.content = ConsoleStringBuilder.create().text(text);
      const builder = new ContentCellBuilder(options);

      const actual = builder.build();
      const expected = buildExpectedCellText(options.content, options.width, contentWidth, options.textAlign);

      equal(actual, expected);
    });

    it('should return the content with whitespace - center aligned - odd amount of whitespace', () => {
      options.xPosition = HorizontalAlignment.LEFT;
      options.textAlign = HorizontalAlignment.CENTER;
      options.width = 19;
      const contentWidth = 10;
      const text = TestUtils.generateRandomString({
        minLength: contentWidth,
      });
      options.content = ConsoleStringBuilder.create().text(text);
      const builder = new ContentCellBuilder(options);

      const actual = builder.build();
      const expected = buildExpectedCellText(options.content, options.width, contentWidth, options.textAlign);

      equal(actual, expected);
    });
  });
});
