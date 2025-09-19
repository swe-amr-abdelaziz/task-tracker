import { deepEqual, equal, ok } from 'node:assert';
import { after, afterEach, describe, it, mock } from 'node:test';

import { TaskBuilder } from '../utils/task.builder.js';
import { TaskController } from '../task.controller.js';
import { TaskView } from '../task.view.js';
import { TaskViewUtils } from '../utils/task-view.utils.js';
import { TestUtils } from '../../shared/test-utils.js';
import { Utils } from '../../shared/utils.js';
import { messages } from '../../shared/messages.js';

describe('TaskView', () => {
  let callOrder = [];
  const logSuccessMsgFn = mock.method(Utils, 'logSuccessMsg', () => {
    callOrder.push('logSuccessMsg');
  });
  const printTasksTableFn = mock.method(TaskViewUtils, 'printTasksTable', () => {
    callOrder.push('printTasksTable');
  });
  const consoleLogFn = mock.method(console, 'log');

  after(() => {
    logSuccessMsgFn.mock.restore();
    printTasksTableFn.mock.restore();
    consoleLogFn.mock.restore();
  });

  describe('getTasksList', () => {
    const result = TestUtils.generateRandomStringArray(3);
    const getTasksListFn = mock.method(TaskController, 'getTasksList', () => result);

    afterEach(() => {
      getTasksListFn.mock.resetCalls();
      printTasksTableFn.mock.resetCalls();
    });

    after(() => {
      getTasksListFn.mock.restore();
    });

    it('should send args to the controller', async () => {
      TaskView.getTasksList();

      equal(getTasksListFn.mock.callCount(), 1);
      deepEqual(getTasksListFn.mock.calls[0].arguments[0], undefined);
    });

    it('should print the result in a table format', async () => {
      TaskView.getTasksList();

      equal(printTasksTableFn.mock.callCount(), 1);
      deepEqual(printTasksTableFn.mock.calls[0].arguments[0], result);
    });
  });

  describe('addTask', () => {
    const description = TestUtils.generateRandomString();
    const newTask = new TaskBuilder().build();
    const addTaskFn = mock.method(TaskController, 'addTask', () => newTask);

    afterEach(() => {
      addTaskFn.mock.resetCalls();
      logSuccessMsgFn.mock.resetCalls();
      printTasksTableFn.mock.resetCalls();
      callOrder = [];
    });

    after(() => {
      addTaskFn.mock.restore();
    });

    it('should send args to the controller', async () => {
      await TaskView.addTask(description);

      equal(addTaskFn.mock.callCount(), 1);
      deepEqual(addTaskFn.mock.calls[0].arguments[0], description);
    });

    it('should log a success message', async () => {
      await TaskView.addTask(description);
      const expectedMsg = messages.success.TASK_ADDED;

      equal(logSuccessMsgFn.mock.callCount(), 1);
      equal(logSuccessMsgFn.mock.calls[0].arguments[0], expectedMsg);
    });

    it('should print the new added task in a table format', async () => {
      await TaskView.addTask(description);

      equal(printTasksTableFn.mock.callCount(), 1);
      deepEqual(printTasksTableFn.mock.calls[0].arguments[0], newTask);
    });

    it('should log the success message before printing the table', async () => {
      await TaskView.addTask(description);

      const logSuccessIndex = callOrder.indexOf('logSuccessMsg');
      const printTasksTableIndex = callOrder.indexOf('printTasksTable');

      ok(logSuccessIndex < printTasksTableIndex);
    });
  });

  describe('updateTask', () => {
    const id = TestUtils.generateRandomInt();
    const description = TestUtils.generateRandomString();
    const updatedTask = new TaskBuilder().build();
    const updateTaskFn = mock.method(TaskController, 'updateTask', () => updatedTask);

    afterEach(() => {
      updateTaskFn.mock.resetCalls();
      logSuccessMsgFn.mock.resetCalls();
      printTasksTableFn.mock.resetCalls();
      callOrder = [];
    });

    after(() => {
      updateTaskFn.mock.restore();
    });

    it('should send args to the controller', async () => {
      await TaskView.updateTask(id, description);

      equal(updateTaskFn.mock.callCount(), 1);
      deepEqual(updateTaskFn.mock.calls[0].arguments[0], id);
      deepEqual(updateTaskFn.mock.calls[0].arguments[1], description);
    });

    it('should log a success message', async () => {
      await TaskView.updateTask(id, description);
      const expectedMsg = messages.success.TASK_UPDATED;

      equal(logSuccessMsgFn.mock.callCount(), 1);
      equal(logSuccessMsgFn.mock.calls[0].arguments[0], expectedMsg);
    });

    it('should print the new updated task in a table format', async () => {
      await TaskView.updateTask(id, description);

      equal(printTasksTableFn.mock.callCount(), 1);
      deepEqual(printTasksTableFn.mock.calls[0].arguments[0], updatedTask);
    });

    it('should log the success message before printing the table', async () => {
      await TaskView.updateTask(id, description);

      const logSuccessIndex = callOrder.indexOf('logSuccessMsg');
      const printTasksTableIndex = callOrder.indexOf('printTasksTable');

      ok(logSuccessIndex < printTasksTableIndex);
    });
  });

  describe('markTaskAsInProgress', () => {
    const id = TestUtils.generateRandomInt();
    const updatedTask = new TaskBuilder().build();
    const markTaskAsInProgressFn = mock.method(TaskController, 'markTaskAsInProgress', () => updatedTask);

    afterEach(() => {
      markTaskAsInProgressFn.mock.resetCalls();
      logSuccessMsgFn.mock.resetCalls();
      printTasksTableFn.mock.resetCalls();
      callOrder = [];
    });

    after(() => {
      markTaskAsInProgressFn.mock.restore();
    });

    it('should send args to the controller', async () => {
      await TaskView.markTaskAsInProgress(id);

      equal(markTaskAsInProgressFn.mock.callCount(), 1);
      deepEqual(markTaskAsInProgressFn.mock.calls[0].arguments[0], id);
    });

    it('should log a success message', async () => {
      await TaskView.markTaskAsInProgress(id);
      const expectedMsg = messages.success.TASK_MARKED_AS_IN_PROGRESS;

      equal(logSuccessMsgFn.mock.callCount(), 1);
      equal(logSuccessMsgFn.mock.calls[0].arguments[0], expectedMsg);
    });

    it('should print the new updated task in a table format', async () => {
      await TaskView.markTaskAsInProgress(id);

      equal(printTasksTableFn.mock.callCount(), 1);
      deepEqual(printTasksTableFn.mock.calls[0].arguments[0], updatedTask);
    });

    it('should log the success message before printing the table', async () => {
      await TaskView.markTaskAsInProgress(id);

      const logSuccessIndex = callOrder.indexOf('logSuccessMsg');
      const printTasksTableIndex = callOrder.indexOf('printTasksTable');

      ok(logSuccessIndex < printTasksTableIndex);
    });
  });

  describe('markTaskAsDone', () => {
    const id = TestUtils.generateRandomInt();
    const updatedTask = new TaskBuilder().build();
    const markTaskAsDoneFn = mock.method(TaskController, 'markTaskAsDone', () => updatedTask);

    afterEach(() => {
      markTaskAsDoneFn.mock.resetCalls();
      logSuccessMsgFn.mock.resetCalls();
      printTasksTableFn.mock.resetCalls();
      callOrder = [];
    });

    after(() => {
      markTaskAsDoneFn.mock.restore();
    });

    it('should send args to the controller', async () => {
      await TaskView.markTaskAsDone(id);

      equal(markTaskAsDoneFn.mock.callCount(), 1);
      deepEqual(markTaskAsDoneFn.mock.calls[0].arguments[0], id);
    });

    it('should log a success message', async () => {
      await TaskView.markTaskAsDone(id);
      const expectedMsg = messages.success.TASK_MARKED_AS_DONE;

      equal(logSuccessMsgFn.mock.callCount(), 1);
      equal(logSuccessMsgFn.mock.calls[0].arguments[0], expectedMsg);
    });

    it('should print the new updated task in a table format', async () => {
      await TaskView.markTaskAsDone(id);

      equal(printTasksTableFn.mock.callCount(), 1);
      deepEqual(printTasksTableFn.mock.calls[0].arguments[0], updatedTask);
    });

    it('should log the success message before printing the table', async () => {
      await TaskView.markTaskAsDone(id);

      const logSuccessIndex = callOrder.indexOf('logSuccessMsg');
      const printTasksTableIndex = callOrder.indexOf('printTasksTable');

      ok(logSuccessIndex < printTasksTableIndex);
    });
  });

  describe('deleteTask', () => {
    const id = TestUtils.generateRandomInt();
    const deletedTask = new TaskBuilder().build();
    const deleteTaskFn = mock.method(TaskController, 'deleteTask', () => deletedTask);

    afterEach(() => {
      deleteTaskFn.mock.resetCalls();
      logSuccessMsgFn.mock.resetCalls();
      printTasksTableFn.mock.resetCalls();
      callOrder = [];
    });

    after(() => {
      deleteTaskFn.mock.restore();
    });

    it('should send args to the controller', async () => {
      await TaskView.deleteTask(id);

      equal(deleteTaskFn.mock.callCount(), 1);
      deepEqual(deleteTaskFn.mock.calls[0].arguments[0], id);
    });

    it('should log a success message', async () => {
      await TaskView.deleteTask(id);
      const expectedMsg = messages.success.TASK_DELETED;

      equal(logSuccessMsgFn.mock.callCount(), 1);
      equal(logSuccessMsgFn.mock.calls[0].arguments[0], expectedMsg);
    });

    it('should print the deleted task in a table format', async () => {
      await TaskView.deleteTask(id);

      equal(printTasksTableFn.mock.callCount(), 1);
      deepEqual(printTasksTableFn.mock.calls[0].arguments[0], deletedTask);
    });

    it('should log the success message before printing the table', async () => {
      await TaskView.deleteTask(id);

      const logSuccessIndex = callOrder.indexOf('logSuccessMsg');
      const printTasksTableIndex = callOrder.indexOf('printTasksTable');

      ok(logSuccessIndex < printTasksTableIndex);
    });
  });

  describe('help', () => {
    const command = TestUtils.generateRandomString();
    const expectedHelp = TestUtils.generateRandomString();
    const helpFn = mock.method(TaskController, 'help', () => expectedHelp);

    afterEach(() => {
      helpFn.mock.resetCalls();
      consoleLogFn.mock.resetCalls();
    });

    after(() => {
      helpFn.mock.restore();
    });

    it('should send args to the controller', async () => {
      await TaskView.help(command);

      equal(helpFn.mock.callCount(), 1);
      deepEqual(helpFn.mock.calls[0].arguments[0], command);
    });

    it('should print the returned help page from the controller to the console', async () => {
      await TaskView.help(command);

      equal(consoleLogFn.mock.callCount(), 1);
      equal(consoleLogFn.mock.calls[0].arguments[0], expectedHelp);
    });
  });
});
