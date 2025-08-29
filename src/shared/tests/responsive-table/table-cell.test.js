import {
  doesNotMatch,
  equal,
  match,
  notEqual,
  ok,
  rejects,
  strictEqual,
} from 'node:assert';
import { describe, it } from 'node:test';

import { AnsiCodes, HorizontalAlignment, TableBorder, VerticalAlignment } from '../../enums.js';
import { ConsoleStringBuilder } from '../../console-string.builder.js';
import { ContentCell, SeparatorCell, TableCell } from '../../responsive-table/table-cell.js';
import { TestUtils } from '../../test-utils.js';
import { messages } from '../../../shared/messages.js';

class TestTableCell extends TableCell {
  constructor(options) {
    super(options);
  }
}

describe('TableCell', () => {
  describe('constructor', () => {
    it('should prevent object creation of TableCell abstract class', async () => {
      const errorMessage = messages.error.ABSTRACT_CLASS_OBJECT_CREATION.replace("{0}", "TableCell");

      await rejects(
        async () => new TableCell(),
        { message: errorMessage },
      );
    });
  });

  describe('width', () => {
    it('should return the width of the cell', () => {
      const options = { width: TestUtils.generateRandomInt() };

      const cell = new TestTableCell(options);

      equal(cell.width, options.width);
    });

    it('should set the width of the cell', () => {
      const options = { width: TestUtils.generateRandomInt() };
      const newWidth = TestUtils.generateRandomInt();
      const cell = new TestTableCell(options);

      cell.width = newWidth;

      equal(cell.width, newWidth);
    });

    it('should set the default width of the cell to 0 if not provided', () => {
      const defaultWidth = 0;

      const cell = new TestTableCell();

      equal(cell.width, defaultWidth);
    });

    it('should throw an error if the width is not a number', async () => {
      const options = { width: TestUtils.generateRandomString() };

      await rejects(
        async () => new TestTableCell(options),
        { message: messages.error.INVALID_TABLE_CELL_WIDTH },
      );
    })

    it('should throw an error if the width is negative', async () => {
      const options = { width: -1 };

      await rejects(
        async () => new TestTableCell(options),
        { message: messages.error.NEGATIVE_TABLE_CELL_WIDTH },
      );
    });
  });

  describe('paddingLeft', () => {
    it('should return the left padding of the cell', () => {
      const options = { paddingLeft: TestUtils.generateRandomInt() };

      const cell = new TestTableCell(options);

      equal(cell.paddingLeft, options.paddingLeft);
    });

    it('should set the left padding of the cell', () => {
      const options = { paddingLeft: TestUtils.generateRandomInt() };
      const newPaddingLeft = TestUtils.generateRandomInt();
      const cell = new TestTableCell(options);

      cell.paddingLeft = newPaddingLeft;

      equal(cell.paddingLeft, newPaddingLeft);
    });

    it('should set the default left padding of the cell to 0 if not provided', () => {
      const defaultPaddingLeft = 0;

      const cell = new TestTableCell();

      equal(cell.paddingLeft, defaultPaddingLeft);
    });

    it('should throw an error if the left padding is not a number', async () => {
      const options = { paddingLeft: TestUtils.generateRandomString() };

      await rejects(
        async () => new TestTableCell(options),
        { message: messages.error.INVALID_TABLE_CELL_PADDING_LEFT },
      );
    })

    it('should throw an error if the left padding is negative', async () => {
      const options = { paddingLeft: -1 };

      await rejects(
        async () => new TestTableCell(options),
        { message: messages.error.NEGATIVE_TABLE_CELL_PADDING_LEFT },
      );
    });
  });

  describe('paddingRight', () => {
    it('should return the right padding of the cell', () => {
      const options = { paddingRight: TestUtils.generateRandomInt() };

      const cell = new TestTableCell(options);

      equal(cell.paddingRight, options.paddingRight);
    });

    it('should set the right padding of the cell', () => {
      const options = { paddingRight: TestUtils.generateRandomInt() };
      const newPaddingRight = TestUtils.generateRandomInt();
      const cell = new TestTableCell(options);

      cell.paddingRight = newPaddingRight;

      equal(cell.paddingRight, newPaddingRight);
    });

    it('should set the default right padding of the cell to 0 if not provided', () => {
      const defaultPaddingRight = 0;

      const cell = new TestTableCell();

      equal(cell.paddingRight, defaultPaddingRight);
    });

    it('should throw an error if the right padding is not a number', async () => {
      const options = { paddingRight: TestUtils.generateRandomString() };

      await rejects(
        async () => new TestTableCell(options),
        { message: messages.error.INVALID_TABLE_CELL_PADDING_RIGHT },
      );
    })

    it('should throw an error if the right padding is negative', async () => {
      const options = { paddingRight: -1 };

      await rejects(
        async () => new TestTableCell(options),
        { message: messages.error.NEGATIVE_TABLE_CELL_PADDING_RIGHT },
      );
    });
  });

  describe('xPosition', () => {
    it('should return xPosition of the cell', () => {
      const options = { xPosition: HorizontalAlignment.CENTER };

      const cell = new TestTableCell(options);

      equal(cell.xPosition, options.xPosition);
    });

    it('should set xPosition of the cell', () => {
      const options = { xPosition: HorizontalAlignment.CENTER };
      const newXPosition = HorizontalAlignment.RIGHT;
      const cell = new TestTableCell(options);

      cell.xPosition = newXPosition;

      equal(cell.xPosition, newXPosition);
    });

    it('should set the default xPosition of the cell to Position.CENTER if not provided', () => {
      const defaultXPosition = HorizontalAlignment.CENTER;

      const cell = new TestTableCell();

      equal(cell.xPosition, defaultXPosition);
    });

    it('should throw an error if the xPosition is not a valid horizontal position', async () => {
      const options = { xPosition: VerticalAlignment.TOP };

      await rejects(
        async () => new TestTableCell(options),
        { message: messages.error.INVALID_TABLE_CELL_X_POSITION },
      );
    });
  });

  describe('singleColumn', () => {
    it('should return singleColumn of the cell', () => {
      const options = { singleColumn: true };

      const cell = new TestTableCell(options);

      equal(cell.singleColumn, options.singleColumn);
    });

    it('should set singleColumn of the cell', () => {
      const options = { singleColumn: true };
      const newSingleColumn = false;
      const cell = new TestTableCell(options);

      cell.singleColumn = newSingleColumn;

      notEqual(cell.singleColumn, options.singleColumn);
      equal(cell.singleColumn, newSingleColumn);
    });

    it('should set the default singleColumn of the cell to false if not provided', () => {
      const defaultSingleColumn = false;

      const cell = new TestTableCell();

      equal(cell.singleColumn, defaultSingleColumn);
    });

    it('should throw an error if singleColumn value is not a boolean', async () => {
      const options = { singleColumn: TestUtils.generateRandomString() };

      await rejects(
        async () => new TestTableCell(options),
        { message: messages.error.INVALID_TABLE_CELL_SINGLE_COLUMN },
      );
    });
  });

  describe('clone', () => {
    it('should clone the TableCell instance', () => {
      const options = {
        width: TestUtils.generateRandomInt(),
        paddingLeft: TestUtils.generateRandomInt(),
        paddingRight: TestUtils.generateRandomInt(),
        xPosition: HorizontalAlignment.CENTER,
      };
      const cell = new TestTableCell(options);

      const clone = cell.clone();

      equal(clone.width, cell.width);
      equal(clone.paddingLeft, cell.paddingLeft);
      equal(clone.paddingRight, cell.paddingRight);
      equal(clone.xPosition, cell.xPosition);
    });
  });
});

