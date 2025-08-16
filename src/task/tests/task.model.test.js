import path from 'path';
import { afterEach, beforeEach, describe, it, mock } from 'node:test';
import { deepEqual, equal, notEqual, rejects } from 'node:assert';
import { promises as fs } from 'fs';

import { DB_FILE_ENCODING, DB_FILENAME_TEST } from '../../shared/enums.js';
import { TaskBuilder } from '../task.builder.js';
import { TaskModel } from '../task.model.js';
import { TaskStatus } from '../task.entity.js';
import { Utils } from '../../shared/utils.js';
import { messages } from '../../shared/messages.js';

describe('TaskModel', () => {
  const dbPath = path.join(
    Utils.dirname(import.meta.url),
    '..',
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
      await fs.rm(dbPath, { force: true });
      const tasks = await TaskModel.populateData();
      equal(tasks.length, 0);
      deepEqual(tasks, []);
    });

    it('should populate the database with data if the file exists with empty tasks', async () => {
      await createDbFile([]);
      const tasks = await TaskModel.populateData();
      equal(tasks.length, 0);
      deepEqual(tasks, []);
    });

    it('should populate the database with data if the file exists with some tasks', async () => {
      await createDbFile(tasks);
      const expected = await TaskModel.populateData();
      equal(expected.length, 3);
      deepEqual(expected, tasks);
    });

    it('should throw an error if unexpected error occurs', async () => {
      const tasksStringified = '[{]';
      await fs.writeFile(
        dbPath,
        tasksStringified,
        DB_FILE_ENCODING,
      );
      await rejects(
        async () => await TaskModel.populateData(),
        { message: messages.error.READ_DB_FAILED },
      );
    });
  });

  describe('getTasksList', () => {
    it('should return all tasks if status is not provided', () => {
      const allTasks = TaskModel.getTasksList();
      equal(allTasks.length, 3);
      deepEqual(allTasks, tasks);
    });

    it('should return tasks with `todo` status', () => {
      const todoTasks = TaskModel.getTasksList(TaskStatus.TODO);
      equal(todoTasks.length, 1);
      deepEqual(tasks[0], todoTasks[0]);
    });

    it('should return tasks with `in-progress` status', () => {
      const todoTasks = TaskModel.getTasksList(TaskStatus.IN_PROGRESS);
      equal(todoTasks.length, 1);
      deepEqual(tasks[1], todoTasks[0]);
    });

    it('should return tasks with `done` status', () => {
      const todoTasks = TaskModel.getTasksList(TaskStatus.DONE);
      equal(todoTasks.length, 1);
      deepEqual(tasks[2], todoTasks[0]);
    });
  });

  describe('getTaskById', () => {
    it('should return a task by id if it exists', () => {
      const expected = tasks[0];
      const actual = TaskModel.getTaskById(expected.id);
      deepEqual(actual, expected);
    });

    it('should return undefined if the task does not exist', () => {
      const task = TaskModel.getTaskById(-1);
      deepEqual(task, undefined);
    });
  });

  describe('addTask', () => {
    it('should add a new task to the database', async () => {
      const oldTasks = [...TaskModel.getTasksList()];
      const description = 'New Task';
      await TaskModel.addTask(description);
      const newTasks = TaskModel.getTasksList();
      const insertedTask = newTasks[newTasks.length - 1];

      equal(newTasks.length, oldTasks.length + 1);
      equal(insertedTask.description, description);
      equal(insertedTask.status, TaskStatus.TODO);
      equal(insertedTask.createdAt instanceof Date, true);
      equal(insertedTask.updatedAt, null);
    });

    it('should write changes to the database', async () => {
      const writeChangesToDbMock = mock.method(TaskModel, '_writeChangesToDb', () => {});
      await TaskModel.addTask('New Task');

      equal(writeChangesToDbMock.mock.calls.length, 1);
    });
  });

  describe('updateTaskDescription', () => {
    it('should update the description of a task if it exists', async () => {
      const taskIndex = 0;
      const task = TaskModel.getTasksList()[taskIndex];
      const oldDescription = task.description;
      const newDescription = 'New Task';
      await TaskModel.updateTaskDescription(task.id, newDescription);
      const newTask = TaskModel.getTasksList()[taskIndex];

      notEqual(newTask.description, oldDescription);
      equal(newTask.description, newDescription);
    });

    it('should write changes to the database if the task exists', async () => {
      const writeChangesToDbMock = mock.method(TaskModel, '_writeChangesToDb', () => {});
      const task = TaskModel.getTasksList()[0];
      await TaskModel.updateTaskDescription(task.id, "New Task");

      equal(writeChangesToDbMock.mock.calls.length, 1);
    });

    it('should not write changes to the database if the task doesn\'t exist', async () => {
      const writeChangesToDbMock = mock.method(TaskModel, '_writeChangesToDb', () => {});
      await TaskModel.updateTaskDescription(-1, "New Task");

      equal(writeChangesToDbMock.mock.calls.length, 0);
    });
  });

  describe('updateTaskStatus', () => {
    it('should update the status of a task if it exists', async () => {
      const taskIndex = 0;
      const task = TaskModel.getTasksList()[taskIndex];
      const oldStatus = task.status;
      const newStatus = TaskStatus.IN_PROGRESS;
      await TaskModel.updateTaskStatus(task.id, newStatus);
      const newTask = TaskModel.getTasksList()[taskIndex];

      notEqual(newTask.status, oldStatus);
      equal(newTask.status, newStatus);
    });

    it('should write changes to the database if the task exists', async () => {
      const writeChangesToDbMock = mock.method(TaskModel, '_writeChangesToDb', () => {});
      const task = TaskModel.getTasksList()[0];
      await TaskModel.updateTaskStatus(task.id, TaskStatus.IN_PROGRESS);

      equal(writeChangesToDbMock.mock.calls.length, 1);
    });

    it('should not write changes to the database if the task doesn\'t exist', async () => {
      const writeChangesToDbMock = mock.method(TaskModel, '_writeChangesToDb', () => {});
      await TaskModel.updateTaskStatus(-1, TaskStatus.IN_PROGRESS);

      equal(writeChangesToDbMock.mock.calls.length, 0);
    });
  });

  describe('deleteTask', () => {
    it('should delete a task if it exists', async () => {
      const taskIndex = 0;
      const deletedTask = TaskModel.getTasksList()[taskIndex];
      const oldTasksCount = TaskModel.getTasksList().length;
      await TaskModel.deleteTask(deletedTask.id);
      const newTasksCount = TaskModel.getTasksList().length;

      equal(newTasksCount, oldTasksCount - 1);
      const task = TaskModel.getTaskById(deletedTask.id);
      equal(task, undefined);
    });

    it('should write changes to the database if the task is found', async () => {
      const writeChangesToDbMock = mock.method(TaskModel, '_writeChangesToDb', () => {});
      const task = TaskModel.getTasksList()[0];
      await TaskModel.deleteTask(task.id);

      equal(writeChangesToDbMock.mock.calls.length, 1);
    });

    it('should not write changes to the database if the task is not found', async () => {
      const writeChangesToDbMock = mock.method(TaskModel, '_writeChangesToDb', () => {});
      await TaskModel.deleteTask(-1);

      equal(writeChangesToDbMock.mock.calls.length, 0);
    });
  });
});
