import { equal, match } from 'node:assert';
import { describe, it } from 'node:test';

import { AnsiCodes } from '../../../../enums.js';
import { ContentCellStyler } from '../table-cell.styler.js';
import { TestUtils } from '../../../../test-utils.js';

describe('ContentCellStyler', () => {
  describe('build', () => {
    const options = {
      content: TestUtils.generateRandomString(),
      isHeader: false,
    };

    it('should return the content of the cell', () => {
      const styler = new ContentCellStyler(options);

      const actual = styler.build();

      equal(actual.plainText, options.content);
    });

    it('should set the style to green color and bold if the cell is a header cell', () => {
      options.isHeader = true;
      const styler = new ContentCellStyler(options);

      const stringBuilder = styler.build();
      const actual = stringBuilder.build();

      const green = AnsiCodes.FG.GREEN.replace('[', '\\[');
      const bold = AnsiCodes.BOLD.replace('[', '\\[');
      match(actual, new RegExp(green));
      match(actual, new RegExp(bold));

      options.isHeader = false;
    });

    it('should set the style to magenta color if the cell content is of type number', () => {
      options.content = TestUtils.generateRandomInt(1, 9);
      const styler = new ContentCellStyler(options);

      const stringBuilder = styler.build();
      const actual = stringBuilder.build();

      const magenta = AnsiCodes.FG.MAGENTA.replace('[', '\\[');
      match(actual, new RegExp(magenta));
    });

    it('should set the style to yellow color by default', () => {
      options.content = TestUtils.generateRandomString();
      const styler = new ContentCellStyler(options);

      const stringBuilder = styler.build();
      const actual = stringBuilder.build();

      const yellow = AnsiCodes.FG.YELLOW.replace('[', '\\[');
      match(actual, new RegExp(yellow));
    });
  });
});
