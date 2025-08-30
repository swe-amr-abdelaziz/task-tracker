import { doesNotReject, rejects } from 'node:assert';
import { describe, it } from 'node:test';

import { HorizontalAlignment, VerticalAlignment } from '../../../../enums.js';
import { TableCellValidator } from '../table-cell.validator.js';
import { TestUtils } from '../../../../test-utils.js';
import { messages } from '../../../../messages.js';

describe('TableCellValidator', () => {
  describe('validateWidth', () => {
    it('should throw a TypeError if the width is not a number', async () => {
      const width = TestUtils.generateRandomString();

      await rejects(
        async () => TableCellValidator.validateWidth(width),
        {
          name: 'TypeError',
          message: messages.error.INVALID_TABLE_CELL_WIDTH
        },
      );
    })

    it('should throw a RangeError if the width is negative', async () => {
      const width = -1;

      await rejects(
        async () => TableCellValidator.validateWidth(width),
        {
          name: 'RangeError',
          message: messages.error.NEGATIVE_TABLE_CELL_WIDTH
        },
      );
    });

    it('should not throw any error if the width is a positive number', async () => {
      const width = TestUtils.generateRandomInt(5, 10);

      await doesNotReject(
        async () => TableCellValidator.validateWidth(width),
      );
    });
  });

  describe('paddingLeft', () => {
    it('should throw a TypeError if the left padding is not a number', async () => {
      const paddingLeft = TestUtils.generateRandomString();

      await rejects(
        async () => TableCellValidator.validatePaddingLeft(paddingLeft),
        {
          name: 'TypeError',
          message: messages.error.INVALID_TABLE_CELL_PADDING_LEFT
        },
      );
    })

    it('should throw a RangeError if the left padding is negative', async () => {
      const paddingLeft = -1;

      await rejects(
        async () => TableCellValidator.validatePaddingLeft(paddingLeft),
        {
          name: 'RangeError',
          message: messages.error.NEGATIVE_TABLE_CELL_PADDING_LEFT
        },
      );
    });

    it('should not throw any error if the left padding is a positive number', async () => {
      const paddingLeft = TestUtils.generateRandomInt(5, 10);

      await doesNotReject(
        async () => TableCellValidator.validatePaddingLeft(paddingLeft),
      );
    });
  });

  describe('paddingRight', () => {
    it('should throw a TypeError if the right padding is not a number', async () => {
      const paddingRight = TestUtils.generateRandomString();

      await rejects(
        async () => TableCellValidator.validatePaddingRight(paddingRight),
        {
          name: 'TypeError',
          message: messages.error.INVALID_TABLE_CELL_PADDING_RIGHT
        },
      );
    })

    it('should throw a RangeError if the right padding is negative', async () => {
      const paddingRight = -1;

      await rejects(
        async () => TableCellValidator.validatePaddingRight(paddingRight),
        {
          name: 'RangeError',
          message: messages.error.NEGATIVE_TABLE_CELL_PADDING_RIGHT
        },
      );
    });

    it('should not throw any error if the right padding is a positive number', async () => {
      const paddingRight = TestUtils.generateRandomInt(5, 10);

      await doesNotReject(
        async () => TableCellValidator.validatePaddingRight(paddingRight),
      );
    });
  });

  describe('xPosition', () => {
    it('should throw a TypeError if the xPosition is not a valid horizontal position', async () => {
      const xPosition = VerticalAlignment.TOP;

      await rejects(
        async () => TableCellValidator.validateXPosition(xPosition),
        {
          name: 'TypeError',
          message: messages.error.INVALID_TABLE_CELL_X_POSITION
        },
      );
    });

    it('should not throw any error if the xPosition is a valid horizontal position', async () => {
      const validPositions = Object.keys(HorizontalAlignment);

      for (const position of validPositions) {
        await doesNotReject(
          async () => TableCellValidator.validateXPosition(position),
        );
      }
    });
  });

  describe('yPosition', () => {
    it('should throw a TypeError if the yPosition is not a valid vertical position', async () => {
      const yPosition = HorizontalAlignment.LEFT;

      await rejects(
        async () => TableCellValidator.validateYPosition(yPosition),
        {
          name: 'TypeError',
          message: messages.error.INVALID_TABLE_CELL_Y_POSITION
        },
      );
    });

    it('should not throw any error if the yPosition is a valid vertical position', async () => {
      const validPositions = Object.keys(VerticalAlignment);

      for (const position of validPositions) {
        await doesNotReject(
          async () => TableCellValidator.validateYPosition(position),
        );
      }
    });
  });

  describe('singleColumn', () => {
    it('should throw a TypeError if singleColumn value is not a boolean', async () => {
      const singleColumn = null;

      await rejects(
        async () => TableCellValidator.validateSingleColumn(singleColumn),
        {
          name: 'TypeError',
          message: messages.error.INVALID_TABLE_CELL_SINGLE_COLUMN
        },
      );
    });

    it('should not throw any error if the singleColumn value is a boolean', async () => {
      const validValues = [true, false];

      for (const value of validValues) {
        await doesNotReject(
          async () => TableCellValidator.validateSingleColumn(value),
        );
      }
    });
  });

  describe('content', () => {
    it('should throw a RangeError if the content length is greater than the cell width', async () => {
      const width = TestUtils.generateRandomInt(1, 10);
      const content = TestUtils.generateRandomString({ minLength: width + 1 });

      await rejects(
        async () => TableCellValidator.validateContent(content, width),
        {
          name: 'RangeError',
          message: messages.error.CELL_CONTENT_EXCEEDS_CELL_WIDTH
        },
      );
    });
  });

  describe('textAlign', () => {
    it('should throw a TypeError if the textAlign is not a valid horizontal position', async () => {
      const textAlign = VerticalAlignment.TOP;

      await rejects(
        async () => TableCellValidator.validateTextAlign(textAlign),
        {
          name: 'TypeError',
          message: messages.error.INVALID_TABLE_CELL_TEXT_ALIGN
        },
      );
    });

    it('should not throw any error if the textAlign is a valid horizontal position', async () => {
      const validPositions = Object.keys(HorizontalAlignment);

      for (const position of validPositions) {
        await doesNotReject(
          async () => TableCellValidator.validateTextAlign(position),
        );
      }
    });
  });
});
