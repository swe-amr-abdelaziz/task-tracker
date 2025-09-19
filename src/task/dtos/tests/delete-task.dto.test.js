import { equal, rejects } from 'node:assert';
import { describe, it, mock } from 'node:test';

import { DeleteTaskDto } from '../delete-task.dto.js';
import { TaskValidator } from '../../utils/task.validator.js';
import { TestUtils } from '../../../shared/test-utils.js';
import { messages } from '../../../shared/messages.js';

describe('DeleteTaskDto', () => {
  describe('constructor', () => {
    it('should throw a RangeError if more than one argument is provided', async () => {
      const id = TestUtils.generateRandomInt().toString();

      await rejects(
        async () => new DeleteTaskDto(id, id),
        {
          name: 'RangeError',
          message: messages.error.TOO_MANY_ARGS,
        },
      );
    });

    it('should call validateTaskId with the id argument', async () => {
      const validateTaskIdFn = mock.method(TaskValidator, 'validateTaskId', () => {});
      const id = TestUtils.generateRandomInt().toString();

      new DeleteTaskDto(id);

      equal(validateTaskIdFn.mock.callCount(), 1);
      equal(validateTaskIdFn.mock.calls[0].arguments[0], id);

      validateTaskIdFn.mock.restore();
    });
  })

  describe('id', () => {
    it('should be of type number', () => {
      const id = TestUtils.generateRandomInt().toString();
      const dto = new DeleteTaskDto(id);

      const actual = typeof dto.id;
      const expected = 'number';

      equal(actual, expected);
    });

    it('should return the id passed by the user', () => {
      const id = TestUtils.generateRandomInt().toString();
      const dto = new DeleteTaskDto(id);

      const actual = dto.id;
      const expected = Number(id);

      equal(actual, expected);
    });
  });
});