describe('SeparatorCell', () => {
  describe('constructor', () => {
    it('should pass options to the super constructor', () => {
      const options = { width: TestUtils.generateRandomInt() };

      const cell = new SeparatorCell(options);

      equal(cell.width, options.width);
    });
  });

  describe('yPosition', () => {
    it('should return yPosition of the cell', () => {
      const options = { yPosition: VerticalAlignment.CENTER };

      const cell = new SeparatorCell(options);

      equal(cell.yPosition, options.yPosition);
    });

    it('should set yPosition of the cell', () => {
      const options = { yPosition: VerticalAlignment.CENTER };
      const newYPosition = VerticalAlignment.BOTTOM;
      const cell = new SeparatorCell(options);

      cell.yPosition = newYPosition;

      notEqual(cell.yPosition, options.yPosition);
      equal(cell.yPosition, newYPosition);
    });

    it('should set the default yPosition of the cell to Position.CENTER if not provided', () => {
      const defaultYPosition = VerticalAlignment.CENTER;

      const cell = new SeparatorCell();

      equal(cell.yPosition, defaultYPosition);
    });

    it('should throw an error if the yPosition is not a valid vertical position', async () => {
      const options = { yPosition: HorizontalAlignment.LEFT };

      await rejects(
        async () => new SeparatorCell(options),
        { message: messages.error.INVALID_TABLE_CELL_Y_POSITION },
      );
    });
  });

  describe('toString', () => {
    let options = {
      width: 5,
      paddingLeft: 1,
      paddingRight: 1,
      xPosition: HorizontalAlignment.LEFT,
      yPosition: VerticalAlignment.TOP,
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

      const cell = new SeparatorCell(options);

      equal(cell.toString()[0], TableBorder.TOP_LEFT);
      equalCellSeparator(cell.toString().slice(1), TableBorder.TOP_CENTER);
    });

    it('should return the top center separator', () => {
      options.yPosition = VerticalAlignment.TOP;
      options.xPosition = HorizontalAlignment.CENTER;

      const cell = new SeparatorCell(options);

      equalCellSeparator(cell.toString(), TableBorder.TOP_CENTER);
    });

    it('should return the top right separator', () => {
      options.yPosition = VerticalAlignment.TOP;
      options.xPosition = HorizontalAlignment.RIGHT;

      const cell = new SeparatorCell(options);

      equalCellSeparator(cell.toString(), TableBorder.TOP_RIGHT);
    });

    it('should return the center left separator', () => {
      options.yPosition = VerticalAlignment.CENTER;
      options.xPosition = HorizontalAlignment.LEFT;

      const cell = new SeparatorCell(options);

      equal(cell.toString()[0], TableBorder.CENTER_LEFT);
      equalCellSeparator(cell.toString().slice(1), TableBorder.CENTER_CENTER);
    });

    it('should return the center center separator', () => {
      options.yPosition = VerticalAlignment.CENTER;
      options.xPosition = HorizontalAlignment.CENTER;

      const cell = new SeparatorCell(options);

      equalCellSeparator(cell.toString(), TableBorder.CENTER_CENTER);
    });

    it('should return the center right separator', () => {
      options.yPosition = VerticalAlignment.CENTER;
      options.xPosition = HorizontalAlignment.RIGHT;

      const cell = new SeparatorCell(options);

      equalCellSeparator(cell.toString(), TableBorder.CENTER_RIGHT);
    });

    it('should return the bottom left separator', () => {
      options.yPosition = VerticalAlignment.BOTTOM;
      options.xPosition = HorizontalAlignment.LEFT;

      const cell = new SeparatorCell(options);

      equal(cell.toString()[0], TableBorder.BOTTOM_LEFT);
      equalCellSeparator(cell.toString().slice(1), TableBorder.BOTTOM_CENTER);
    });

    it('should return the bottom center separator', () => {
      options.yPosition = VerticalAlignment.BOTTOM;
      options.xPosition = HorizontalAlignment.CENTER;

      const cell = new SeparatorCell(options);

      equalCellSeparator(cell.toString(), TableBorder.BOTTOM_CENTER);
    });

    it('should return the bottom right separator', () => {
      options.yPosition = VerticalAlignment.BOTTOM;
      options.xPosition = HorizontalAlignment.RIGHT;

      const cell = new SeparatorCell(options);

      equalCellSeparator(cell.toString(), TableBorder.BOTTOM_RIGHT);
    });

    it('should return the correct separator for a single column table', () => {
      options.yPosition = VerticalAlignment.BOTTOM;
      options.xPosition = HorizontalAlignment.LEFT;
      options.singleColumn = true;

      const cell = new SeparatorCell(options);
      const leftCorner = cell.toString()[0];
      const rightCorner = cell.toString()[cell.toString().length - 1];

      equal(leftCorner, TableBorder.BOTTOM_LEFT);
      equal(rightCorner, TableBorder.BOTTOM_RIGHT);
    });
  });

  describe('clone', () => {
    it('should clone the SeparatorCell instance', () => {
      const options = {
        width: TestUtils.generateRandomInt(),
        paddingLeft: TestUtils.generateRandomInt(),
        paddingRight: TestUtils.generateRandomInt(),
        xPosition: HorizontalAlignment.CENTER,
        yPosition: VerticalAlignment.CENTER,
      };
      const cell = new SeparatorCell(options);

      const clone = cell.clone();

      equal(clone.width, cell.width);
      equal(clone.paddingLeft, cell.paddingLeft);
      equal(clone.paddingRight, cell.paddingRight);
      equal(clone.xPosition, cell.xPosition);
      equal(clone.yPosition, cell.yPosition);
    });
  });
});

