import path from 'path';
import { describe, it, mock } from 'node:test';
import { equal } from 'node:assert';

import { TaskCommand } from '../../shared/enums.js';
import { TaskController } from '../task.controller.js';
import { TaskModel } from '../task.model.js';

describe('TaskController', () => {
  describe('help', () => {
    it('should construct the "docsPath" and get the help page from the model', async () => {
      // Arrange
      const expectedPath = "docs/help/help.txt";
      const expectedHelpPage = "help page text";
      const pathJoinMock = mock.method(path, 'join', () => expectedPath);
      const readHelpPageMock = mock.method(TaskModel, 'readHelpPage', () => expectedHelpPage);
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
        const helpPage = await TaskController.help(command);

        // Assert
        equal(pathJoinMock.mock.callCount(), index + 1);
        const lastArgIndex = pathJoinMock.mock.calls[index].arguments.length - 1;
        const expectedFilename = `${command ?? 'help'}.txt`;
        equal(pathJoinMock.mock.calls[index].arguments[lastArgIndex], expectedFilename);
        equal(readHelpPageMock.mock.callCount(), index + 1);
        equal(readHelpPageMock.mock.calls[index].arguments[0], expectedPath);
        equal(readHelpPageMock.mock.calls[index].arguments[1], command);
        equal(helpPage, expectedHelpPage);
      }

      // Teardown
      pathJoinMock.mock.restore();
      readHelpPageMock.mock.restore();
    });
  });
});
