import { equal, rejects } from 'node:assert';
import { describe, it, mock } from 'node:test';

import { AddTaskDto } from '../add-task.dto.js';
import { TaskValidator } from '../../utils/task.validator.js';
import { TestUtils } from '../../../shared/test-utils.js';
import { messages } from '../../../shared/messages.js';

describe('AddTaskDto', () => {
  describe('constructor', () => {
    it('should throw a RangeError if more than one argument is provided', async () => {
      const description = TestUtils.generateRandomString();

      await rejects(
        async () => new AddTaskDto(description, description),
        {
          name: 'RangeError',
          message: messages.error.TOO_MANY_ARGS,
        },
      );
    });

    it('should call validateTaskDescription with the description argument', async () => {
      const validateTaskDescriptionFn = mock.method(TaskValidator, 'validateTaskDescription', () => {});
      const description = TestUtils.generateRandomString();

      new AddTaskDto(description);

      equal(validateTaskDescriptionFn.mock.callCount(), 1);
      equal(validateTaskDescriptionFn.mock.calls[0].arguments[0], description);

      validateTaskDescriptionFn.mock.restore();
    });
  })

  describe('description', () => {
    it('should be of type string', () => {
      const description = TestUtils.generateRandomString();
      const dto = new AddTaskDto(description);

      const actual = typeof dto.description;
      const expected = 'string';

      equal(actual, expected);
    });

    it('should return the description passed by the user', () => {
      const description = TestUtils.generateRandomString();
      const dto = new AddTaskDto(description);

      const actual = dto.description;
      const expected = description;

      equal(actual, expected);
    });
  });
});
