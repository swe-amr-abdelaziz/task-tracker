import { describe, it, mock } from 'node:test';
import { equal } from 'node:assert';

import { TaskCommand } from '../../shared/enums.js';
import { TaskController } from '../task.controller.js';
import { TaskView } from '../task.view.js';

describe('TaskView', () => {
  describe('help', () => {
    it('should get help page from the controller and print it to the console', async () => {
      // Arrange
      const expectedHelp = "help page text";
      const helpMock = mock.method(TaskController, 'help', () => expectedHelp);
      const consoleLogMock = mock.method(console, 'log', () => {});
      const command = TaskCommand.LIST;

      // Act
      await TaskView.help(command);

      // Assert
      equal(helpMock.mock.callCount(), 1);
      equal(helpMock.mock.calls[0].arguments[0], command);
      equal(consoleLogMock.mock.callCount(), 1);
      equal(consoleLogMock.mock.calls[0].arguments[0], expectedHelp);

      // Teardown
      helpMock.mock.restore();
      consoleLogMock.mock.restore();
    });
  });
});
