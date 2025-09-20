import { equal, ok, rejects } from 'node:assert';
import { describe, it } from 'node:test';

import { GetTasksListDto } from '../get-tasks-list.dto.js';
import { OrderDirection, TaskStatus, TaskTableColumn } from '../../../shared/enums.js';
import { TestUtils } from '../../../shared/test-utils.js';
import { messages } from '../../../shared/messages.js';

describe('GetTasksListDto', () => {
  const id = TestUtils.generateRandomInt();
  const description = '^test$';
  const status = TaskStatus.DONE;
  const dateAfter = '2020-01-01';
  const dateBefore = '2025-01-01';
  const orderBy = TaskTableColumn.ID;
  const orderDirection = OrderDirection.DESC;
  const page = TestUtils.generateRandomInt();
  const limit = TestUtils.generateRandomInt();

  const getArgs = () => [
    `--id=${id}`,
    `--description=${description}`,
    `--status=${status}`,
    `--created-after=${dateAfter}`,
    `--created-before=${dateBefore}`,
    `--updated-after=${dateAfter}`,
    `--updated-before=${dateBefore}`,
    `--order-by=${orderBy}`,
    `--${orderDirection}`,
    `--page=${page}`,
    `--limit=${limit}`,
  ];

  describe('id', () => {
    it('should return undefined if no id is provided', () => {
      let args = getArgs();
      args = args.filter(arg => !arg.startsWith('--id'));

      const dto = new GetTasksListDto(...args);

      equal(dto.id, undefined);
    });

    it('should be of type number', () => {
      const args = getArgs();

      const dto = new GetTasksListDto(...args);

      equal(typeof dto.id, 'number');
    });

    it('should return the id passed by the user', () => {
      const args = getArgs();

      const dto = new GetTasksListDto(...args);

      equal(dto.id, id);
    });

    it('should throw a SyntaxError if id is empty', async () => {
      const args = getArgs();
      args[0] = '--id=';

      await rejects(
        async () => new GetTasksListDto(...args),
        {
          name: 'SyntaxError',
          message: messages.error.EMPTY_CLI_ARG_VALUE,
        },
      );
    });

    it('should throw a TypeError if id is not a number', async () => {
      const args = getArgs();
      const id = TestUtils.generateRandomString({ excludeNumbers: true });
      args[0] = `--id=${id}`;

      await rejects(
        async () => new GetTasksListDto(...args),
        {
          name: 'TypeError',
          message: messages.error.INVALID_ID_ARG_TYPE,
        },
      );
    });
  });

  describe('description', () => {
    it('should return undefined if no description is provided', () => {
      let args = getArgs();
      args = args.filter(arg => !arg.startsWith('--description'));

      const dto = new GetTasksListDto(...args);

      equal(dto.description, undefined);
    });

    it('should be of type RegExp', () => {
      const args = getArgs();

      const dto = new GetTasksListDto(...args);

      ok(dto.description instanceof RegExp);
    });

    it('should return the description passed by the user', () => {
      const args = getArgs();

      const dto = new GetTasksListDto(...args);

      const { description: regex } = dto;

      equal(regex.test('test'), true);
      equal(regex.test('test test'), false);
    });

    it('should throw a SyntaxError if description is empty', async () => {
      const args = getArgs();
      args[1] = '--description='

      await rejects(
        async () => new GetTasksListDto(...args),
        {
          name: 'SyntaxError',
          message: messages.error.EMPTY_CLI_ARG_VALUE,
        },
      );
    });

    it('should throw a SyntaxError if description is not a valid regular expression', async () => {
      const args = getArgs();
      args[1] = '--description=test\\';

      await rejects(
        async () => new GetTasksListDto(...args),
        {
          name: 'SyntaxError',
          message: messages.error.INVALID_DESCRIPTION_REGEX,
        },
      );
    });
  });

  describe('status', () => {
    it('should return undefined if no status is provided', () => {
      let args = getArgs();
      args = args.filter(arg => !arg.startsWith('--status'));

      const dto = new GetTasksListDto(...args);

      equal(dto.status, undefined);
    });

    it('should be of type string', () => {
      const args = getArgs();

      const dto = new GetTasksListDto(...args);

      equal(typeof dto.status, 'string');
    });

    it('should return the status passed by the user', () => {
      const args = getArgs();

      const dto = new GetTasksListDto(...args);

      equal(dto.status, status);
    });

    it('should throw a SyntaxError if status is empty', async () => {
      const args = getArgs();
      args[2] = '--status=';

      await rejects(
        async () => new GetTasksListDto(...args),
        {
          name: 'SyntaxError',
          message: messages.error.EMPTY_CLI_ARG_VALUE,
        },
      );
    });

    it('should throw a TypeError if status is not a valid status', async () => {
      const args = getArgs();
      args[2] = `--status=${TestUtils.generateRandomString()}`;

      await rejects(
        async () => new GetTasksListDto(...args),
        {
          name: 'TypeError',
          message: messages.error.INVALID_STATUS_ARG_TYPE,
        },
      );
    });
  });

  describe('createdAfter', () => {
    it('should return undefined if no createdAfter is provided', () => {
      let args = getArgs();
      args = args.filter(arg => !arg.startsWith('--created-after'));

      const dto = new GetTasksListDto(...args);

      equal(dto.createdAfter, undefined);
    });

    it('should be of type Date', () => {
      const args = getArgs();

      const dto = new GetTasksListDto(...args);

      ok(dto.createdAfter instanceof Date);
    });

    it('should return the createdAfter passed by the user', () => {
      const args = getArgs();

      const dto = new GetTasksListDto(...args);

      equal(dto.createdAfter.toISOString(), new Date(dateAfter).toISOString());
    });

    it('should throw a SyntaxError if createdAfter is empty', async () => {
      const args = getArgs();
      args[3] = '--created-after=';

      await rejects(
        async () => new GetTasksListDto(...args),
        {
          name: 'SyntaxError',
          message: messages.error.EMPTY_CLI_ARG_VALUE,
        },
      );
    });

    it('should throw a TypeError if createdAfter is not a valid date', async () => {
      const args = getArgs();
      args[3] = `--created-after=${TestUtils.generateRandomString()}`;

      await rejects(
        async () => new GetTasksListDto(...args),
        {
          name: 'TypeError',
          message: messages.error.INVALID_CREATED_AFTER_ARG_TYPE,
        },
      );
    });
  });

  describe('createdBefore', () => {
    it('should return undefined if no createdBefore is provided', () => {
      let args = getArgs();
      args = args.filter(arg => !arg.startsWith('--created-before'));

      const dto = new GetTasksListDto(...args);

      equal(dto.createdBefore, undefined);
    });

    it('should be of type Date', () => {
      const args = getArgs();

      const dto = new GetTasksListDto(...args);

      ok(dto.createdBefore instanceof Date);
    });

    it('should return the createdBefore passed by the user', () => {
      const args = getArgs();

      const dto = new GetTasksListDto(...args);

      equal(dto.createdBefore.toISOString(), new Date(dateBefore).toISOString());
    });

    it('should throw a SyntaxError if createdBefore is empty', async () => {
      const args = getArgs();
      args[4] = '--created-before=';

      await rejects(
        async () => new GetTasksListDto(...args),
        {
          name: 'SyntaxError',
          message: messages.error.EMPTY_CLI_ARG_VALUE,
        },
      );
    });

    it('should throw a TypeError if createdBefore is not a valid date', async () => {
      const args = getArgs();
      args[4] = `--created-before=${TestUtils.generateRandomString()}`;

      await rejects(
        async () => new GetTasksListDto(...args),
        {
          name: 'TypeError',
          message: messages.error.INVALID_CREATED_BEFORE_ARG_TYPE,
        },
      );
    });
  });

  describe('updatedAfter', () => {
    it('should return undefined if no updatedAfter is provided', () => {
      let args = getArgs();
      args = args.filter(arg => !arg.startsWith('--updated-after'));

      const dto = new GetTasksListDto(...args);

      equal(dto.updatedAfter, undefined);
    });

    it('should be of type Date', () => {
      const args = getArgs();

      const dto = new GetTasksListDto(...args);

      ok(dto.updatedAfter instanceof Date);
    });

    it('should return the updatedAfter passed by the user', () => {
      const args = getArgs();

      const dto = new GetTasksListDto(...args);

      equal(dto.updatedAfter.toISOString(), new Date(dateAfter).toISOString());
    });

    it('should throw a SyntaxError if updatedAfter is empty', async () => {
      const args = getArgs();
      args[5] = '--updated-after=';

      await rejects(
        async () => new GetTasksListDto(...args),
        {
          name: 'SyntaxError',
          message: messages.error.EMPTY_CLI_ARG_VALUE,
        },
      );
    });

    it('should throw a TypeError if updatedAfter is not a valid date', async () => {
      const args = getArgs();
      args[5] = `--updated-after=${TestUtils.generateRandomString()}`;

      await rejects(
        async () => new GetTasksListDto(...args),
        {
          name: 'TypeError',
          message: messages.error.INVALID_UPDATED_AFTER_ARG_TYPE,
        },
      );
    });
  });

  describe('updatedBefore', () => {
    it('should return undefined if no updatedBefore is provided', () => {
      let args = getArgs();
      args = args.filter(arg => !arg.startsWith('--updated-before'));

      const dto = new GetTasksListDto(...args);

      equal(dto.updatedBefore, undefined);
    });

    it('should be of type Date', () => {
      const args = getArgs();

      const dto = new GetTasksListDto(...args);

      ok(dto.updatedBefore instanceof Date);
    });

    it('should return the updatedBefore passed by the user', () => {
      const args = getArgs();

      const dto = new GetTasksListDto(...args);

      equal(dto.updatedBefore.toISOString(), new Date(dateBefore).toISOString());
    });

    it('should throw a SyntaxError if updatedBefore is empty', async () => {
      const args = getArgs();
      args[6] = '--updated-before=';

      await rejects(
        async () => new GetTasksListDto(...args),
        {
          name: 'SyntaxError',
          message: messages.error.EMPTY_CLI_ARG_VALUE,
        },
      );
    });

    it('should throw a TypeError if updatedBefore is not a valid date', async () => {
      const args = getArgs();
      args[6] = `--updated-before=${TestUtils.generateRandomString()}`;

      await rejects(
        async () => new GetTasksListDto(...args),
        {
          name: 'TypeError',
          message: messages.error.INVALID_UPDATED_BEFORE_ARG_TYPE,
        },
      );
    });
  });

  describe('orderBy', () => {
    it('should return undefined if no orderBy is provided', () => {
      let args = getArgs();
      args = args.filter(arg => !arg.startsWith('--order-by'));

      const dto = new GetTasksListDto(...args);

      equal(dto.orderBy, undefined);
    });

    it('should be of type string', () => {
      const args = getArgs();

      const dto = new GetTasksListDto(...args);

      equal(typeof dto.orderBy, 'string');
    });

    it('should return the orderBy passed by the user', () => {
      const args = getArgs();

      const dto = new GetTasksListDto(...args);

      equal(dto.orderBy, orderBy);
    });

    it('should throw a SyntaxError if orderBy is empty', async () => {
      const args = getArgs();
      args[7] = '--order-by=';

      await rejects(
        async () => new GetTasksListDto(...args),
        {
          name: 'SyntaxError',
          message: messages.error.EMPTY_CLI_ARG_VALUE,
        },
      );
    });

    it('should throw a TypeError if orderBy is not a valid column name', async () => {
      const args = getArgs();
      args[7] = `--order-by=${TestUtils.generateRandomString()}`;

      await rejects(
        async () => new GetTasksListDto(...args),
        {
          name: 'TypeError',
          message: messages.error.INVALID_ORDER_BY_ARG_TYPE,
        },
      );
    });
  });

  describe('orderDirection', () => {
    it('should return asc by default if no orderDirection is provided', () => {
      let args = getArgs();
      args = args.filter(arg => arg !== `--${orderDirection}`);

      const dto = new GetTasksListDto(...args);

      equal(dto.orderDirection, OrderDirection.ASC);
    });

    it('should be of type string', () => {
      const args = getArgs();

      const dto = new GetTasksListDto(...args);

      equal(typeof dto.orderDirection, 'string');
    });

    it('should return the orderDirection passed by the user', () => {
      const args = getArgs();

      const dto = new GetTasksListDto(...args);

      equal(dto.orderDirection, orderDirection);
    });

    it('should throw a SyntaxError if both asc and desc are provided', async () => {
      const args = getArgs();
      args.push(`--${OrderDirection.ASC}`);

      await rejects(
        async () => new GetTasksListDto(...args),
        {
          name: 'SyntaxError',
          message: messages.error.CONFLICTING_ORDER_DIRECTIONS,
        },
      );
    });
  });

  describe('page', () => {
    it('should return 1 by default if no page is provided', () => {
      let args = getArgs();
      args = args.filter(arg => !arg.startsWith('--page'));

      const dto = new GetTasksListDto(...args);

      equal(dto.page, 1);
    });

    it('should be of type number', () => {
      const args = getArgs();

      const dto = new GetTasksListDto(...args);

      equal(typeof dto.page, 'number');
    });

    it('should return the page passed by the user', () => {
      const args = getArgs();

      const dto = new GetTasksListDto(...args);

      equal(dto.page, page);
    });

    it('should throw a SyntaxError if page is empty', async () => {
      const args = getArgs();
      args[9] = '--page=';

      await rejects(
        async () => new GetTasksListDto(...args),
        {
          name: 'SyntaxError',
          message: messages.error.EMPTY_CLI_ARG_VALUE,
        },
      );
    });

    it('should throw a TypeError if page is not a number', async () => {
      const args = getArgs();
      const page = TestUtils.generateRandomString({ excludeNumbers: true });
      args[9] = `--page=${page}`;

      await rejects(
        async () => new GetTasksListDto(...args),
        {
          name: 'TypeError',
          message: messages.error.INVALID_PAGE_ARG_TYPE,
        },
      );
    });

    it('should throw a RangeError if page is less than 1', async () => {
      const args = getArgs();
      const page = 0;
      args[9] = `--page=${page}`;

      await rejects(
        async () => new GetTasksListDto(...args),
        {
          name: 'RangeError',
          message: messages.error.PAGE_NUMBER_OUT_OF_RANGE,
        },
      );
    });
  });

  describe('limit', () => {
    it('should return 0 by default if no limit is provided', () => {
      let args = getArgs();
      args = args.filter(arg => !arg.startsWith('--limit'));

      const dto = new GetTasksListDto(...args);

      equal(dto.limit, 0);
    });

    it('should be of type number', () => {
      const args = getArgs();

      const dto = new GetTasksListDto(...args);

      equal(typeof dto.limit, 'number');
    });

    it('should return the page limit passed by the user', () => {
      const args = getArgs();

      const dto = new GetTasksListDto(...args);

      equal(dto.limit, limit);
    });

    it('should throw a SyntaxError if limit is empty', async () => {
      const args = getArgs();
      args[10] = '--limit=';

      await rejects(
        async () => new GetTasksListDto(...args),
        {
          name: 'SyntaxError',
          message: messages.error.EMPTY_CLI_ARG_VALUE,
        },
      );
    });

    it('should throw a TypeError if page limit is not a number', async () => {
      const args = getArgs();
      const limit = TestUtils.generateRandomString({ excludeNumbers: true });
      args[10] = `--limit=${limit}`;

      await rejects(
        async () => new GetTasksListDto(...args),
        {
          name: 'TypeError',
          message: messages.error.INVALID_PAGE_LIMIT_ARG_TYPE,
        },
      );
    });

    it('should throw a RangeError if page limit is less than 0', async () => {
      const args = getArgs();
      const limit = -1;
      args[10] = `--limit=${limit}`;

      await rejects(
        async () => new GetTasksListDto(...args),
        {
          name: 'RangeError',
          message: messages.error.PAGE_LIMIT_OUT_OF_RANGE,
        },
      );
    });

    it('should throw a RangeError if page limit is 0 and page is not 1', async () => {
      const args = getArgs();
      const page = 2;
      const limit = 0;
      args[9] = `--page=${page}`;
      args[10] = `--limit=${limit}`;

      await rejects(
        async () => new GetTasksListDto(...args),
        {
          name: 'RangeError',
          message: messages.error.PAGE_WITH_UNLIMITED_LIMIT,
        },
      );
    });
  });
});
