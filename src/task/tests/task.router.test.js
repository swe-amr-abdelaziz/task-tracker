import { deepStrictEqual, equal, rejects } from 'node:assert';
import { describe, it, mock } from 'node:test';

import { TaskCommand } from '../../shared/enums.js';
import { TaskRouter } from '../task.router.js';
import { TaskView } from '../task.view.js';
import { messages } from '../../shared/messages.js';

describe('TaskRouter', () => {
  describe('route', () => {
    it(`should call the 'addTask' method if the command is '${TaskCommand.ADD}'`, () => {
      // Arrange
      const addTaskMock = mock.method(TaskView, 'addTask', () => {});
      const args = [TaskCommand.ADD];

      // Act
      TaskRouter.route(args);

      // Assert
      equal(addTaskMock.mock.callCount(), 1);
      deepStrictEqual(
        addTaskMock.mock.calls[0].arguments,
        [...args.slice(1)],
      );

      // Teardown
      addTaskMock.mock.restore();
    });

    it(`should call the 'updateTask' method if the command is '${TaskCommand.UPDATE}'`, () => {
      // Arrange
      const updateTaskMock = mock.method(TaskView, 'updateTask', () => {});
      const args = [TaskCommand.UPDATE];

      // Act
      TaskRouter.route(args);

      // Assert
      equal(updateTaskMock.mock.callCount(), 1);
      deepStrictEqual(
        updateTaskMock.mock.calls[0].arguments,
        [...args.slice(1)],
      );

      // Teardown
      updateTaskMock.mock.restore();
    });

    it(`should call the 'deleteTask' method if the command is '${TaskCommand.DELETE}'`, () => {
      // Arrange
      const deleteTaskMock = mock.method(TaskView, 'deleteTask', () => {});
      const args = [TaskCommand.DELETE];

      // Act
      TaskRouter.route(args);

      // Assert
      equal(deleteTaskMock.mock.callCount(), 1);
      deepStrictEqual(
        deleteTaskMock.mock.calls[0].arguments,
        [...args.slice(1)],
      );

      // Teardown
      deleteTaskMock.mock.restore();
    });

    it(`should call the 'markTaskAsInProgress' method if the command is '${TaskCommand.MARK_IN_PROGRESS}'`, () => {
      // Arrange
      const markTaskAsInProgressMock = mock.method(TaskView, 'markTaskAsInProgress', () => {});
      const args = [TaskCommand.MARK_IN_PROGRESS];

      // Act
      TaskRouter.route(args);

      // Assert
      equal(markTaskAsInProgressMock.mock.callCount(), 1);
      deepStrictEqual(
        markTaskAsInProgressMock.mock.calls[0].arguments,
        [...args.slice(1)],
      );

      // Teardown
      markTaskAsInProgressMock.mock.restore();
    });

    it(`should call the 'markTaskAsDone' method if the command is '${TaskCommand.MARK_DONE}'`, () => {
      // Arrange
      const markTaskAsDoneMock = mock.method(TaskView, 'markTaskAsDone', () => {});
      const args = [TaskCommand.MARK_DONE];

      // Act
      TaskRouter.route(args);

      // Assert
      equal(markTaskAsDoneMock.mock.callCount(), 1);
      deepStrictEqual(
        markTaskAsDoneMock.mock.calls[0].arguments,
        [...args.slice(1)],
      );

      // Teardown
      markTaskAsDoneMock.mock.restore();
    });

    it(`should call the 'getTasksList' method if the command is '${TaskCommand.LIST}'`, () => {
      // Arrange
      const getTasksListMock = mock.method(TaskView, 'getTasksList', () => {});
      const args = [TaskCommand.LIST];

      // Act
      TaskRouter.route(args);

      // Assert
      equal(getTasksListMock.mock.callCount(), 1);
      deepStrictEqual(
        getTasksListMock.mock.calls[0].arguments,
        [...args.slice(1)],
      );

      // Teardown
      getTasksListMock.mock.restore();
    });

    it(`should call the 'help' method if the command is '${TaskCommand.HELP}'`, () => {
      // Arrange
      const helpMock = mock.method(TaskView, 'help', () => {});
      const args = [TaskCommand.HELP];

      // Act
      TaskRouter.route(args);

      // Assert
      equal(helpMock.mock.callCount(), 1);
      deepStrictEqual(
        helpMock.mock.calls[0].arguments,
        [...args.slice(1)],
      );

      // Teardown
      helpMock.mock.restore();
    });

    it(`should call the 'help' method if the command is not provided`, () => {
      // Arrange
      const helpMock = mock.method(TaskView, 'help', () => {});
      const args = [];

      // Act
      TaskRouter.route(args);

      // Assert
      equal(helpMock.mock.callCount(), 1);
      deepStrictEqual(
        helpMock.mock.calls[0].arguments,
        [...args.slice(1)],
      );

      // Teardown
      helpMock.mock.restore();
    });

    it(`should throw an error if the command is invalid`, async () => {
      // Arrange
      const args = ['invalid-command'];

      // Act & Assert
      await rejects(
        async () => TaskRouter.route(args),
        { message: messages.error.INVALID_TASK_COMMAND },
      );
    });
  });
});
