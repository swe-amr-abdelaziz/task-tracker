import { describe, it, mock } from 'node:test';
import { equal } from 'node:assert';

import { TaskCommand } from '../../shared/enums.js';
import { TaskController } from '../task.controller.js';
import { TaskView } from '../task.view.js';
import { TestUtils } from '../../shared/test-utils.js';

describe('TaskView', () => {
  describe('help', () => {
    it('should get help page from the controller and print it to the console', async () => {
      const expectedHelp = TestUtils.generateRandomString();
      const helpMock = mock.method(TaskController, 'help', () => expectedHelp).mock;
      const consoleLogMock = mock.method(console, 'log', () => {}).mock;
      const command = TaskCommand.LIST;

      await TaskView.help(command);

      equal(helpMock.callCount(), 1);
      equal(helpMock.calls[0].arguments[0], command);
      equal(consoleLogMock.callCount(), 1);
      equal(consoleLogMock.calls[0].arguments[0], expectedHelp);

      helpMock.restore();
      consoleLogMock.restore();
    });
  });
});
