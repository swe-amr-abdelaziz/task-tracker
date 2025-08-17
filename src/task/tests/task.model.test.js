import path from 'path';
import { afterEach, beforeEach, describe, it, mock } from 'node:test';
import { deepEqual, equal, notEqual, rejects } from 'node:assert';
import { promises as fs } from 'fs';

import { DB_FILE_ENCODING, DB_FILENAME_TEST } from '../../shared/enums.js';
import { TaskBuilder } from '../task.builder.js';
import { TaskModel } from '../task.model.js';
import { TaskStatus } from '../task.entity.js';
import { messages } from '../../shared/messages.js';

describe('TaskModel', () => {
  const dbPath = path.join(
    process.cwd(),
    DB_FILENAME_TEST,
  );

  const createDbFile = async (tasks) => {
    await fs.writeFile(
      dbPath,
      JSON.stringify(tasks.map(t => t.toJSON()), null, 2),
      DB_FILE_ENCODING,
    );
  };

  const tasks = [
    new TaskBuilder()
      .withDescription('Task 1')
      .withStatus(TaskStatus.TODO)
      .build(),
    new TaskBuilder()
      .withDescription('Task 2')
      .withStatus(TaskStatus.IN_PROGRESS)
      .build(),
    new TaskBuilder()
      .withDescription('Task 3')
      .withStatus(TaskStatus.DONE)
      .build(),
  ];

  beforeEach(async () => {
    await createDbFile(tasks);
  });

  afterEach(async () => {
    await fs.rm(dbPath, { force: true });
  });

  describe('populateData', () => {
    it('should should create a new database file if the file does not exist', async () => {
      // Arrange
      await fs.rm(dbPath, { force: true });

      // Act
      const tasks = await TaskModel.populateData();

      // Assert
      equal(tasks.length, 0);
      deepEqual(tasks, []);
    });

    it('should populate the database with data if the file exists with empty tasks', async () => {
      // Arrange
      await createDbFile([]);

      // Act
      const tasks = await TaskModel.populateData();

      // Assert
      equal(tasks.length, 0);
      deepEqual(tasks, []);
    });

    it('should populate the database with data if the file exists with some tasks', async () => {
      // Arrange
      await createDbFile(tasks);

      // Act
      const expected = await TaskModel.populateData();

      // Assert
      equal(expected.length, 3);
      deepEqual(expected, tasks);
    });

    it('should throw an error if unexpected error occurs', async () => {
      // Arrange
      const tasksStringified = '[{]';
      await fs.writeFile(
        dbPath,
        tasksStringified,
        DB_FILE_ENCODING,
      );

      // Act & Assert
      await rejects(
        async () => await TaskModel.populateData(),
        { message: messages.error.READ_DB_FAILED },
      );
    });
  });

  describe('getTasksList', () => {
    it('should return all tasks if status is not provided', () => {
      // Arrange
      let allTasks;

      // Act
      allTasks = TaskModel.getTasksList();

      // Assert
      equal(allTasks.length, 3);
      deepEqual(allTasks, tasks);
    });

    it('should return tasks with `todo` status', () => {
      // Arrange
      let todoTasks;
      const status = TaskStatus.TODO;

      // Act
      todoTasks = TaskModel.getTasksList(status);

      // Assert
      equal(todoTasks.length, 1);
      deepEqual(tasks[0], todoTasks[0]);
    });

    it('should return tasks with `in-progress` status', () => {
      // Arrange
      let todoTasks;
      const status = TaskStatus.IN_PROGRESS;

      // Act
      todoTasks = TaskModel.getTasksList(status);

      // Assert
      equal(todoTasks.length, 1);
      deepEqual(tasks[1], todoTasks[0]);
    });

    it('should return tasks with `done` status', () => {
      // Arrange
      let todoTasks;
      const status = TaskStatus.DONE;

      // Act
      todoTasks = TaskModel.getTasksList(status);

      // Assert
      equal(todoTasks.length, 1);
      deepEqual(tasks[2], todoTasks[0]);
    });
  });

  describe('getTaskById', () => {
    it('should return a task by id if it exists', () => {
      // Arrange
      const expected = tasks[0];

      // Act
      const actual = TaskModel.getTaskById(expected.id);

      // Assert
      deepEqual(actual, expected);
    });

    it('should return undefined if the task does not exist', () => {
      // Arrange
      const id = -1;

      // Act
      const task = TaskModel.getTaskById(id);

      // Assert
      deepEqual(task, undefined);
    });
  });

  describe('addTask', () => {
    it('should add a new task to the database', async () => {
      // Arrange
      const oldTasks = [...TaskModel.getTasksList()];
      const description = 'New Task';

      // Act
      await TaskModel.addTask(description);
      const newTasks = TaskModel.getTasksList();
      const insertedTask = newTasks[newTasks.length - 1];

      // Assert
      equal(newTasks.length, oldTasks.length + 1);
      equal(insertedTask.description, description);
      equal(insertedTask.status, TaskStatus.TODO);
      equal(insertedTask.createdAt instanceof Date, true);
      equal(insertedTask.updatedAt, null);
    });

    it('should write changes to the database', async () => {
      // Arrange
      const writeChangesToDbMock = mock.method(TaskModel, '_writeChangesToDb', () => {});
      const description = 'New Task';

      // Act
      await TaskModel.addTask(description);

      // Assert
      equal(writeChangesToDbMock.mock.calls.length, 1);

      // Teardown
      writeChangesToDbMock.mock.restore();
    });
  });

  describe('updateTaskDescription', () => {
    it('should update the description of a task if it exists', async () => {
      // Arrange
      const taskIndex = 0;
      const task = TaskModel.getTasksList()[taskIndex];
      const oldDescription = task.description;
      const newDescription = 'New Task';

      // Act
      await TaskModel.updateTaskDescription(task.id, newDescription);
      const newTask = TaskModel.getTasksList()[taskIndex];

      // Assert
      notEqual(newTask.description, oldDescription);
      equal(newTask.description, newDescription);
    });

    it('should write changes to the database if the task exists', async () => {
      // Arrange
      const writeChangesToDbMock = mock.method(TaskModel, '_writeChangesToDb', () => {});
      const task = TaskModel.getTasksList()[0];
      const description = 'New Task';

      // Act
      await TaskModel.updateTaskDescription(task.id, description);

      // Assert
      equal(writeChangesToDbMock.mock.calls.length, 1);

      // Teardown
      writeChangesToDbMock.mock.restore();
    });

    it('should not write changes to the database if the task doesn\'t exist', async () => {
      // Arrange
      const writeChangesToDbMock = mock.method(TaskModel, '_writeChangesToDb', () => {});
      const id = -1;
      const description = 'New Task';

      // Act
      await TaskModel.updateTaskDescription(id, description);

      equal(writeChangesToDbMock.mock.calls.length, 0);
      writeChangesToDbMock.mock.restore();
    });
  });

  describe('updateTaskStatus', () => {
    it('should update the status of a task if it exists', async () => {
      // Arrange
      const taskIndex = 0;
      const task = TaskModel.getTasksList()[taskIndex];
      const oldStatus = task.status;
      const newStatus = TaskStatus.IN_PROGRESS;

      // Act
      await TaskModel.updateTaskStatus(task.id, newStatus);
      const newTask = TaskModel.getTasksList()[taskIndex];

      // Assert
      notEqual(newTask.status, oldStatus);
      equal(newTask.status, newStatus);
    });

    it('should write changes to the database if the task exists', async () => {
      // Arrange
      const writeChangesToDbMock = mock.method(TaskModel, '_writeChangesToDb', () => {});
      const task = TaskModel.getTasksList()[0];

      // Act
      await TaskModel.updateTaskStatus(task.id, TaskStatus.IN_PROGRESS);

      // Assert
      equal(writeChangesToDbMock.mock.calls.length, 1);

      // Teardown
      writeChangesToDbMock.mock.restore();
    });

    it('should not write changes to the database if the task doesn\'t exist', async () => {
      // Arrange
      const writeChangesToDbMock = mock.method(TaskModel, '_writeChangesToDb', () => {});
      const id = -1;

      // Act
      await TaskModel.updateTaskStatus(id, TaskStatus.IN_PROGRESS);

      // Assert
      equal(writeChangesToDbMock.mock.calls.length, 0);

      // Teardown
      writeChangesToDbMock.mock.restore();
    });
  });

  describe('deleteTask', () => {
    it('should delete a task if it exists', async () => {
      // Arrange
      const taskIndex = 0;
      const deletedTask = TaskModel.getTasksList()[taskIndex];
      const oldTasksCount = TaskModel.getTasksList().length;

      // Act
      await TaskModel.deleteTask(deletedTask.id);
      const newTasksCount = TaskModel.getTasksList().length;

      // Assert
      equal(newTasksCount, oldTasksCount - 1);
      const task = TaskModel.getTaskById(deletedTask.id);
      equal(task, undefined);
    });

    it('should write changes to the database if the task is found', async () => {
      // Arrange
      const writeChangesToDbMock = mock.method(TaskModel, '_writeChangesToDb', () => {});
      const task = TaskModel.getTasksList()[0];

      // Act
      await TaskModel.deleteTask(task.id);

      // Assert
      equal(writeChangesToDbMock.mock.calls.length, 1);

      // Teardown
      writeChangesToDbMock.mock.restore();
    });

    it('should not write changes to the database if the task is not found', async () => {
      // Arrange
      const writeChangesToDbMock = mock.method(TaskModel, '_writeChangesToDb', () => {});
      const id = -1;

      // Act
      await TaskModel.deleteTask(id);

      // Assert
      equal(writeChangesToDbMock.mock.calls.length, 0);

      // Teardown
      writeChangesToDbMock.mock.restore();
    });
  });
});
