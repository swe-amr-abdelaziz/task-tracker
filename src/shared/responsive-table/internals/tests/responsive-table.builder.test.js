import { deepEqual, match } from 'node:assert';
import { describe, it } from 'node:test';

import { HorizontalAlignment, PADDING_DEFAULT } from '../../../enums.js';
import { ResponsiveTableBuilder } from '../responsive-table.builder.js';
import { STARTS_WITH_NEWLINE_REGEX } from '../../../regex.js';
import { TestUtils } from '../../../test-utils.js';
import { Utils } from '../../../utils.js';

describe('ResponsiveTableBuilder', () => {
  describe('build', () => {
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
      return str.replace(STARTS_WITH_NEWLINE_REGEX, '');
    }
    const tableOptions = {
      paddingLeft: PADDING_DEFAULT,
      paddingRight: PADDING_DEFAULT,
    };

    it('should build the responsive table', () => {
      const data = generateData();
      const headerData = generateHeaderData();
      const builder = new ResponsiveTableBuilder(data, headerData, tableOptions);
      const layoutOptions = {
        isSmallViewPort: false,
        widths: [2, 11, 3],
      };

      const result = builder.build(layoutOptions);
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
    });

    it('should build the responsive table and wrap long content into multiple lines', () => {
      const data = generateData();
      const headerData = generateHeaderData();
      data[0].name = 'Very long name that should wrap into multiple lines';
      const builder = new ResponsiveTableBuilder(data, headerData, tableOptions);
      const layoutOptions = {
        isSmallViewPort: false,
        widths: [2, 15, 3],
      };

      const result = builder.build(layoutOptions);
      const actual = Utils.clearAnsiSequences(result);
      const expected = `
╭────┬─────────────────┬─────╮
│ ID │    Full Name    │ Age │
├────┼─────────────────┼─────┤
│ 1  │ Very long name  │ 30  │
│    │ that should     │     │
│    │ wrap into       │     │
│    │ multiple lines  │     │
├────┼─────────────────┼─────┤
│ 2  │ Jane Smith      │ 25  │
├────┼─────────────────┼─────┤
│ 3  │ Alice Brown     │ 40  │
╰────┴─────────────────┴─────╯`;

      match(actual, new RegExp(removeFirstLine(expected)));
    });

    it('should build the responsive table and print missing values as empty strings', () => {
      const data = generateData();
      const headerData = generateHeaderData();
      delete data[0].name;
      const builder = new ResponsiveTableBuilder(data, headerData, tableOptions);
      const layoutOptions = {
        isSmallViewPort: false,
        widths: [2, 11, 3],
      };

      const result = builder.build(layoutOptions);
      const actual = Utils.clearAnsiSequences(result);
      const expected = `
╭────┬─────────────┬─────╮
│ ID │  Full Name  │ Age │
├────┼─────────────┼─────┤
│ 1  │             │ 30  │
├────┼─────────────┼─────┤
│ 2  │ Jane Smith  │ 25  │
├────┼─────────────┼─────┤
│ 3  │ Alice Brown │ 40  │
╰────┴─────────────┴─────╯`;

      match(actual, new RegExp(removeFirstLine(expected)));
    });

    it('should build the responsive table for small view port', () => {
      const data = generateData();
      const headerData = generateHeaderData();
      const builder = new ResponsiveTableBuilder(data, headerData, tableOptions);
      const layoutOptions = {
        isSmallViewPort: true,
        widths: [9, 11],
      };

      const result = builder.build(layoutOptions);
      const actual = Utils.clearAnsiSequences(result);
      const expected = `
╭───────────┬─────────────╮
│           │             │
│ ID        │ 1           │
│           │             │
│ Full Name │ John Doe    │
│           │             │
│ Age       │ 30          │
│           │             │
├───────────┼─────────────┤
│           │             │
│ ID        │ 2           │
│           │             │
│ Full Name │ Jane Smith  │
│           │             │
│ Age       │ 25          │
│           │             │
├───────────┼─────────────┤
│           │             │
│ ID        │ 3           │
│           │             │
│ Full Name │ Alice Brown │
│           │             │
│ Age       │ 40          │
│           │             │
╰───────────┴─────────────╯`;

      match(actual, new RegExp(removeFirstLine(expected)));
    });

    it('should build the responsive table for small view port and wrap long content into multiple lines', () => {
      const data = generateData();
      const headerData = generateHeaderData();
      data[0].name = 'Very long name that should wrap into multiple lines';
      const builder = new ResponsiveTableBuilder(data, headerData, tableOptions);
      const layoutOptions = {
        isSmallViewPort: true,
        widths: [9, 15],
      };

      const result = builder.build(layoutOptions);
      const actual = Utils.clearAnsiSequences(result);
      const expected = `
╭───────────┬─────────────────╮
│           │                 │
│ ID        │ 1               │
│           │                 │
│ Full Name │ Very long name  │
│           │ that should     │
│           │ wrap into       │
│           │ multiple lines  │
│           │                 │
│ Age       │ 30              │
│           │                 │
├───────────┼─────────────────┤
│           │                 │
│ ID        │ 2               │
│           │                 │
│ Full Name │ Jane Smith      │
│           │                 │
│ Age       │ 25              │
│           │                 │
├───────────┼─────────────────┤
│           │                 │
│ ID        │ 3               │
│           │                 │
│ Full Name │ Alice Brown     │
│           │                 │
│ Age       │ 40              │
│           │                 │
╰───────────┴─────────────────╯`;

      match(actual, new RegExp(removeFirstLine(expected)));
    });

    it('should build the responsive table and print missing values as empty strings in small view port mode', () => {
      const data = generateData();
      const headerData = generateHeaderData();
      delete data[0].name;
      const builder = new ResponsiveTableBuilder(data, headerData, tableOptions);
      const layoutOptions = {
        isSmallViewPort: true,
        widths: [9, 11],
      };

      const result = builder.build(layoutOptions);
      const actual = Utils.clearAnsiSequences(result);
      const expected = `
╭───────────┬─────────────╮
│           │             │
│ ID        │ 1           │
│           │             │
│ Full Name │             │
│           │             │
│ Age       │ 30          │
│           │             │
├───────────┼─────────────┤
│           │             │
│ ID        │ 2           │
│           │             │
│ Full Name │ Jane Smith  │
│           │             │
│ Age       │ 25          │
│           │             │
├───────────┼─────────────┤
│           │             │
│ ID        │ 3           │
│           │             │
│ Full Name │ Alice Brown │
│           │             │
│ Age       │ 40          │
│           │             │
╰───────────┴─────────────╯`;

      match(actual, new RegExp(removeFirstLine(expected)));
    });

    it('should render a table with a single row', () => {
      const data = generateData();
      const headerData = generateHeaderData().filter((header) => header.key === 'name');
      const builder = new ResponsiveTableBuilder(data, headerData, tableOptions);
      const layoutOptions = {
        isSmallViewPort: false,
        widths: [15],
      };

      const result = builder.build(layoutOptions);
      const actual = Utils.clearAnsiSequences(result);
      const expected = `
╭─────────────────╮
│    Full Name    │
├─────────────────┤
│ John Doe        │
├─────────────────┤
│ Jane Smith      │
├─────────────────┤
│ Alice Brown     │
╰─────────────────╯`;

      match(actual, new RegExp(removeFirstLine(expected)));
    });

    it('should render a table with a single row for small view port', () => {
      const data = generateData();
      const headerData = generateHeaderData().filter((header) => header.key === 'name');
      const builder = new ResponsiveTableBuilder(data, headerData, tableOptions);
      const layoutOptions = {
        isSmallViewPort: true,
        widths: [9, 11],
      };

      const result = builder.build(layoutOptions);
      const actual = Utils.clearAnsiSequences(result);
      const expected = `
╭───────────┬─────────────╮
│           │             │
│ Full Name │ John Doe    │
│           │             │
├───────────┼─────────────┤
│           │             │
│ Full Name │ Jane Smith  │
│           │             │
├───────────┼─────────────┤
│           │             │
│ Full Name │ Alice Brown │
│           │             │
╰───────────┴─────────────╯`;

      match(actual, new RegExp(removeFirstLine(expected)));
    });
  });


  describe('formalizeHeaderData', () => {
    it('should return the same header data if all header data is provided', () => {
      const data = [];
      const headerData = [
        {
          key: TestUtils.generateRandomString(),
          label: TestUtils.generateRandomString(),
          isFixed: false,
          textAlign: HorizontalAlignment.LEFT,
        },
        {
          key: TestUtils.generateRandomString(),
          label: TestUtils.generateRandomString(),
          isFixed: false,
          textAlign: HorizontalAlignment.LEFT,
        },
        {
          key: TestUtils.generateRandomString(),
          label: TestUtils.generateRandomString(),
          isFixed: false,
          textAlign: HorizontalAlignment.LEFT,
        },
      ];

      const actual = ResponsiveTableBuilder.formalizeHeaderData(data, headerData);
      const expected = headerData;

      deepEqual(actual, expected);
    });

    it('should return the header data with default values if optional header data are not provided', () => {
      const data = [];
      const headerData = [
        {
          key: TestUtils.generateRandomString(),
          label: TestUtils.generateRandomString(),
          isFixed: false,
        },
        {
          key: TestUtils.generateRandomString(),
          label: TestUtils.generateRandomString(),
          isFixed: false,
        },
        {
          key: TestUtils.generateRandomString(),
          label: TestUtils.generateRandomString(),
          isFixed: false,
        },
      ];

      const actual = ResponsiveTableBuilder.formalizeHeaderData(data, headerData);
      const expected = headerData.map((header) => ({
        ...header,
        textAlign: HorizontalAlignment.LEFT,
      }));

      deepEqual(actual, expected);
    });

    it('should generate the header data from the table data if no header data are provided', () => {
      const data = [
        {
          id: TestUtils.generateRandomInt(),
          name: TestUtils.generateRandomString(),
          age: TestUtils.generateRandomInt(),
        },
        {
          id: TestUtils.generateRandomInt(),
          name: TestUtils.generateRandomString(),
          age: TestUtils.generateRandomInt(),
        },
      ];

      const actual = ResponsiveTableBuilder.formalizeHeaderData(data);
      const expected = [
        {
          key: 'id',
          label: 'id',
          isFixed: false,
          textAlign: HorizontalAlignment.LEFT,
        },
        {
          key: 'name',
          label: 'name',
          isFixed: false,
          textAlign: HorizontalAlignment.LEFT,
        },
        {
          key: 'age',
          label: 'age',
          isFixed: false,
          textAlign: HorizontalAlignment.LEFT,
        },
      ];

      deepEqual(actual, expected);
    });

    it('should generate the header data from the table data if header data length equals zero', () => {
      const data = [
        {
          id: TestUtils.generateRandomInt(),
          name: TestUtils.generateRandomString(),
          age: TestUtils.generateRandomInt(),
        },
        {
          id: TestUtils.generateRandomInt(),
          name: TestUtils.generateRandomString(),
          age: TestUtils.generateRandomInt(),
        },
      ];
      const headerData = [];

      const actual = ResponsiveTableBuilder.formalizeHeaderData(data, headerData);
      const expected = [
        {
          key: 'id',
          label: 'id',
          isFixed: false,
          textAlign: HorizontalAlignment.LEFT,
        },
        {
          key: 'name',
          label: 'name',
          isFixed: false,
          textAlign: HorizontalAlignment.LEFT,
        },
        {
          key: 'age',
          label: 'age',
          isFixed: false,
          textAlign: HorizontalAlignment.LEFT,
        },
      ];

      deepEqual(actual, expected);
    });

    it('should generate the header data of all table columns if no header data are provided', () => {
      const data = [
        {
          id: TestUtils.generateRandomInt(),
          name: TestUtils.generateRandomString(),
          age: TestUtils.generateRandomInt(),
        },
        {
          id: TestUtils.generateRandomInt(),
          name: TestUtils.generateRandomString(),
          salary: TestUtils.generateRandomInt(),
        },
      ];

      const actual = ResponsiveTableBuilder.formalizeHeaderData(data);
      const expected = [
        {
          key: 'id',
          label: 'id',
          isFixed: false,
          textAlign: HorizontalAlignment.LEFT,
        },
        {
          key: 'name',
          label: 'name',
          isFixed: false,
          textAlign: HorizontalAlignment.LEFT,
        },
        {
          key: 'age',
          label: 'age',
          isFixed: false,
          textAlign: HorizontalAlignment.LEFT,
        },
        {
          key: 'salary',
          label: 'salary',
          isFixed: false,
          textAlign: HorizontalAlignment.LEFT,
        },
      ];

      deepEqual(actual, expected);
    });
  });
});
