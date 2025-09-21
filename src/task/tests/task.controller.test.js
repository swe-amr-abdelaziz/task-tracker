import path from 'path';
import { deepEqual, equal, rejects } from 'node:assert';
import { after, afterEach, describe, it, mock } from 'node:test';

import { TaskBuilder } from '../utils/task.builder.js';
import { TaskCommand, TaskStatus } from '../../shared/enums.js';
import { TaskController } from '../task.controller.js';
import { TaskControllerUtils } from '../utils/task-controller.utils.js';
import { TaskModel } from '../task.model.js';
import { TestUtils } from '../../shared/test-utils.js';
import { messages } from '../../shared/messages.js';

describe('TaskController', () => {
  const getTaskByIdFn = mock.method(TaskModel, 'getTaskById', () => new TaskBuilder().build());
  const updateTaskDescriptionFn = mock.method(TaskModel, 'updateTaskDescription', () => {});
  const updateTaskStatusFn = mock.method(TaskModel, 'updateTaskStatus', () => {});

  afterEach(() => {
    getTaskByIdFn.mock.resetCalls();
    updateTaskDescriptionFn.mock.resetCalls();
    updateTaskStatusFn.mock.resetCalls();
  });

  after(() => {
    getTaskByIdFn.mock.restore();
    updateTaskDescriptionFn.mock.restore();
    updateTaskStatusFn.mock.restore();
  });

  describe('getTasksList', () => {
    const allTasks = [
      new TaskBuilder().build(),
      new TaskBuilder().build(),
    ];
    const processedTasks = [
      new TaskBuilder().build(),
      new TaskBuilder().build(),
    ];
    const getTasksListFn = mock.method(TaskModel, 'getTasksList', () => allTasks);
    const filterSortPaginateFn = mock.method(TaskControllerUtils, 'filterSortPaginate', () => processedTasks);

    afterEach(() => {
      getTasksListFn.mock.resetCalls();
      filterSortPaginateFn.mock.resetCalls();
    });

    after(() => {
      getTasksListFn.mock.restore();
      filterSortPaginateFn.mock.restore();
    });

    it('should get all tasks from the model', async () => {
      TaskController.getTasksList();

      equal(getTasksListFn.mock.callCount(), 1);
    });

    it('should call filterSortPaginate method from the utils with the tasks and the dto', async () => {
      TaskController.getTasksList();

      equal(filterSortPaginateFn.mock.callCount(), 1);
      deepEqual(filterSortPaginateFn.mock.calls[0].arguments[0], allTasks);
    });

    it('should send formatted dto to filterSortPaginate method', async () => {
      TaskController.getTasksList('--status=done', '--created-before=2022-01-01', '--order-by=status')

      equal(filterSortPaginateFn.mock.callCount(), 1);
      const dto = filterSortPaginateFn.mock.calls[0].arguments[1];
      equal(dto.status, TaskStatus.DONE);
      equal(dto.createdBefore.toISOString(), new Date('2022-01-01').toISOString());
      equal(dto.orderBy, 'status');
    });

    it('should return the list of tasks', async () => {
      const result = TaskController.getTasksList();

      deepEqual(result, processedTasks);
    });
  });

  describe('addTask', () => {
    const addTaskFn = mock.method(TaskModel, 'addTask', () => {});

    afterEach(() => {
      addTaskFn.mock.resetCalls();
    });

    after(() => {
      addTaskFn.mock.restore();
    });

    it('should throw a TypeError if the description is missing', async () => {
      let description;

      await rejects(
        async () => await TaskController.addTask(description),
        {
          name: 'TypeError',
          message: messages.error.REQUIRED_TASK_DESCRIPTION,
        },
      );
    });

    it('should throw a TypeError if the description is not a string', async () => {
      const description = TestUtils.generateRandomInt();

      await rejects(
        async () => await TaskController.addTask(description),
        {
          name: 'TypeError',
          message: messages.error.INVALID_TASK_DESCRIPTION,
        },
      );
    });

    it('should call addTask method from the model with the description', async () => {
      const description = TestUtils.generateRandomString();

      await TaskController.addTask(description);

      equal(addTaskFn.mock.callCount(), 1);
      equal(addTaskFn.mock.calls[0].arguments[0], description);
    });

    it('should return the newly created task', async () => {
      const description = TestUtils.generateRandomString();
      const task = new TaskBuilder().withDescription(description).build();
      addTaskFn.mock.mockImplementationOnce(() => task);

      const result = await TaskController.addTask(description);

      equal(result, task);
    });
  });

  describe('updateTask', () => {
    afterEach(() => {
      updateTaskDescriptionFn.mock.resetCalls();
    });

    after(() => {
      updateTaskDescriptionFn.mock.restore();
    });

    it('should throw a TypeError if the task ID is missing', async () => {
      let id;

      await rejects(
        async () => await TaskController.updateTask(id),
        {
          name: 'TypeError',
          message: messages.error.REQUIRED_TASK_ID,
        },
      );
    });

    it('should throw a TypeError if the task ID is not a number', async () => {
      const id = TestUtils.generateRandomString();

      await rejects(
        async () => await TaskController.updateTask(id),
        {
          name: 'TypeError',
          message: messages.error.INVALID_TASK_ID,
        },
      );
    });

    it('should throw a TypeError if the description is missing', async () => {
      const id = TestUtils.generateRandomInt();
      let description;

      await rejects(
        async () => await TaskController.updateTask(id, description),
        {
          name: 'TypeError',
          message: messages.error.REQUIRED_TASK_DESCRIPTION,
        },
      );
    });

    it('should throw a TypeError if the description is not a string', async () => {
      const id = TestUtils.generateRandomInt();
      const description = TestUtils.generateRandomInt();

      await rejects(
        async () => await TaskController.updateTask(id, description),
        {
          name: 'TypeError',
          message: messages.error.INVALID_TASK_DESCRIPTION,
        },
      );
    });

    it('should throw an Error if the task does not exist', async () => {
      const id = TestUtils.generateRandomInt();
      const description = TestUtils.generateRandomString();
      getTaskByIdFn.mock.mockImplementationOnce(() => undefined);

      await rejects(
        async () => await TaskController.updateTask(id, description),
        {
          name: 'Error',
          message: messages.error.TASK_NOT_FOUND,
        },
      );
    });

    it('should call updateTaskDescription method from the model with the id and description', async () => {
      const id = TestUtils.generateRandomInt();
      const description = TestUtils.generateRandomString();

      await TaskController.updateTask(id, description);

      equal(updateTaskDescriptionFn.mock.callCount(), 1);
      equal(updateTaskDescriptionFn.mock.calls[0].arguments[0], id);
      equal(updateTaskDescriptionFn.mock.calls[0].arguments[1], description);
    });

    it('should return the updated task', async () => {
      const id = TestUtils.generateRandomInt();
      const description = TestUtils.generateRandomString();
      const task = new TaskBuilder().withDescription(description).build();
      updateTaskDescriptionFn.mock.mockImplementationOnce(() => task);

      const result = await TaskController.updateTask(id, description);

      equal(result, task);
    });
  });

  describe('markTaskAsInProgress', () => {
    afterEach(() => {
      updateTaskStatusFn.mock.resetCalls();
    });

    it('should throw a TypeError if the task ID is missing', async () => {
      let id;

      await rejects(
        async () => await TaskController.markTaskAsInProgress(id),
        {
          name: 'TypeError',
          message: messages.error.REQUIRED_TASK_ID,
        },
      );
    });

    it('should throw a TypeError if the task ID is not a number', async () => {
      const id = TestUtils.generateRandomString();

      await rejects(
        async () => await TaskController.markTaskAsInProgress(id),
        {
          name: 'TypeError',
          message: messages.error.INVALID_TASK_ID,
        },
      );
    });

    it('should throw an Error if the task does not exist', async () => {
      const id = TestUtils.generateRandomInt();
      getTaskByIdFn.mock.mockImplementationOnce(() => undefined);

      await rejects(
        async () => await TaskController.markTaskAsInProgress(id),
        {
          name: 'Error',
          message: messages.error.TASK_NOT_FOUND,
        },
      );
    });

    it('should throw an Error if the task is already in progress', async () => {
      const id = TestUtils.generateRandomInt();
      const task = new TaskBuilder().withStatus(TaskStatus.IN_PROGRESS).build();
      getTaskByIdFn.mock.mockImplementationOnce(() => task);

      await rejects(
        async () => await TaskController.markTaskAsInProgress(id),
        {
          name: 'Error',
          message: messages.error.TASK_ALREADY_IN_PROGRESS,
        },
      );
    });

    it('should throw an Error if the task status is done', async () => {
      const id = TestUtils.generateRandomInt();
      const task = new TaskBuilder().withStatus(TaskStatus.DONE).build();
      getTaskByIdFn.mock.mockImplementationOnce(() => task);

      await rejects(
        async () => await TaskController.markTaskAsInProgress(id),
        {
          name: 'Error',
          message: messages.error.CANNOT_MARK_DONE_AS_IN_PROGRESS,
        },
      );
    });

    it('should call updateTaskStatus method from the model with the id and the new status', async () => {
      const task = new TaskBuilder().withStatus(TaskStatus.TODO).build();
      getTaskByIdFn.mock.mockImplementationOnce(() => task);
      const id = TestUtils.generateRandomInt();

      await TaskController.markTaskAsInProgress(id);

      equal(updateTaskStatusFn.mock.callCount(), 1);
      equal(updateTaskStatusFn.mock.calls[0].arguments[0], id);
      equal(updateTaskStatusFn.mock.calls[0].arguments[1], TaskStatus.IN_PROGRESS);
    });

    it('should return the updated task', async () => {
      const id = TestUtils.generateRandomInt();
      const task = new TaskBuilder().build();
      updateTaskStatusFn.mock.mockImplementationOnce(() => task);

      const result = await TaskController.markTaskAsInProgress(id);

      equal(result, task);
    });
  });

  describe('markTaskAsDone', () => {
    afterEach(() => {
      updateTaskStatusFn.mock.resetCalls();
    });

    it('should throw a TypeError if the task ID is missing', async () => {
      let id;

      await rejects(
        async () => await TaskController.markTaskAsDone(id),
        {
          name: 'TypeError',
          message: messages.error.REQUIRED_TASK_ID,
        },
      );
    });

    it('should throw a TypeError if the task ID is not a number', async () => {
      const id = TestUtils.generateRandomString();

      await rejects(
        async () => await TaskController.markTaskAsDone(id),
        {
          name: 'TypeError',
          message: messages.error.INVALID_TASK_ID,
        },
      );
    });

    it('should throw an Error if the task does not exist', async () => {
      const id = TestUtils.generateRandomInt();
      getTaskByIdFn.mock.mockImplementationOnce(() => undefined);

      await rejects(
        async () => await TaskController.markTaskAsDone(id),
        {
          name: 'Error',
          message: messages.error.TASK_NOT_FOUND,
        },
      );
    });

    it('should throw an Error if the task status is todo', async () => {
      const id = TestUtils.generateRandomInt();
      const task = new TaskBuilder().withStatus(TaskStatus.TODO).build();
      getTaskByIdFn.mock.mockImplementationOnce(() => task);

      await rejects(
        async () => await TaskController.markTaskAsDone(id),
        {
          name: 'Error',
          message: messages.error.CANNOT_MARK_TODO_AS_DONE,
        },
      );
    });

    it('should throw an Error if the task is already done', async () => {
      const id = TestUtils.generateRandomInt();
      const task = new TaskBuilder().withStatus(TaskStatus.DONE).build();
      getTaskByIdFn.mock.mockImplementationOnce(() => task);

      await rejects(
        async () => await TaskController.markTaskAsDone(id),
        {
          name: 'Error',
          message: messages.error.TASK_ALREADY_DONE,
        },
      );
    });

    it('should call updateTaskStatus method from the model with the id and the new status', async () => {
      const task = new TaskBuilder().withStatus(TaskStatus.IN_PROGRESS).build();
      getTaskByIdFn.mock.mockImplementationOnce(() => task);
      const id = TestUtils.generateRandomInt();

      await TaskController.markTaskAsDone(id);

      equal(updateTaskStatusFn.mock.callCount(), 1);
      equal(updateTaskStatusFn.mock.calls[0].arguments[0], id);
    });

    it('should return the updated task', async () => {
      const id = TestUtils.generateRandomInt();
      const task = new TaskBuilder().withStatus(TaskStatus.IN_PROGRESS).build();
      getTaskByIdFn.mock.mockImplementationOnce(() => task);
      const updatedTask = new TaskBuilder().withStatus(TaskStatus.DONE).build();
      updateTaskStatusFn.mock.mockImplementationOnce(() => updatedTask);

      const result = await TaskController.markTaskAsDone(id);

      equal(result, updatedTask);
    });
  });

  describe('deleteTask', () => {
    const deleteTaskFn = mock.method(TaskModel, 'deleteTask', () => {});

    afterEach(() => {
      deleteTaskFn.mock.resetCalls();
    });

    after(() => {
      deleteTaskFn.mock.restore();
    });

    it('should throw a TypeError if the task ID is missing', async () => {
      let id;

      await rejects(
        async () => await TaskController.deleteTask(id),
        {
          name: 'TypeError',
          message: messages.error.REQUIRED_TASK_ID,
        },
      );
    });

    it('should throw a TypeError if the task ID is not a number', async () => {
      const id = TestUtils.generateRandomString();

      await rejects(
        async () => await TaskController.deleteTask(id),
        {
          name: 'TypeError',
          message: messages.error.INVALID_TASK_ID,
        },
      );
    });

    it('should throw an Error if the task does not exist', async () => {
      const id = TestUtils.generateRandomInt();
      getTaskByIdFn.mock.mockImplementationOnce(() => undefined);

      await rejects(
        async () => await TaskController.deleteTask(id),
        {
          name: 'Error',
          message: messages.error.TASK_NOT_FOUND,
        },
      );
    });

    it('should call deleteTask method from the model with the id', async () => {
      const task = new TaskBuilder().build();
      getTaskByIdFn.mock.mockImplementationOnce(() => task);
      const id = TestUtils.generateRandomInt();

      await TaskController.deleteTask(id);

      equal(deleteTaskFn.mock.callCount(), 1);
      equal(deleteTaskFn.mock.calls[0].arguments[0], id);
    });

    it('should return the updated task', async () => {
      const id = TestUtils.generateRandomInt();
      const task = new TaskBuilder().build();
      deleteTaskFn.mock.mockImplementationOnce(() => task);

      const result = await TaskController.deleteTask(id);

      equal(result, task);
    });
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
      undefined,
    ];

    const pathJoinFn = mock.method(path, 'join', () => expectedPath);
    const readHelpPageFn = mock.method(TaskModel, 'readHelpPage', () => expectedHelpPage);

    afterEach(() => {
      pathJoinFn.mock.resetCalls();
      readHelpPageFn.mock.resetCalls();
    });

    after(() => {
      pathJoinFn.mock.restore();
      readHelpPageFn.mock.restore();
    });

    it('should throw an Error if "help" itself is sent as a command', async () => {
      const command = TaskCommand.HELP;

      await rejects(
        async () => await TaskController.help(command),
        {
          name: 'Error',
          message: messages.error.INVALID_HELP_COMMAND,
        },
      );
    });

    it('should construct the "docsPath"', async () => {
      for (let index = 0; index < commands.length; index++) {
        const command = commands[index];
        const expectedFilename = `${command ?? 'help'}.txt`;

        await TaskController.help(command);
        const lastArgIndex = pathJoinFn.mock.calls[index].arguments.length - 1;

        equal(pathJoinFn.mock.callCount(), index + 1);
        equal(pathJoinFn.mock.calls[index].arguments[lastArgIndex], expectedFilename);
      }
    });

    it('should return the help page from the model', async () => {
      for (let index = 0; index < commands.length; index++) {
        const command = commands[index];

        const helpPage = await TaskController.help(command);

        equal(helpPage, expectedHelpPage);
        equal(readHelpPageFn.mock.callCount(), index + 1);
        equal(readHelpPageFn.mock.calls[index].arguments[0], expectedPath);
        equal(readHelpPageFn.mock.calls[index].arguments[1], command);
      }
    });
  });
});