describe('ContentCell', () => {
  describe('constructor', () => {
    it('should pass options to the super constructor', () => {
      const options = { width: TestUtils.generateRandomInt() };

      const cell = new ContentCell(options);

      equal(cell.width, options.width);
    });
  });

  describe('content', () => {
    it('should return the content of the cell', () => {
      const width = TestUtils.generateRandomInt(1, 10);
      const content = TestUtils.generateRandomString({ minLength: width });
      const options = { content, width };

      const cell = new ContentCell(options);

      strictEqual(cell.content.plainText, content);
    });

    it('should set the content of the cell', () => {
      const width = TestUtils.generateRandomInt(1, 10);
      const content = TestUtils.generateRandomString({ minLength: width });
      const options = { content, width };
      const newContent = TestUtils.generateRandomString({ minLength: width });
      const cell = new ContentCell(options);

      cell.content = newContent;

      notEqual(cell.content.plainText, options.content);
      equal(cell.content.plainText, newContent);
    });

    it('should set a default content of the cell to an empty string if not provided', () => {
      const cell = new ContentCell();

      ok(cell.content instanceof ConsoleStringBuilder);
      equal(cell.content.plainText, '');
    });

    it('should set the style to green color and bold if the cell is a header cell', () => {
      const width = TestUtils.generateRandomInt(1, 10);
      const content = TestUtils.generateRandomString({ minLength: width });
      const options = {
        width,
        content,
        isHeader: true,
      };

      const cell = new ContentCell(options);
      const expected = cell.content.build();

      const green = AnsiCodes.FG.GREEN.replace('[', '\\[');
      const bold = AnsiCodes.BOLD.replace('[', '\\[');
      match(expected, new RegExp(green));
      match(expected, new RegExp(bold));
    });

    it('should set the style to magenta color if the cell content is of type number', () => {
      const width = TestUtils.generateRandomInt(1, 10);
      const content = TestUtils.generateRandomInt(1, 9);
      const options = {
        width,
        content,
      };

      const cell = new ContentCell(options);
      const expected = cell.content.build();

      const magenta = AnsiCodes.FG.MAGENTA.replace('[', '\\[');
      match(expected, new RegExp(magenta));
    });

    it('should set the style to yellow color by default', () => {
      const width = TestUtils.generateRandomInt(1, 10);
      const content = TestUtils.generateRandomString({ minLength: width });
      const options = {
        width,
        content,
      };

      const cell = new ContentCell(options);
      const expected = cell.content.build();

      const yellow = AnsiCodes.FG.YELLOW.replace('[', '\\[');
      match(expected, new RegExp(yellow));
    });

    it('should throw an error if the content length is greater than the cell width', async () => {
      const width = TestUtils.generateRandomInt(1, 10);
      const content = TestUtils.generateRandomString({ minLength: width + 1 });
      const options = {
        width,
        content,
      };

      await rejects(
        async () => new ContentCell(options),
        { message: messages.error.CELL_CONTENT_EXCEEDS_CELL_WIDTH },
      );
    });
  });

  describe('textAlign', () => {
    it('should return the textAlign of the cell', () => {
      const options = { textAlign: HorizontalAlignment.CENTER };

      const cell = new ContentCell(options);

      equal(cell.textAlign, options.textAlign);
    });

    it('should set the textAlign of the cell', () => {
      const options = { textAlign: HorizontalAlignment.CENTER };
      const newTextAlign = HorizontalAlignment.RIGHT;
      const cell = new ContentCell(options);

      cell.textAlign = newTextAlign;

      notEqual(cell.textAlign, options.textAlign);
      equal(cell.textAlign, newTextAlign);
    });

    it('should set the default textAlign of the cell to HorizontalAlignment.LEFT if not provided', () => {
      const defaultTextAlign = HorizontalAlignment.LEFT;

      const cell = new ContentCell();

      equal(cell.textAlign, defaultTextAlign);
    });

    it('should throw an error if the textAlign is not a valid horizontal position', async () => {
      const options = { textAlign: VerticalAlignment.TOP };

      await rejects(
        async () => new ContentCell(options),
        { message: messages.error.INVALID_TABLE_CELL_TEXT_ALIGN },
      );
    });
  });

  describe('toString', () => {
    const width = TestUtils.generateRandomInt(1, 10);
    const text = TestUtils.generateRandomString({ minLength: width });

    let options = {
      width,
      paddingLeft: 1,
      paddingRight: 1,
      xPosition: HorizontalAlignment.LEFT,
      content: text,
      textAlign: HorizontalAlignment.LEFT,
      isHeader: false,
      singleColumn: false,
    };

    it('should return the left content cell', () => {
      options.xPosition = HorizontalAlignment.LEFT;
      const cell = new ContentCell(options);
      const expected = `${TableBorder.VERTICAL} ${text} ${TableBorder.VERTICAL}`;

      const actual = cell.toString(false);

      equal(actual, expected);
    });

    it('should return the center content cell', () => {
      options.xPosition = HorizontalAlignment.CENTER;
      const cell = new ContentCell(options);
      const expected = ` ${text} ${TableBorder.VERTICAL}`;

      const actual = cell.toString(false);

      equal(actual, expected);
    });

    it('should return the right content cell', () => {
      options.xPosition = HorizontalAlignment.RIGHT;
      const cell = new ContentCell(options);
      const expected = ` ${text} ${TableBorder.VERTICAL}`;

      const actual = cell.toString(false);

      equal(actual, expected);
    });

    it('should return the content with style by default', () => {
      const cell = new ContentCell(options);

      const actual = cell.toString();

      const yellow = AnsiCodes.FG.YELLOW.replace('[', '\\[');
      match(actual, new RegExp(yellow));
    });

    it('should return the content without style if withStyle is set to false', () => {
      const cell = new ContentCell(options);

      const actual = cell.toString(false);

      const yellow = AnsiCodes.FG.YELLOW.replace('[', '\\[');
      doesNotMatch(actual, new RegExp(yellow));
    });

    function buildExpectedCellText(cell, width, contentWidth, alignment) {
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

      const inner = ' '.repeat(leftWhitespace) + cell.content.plainText + ' '.repeat(rightWhitespace);

      return TableBorder.VERTICAL + ' ' + inner + ' ' + TableBorder.VERTICAL;
    }

    it('should return the content with whitespace - left aligned', () => {
      options.xPosition = HorizontalAlignment.LEFT;
      options.textAlign = HorizontalAlignment.LEFT;
      options.width = TestUtils.generateRandomInt(10, 20);
      const contentWidth = Math.floor(options.width / 2);
      options.content = TestUtils.generateRandomString({
        minLength: contentWidth,
      });
      const cell = new ContentCell(options);

      const actual = cell.toString(false);
      const expected = buildExpectedCellText(cell, options.width, contentWidth, options.textAlign);

      equal(actual, expected);
    });

    it('should return the content with whitespace - right aligned', () => {
      options.xPosition = HorizontalAlignment.LEFT;
      options.textAlign = HorizontalAlignment.RIGHT;
      options.width = TestUtils.generateRandomInt(10, 20);
      const contentWidth = Math.floor(options.width / 2);
      options.content = TestUtils.generateRandomString({
        minLength: contentWidth,
      });
      const cell = new ContentCell(options);

      const actual = cell.toString(false);
      const expected = buildExpectedCellText(cell, options.width, contentWidth, options.textAlign);

      equal(actual, expected);
    });

    it('should return the content with whitespace - center aligned - even amount of whitespace', () => {
      options.xPosition = HorizontalAlignment.LEFT;
      options.textAlign = HorizontalAlignment.CENTER;
      options.width = 20;
      const contentWidth = 10;
      options.content = TestUtils.generateRandomString({
        minLength: contentWidth,
      });
      const cell = new ContentCell(options);

      const actual = cell.toString(false);
      const expected = buildExpectedCellText(cell, options.width, contentWidth, options.textAlign);

      equal(actual, expected);
    });

    it('should return the content with whitespace - center aligned - odd amount of whitespace', () => {
      options.xPosition = HorizontalAlignment.LEFT;
      options.textAlign = HorizontalAlignment.CENTER;
      options.width = 19;
      const contentWidth = 10;
      options.content = TestUtils.generateRandomString({
        minLength: contentWidth,
      });
      const cell = new ContentCell(options);

      const actual = cell.toString(false);
      const expected = buildExpectedCellText(cell, options.width, contentWidth, options.textAlign);

      equal(actual, expected);
    });

    it('should return the correct content for a single column table', () => {
      options.xPosition = HorizontalAlignment.LEFT;
      options.singleColumn = true;

      const cell = new ContentCell(options);
      const leftCorner = cell.toString()[0];
      const rightCorner = cell.toString()[cell.toString().length - 1];

      equal(leftCorner, TableBorder.VERTICAL);
      equal(rightCorner, TableBorder.VERTICAL);
    });
  });

  describe('clone', () => {
    it('should clone the ContentCell instance', () => {
      const options = {
        width: TestUtils.generateRandomInt(),
        paddingLeft: TestUtils.generateRandomInt(),
        paddingRight: TestUtils.generateRandomInt(),
        xPosition: HorizontalAlignment.CENTER,
        content: TestUtils.generateRandomString(),
      };
      const cell = new ContentCell(options);

      const clone = cell.clone();

      equal(clone.width, cell.width);
      equal(clone.paddingLeft, cell.paddingLeft);
      equal(clone.paddingRight, cell.paddingRight);
      equal(clone.xPosition, cell.xPosition);
      equal(clone.content, cell.content);
    });
  });
});
