import path from 'path';
import { deepStrictEqual, equal, rejects } from 'node:assert';
import { describe, it, mock } from 'node:test';
import { promises as fs } from 'fs';

import { TaskCommand } from '../../shared/enums.js';
import { TaskRouter } from '../task.router.js';
import { TaskView } from '../task.view.js';
import { messages } from '../../shared/messages.js';

describe('TaskView', () => {
  describe('help', () => {
    it(`should read the help file for the given valid command`, () => {
      // Arrange
      const readFileMock = mock.method(fs, 'readFile', () => {});
      const pathJoinMock = mock.method(path, 'join', () => {});
      const commands = [
        TaskCommand.ADD,
        TaskCommand.UPDATE,
        TaskCommand.DELETE,
        TaskCommand.MARK_IN_PROGRESS,
        TaskCommand.MARK_DONE,
        TaskCommand.LIST,
        TaskCommand.HELP,
        undefined,
      ];

      for (let index = 0; index < commands.length; index++) {
        // Act
        const command = commands[index];
        TaskView.help(command);

        // Assert
        equal(readFileMock.mock.callCount(), index + 1);
        equal(pathJoinMock.mock.callCount(), index + 1);
        const lastArgIndex = pathJoinMock.mock.calls[index].arguments.length - 1;
        const expectedFilename = `${command ?? 'help'}.txt`;
        equal(pathJoinMock.mock.calls[index].arguments[lastArgIndex], expectedFilename);
      }

      // Teardown
      readFileMock.mock.restore();
      pathJoinMock.mock.restore();
    });

    it(`should throw an error if the command is invalid`, async () => {
      // Arrange
      const command = 'invalid-command';

      // Act & Assert
      const errorMessage = messages.error.INVALID_TASK_COMMAND.replace('{0}', command);
      await rejects(
        async () => TaskView.help(command),
        { message: errorMessage },
      );
    });
  });
});
