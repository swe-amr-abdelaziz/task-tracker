import { equal, rejects } from 'node:assert';
import { describe, it, mock } from 'node:test';

import { TaskValidator } from '../../utils/task.validator.js';
import { TestUtils } from '../../../shared/test-utils.js';
import { UpdateTaskDto } from '../update-task.dto.js';
import { messages } from '../../../shared/messages.js';

describe('UpdateTaskDto', () => {
  describe('constructor', () => {
    it('should throw a RangeError if more than two arguments are provided', async () => {
      const id = TestUtils.generateRandomInt().toString();
      const description = TestUtils.generateRandomString();

      await rejects(
        async () => new UpdateTaskDto(id, description, description),
        {
          name: 'RangeError',
          message: messages.error.TOO_MANY_ARGS,
        },
      );
    });

    it('should call validateTaskId with the id argument', async () => {
      const validateTaskIdFn = mock.method(TaskValidator, 'validateTaskId', () => {});
      const id = TestUtils.generateRandomInt().toString();
      const description = TestUtils.generateRandomString();

      new UpdateTaskDto(id, description);

      equal(validateTaskIdFn.mock.callCount(), 1);
      equal(validateTaskIdFn.mock.calls[0].arguments[0], id);

      validateTaskIdFn.mock.restore();
    });

    it('should call validateTaskDescription with the description argument', async () => {
      const validateTaskDescriptionFn = mock.method(TaskValidator, 'validateTaskDescription', () => {});
      const id = TestUtils.generateRandomInt().toString();
      const description = TestUtils.generateRandomString();

      new UpdateTaskDto(id, description);

      equal(validateTaskDescriptionFn.mock.callCount(), 1);
      equal(validateTaskDescriptionFn.mock.calls[0].arguments[0], description);

      validateTaskDescriptionFn.mock.restore();
    });
  })

  describe('id', () => {
    it('should be of type number', () => {
      const id = TestUtils.generateRandomInt().toString();
      const description = TestUtils.generateRandomString();
      const dto = new UpdateTaskDto(id, description);

      const actual = typeof dto.id;
      const expected = 'number';

      equal(actual, expected);
    });

    it('should return the id passed by the user', () => {
      const id = TestUtils.generateRandomInt().toString();
      const description = TestUtils.generateRandomString();
      const dto = new UpdateTaskDto(id, description);

      const actual = dto.id;
      const expected = Number(id);

      equal(actual, expected);
    });
  });

  describe('description', () => {
    it('should be of type string', () => {
      const id = TestUtils.generateRandomInt().toString();
      const description = TestUtils.generateRandomString();
      const dto = new UpdateTaskDto(id, description);

      const actual = typeof dto.description;
      const expected = 'string';

      equal(actual, expected);
    });

    it('should return the description passed by the user', () => {
      const id = TestUtils.generateRandomInt().toString();
      const description = TestUtils.generateRandomString();
      const dto = new UpdateTaskDto(id, description);

      const actual = dto.description;
      const expected = description;

      equal(actual, expected);
    });
  });
});
