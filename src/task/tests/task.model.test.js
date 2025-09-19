import path from 'path';
import { promises as fs } from 'fs';
import { deepEqual, equal, notEqual, rejects } from 'node:assert';
import { after, afterEach, beforeEach, describe, it, mock } from 'node:test';

import {
  DB_FILENAME,
  DB_FILE_ENCODING,
  TaskCommand,
  TaskStatus,
} from '../../shared/enums.js';
import { TaskBuilder } from '../utils/task.builder.js';
import { TaskModel } from '../task.model.js';
import { TestUtils } from '../../shared/test-utils.js';
import { Utils } from '../../shared/utils.js';
import { messages } from '../../shared/messages.js';

describe('TaskModel', () => {
  const writeChangesToDbFn = mock.method(TaskModel, '_writeChangesToDb');
  const dbPath = path.join(
    process.cwd(),
    DB_FILENAME,
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
      .withDescription(TestUtils.generateRandomString())
      .withStatus(TaskStatus.TODO)
      .build(),
    new TaskBuilder()
      .withDescription(TestUtils.generateRandomString())
      .withStatus(TaskStatus.IN_PROGRESS)
      .build(),
    new TaskBuilder()
      .withDescription(TestUtils.generateRandomString())
      .withStatus(TaskStatus.DONE)
      .build(),
  ];

  beforeEach(async () => {
    await createDbFile(tasks);
  });

  afterEach(async () => {
    await fs.rm(dbPath, { force: true });
    writeChangesToDbFn.mock.resetCalls();
  });

  after(() => {
    writeChangesToDbFn.mock.restore();
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

      equal(expected.length, tasks.length);
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
    it('should return all tasks', () => {
      const allTasks = TaskModel.getTasksList();

      equal(allTasks.length, tasks.length);
      deepEqual(allTasks, tasks);
    });
  });

  describe('getTaskById', () => {
    it('should return a task by id if it exists', () => {
      const expected = tasks[0];

      const actual = TaskModel.getTaskById(expected.id);

      deepEqual(actual, expected);
    });

    it('should return undefined if the task does not exist', () => {
      const id = -1;

      const task = TaskModel.getTaskById(id);

      deepEqual(task, undefined);
    });
  });

  describe('addTask', () => {
    it('should add a new task to the database', async () => {
      const oldTasks = [...TaskModel.getTasksList()];
      const description = TestUtils.generateRandomString();

      await TaskModel.addTask(description);
      const newTasks = TaskModel.getTasksList();

      equal(newTasks.length, oldTasks.length + 1);
    });

    it('should return the new inserted task', async () => {
      const description = TestUtils.generateRandomString();

      const newTask = await TaskModel.addTask(description);

      equal(newTask.description, description);
      equal(newTask.status, TaskStatus.TODO);
      equal(newTask.createdAt instanceof Date, true);
      equal(newTask.updatedAt instanceof Date, true);
    });

    it('should write changes to the database', async () => {
      const description = TestUtils.generateRandomString();

      await TaskModel.addTask(description);

      equal(writeChangesToDbFn.mock.calls.length, 1);
    });
  });

  describe('updateTaskDescription', () => {
    it('should update the description of a task if it exists', async () => {
      const taskIndex = 0;
      const task = TaskModel.getTasksList()[taskIndex];
      const oldDescription = task.description;
      const newDescription = TestUtils.generateRandomString();

      await TaskModel.updateTaskDescription(task.id, newDescription);
      const newTask = TaskModel.getTasksList()[taskIndex];

      notEqual(newTask.description, oldDescription);
      equal(newTask.description, newDescription);
    });

    it('should return the updated task', async () => {
      const taskIndex = 0;
      const task = TaskModel.getTasksList()[taskIndex];
      const description = TestUtils.generateRandomString();

      const updatedTask = await TaskModel.updateTaskDescription(task.id, description);

      deepEqual(updatedTask, task);
    });

    it('should write changes to the database if the task exists', async () => {
      const task = TaskModel.getTasksList()[0];
      const description = TestUtils.generateRandomString();

      await TaskModel.updateTaskDescription(task.id, description);

      equal(writeChangesToDbFn.mock.calls.length, 1);

      writeChangesToDbFn.mock.resetCalls();
    });

    it('should not write changes to the database if the task doesn\'t exist', async () => {
      const id = -1;
      const description = TestUtils.generateRandomString();

      await TaskModel.updateTaskDescription(id, description);

      equal(writeChangesToDbFn.mock.calls.length, 0);
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

    it('should return the updated task', async () => {
      const taskIndex = 0;
      const task = TaskModel.getTasksList()[taskIndex];
      const status = TaskStatus.IN_PROGRESS;

      const updatedTask = await TaskModel.updateTaskStatus(task.id, status);

      deepEqual(updatedTask, task);
    });

    it('should write changes to the database if the task exists', async () => {
      const task = TaskModel.getTasksList()[0];

      await TaskModel.updateTaskStatus(task.id, TaskStatus.IN_PROGRESS);

      equal(writeChangesToDbFn.mock.calls.length, 1);

      writeChangesToDbFn.mock.resetCalls();
    });

    it('should not write changes to the database if the task doesn\'t exist', async () => {
      const id = -1;

      await TaskModel.updateTaskStatus(id, TaskStatus.IN_PROGRESS);

      equal(writeChangesToDbFn.mock.calls.length, 0);
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

    it('should return the deleted task', async () => {
      const taskIndex = 0;
      const task = TaskModel.getTasksList()[taskIndex];

      const deletedTask = await TaskModel.deleteTask(task.id);

      deepEqual(deletedTask, task);
    });

    it('should write changes to the database if the task is found', async () => {
      const task = TaskModel.getTasksList()[0];

      await TaskModel.deleteTask(task.id);

      equal(writeChangesToDbFn.mock.calls.length, 1);

      writeChangesToDbFn.mock.resetCalls();
    });

    it('should not write changes to the database if the task is not found', async () => {
      const id = -1;

      await TaskModel.deleteTask(id);

      equal(writeChangesToDbFn.mock.calls.length, 0);
    });
  });

  describe('readHelpPage', () => {
    it('should read the help page for the given command', async () => {
      const readFileMock = mock.method(fs, 'readFile', () => {});
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
        const command = commands[index];
        const docsPath = path.join(
          Utils.dirname(import.meta.url),
          '..',
          '..',
          'docs',
          'help',
          `${command ?? 'help'}.txt`,
        );
        TaskModel.readHelpPage(docsPath, command);

        equal(readFileMock.mock.callCount(), index + 1);
        equal(readFileMock.mock.calls[index].arguments[0], docsPath);
      }

      readFileMock.mock.restore();
    });

    it('should throw an error if the command is invalid', async () => {
      const command = TestUtils.generateRandomString({ minLength: 10 });
      const docsPath = path.join(
        Utils.dirname(import.meta.url),
        '..',
        '..',
        'docs',
        'help',
        `${command}.txt`,
      );

      const errorMessage = messages.error.INVALID_TASK_COMMAND.replace('{0}', command);
      await rejects(
        async () => TaskModel.readHelpPage(docsPath, command),
        { message: errorMessage },
      );
    });
  });
});
