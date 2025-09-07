import { doesNotReject, rejects } from 'node:assert';
import { describe, it } from 'node:test';

import { HorizontalAlignment } from '../../../enums.js';
import { ResponsiveTableValidator } from '../responsive-table.validator.js';
import { TestUtils } from '../../../test-utils.js';
import { messages } from '../../../messages.js';

describe('ResponsiveTableValidator', () => {
  describe('validateData', () => {
    it('should throw an Error if data is not provided', async () => {
      await rejects(
        async () => ResponsiveTableValidator.validateData(),
        {
          name: 'Error',
          message: messages.error.REQUIRED_TABLE_DATA
        }
      );
    });

    it('should throw a TypeError if data is not an array', async () => {
      const data = TestUtils.generateRandomString();

      await rejects(
        async () => ResponsiveTableValidator.validateData(data),
        {
          name: 'TypeError',
          message: messages.error.INVALID_RESPONSIVE_TABLE_DATA
        },
      );
    });

    it('should throw a RangeError if data is an empty array', async () => {
      const data = [];

      await rejects(
        async () => ResponsiveTableValidator.validateData(data),
        {
          name: 'RangeError',
          message: messages.error.REQUIRED_TABLE_DATA_ROWS
        },
      );
    });

    it('should throw a TypeError if data is not an array of objects', async () => {
      const data = [
        {
          id: TestUtils.generateRandomInt(),
          name: TestUtils.generateRandomString()
        },
        TestUtils.generateRandomString()
      ];

      await rejects(
        async () => ResponsiveTableValidator.validateData(data),
        {
          name: 'TypeError',
          message: messages.error.INVALID_RESPONSIVE_TABLE_DATA_ROW
        },
      );
    });

    it('should not throw any error even if the columns are in different order', async () => {
      const data = [
        {
          id: TestUtils.generateRandomInt(),
          name: TestUtils.generateRandomString(),
          age: TestUtils.generateRandomInt(),
        },
        {
          age: TestUtils.generateRandomInt(),
          id: TestUtils.generateRandomInt(),
          name: TestUtils.generateRandomString(),
        },
        {
          name: TestUtils.generateRandomString(),
          id: TestUtils.generateRandomInt(),
          age: TestUtils.generateRandomInt(),
        },
      ];

      await doesNotReject(
        async () => ResponsiveTableValidator.validateData(data),
      );
    });

    it('should not throw any error if data are valid', async () => {
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
        {
          id: TestUtils.generateRandomInt(),
          name: TestUtils.generateRandomString(),
          age: TestUtils.generateRandomInt(),
        },
      ];

      await doesNotReject(
        async () => ResponsiveTableValidator.validateData(data),
      );
    });
  });

  describe('validateHeaderData', () => {
    const data = [
      {
        id: TestUtils.generateRandomInt(),
        name: TestUtils.generateRandomString()
      },
      {
        id: TestUtils.generateRandomInt(),
        name: TestUtils.generateRandomString()
      },
      {
        id: TestUtils.generateRandomInt(),
        name: TestUtils.generateRandomString()
      },
    ];
    function generateRandomHeaderData() {
      return [
        {
          key: TestUtils.generateRandomString(),
          label: TestUtils.generateRandomString(),
          textAlign: HorizontalAlignment.LEFT,
        },
        {
          key: TestUtils.generateRandomString(),
          label: TestUtils.generateRandomString(),
          isFixed: true,
          textAlign: HorizontalAlignment.LEFT,
        },
        {
          key: TestUtils.generateRandomString(),
          label: TestUtils.generateRandomString(),
          isFixed: false,
          textAlign: HorizontalAlignment.LEFT,
        }
      ];
    }

    it('should throw a TypeError if headerData is not an array', async () => {
      const headerData = TestUtils.generateRandomString();

      await rejects(
        async () => ResponsiveTableValidator.validateHeaderData(headerData, data),
        {
          name: 'TypeError',
          message: messages.error.INVALID_RESPONSIVE_TABLE_HEADER_DATA
        },
      );
    });

    it('should throw a RangeError if headerData length is equal to zero', async () => {
      const headerData = [];

      await rejects(
        async () => ResponsiveTableValidator.validateHeaderData(headerData, data),
        {
          name: 'RangeError',
          message: messages.error.INVALID_RESPONSIVE_TABLE_HEADER_DATA_RANGE
        },
      );
    });

    it('should throw a TypeError if headerData contains a non-object item', async () => {
      const headerData = generateRandomHeaderData();
      headerData.push(TestUtils.generateRandomString());

      await rejects(
        async () => ResponsiveTableValidator.validateHeaderData(headerData, data),
        {
          name: 'TypeError',
          message: messages.error.INVALID_RESPONSIVE_TABLE_HEADER_DATA_ROW
        }
      );
    });

    it('should throw a TypeError if headerData item label is not a string', async () => {
      const headerData = generateRandomHeaderData();
      headerData[0].label = TestUtils.generateRandomInt();

      await rejects(
        async () => ResponsiveTableValidator.validateHeaderData(headerData, data),
        {
          name: 'TypeError',
          message: messages.error.INVALID_RESPONSIVE_TABLE_HEADER_DATA_ROW_LABEL
        }
      );
    });

    it('should throw a TypeError if headerData item isFixed is provided and it is not a boolean', async () => {
      const headerData = generateRandomHeaderData();
      headerData[0].isFixed = TestUtils.generateRandomInt();

      await rejects(
        async () => ResponsiveTableValidator.validateHeaderData(headerData, data),
        {
          name: 'TypeError',
          message: messages.error.INVALID_RESPONSIVE_TABLE_HEADER_DATA_ROW_IS_FIXED
        }
      );
    });

    it('should throw a TypeError if headerData item key is missing', async () => {
      const headerData = generateRandomHeaderData();
      delete headerData[0].key;

      await rejects(
        async () => ResponsiveTableValidator.validateHeaderData(headerData, data),
        {
          name: 'TypeError',
          message: messages.error.INVALID_RESPONSIVE_TABLE_HEADER_DATA_ROW_MISSING_KEY
        }
      );
    });

    it('should throw a TypeError if headerData item key is not a string', async () => {
      const headerData = generateRandomHeaderData();
      headerData[0].key = TestUtils.generateRandomInt();

      await rejects(
        async () => ResponsiveTableValidator.validateHeaderData(headerData, data),
        {
          name: 'TypeError',
          message: messages.error.INVALID_RESPONSIVE_TABLE_HEADER_DATA_ROW_KEY
        }
      );
    });

    it('should throw an Error if headerData item key is not unique', async () => {
      const headerData = generateRandomHeaderData();
      const key = TestUtils.generateRandomString();
      headerData[0].key = key;
      headerData[1].key = key;

      await rejects(
        async () => ResponsiveTableValidator.validateHeaderData(headerData, data),
        {
          name: 'Error',
          message: messages.error.DUPLICATE_HEADER_DATA_ROW_KEY
        }
      );
    });

    it('should throw a TypeError if textAlign is not a HorizontalAlignment', async () => {
      const headerData = generateRandomHeaderData();
      headerData[0].textAlign = TestUtils.generateRandomString();

      await rejects(
        async () => ResponsiveTableValidator.validateHeaderData(headerData, data),
        {
          name: 'TypeError',
          message: messages.error.INVALID_RESPONSIVE_TABLE_HEADER_DATA_ROW_TEXT_ALIGN
        }
      );
    });

    it('should not throw any error if headerData is valid', async () => {
      const headerData = generateRandomHeaderData();

      await doesNotReject(
        async () => ResponsiveTableValidator.validateHeaderData(headerData, data),
      );
    });
  });

  describe('validateOptions', () => {
    function generateOptions() {
      return {
        paddingLeft: TestUtils.generateRandomInt(1, 5),
        paddingRight: TestUtils.generateRandomInt(1, 5),
      };
    }

    it('should throw a TypeError if options is not an object', async () => {
      const options = TestUtils.generateRandomString();

      await rejects(
        async () => ResponsiveTableValidator.validateOptions(options),
        {
          name: 'TypeError',
          message: messages.error.INVALID_RESPONSIVE_TABLE_OPTIONS
        },
      );
    });

    it('should throw a TypeError if paddingLeft is not a number', async () => {
      const options = generateOptions();
      options.paddingLeft = TestUtils.generateRandomString();

      await rejects(
        async () => ResponsiveTableValidator.validateOptions(options),
        {
          name: 'TypeError',
          message: messages.error.INVALID_RESPONSIVE_TABLE_OPTIONS_PADDING_LEFT
        }
      );
    });

    it('should throw a RangeError if paddingLeft is negative', async () => {
      const options = generateOptions();
      options.paddingLeft = -1;

      await rejects(
        async () => ResponsiveTableValidator.validateOptions(options),
        {
          name: 'RangeError',
          message: messages.error.INVALID_RESPONSIVE_TABLE_OPTIONS_PADDING_LEFT
        }
      );
    });

    it('should throw a TypeError if paddingRight is not a number', async () => {
      const options = generateOptions();
      options.paddingRight = TestUtils.generateRandomString();

      await rejects(
        async () => ResponsiveTableValidator.validateOptions(options),
        {
          name: 'TypeError',
          message: messages.error.INVALID_RESPONSIVE_TABLE_OPTIONS_PADDING_RIGHT
        }
      );
    });

    it('should throw a RangeError if paddingRight is negative', async () => {
      const options = generateOptions();
      options.paddingRight = -1;

      await rejects(
        async () => ResponsiveTableValidator.validateOptions(options),
        {
          name: 'RangeError',
          message: messages.error.INVALID_RESPONSIVE_TABLE_OPTIONS_PADDING_RIGHT
        }
      );
    });
  });
});
