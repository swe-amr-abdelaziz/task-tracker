import path from 'path';
import { after, afterEach, describe, it, mock } from 'node:test';
import { equal } from 'node:assert';

import { TaskCommand } from '../../shared/enums.js';
import { TaskController } from '../task.controller.js';
import { TaskModel } from '../task.model.js';
import { TestUtils } from '../../shared/test-utils.js';

describe('TaskController', () => {
  after(() => {
    mock.restoreAll();
  });

  describe('help', () => {
    const expectedPath = TestUtils.generateRandomString();
    const expectedHelpPage = TestUtils.generateRandomString();
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

    const pathJoinMock = mock.method(path, 'join', () => expectedPath).mock;
    const readHelpPageMock = mock.method(TaskModel, 'readHelpPage', () => expectedHelpPage).mock;

    afterEach(() => {
      pathJoinMock.resetCalls();
      readHelpPageMock.resetCalls();
    });

    it('should construct the "docsPath"', async () => {
      for (let index = 0; index < commands.length; index++) {
        const command = commands[index];
        const expectedFilename = `${command ?? 'help'}.txt`;

        await TaskController.help(command);
        const lastArgIndex = pathJoinMock.calls[index].arguments.length - 1;

        equal(pathJoinMock.callCount(), index + 1);
        equal(pathJoinMock.calls[index].arguments[lastArgIndex], expectedFilename);
      }
    });

    it('should return the help page from the model', async () => {
      for (let index = 0; index < commands.length; index++) {
        const command = commands[index];

        const helpPage = await TaskController.help(command);

        equal(helpPage, expectedHelpPage);
        equal(readHelpPageMock.callCount(), index + 1);
        equal(readHelpPageMock.calls[index].arguments[0], expectedPath);
        equal(readHelpPageMock.calls[index].arguments[1], command);
      }
    });
  });
});
