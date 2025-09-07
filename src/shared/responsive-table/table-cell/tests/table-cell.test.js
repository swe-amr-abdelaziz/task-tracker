import {
  doesNotMatch,
  equal,
  match,
  notEqual,
  ok,
  rejects,
  strictEqual,
} from 'node:assert';
import { describe, it, mock } from 'node:test';

import { AnsiCodes, HorizontalAlignment, PADDING_DEFAULT, TableBorder, VerticalAlignment } from '../../../enums.js';
import { ConsoleStringBuilder } from '../../../console-string.builder.js';
import { ContentCell, SeparatorCell, TableCell } from '../table-cell.js';
import { TableCellValidator } from '../internals/table-cell.validator.js';
import { TestUtils } from '../../../test-utils.js';
import { messages } from '../../../messages.js';

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

    it('should validate the width of the cell', async () => {
      const options = { width: TestUtils.generateRandomInt() };
      const validateWidthFn = mock.method(TableCellValidator, 'validateWidth');

      new TestTableCell(options);

      equal(validateWidthFn.mock.callCount(), 1);
      equal(validateWidthFn.mock.calls[0].arguments[0], options.width);

      validateWidthFn.mock.restore();
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

    it('should set the default left padding of the cell if not provided', () => {
      const defaultPaddingLeft = PADDING_DEFAULT;

      const cell = new TestTableCell();

      equal(cell.paddingLeft, defaultPaddingLeft);
    });

    it('should validate the left padding of the cell', async () => {
      const options = { paddingLeft: TestUtils.generateRandomInt() };
      const validatePaddingLeftFn = mock.method(TableCellValidator, 'validatePaddingLeft');

      new TestTableCell(options);

      equal(validatePaddingLeftFn.mock.callCount(), 1);
      equal(validatePaddingLeftFn.mock.calls[0].arguments[0], options.paddingLeft);

      validatePaddingLeftFn.mock.restore();
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

    it('should set the default right padding of the cell if not provided', () => {
      const defaultPaddingRight = PADDING_DEFAULT;

      const cell = new TestTableCell();

      equal(cell.paddingRight, defaultPaddingRight);
    });

    it('should validate the right padding of the cell', async () => {
      const options = { paddingRight: TestUtils.generateRandomInt() };
      const validatePaddingRightFn = mock.method(TableCellValidator, 'validatePaddingRight');

      new TestTableCell(options);

      equal(validatePaddingRightFn.mock.callCount(), 1);
      equal(validatePaddingRightFn.mock.calls[0].arguments[0], options.paddingRight);

      validatePaddingRightFn.mock.restore();
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

    it('should validate xPosition of the cell', async () => {
      const options = { xPosition: HorizontalAlignment.CENTER };
      const validateXPositionFn = mock.method(TableCellValidator, 'validateXPosition');

      new TestTableCell(options);

      equal(validateXPositionFn.mock.callCount(), 1);
      equal(validateXPositionFn.mock.calls[0].arguments[0], options.xPosition);

      validateXPositionFn.mock.restore();
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

    it('should validate singleColumn of the cell', async () => {
      const options = { singleColumn: true };
      const validateSingleColumnFn = mock.method(TableCellValidator, 'validateSingleColumn');

      new TestTableCell(options);

      equal(validateSingleColumnFn.mock.callCount(), 1);
      equal(validateSingleColumnFn.mock.calls[0].arguments[0], options.singleColumn);

      validateSingleColumnFn.mock.restore();
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

    it('should validate the yPosition of the cell', async () => {
      const options = { yPosition: VerticalAlignment.CENTER };
      const validateYPositionFn = mock.method(TableCellValidator, 'validateYPosition');

      new SeparatorCell(options);

      equal(validateYPositionFn.mock.callCount(), 1);
      equal(validateYPositionFn.mock.calls[0].arguments[0], options.yPosition);

      validateYPositionFn.mock.restore();
    });
  });

  describe('toString', () => {
    let options = {
      width: 5,
      paddingLeft: 1,
      paddingRight: 1,
      xPosition: HorizontalAlignment.LEFT,
      yPosition: VerticalAlignment.TOP,
      singleColumn: false,
    };

    it('should build the separator cell', () => {
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

    it('should set the style to white color by default', () => {
      const width = TestUtils.generateRandomInt(1, 10);
      const content = TestUtils.generateRandomString({ minLength: width });
      const options = {
        width,
        content,
      };

      const cell = new ContentCell(options);
      const expected = cell.content.build();

      const white = AnsiCodes.FG.WHITE.replace('[', '\\[');
      match(expected, new RegExp(white));
    });

    it('should validate the content of the cell', async () => {
      const width = TestUtils.generateRandomInt(1, 10);
      const content = TestUtils.generateRandomString({ minLength: width });
      const options = { width, content };

      const validateContentFn = mock.method(TableCellValidator, 'validateContent');

      new ContentCell(options);

      equal(validateContentFn.mock.callCount(), 1);
      equal(validateContentFn.mock.calls[0].arguments[0], content);
      equal(validateContentFn.mock.calls[0].arguments[1], width);

      validateContentFn.mock.restore();
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

    it('should validate textAlign of the cell', async () => {
      const options = { textAlign: HorizontalAlignment.CENTER };
      const validateTextAlignFn = mock.method(TableCellValidator, 'validateTextAlign');

      new ContentCell(options);

      equal(validateTextAlignFn.mock.callCount(), 1);
      equal(validateTextAlignFn.mock.calls[0].arguments[0], options.textAlign);

      validateTextAlignFn.mock.restore();
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

    it('should return the content with style by default', () => {
      const cell = new ContentCell(options);

      const actual = cell.toString();

      const white = AnsiCodes.FG.WHITE.replace('[', '\\[');
      match(actual, new RegExp(white));
    });

    it('should return the content without style if withStyle is set to false', () => {
      const cell = new ContentCell(options);

      const actual = cell.toString(false);

      const white = AnsiCodes.FG.WHITE.replace('[', '\\[');
      doesNotMatch(actual, new RegExp(white));
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
