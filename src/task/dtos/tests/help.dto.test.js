import { equal, rejects } from 'node:assert';
import { describe, it, mock } from 'node:test';

import { HelpDto } from '../help.dto.js';
import { TaskCommand } from '../../../shared/enums.js';
import { TaskValidator } from '../../utils/task.validator.js';
import { TestUtils } from '../../../shared/test-utils.js';
import { messages } from '../../../shared/messages.js';

describe('HelpDto', () => {
  describe('constructor', () => {
    it('should throw a RangeError if more than one argument is provided', async () => {
      const command = TestUtils.generateRandomString();

      await rejects(
        async () => new HelpDto(command, command),
        {
          name: 'RangeError',
          message: messages.error.TOO_MANY_ARGS,
        },
      );
    });

    it('should call validateHelpCommand with the command argument', async () => {
      const validateHelpCommandFn = mock.method(TaskValidator, 'validateHelpCommand', () => {});
      const command = TaskCommand.ADD;

      new HelpDto(command);

      equal(validateHelpCommandFn.mock.callCount(), 1);
      equal(validateHelpCommandFn.mock.calls[0].arguments[0], command);

      validateHelpCommandFn.mock.restore();
    });
  })

  describe('command', () => {
    it('should be of type string', () => {
      const command = TaskCommand.ADD;
      const dto = new HelpDto(command);

      const actual = typeof dto.command;
      const expected = 'string';

      equal(actual, expected);
    });

    it('should return the command passed by the user', () => {
      const command = TaskCommand.ADD;
      const dto = new HelpDto(command);

      const actual = dto.command;
      const expected = command;

      equal(actual, expected);
    });
  });
});
