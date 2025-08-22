import { describe, it, mock } from 'node:test';
import { doesNotMatch, equal, match, ok, strictEqual } from 'assert';

import { AnsiCodes } from '../enums.js';
import { ConsoleStringBuilder } from '../console-string.builder.js';
import { TestUtils } from '../test-utils.js';

describe('ConsoleStringBuilder', () => {
  describe('text', () => {
    it('should add text to the buffer', () => {
      const builder = ConsoleStringBuilder.create();
      const text = TestUtils.generateRandomString({ excludeSpecialCharacters: true });
      const testRegex = new RegExp(`^${text}`);

      const result = builder.text(text).build();

      match(result, testRegex);
    });

    it('should return the builder instance for chaining', () => {
      const builder = ConsoleStringBuilder.create();
      const text = TestUtils.generateRandomString();

      const result = builder.text(text);

      strictEqual(result, builder);
    });
  });

  describe('newline', () => {
    it('should add newline to the buffer', () => {
      const builder = ConsoleStringBuilder.create();
      const testRegex = new RegExp('\n');

      const result = builder.newline().build();

      match(result, testRegex);
    });

    it('should return the builder instance for chaining', () => {
      const builder = ConsoleStringBuilder.create();

      const result = builder.newline();

      strictEqual(result, builder);
    });
  });

  describe('newlines', () => {
    it('should add multiple newlines to the buffer', () => {
      const builder = ConsoleStringBuilder.create();
      const newlinesCount = TestUtils.generateRandomInt(1, 10);
      const testRegex = new RegExp('\n'.repeat(newlinesCount));

      const result = builder.newlines(newlinesCount).build();

      match(result, testRegex);
    });

    it('should return the builder instance for chaining', () => {
      const builder = ConsoleStringBuilder.create();

      const result = builder.newlines();

      strictEqual(result, builder);
    });
  });

  describe('spaces', () => {
    it('should add multiple spaces to the buffer', () => {
      const builder = ConsoleStringBuilder.create();
      const spacesCount = TestUtils.generateRandomInt(1, 10);
      const testRegex = new RegExp(' '.repeat(spacesCount));

      const result = builder.spaces(spacesCount).build();

      match(result, testRegex);
    });

    it('should return the builder instance for chaining', () => {
      const builder = ConsoleStringBuilder.create();

      const result = builder.spaces();

      strictEqual(result, builder);
    });
  });

  describe('tabs', () => {
    it('should add multiple tabs to the buffer', () => {
      const builder = ConsoleStringBuilder.create();
      const tabsCount = TestUtils.generateRandomInt(1, 10);
      const testRegex = new RegExp('\t'.repeat(tabsCount));

      const result = builder.tabs(tabsCount).build();

      match(result, testRegex);
    });

    it('should return the builder instance for chaining', () => {
      const builder = ConsoleStringBuilder.create();

      const result = builder.tabs();

      strictEqual(result, builder);
    });
  });

  const styles = [
    ['bold', AnsiCodes.BOLD],
    ['dim', AnsiCodes.DIM],
    ['italic', AnsiCodes.ITALIC],
    ['underline', AnsiCodes.UNDERLINE],
    ['reverse', AnsiCodes.REVERSE],
    ['strikeThrough', AnsiCodes.STRIKE_THROUGH],
  ];

  for (const [method, code] of styles) {
    describe(method, () => {
      it(`should make text ${method}`, () => {
        const builder = ConsoleStringBuilder.create();
        const testRegex = new RegExp(code.replace('[', '\\['));

        const result = builder[method]().build();

        match(result, testRegex);
      });

      it('should return the builder instance for chaining', () => {
        const builder = ConsoleStringBuilder.create();

        const result = builder[method]();

        strictEqual(result, builder);
      });
   });
  }

  const colors = [
    // Foreground colors
    ['black', AnsiCodes.FG.BLACK],
    ['red', AnsiCodes.FG.RED],
    ['green', AnsiCodes.FG.GREEN],
    ['yellow', AnsiCodes.FG.YELLOW],
    ['blue', AnsiCodes.FG.BLUE],
    ['magenta', AnsiCodes.FG.MAGENTA],
    ['cyan', AnsiCodes.FG.CYAN],
    ['white', AnsiCodes.FG.WHITE],

    // Bright foreground colors
    ['brightBlack', AnsiCodes.FG.BRIGHT_BLACK],
    ['brightRed', AnsiCodes.FG.BRIGHT_RED],
    ['brightGreen', AnsiCodes.FG.BRIGHT_GREEN],
    ['brightYellow', AnsiCodes.FG.BRIGHT_YELLOW],
    ['brightBlue', AnsiCodes.FG.BRIGHT_BLUE],
    ['brightMagenta', AnsiCodes.FG.BRIGHT_MAGENTA],
    ['brightCyan', AnsiCodes.FG.BRIGHT_CYAN],
    ['brightWhite', AnsiCodes.FG.BRIGHT_WHITE],

    // Background colors
    ['bgBlack', AnsiCodes.BG.BLACK],
    ['bgRed', AnsiCodes.BG.RED],
    ['bgGreen', AnsiCodes.BG.GREEN],
    ['bgYellow', AnsiCodes.BG.YELLOW],
    ['bgBlue', AnsiCodes.BG.BLUE],
    ['bgMagenta', AnsiCodes.BG.MAGENTA],
    ['bgCyan', AnsiCodes.BG.CYAN],
    ['bgWhite', AnsiCodes.BG.WHITE],

    // Bright background colors
    ['bgBrightBlack', AnsiCodes.BG.BRIGHT_BLACK],
    ['bgBrightRed', AnsiCodes.BG.BRIGHT_RED],
    ['bgBrightGreen', AnsiCodes.BG.BRIGHT_GREEN],
    ['bgBrightYellow', AnsiCodes.BG.BRIGHT_YELLOW],
    ['bgBrightBlue', AnsiCodes.BG.BRIGHT_BLUE],
    ['bgBrightMagenta', AnsiCodes.BG.BRIGHT_MAGENTA],
    ['bgBrightCyan', AnsiCodes.BG.BRIGHT_CYAN],
    ['bgBrightWhite', AnsiCodes.BG.BRIGHT_WHITE],
  ];

  for (const [method, code] of colors) {
    describe(method, () => {
      it(`should make text ${method}`, () => {
        const builder = ConsoleStringBuilder.create();
        const testRegex = new RegExp(code.replace('[', '\\['));

        const result = builder[method]().build();

        match(result, testRegex);
      });

      it('should return the builder instance for chaining', () => {
        const builder = ConsoleStringBuilder.create();

        const result = builder[method]();

        strictEqual(result, builder);
      });
   });
  }

  const aliases = [
    ['gray', 'brightBlack'],
    ['grey', 'brightBlack'],
  ];

  for (const [alias, method] of aliases) {
    describe(alias, () => {
      it(`should delegate to "${method}"`, () => {
        const builder = ConsoleStringBuilder.create();
        const methodFn = mock.method(builder, method, () => builder);

        const result = builder[alias]();

        strictEqual(result, builder);
        methodFn.mock.callCount(1);
      });
   });
  }

  describe('reset', () => {
    it('should add reset ansi code to the buffer', () => {
      const builder = ConsoleStringBuilder.create();
      const testRegex = new RegExp(AnsiCodes.RESET.replace('[', '\\['));

      const result = builder.reset().build();

      match(result, testRegex);
    });

    it('should return the builder instance for chaining', () => {
      const builder = ConsoleStringBuilder.create();

      const result = builder.reset();

      strictEqual(result, builder);
    });
  });

  describe('autoReset', () => {
    it('should include the reset ansi code if the buffer is not empty and autoReset is set to true', () => {
      const builder = ConsoleStringBuilder.create();
      const testRegex = new RegExp(AnsiCodes.RESET.replace('[', '\\['));
      const text = TestUtils.generateRandomString();
      builder.text(text);
      const autoReset = true;

      const result = builder.autoReset(autoReset).build();

      match(result, testRegex);
    });

    it('should not include the reset ansi code if the buffer is not empty and autoReset is set to false', () => {
      const builder = ConsoleStringBuilder.create();
      const testRegex = new RegExp(AnsiCodes.RESET.replace('[', '\\['));
      const text = TestUtils.generateRandomString();
      builder.text(text);
      const autoReset = false;

      const result = builder.autoReset(autoReset).build();

      doesNotMatch(result, testRegex);
    });

    it('should not include the reset ansi code if the buffer is empty', () => {
      const builder = ConsoleStringBuilder.create();
      const testRegex = new RegExp(AnsiCodes.RESET.replace('[', '\\['));
      const autoReset = true;

      const result = builder.autoReset(autoReset).build();

      doesNotMatch(result, testRegex);
    });

    it('should return the builder instance for chaining', () => {
      const builder = ConsoleStringBuilder.create();

      const result = builder.autoReset();

      strictEqual(result, builder);
    });
  });

  describe('ansi', () => {
    it('should add custom ansi code to the buffer', () => {
      const builder = ConsoleStringBuilder.create();
      const testRegex = new RegExp(AnsiCodes.BOLD.replace('[', '\\['));

      const result = builder.ansi(AnsiCodes.BOLD).build();

      match(result, testRegex);
    });

    it('should return the builder instance for chaining', () => {
      const builder = ConsoleStringBuilder.create();

      const result = builder.ansi(AnsiCodes.BOLD);

      strictEqual(result, builder);
    });
  });

  describe('clear', () => {
    it('should clear the buffer', () => {
      const builder = ConsoleStringBuilder.create();
      const text = TestUtils.generateRandomString({ excludeSpecialCharacters: true });
      const testRegex = new RegExp(text);
      builder.text(text);

      const result = builder.clear().build();

      doesNotMatch(result, testRegex);
    });

    it('should return the builder instance for chaining', () => {
      const builder = ConsoleStringBuilder.create();

      const result = builder.clear();

      strictEqual(result, builder);
    });
  });

  describe('length', () => {
    it('should return the length of the buffer', () => {
      const builder = ConsoleStringBuilder.create();
      const text = TestUtils.generateRandomString();

      builder.text(text).text(text).text(text);

      equal(builder.length(), 3);
    });
  });

  describe('isEmpty', () => {
    it('buffer should be empty before adding text', () => {
      const builder = ConsoleStringBuilder.create();

      const isEmpty = builder.isEmpty();

      ok(isEmpty);
    });

    it('buffer should not be empty after adding text', () => {
      const builder = ConsoleStringBuilder.create();
      const text = TestUtils.generateRandomString();

      builder.text(text);
      const isEmpty = builder.isEmpty();

      ok(!isEmpty);
    });
  });

  describe('build', () => {
    it('should return the formatted string', () => {
      const text = TestUtils.generateRandomString();
      const builder = ConsoleStringBuilder
        .create()
        .autoReset(false)
        .text(text);

      const result = builder.build();

      equal(result, text);
    });
  });

  describe('log', () => {
    it('should build the string and log it to the console', () => {
      const consoleLogFn = mock.method(console, 'log', () => {});
      const text = TestUtils.generateRandomString();
      const builder = ConsoleStringBuilder
        .create()
        .autoReset(false)
        .text(text);

      builder.log();

      equal(consoleLogFn.mock.callCount(), 1);
      equal(consoleLogFn.mock.calls[0].arguments[0], builder.build());

      consoleLogFn.mock.restore();
    });

    it('should return the builder instance for chaining', () => {
      const builder = ConsoleStringBuilder.create();

      const result = builder.log();

      strictEqual(result, builder);
    });
  });

  describe('error', () => {
    it('should build the string and log it as error to the console', () => {
      const consoleErrorFn = mock.method(console, 'error', () => {});
      const text = TestUtils.generateRandomString();
      const builder = ConsoleStringBuilder
        .create()
        .autoReset(false)
        .text(text);

      builder.error();

      equal(consoleErrorFn.mock.callCount(), 1);
      equal(consoleErrorFn.mock.calls[0].arguments[0], builder.build());

      consoleErrorFn.mock.restore();
    });

    it('should return the builder instance for chaining', () => {
      const builder = ConsoleStringBuilder.create();

      const result = builder.error();

      strictEqual(result, builder);
    });
  });

  describe('warn', () => {
    it('should build the string and log it as warning to the console', () => {
      const consoleWarnFn = mock.method(console, 'warn', () => {});
      const text = TestUtils.generateRandomString();
      const builder = ConsoleStringBuilder
        .create()
        .autoReset(false)
        .text(text);

      builder.warn();

      equal(consoleWarnFn.mock.callCount(), 1);
      equal(consoleWarnFn.mock.calls[0].arguments[0], builder.build());

      consoleWarnFn.mock.restore();
    });

    it('should return the builder instance for chaining', () => {
      const builder = ConsoleStringBuilder.create();

      const result = builder.warn();

      strictEqual(result, builder);
    });
  });

  describe('successMsg', () => {
    it('should return a green message with a check mark', () => {
      const text = TestUtils.generateRandomString({ excludeSpecialCharacters: true });
      const builder = ConsoleStringBuilder
        .create()
        .autoReset(false);
      const greenFn = mock.method(builder, 'green', (t) => builder.text(t));

      const result = builder.successMsg(text).build();

      match(result, new RegExp(`✅ ${text}`));
      equal(greenFn.mock.callCount(), 1);

      greenFn.mock.restore();
    });
  });

  describe('errorMsg', () => {
    it('should return a red message with a close mark', () => {
      const text = TestUtils.generateRandomString({ excludeSpecialCharacters: true });
      const builder = ConsoleStringBuilder
        .create()
        .autoReset(false);
      const redFn = mock.method(builder, 'red', (t) => builder.text(t));

      const result = builder.errorMsg(text).build();

      match(result, new RegExp(`❌ ${text}`));
      equal(redFn.mock.callCount(), 1);

      redFn.mock.restore();
    });
  });

  describe('warningMsg', () => {
    it('should return a yellow message with a warning sign', () => {
      const text = TestUtils.generateRandomString({ excludeSpecialCharacters: true });
      const builder = ConsoleStringBuilder
        .create()
        .autoReset(false);
      const yellowFn = mock.method(builder, 'yellow', (t) => builder.text(t));

      const result = builder.warningMsg(text).build();

      match(result, new RegExp(`⚠️ ${text}`));
      equal(yellowFn.mock.callCount(), 1);

      yellowFn.mock.restore();
    });
  });

  describe('infoMsg', () => {
    it('should return a blue message with an info icon', () => {
      const text = TestUtils.generateRandomString({ excludeSpecialCharacters: true });
      const builder = ConsoleStringBuilder
        .create()
        .autoReset(false);
      const blueFn = mock.method(builder, 'blue', (t) => builder.text(t));

      const result = builder.infoMsg(text).build();

      match(result, new RegExp(`ℹ️ ${text}`));
      equal(blueFn.mock.callCount(), 1);

      blueFn.mock.restore();
    });
  });

  describe('create', () => {
    it('should create a new builder instance', () => {
      const builder = ConsoleStringBuilder.create();

      ok(builder instanceof ConsoleStringBuilder);
    });
  });
});
