import { deepEqual, equal, match } from 'node:assert';
import { after, beforeEach, describe, it, mock } from 'node:test';

import { HorizontalAlignment, PADDING_DEFAULT } from '../../enums.js';
import { ResponsiveTable } from '../responsive-table.js';
import { ResponsiveTableBuilder } from '../internals/responsive-table.builder.js';
import { ResponsiveTableValidator } from '../internals/responsive-table.validator.js';
import { TestUtils } from '../../test-utils.js';
import { Utils } from '../../utils.js';

describe('ResponsiveTable', () => {
  describe('constructor', () => {
    const validateDataFn = mock.method(
      ResponsiveTableValidator,
      'validateData',
      () => {},
    );
    const validateHeaderDataFn = mock.method(
      ResponsiveTableValidator,
      'validateHeaderData',
      () => {},
    );
    const validateOptionsFn = mock.method(
      ResponsiveTableValidator,
      'validateOptions',
      () => {},
    );
    const formalizedHeaderData = [];
    const formalizeHeaderDataFn = mock.method(
      ResponsiveTableBuilder,
      'formalizeHeaderData',
      () => formalizedHeaderData,
    );

    beforeEach(() => {
      validateDataFn.mock.resetCalls();
      validateHeaderDataFn.mock.resetCalls();
      validateOptionsFn.mock.resetCalls();
      formalizeHeaderDataFn.mock.resetCalls();
    });

    after(() => {
      validateDataFn.mock.restore();
      validateHeaderDataFn.mock.restore();
      validateOptionsFn.mock.restore();
      formalizeHeaderDataFn.mock.restore();
    });

    it('should validate the data of the table', () => {
      const data = [{ id: 1, name: 'John' }];

      new ResponsiveTable(data);

      equal(validateDataFn.mock.callCount(), 1);
      equal(validateDataFn.mock.calls[0].arguments[0], data);
    });

    it('should validate the header data of the table', () => {
      const data = [{ id: 1, name: 'John' }];
      const headerData = [];

      new ResponsiveTable(data, headerData);

      equal(validateHeaderDataFn.mock.callCount(), 1);
    });

    it('should validate the options of the table', () => {
      const data = [{ id: 1, name: 'John' }];
      const headerData = [];
      const options = {
        paddingLeft: TestUtils.generateRandomInt(),
        paddingRight: TestUtils.generateRandomInt(),
      };

      new ResponsiveTable(data, headerData, options);

      equal(validateOptionsFn.mock.callCount(), 1);
      deepEqual(validateOptionsFn.mock.calls[0].arguments[0], options);
    });

    it('should send the formalized header data to the validator', () => {
      const data = [{ id: 1, name: 'John' }];
      const headerData = [];

      new ResponsiveTable(data, headerData);

      equal(validateHeaderDataFn.mock.callCount(), 1);
      equal(validateHeaderDataFn.mock.calls[0].arguments[0], formalizedHeaderData);
    });
  });

  describe('print', () => {
    function generateData() {
      return [
        { id: 1, name: 'John Doe', age: 30 },
        { id: 2, name: 'Jane Smith', age: 25 },
        { id: 3, name: 'Alice Brown', age: 40 },
      ];
    }
    function generateHeaderData() {
      return [
        {
          key: 'id',
          label: 'ID',
          isFixed: false,
          textAlign: HorizontalAlignment.LEFT,
        },
        {
          key: 'name',
          label: 'Full Name',
          isFixed: false,
          textAlign: HorizontalAlignment.LEFT,
        },
        {
          key: 'age',
          label: 'Age',
          isFixed: false,
          textAlign: HorizontalAlignment.LEFT,
        },
      ];
    }
    function removeFirstLine(str) {
      return str.replace(/^\n/, '');
    }
    const tableOptions = {
      paddingLeft: PADDING_DEFAULT,
      paddingRight: PADDING_DEFAULT,
    };
    const consoleLogFn = mock.method(console, 'log', () => {});

    it('should build the responsive table (all cases are tested in the builder class)', () => {
      const data = generateData();
      const headerData = generateHeaderData();
      const table = new ResponsiveTable(data, headerData, tableOptions);

      table.print();
      const result = consoleLogFn.mock.calls[0].arguments[0];
      const actual = Utils.clearAnsiSequences(result);
      const expected = `
╭────┬─────────────┬─────╮
│ ID │  Full Name  │ Age │
├────┼─────────────┼─────┤
│ 1  │ John Doe    │ 30  │
├────┼─────────────┼─────┤
│ 2  │ Jane Smith  │ 25  │
├────┼─────────────┼─────┤
│ 3  │ Alice Brown │ 40  │
╰────┴─────────────┴─────╯`;

      match(actual, new RegExp(removeFirstLine(expected)));

      consoleLogFn.mock.restore();
    });
  });
});
