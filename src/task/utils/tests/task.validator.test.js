import { doesNotReject, rejects } from 'node:assert';
import { describe, it } from 'node:test';

import { TaskBuilder } from '../task.builder.js';
import { TaskCommand } from '../../../shared/enums.js';
import { TaskValidator } from '../task.validator.js';
import { TestUtils } from '../../../shared/test-utils.js';
import { messages } from '../../../shared/messages.js';

describe('TaskValidator', () => {
  describe('validateTaskId', () => {
    it('should throw a TypeError if id is undefined', async () => {
      const id = undefined;

      await rejects(
        async () => TaskValidator.validateTaskId(id),
        {
          name: 'TypeError',
          message: messages.error.REQUIRED_TASK_ID,
        },
      );
    });

    it('should throw a TypeError if id is null', async () => {
      const id = null;

      await rejects(
        async () => TaskValidator.validateTaskId(id),
        {
          name: 'TypeError',
          message: messages.error.REQUIRED_TASK_ID,
        },
      );
    });

    it('should throw a TypeError if id is not a valid number', async () => {
      const id = TestUtils.generateRandomString();

      await rejects(
        async () => TaskValidator.validateTaskId(id),
        {
          name: 'TypeError',
          message: messages.error.INVALID_TASK_ID,
        },
      );
    });

    it('should not throw any error if id is a valid number (string)', async () => {
      const id = TestUtils.generateRandomInt().toString();

      await doesNotReject(
        async () => TaskValidator.validateTaskId(id),
      );
    });

    it('should not throw any error if id is a valid number (number)', async () => {
      const id = TestUtils.generateRandomInt();

      await doesNotReject(
        async () => TaskValidator.validateTaskId(id),
      );
    });
  });

  describe('validateTaskDescription', () => {
    it('should throw a TypeError if description is undefined', async () => {
      const description = undefined;

      await rejects(
        async () => TaskValidator.validateTaskDescription(description),
        {
          name: 'TypeError',
          message: messages.error.REQUIRED_TASK_DESCRIPTION,
        },
      );
    });

    it('should throw a TypeError if description is null', async () => {
      const description = null;

      await rejects(
        async () => TaskValidator.validateTaskDescription(description),
        {
          name: 'TypeError',
          message: messages.error.REQUIRED_TASK_DESCRIPTION,
        },
      );
    });

    it('should throw a TypeError if description is whitespace', async () => {
      const description = '    ';

      await rejects(
        async () => TaskValidator.validateTaskDescription(description),
        {
          name: 'TypeError',
          message: messages.error.REQUIRED_TASK_DESCRIPTION,
        },
      );
    });

    it('should throw a TypeError if description is not a string', async () => {
      const description = TestUtils.generateRandomInt();

      await rejects(
        async () => TaskValidator.validateTaskDescription(description),
        {
          name: 'TypeError',
          message: messages.error.INVALID_TASK_DESCRIPTION,
        },
      );
    });


    it('should not throw any error if description is a valid string', async () => {
      const description = TestUtils.generateRandomString();

      await doesNotReject(
        async () => TaskValidator.validateTaskDescription(description),
      );
    });
  });

  describe('validateHelpCommand', () => {
    it('should throw an Error if the command is "help"', async () => {
      const command = TaskCommand.HELP;

      await rejects(
        async () => TaskValidator.validateHelpCommand(command),
        {
          name: 'Error',
          message: messages.error.INVALID_HELP_COMMAND,
        },
      );
    });

    it('should not throw any error if command is valid', async () => {
      const command = TaskCommand.ADD;

      await doesNotReject(
        async () => TaskValidator.validateHelpCommand(command),
      );
    });
  })

  describe('validateTasksType', () => {
    it('should throw a TypeError if data is not an array of Task instances', async () => {
      const data = [
        new TaskBuilder().build(),
        { description: TestUtils.generateRandomString() },
      ];

      await rejects(
        async () => TaskValidator.validateTasksType(data),
        {
          name: 'TypeError',
          message: messages.error.INVALID_TASKS_DATA_TYPE,
        },
      );
    });

    it('should throw a TypeError if data is not an instance of Task', async () => {
      const data = { description: TestUtils.generateRandomString() };

      await rejects(
        async () => TaskValidator.validateTasksType(data),
        {
          name: 'TypeError',
          message: messages.error.INVALID_TASK_DATA_TYPE,
        },
      );
    });

    it('should not throw any error if data is an array of Task instances', async () => {
      const data = [
        new TaskBuilder().build(),
        new TaskBuilder().build(),
      ];

      await doesNotReject(
        async () => TaskValidator.validateTasksType(data),
      );
    });

    it('should not throw any error if data is an instance of Task', async () => {
      const data = new TaskBuilder().build();

      await doesNotReject(
        async () => TaskValidator.validateTasksType(data),
      );
    });
  })
});
