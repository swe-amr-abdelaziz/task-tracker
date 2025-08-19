import { deepStrictEqual, equal, rejects } from 'node:assert';
import { afterEach, describe, it, mock } from 'node:test';

import { TaskCommand } from '../../shared/enums.js';
import { TaskRouter } from '../task.router.js';
import { TaskView } from '../task.view.js';
import { TestUtils } from '../../shared/test-utils.js';
import { messages } from '../../shared/messages.js';

describe('TaskRouter', () => {
  describe('route', () => {
    afterEach(() => {
      mock.restoreAll();
    });

    it(`should call the 'addTask' method if the command is '${TaskCommand.ADD}'`, () => {
      const addTaskMock = mock.method(TaskView, 'addTask', () => {});
      const args = [TaskCommand.ADD];

      TaskRouter.route(args);

      equal(addTaskMock.mock.callCount(), 1);
      deepStrictEqual(
        addTaskMock.mock.calls[0].arguments,
        [...args.slice(1)],
      );
    });

    it(`should call the 'updateTask' method if the command is '${TaskCommand.UPDATE}'`, () => {
      const updateTaskMock = mock.method(TaskView, 'updateTask', () => {});
      const args = [TaskCommand.UPDATE];

      TaskRouter.route(args);

      equal(updateTaskMock.mock.callCount(), 1);
      deepStrictEqual(
        updateTaskMock.mock.calls[0].arguments,
        [...args.slice(1)],
      );
    });

    it(`should call the 'deleteTask' method if the command is '${TaskCommand.DELETE}'`, () => {
      const deleteTaskMock = mock.method(TaskView, 'deleteTask', () => {});
      const args = [TaskCommand.DELETE];

      TaskRouter.route(args);

      equal(deleteTaskMock.mock.callCount(), 1);
      deepStrictEqual(
        deleteTaskMock.mock.calls[0].arguments,
        [...args.slice(1)],
      );
    });

    it(`should call the 'markTaskAsInProgress' method if the command is '${TaskCommand.MARK_IN_PROGRESS}'`, () => {
      const markTaskAsInProgressMock = mock.method(TaskView, 'markTaskAsInProgress', () => {});
      const args = [TaskCommand.MARK_IN_PROGRESS];

      TaskRouter.route(args);

      equal(markTaskAsInProgressMock.mock.callCount(), 1);
      deepStrictEqual(
        markTaskAsInProgressMock.mock.calls[0].arguments,
        [...args.slice(1)],
      );
    });

    it(`should call the 'markTaskAsDone' method if the command is '${TaskCommand.MARK_DONE}'`, () => {
      const markTaskAsDoneMock = mock.method(TaskView, 'markTaskAsDone', () => {});
      const args = [TaskCommand.MARK_DONE];

      TaskRouter.route(args);

      equal(markTaskAsDoneMock.mock.callCount(), 1);
      deepStrictEqual(
        markTaskAsDoneMock.mock.calls[0].arguments,
        [...args.slice(1)],
      );
    });

    it(`should call the 'getTasksList' method if the command is '${TaskCommand.LIST}'`, () => {
      const getTasksListMock = mock.method(TaskView, 'getTasksList', () => {});
      const args = [TaskCommand.LIST];

      TaskRouter.route(args);

      equal(getTasksListMock.mock.callCount(), 1);
      deepStrictEqual(
        getTasksListMock.mock.calls[0].arguments,
        [...args.slice(1)],
      );
    });

    it(`should call the 'help' method if the command is '${TaskCommand.HELP}'`, () => {
      const helpMock = mock.method(TaskView, 'help', () => {});
      const args = [TaskCommand.HELP];

      TaskRouter.route(args);

      equal(helpMock.mock.callCount(), 1);
      deepStrictEqual(
        helpMock.mock.calls[0].arguments,
        [...args.slice(1)],
      );
    });

    it('should call the "help" method if the command is not provided', () => {
      const helpMock = mock.method(TaskView, 'help', () => {});
      const args = [];

      TaskRouter.route(args);

      equal(helpMock.mock.callCount(), 1);
      deepStrictEqual(
        helpMock.mock.calls[0].arguments,
        [...args.slice(1)],
      );
    });

    it('should throw an error if the command is invalid', async () => {
      const command = TestUtils.generateRandomString(10);
      const args = [command];

      const errorMessage = messages.error.INVALID_TASK_COMMAND.replace('{0}', command);
      await rejects(
        async () => TaskRouter.route(args),
        { message: errorMessage },
      );
    });
  });
});
