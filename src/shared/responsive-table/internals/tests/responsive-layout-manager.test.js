import { deepEqual, equal, notEqual, ok, strictEqual } from 'node:assert';
import { describe, it } from 'node:test';

import { HorizontalAlignment, PADDING_DEFAULT } from '../../../enums.js';
import { ResponsiveLayoutManager } from '../responsive-layout-manager.js';
import { TestUtils } from '../../../test-utils.js';

describe('ResponsiveLayoutManager', () => {
  function generateData() {
    return [
      { id: 1, name: 'John Doe', age: 30 },
      { id: 2, name: 'Jane Smith', age: 25 },
      { id: 3, name: 'Alice Brown', age: 35 },
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
  const tableOptions = {
    paddingLeft: PADDING_DEFAULT,
    paddingRight: PADDING_DEFAULT,
  };

  describe('constructor', () => {
    it('should create an instance with data and headerData', () => {
      const data = generateData();
      const headerData = generateHeaderData();

      const manager = new ResponsiveLayoutManager(data, headerData, tableOptions);
      strictEqual(manager instanceof ResponsiveLayoutManager, true);
    });
  });

  describe('layoutOptions', () => {
    it('should return the layout options', () => {
      const data = generateData();
      const headerData = generateHeaderData();
      process.stdout.columns = 80;
      const manager = new ResponsiveLayoutManager(data, headerData, tableOptions);

      const layoutOptions = manager.layoutOptions;

      notEqual(layoutOptions.isSmallViewPort, undefined);
      equal(layoutOptions.widths.length, 3);
    });

    it('should set isSmallViewPort to false if the view port is large', () => {
      const data = generateData();
      const headerData = generateHeaderData();
      process.stdout.columns = 80;
      const manager = new ResponsiveLayoutManager(data, headerData, tableOptions);

      const layoutOptions = manager.layoutOptions;

      equal(layoutOptions.isSmallViewPort, false);
    });

    it('should set isSmallViewPort to true if the view port is small', () => {
      const data = generateData();
      const headerData = generateHeaderData();
      process.stdout.columns = 20;
      const manager = new ResponsiveLayoutManager(data, headerData, tableOptions);

      const layoutOptions = manager.layoutOptions;

      equal(layoutOptions.isSmallViewPort, true);
    });

    it('should set widths to the correct values for a large view port', () => {
      const data = generateData();
      const headerData = generateHeaderData();
      process.stdout.columns = 80;
      const manager = new ResponsiveLayoutManager(data, headerData, tableOptions);

      const layoutOptions = manager.layoutOptions;

      deepEqual(layoutOptions.widths, [2, 11, 3])
    });

    it('should set widths to the correct values for a large view port in case of long content', () => {
      const data = generateData();
      const headerData = generateHeaderData();
      const width1 = 15;
      const width2 = 20;
      const width3 = 25;
      data[0].id = TestUtils.generateRandomString({ minLength: width1 });
      data[0].name = TestUtils.generateRandomString({ minLength: width2 });
      data[0].age = TestUtils.generateRandomString({ minLength: width3 });
      process.stdout.columns = 80;
      const manager = new ResponsiveLayoutManager(data, headerData, tableOptions);

      const layoutOptions = manager.layoutOptions;

      deepEqual(layoutOptions.widths, [width1, width2, width3]);
    });

    it('should distribute widths evenly among flexible columns if maxTableLength is greater than screen width', () => {
      const data = generateData();
      const headerData = generateHeaderData();
      const width1 = 15;
      const width2 = 20;
      const width3 = 25;
      data[0].id = TestUtils.generateRandomString({ minLength: width1 });
      data[0].name = TestUtils.generateRandomString({ minLength: width2 });
      data[0].age = TestUtils.generateRandomString({ minLength: width3 });
      process.stdout.columns = 60;
      const manager = new ResponsiveLayoutManager(data, headerData, tableOptions);

      const layoutOptions = manager.layoutOptions;

      const actualWidths = layoutOptions.widths;
      const expectedWidths = [width1, width2, width3];
      const originalWidths = [2, 11, 3];
      for (let i = 0; i < actualWidths.length; i++) {
        const actualWidth = actualWidths[i];
        const expectedWidth = expectedWidths[i];
        const originalWidth = originalWidths[i];
        ok(actualWidth <= expectedWidth && actualWidth >= originalWidth);
      }
    });

    it('should distribute widths evenly among flexible columns not including isFixed headers, if maxTableLength is greater than screen width', () => {
      const data = generateData();
      const headerData = generateHeaderData();
      headerData[2].isFixed = true
      const width1 = 15;
      const width2 = 20;
      const width3 = 25;
      data[0].id = TestUtils.generateRandomString({ minLength: width1 });
      data[0].name = TestUtils.generateRandomString({ minLength: width2 });
      data[0].age = TestUtils.generateRandomString({ minLength: width3 });
      process.stdout.columns = 60;
      const manager = new ResponsiveLayoutManager(data, headerData, tableOptions);
      const layoutOptions = manager.layoutOptions;

      const actualWidths = layoutOptions.widths;
      const expectedWidths = [width1, width2, width3];
      const originalWidths = [2, 11, 3];
      for (let i = 0; i < actualWidths.length; i++) {
        const actualWidth = actualWidths[i];
        const expectedWidth = expectedWidths[i];
        const originalWidth = originalWidths[i];
        ok(actualWidth <= expectedWidth && actualWidth >= originalWidth);
      }

      // ensure that ixFixed column remains unchanged
      equal(actualWidths[2], width3);
    });

    it('should set empty string as the cell value if the the data key is not matched with the header key', () => {
      const data = [{}, {}, {}];
      const headerData = generateHeaderData();
      process.stdout.columns = 80;
      const manager = new ResponsiveLayoutManager(data, headerData, tableOptions);

      const layoutOptions = manager.layoutOptions;

      notEqual(layoutOptions.isSmallViewPort, undefined);
      equal(layoutOptions.widths.length, 3);
      deepEqual(layoutOptions.widths, [2, 9, 3]);
    });

    it('should deal with undefined process.stdout.columns and set a default value of 80', () => {
      process.stdout.columns = undefined;
      const data = generateData();
      const headerData = generateHeaderData();
      const width1 = 15;
      const width2 = 20;
      const width3 = 25;
      data[0].id = TestUtils.generateRandomString({ minLength: width1 });
      data[0].name = TestUtils.generateRandomString({ minLength: width2 });
      data[0].age = TestUtils.generateRandomString({ minLength: width3 });
      const manager = new ResponsiveLayoutManager(data, headerData, tableOptions);

      const layoutOptions = manager.layoutOptions;

      deepEqual(layoutOptions.widths, [width1, width2, width3]);
    });
  });
});
