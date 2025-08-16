import { deepStrictEqual, equal, strictEqual } from 'node:assert';
import { beforeEach, describe, it, mock } from 'node:test';

import { Task, TaskStatus } from '../task.entity.js';
import { TaskBuilder } from '../task.builder.js';
import { Utils } from '../../shared/utils.js';
import { messages } from '../../shared/messages.js';

describe('Task', () => {
  describe('id', () => {
    beforeEach(() => {
      Task.setIdCount(0);
    });

    it('should create the first task with id = 1', () => {
      const task = new TaskBuilder().build();
      equal(task.id, 1);
    });

    it('should create the three tasks with their ids = 1, 2, and 3 respectively', () => {
      const task1 = new TaskBuilder().build();
      const task2 = new TaskBuilder().build();
      const task3 = new TaskBuilder().build();
      equal(task1.id, 1);
      equal(task2.id, 2);
      equal(task3.id, 3);
    });

    it('should create a new task with id = count + 1', () => {
      const tasksCount = 10;
      Task.setIdCount(tasksCount);
      const task = new TaskBuilder().build();
      equal(task.id, tasksCount + 1);
    });
  });

  describe('description', () => {
    it('should create a task if a valid description is provided', () => {
      const description = 'This is a test description';
      const task = new TaskBuilder().withDescription(description).build();
      equal(task.description, description);
    });

    it('should log an error message if an invalid description is provided', () => {
      const logErrorMock = mock.method(Utils, 'logErrorMsg', () => {});
      const description = '    ';
      new TaskBuilder().withDescription(description).build();

      strictEqual(logErrorMock.mock.calls.length, 1);
      deepStrictEqual(
        logErrorMock.mock.calls[0].arguments,
        [messages.error.REQUIRED_TASK_DESCRIPTION]
      );
      logErrorMock.mock.restore();
    });
  });

  describe('status', () => {
    it('should create a task if a valid status is provided', () => {
      const status = TaskStatus.IN_PROGRESS;
      const task = new TaskBuilder().withStatus(status).build();
      equal(task.status, status);
    });

    it('should log an error message if an invalid status is provided', () => {
      const logErrorMock = mock.method(Utils, 'logErrorMsg', () => {});
      const status = 'invalid-status';
      new TaskBuilder().withStatus(status).build();

      strictEqual(logErrorMock.mock.calls.length, 1);
      deepStrictEqual(
        logErrorMock.mock.calls[0].arguments,
        [messages.error.INVALID_TASK_STATUS]
      );
      logErrorMock.mock.restore();
    });
  });

  describe('creation date', () => {
    it('should create a task if a valid creation date is provided', () => {
      const createdAt = new Date('2025-01-01');
      const task = new TaskBuilder().withCreatedAt(createdAt).build();
      equal(task.createdAt.getSeconds(), createdAt.getSeconds());
    });

    it('should not override the creation date if it is already set', () => {
      const createdAt1 = new Date('2025-01-01');
      const createdAt2 = new Date('2026-01-01');
      const task = new TaskBuilder().withCreatedAt(createdAt1).build();
      task.createdAt = createdAt2;
      equal(task.createdAt.getSeconds(), createdAt1.getSeconds());
    });

    it('should log an error message if an invalid creation date is provided', () => {
      const logErrorMock = mock.method(Utils, 'logErrorMsg', () => {});
      const createdAt = new Date('invalid-date');
      new TaskBuilder().withCreatedAt(createdAt).build();

      strictEqual(logErrorMock.mock.calls.length, 1);
      deepStrictEqual(
        logErrorMock.mock.calls[0].arguments,
        [messages.error.INVALID_CREATED_AT]
      );
      logErrorMock.mock.restore();
    });
  });

  describe('update date', () => {
    it('should create a task if a valid update date is provided', () => {
      const updatedAt = new Date('2025-01-01');
      const task = new TaskBuilder().withUpdatedAt(updatedAt).build();
      equal(task.updatedAt.getSeconds(), updatedAt.getSeconds());
    });

    it('should log an error message if an invalid update date is provided', () => {
      const logErrorMock = mock.method(Utils, 'logErrorMsg', () => {});
      const updatedAt = new Date('invalid-date');
      new TaskBuilder().withUpdatedAt(updatedAt).build();

      strictEqual(logErrorMock.mock.calls.length, 1);
      deepStrictEqual(
        logErrorMock.mock.calls[0].arguments,
        [messages.error.INVALID_UPDATED_AT]
      );
      setTimeout(() => logErrorMock.mock.restore());
    });
  });

  describe('toJSON', () => {
    it('should serialize a task to a plain object', () => {
      const task = new TaskBuilder()
        .withDescription('Task')
        .withStatus(TaskStatus.TODO)
        .withCreatedAt(new Date('2025-01-01'))
        .withUpdatedAt(new Date('2025-01-02'))
        .build();
      const serializedTask = task.toJSON();

      equal(serializedTask.id, task.id);
      equal(serializedTask.description, task.description);
      equal(serializedTask.status, task.status);
      equal(serializedTask.createdAt, task.createdAt.toISOString());
      equal(serializedTask.updatedAt, task.updatedAt.toISOString());
    });

    it('should serialize a task to a plain object with missing createdAt, updatedAt', () => {
      const task = new TaskBuilder()
        .withDescription('Task')
        .withStatus(TaskStatus.TODO)
        .withCreatedAt(null)
        .withUpdatedAt(null)
        .build();
      const serializedTask = task.toJSON();

      equal(serializedTask.id, task.id);
      equal(serializedTask.description, task.description);
      equal(serializedTask.status, task.status);
      equal(new Date(serializedTask.createdAt) instanceof Date, true);
      equal(serializedTask.updatedAt, null);
    });
  });

  describe('fromJSON', () => {
    it('should deserialize a task from a plain object', () => {
      const task = new TaskBuilder()
        .withDescription('Task')
        .withStatus(TaskStatus.TODO)
        .withCreatedAt(new Date('2025-01-01'))
        .withUpdatedAt(new Date('2025-01-02'))
        .build();
      const serializedTask = task.toJSON();
      const deserializedTask = Task.fromJSON(serializedTask);

      equal(deserializedTask.id, task.id);
      equal(deserializedTask.description, task.description);
      equal(deserializedTask.status, task.status);
      equal(deserializedTask.createdAt.getSeconds(), task.createdAt.getSeconds());
      equal(deserializedTask.updatedAt.getSeconds(), task.updatedAt.getSeconds());
    });

    it('should deserialize a task from a plain object with missing properties', () => {
      const task = {};
      const deserializedTask = Task.fromJSON(task);

      equal(typeof deserializedTask.id, 'number');
      equal(deserializedTask.description, '');
      equal(deserializedTask.status, TaskStatus.TODO);
      equal(deserializedTask.createdAt instanceof Date, true);
      equal(deserializedTask.updatedAt, null);
    });
  });
});
