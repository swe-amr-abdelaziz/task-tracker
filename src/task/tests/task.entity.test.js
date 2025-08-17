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
      // Arrange
      let task;

      // Act
      task = new TaskBuilder().build();

      // Assert
      equal(task.id, 1);
    });

    it('should create the three tasks with their ids = 1, 2, and 3 respectively', () => {
      // Arrange
      let task1, task2, task3;

      // Act
      task1 = new TaskBuilder().build();
      task2 = new TaskBuilder().build();
      task3 = new TaskBuilder().build();

      // Assert
      equal(task1.id, 1);
      equal(task2.id, 2);
      equal(task3.id, 3);
    });

    it('should create a new task with id = count + 1', () => {
      // Arrange
      let task;
      const tasksCount = 10;
      Task.setIdCount(tasksCount);

      // Act
      task = new TaskBuilder().build();

      // Assert
      equal(task.id, tasksCount + 1);
    });
  });

  describe('description', () => {
    it('should create a task if a valid description is provided', () => {
      // Arrange
      let task;
      const description = 'This is a test description';

      // Act
      task = new TaskBuilder().withDescription(description).build();

      // Assert
      equal(task.description, description);
    });

    it('should log an error message if an invalid description is provided', () => {
      // Arrange
      const logErrorMock = mock.method(Utils, 'logErrorMsg', () => {});
      const description = '    ';

      // Act
      new TaskBuilder().withDescription(description).build();

      // Assert
      strictEqual(logErrorMock.mock.calls.length, 1);
      deepStrictEqual(
        logErrorMock.mock.calls[0].arguments,
        [messages.error.REQUIRED_TASK_DESCRIPTION]
      );

      // Teardown
      logErrorMock.mock.restore();
    });
  });

  describe('status', () => {
    it('should create a task if a valid status is provided', () => {
      // Arrange
      let task;
      const status = TaskStatus.IN_PROGRESS;

      // Act
      task = new TaskBuilder().withStatus(status).build();

      // Assert
      equal(task.status, status);
    });

    it('should log an error message if an invalid status is provided', () => {
      // Arrange
      const logErrorMock = mock.method(Utils, 'logErrorMsg', () => {});
      const status = 'invalid-status';

      // Act
      new TaskBuilder().withStatus(status).build();

      // Assert
      strictEqual(logErrorMock.mock.calls.length, 1);
      deepStrictEqual(
        logErrorMock.mock.calls[0].arguments,
        [messages.error.INVALID_TASK_STATUS]
      );

      // Teardown
      logErrorMock.mock.restore();
    });
  });

  describe('creation date', () => {
    it('should create a task if a valid creation date is provided', () => {
      // Arrange
      let task;
      const createdAt = new Date('2025-01-01');

      // Act
      task = new TaskBuilder().withCreatedAt(createdAt).build();

      // Assert
      equal(task.createdAt.getSeconds(), createdAt.getSeconds());
    });

    it('should not override the creation date if it is already set', () => {
      // Arrange
      let task;
      const createdAt1 = new Date('2025-01-01');
      const createdAt2 = new Date('2026-01-01');

      // Act
      task = new TaskBuilder().withCreatedAt(createdAt1).build();
      task.createdAt = createdAt2;

      // Assert
      equal(task.createdAt.getSeconds(), createdAt1.getSeconds());
    });

    it('should log an error message if an invalid creation date is provided', () => {
      // Arrange
      const logErrorMock = mock.method(Utils, 'logErrorMsg', () => {});
      const createdAt = new Date('invalid-date');

      // Act
      new TaskBuilder().withCreatedAt(createdAt).build();

      // Assert
      strictEqual(logErrorMock.mock.calls.length, 1);
      deepStrictEqual(
        logErrorMock.mock.calls[0].arguments,
        [messages.error.INVALID_CREATED_AT]
      );

      // Teardown
      logErrorMock.mock.restore();
    });
  });

  describe('update date', () => {
    it('should create a task if a valid update date is provided', () => {
      // Arrange
      let task;
      const updatedAt = new Date('2025-01-01');

      // Act
      task = new TaskBuilder().withUpdatedAt(updatedAt).build();

      // Assert
      equal(task.updatedAt.getSeconds(), updatedAt.getSeconds());
    });

    it('should log an error message if an invalid update date is provided', () => {
      // Arrange
      const logErrorMock = mock.method(Utils, 'logErrorMsg', () => {});
      const updatedAt = new Date('invalid-date');

      // Act
      new TaskBuilder().withUpdatedAt(updatedAt).build();

      // Assert
      strictEqual(logErrorMock.mock.calls.length, 1);
      deepStrictEqual(
        logErrorMock.mock.calls[0].arguments,
        [messages.error.INVALID_UPDATED_AT]
      );

      // Teardown
      setTimeout(() => logErrorMock.mock.restore());
    });
  });

  describe('toJSON', () => {
    it('should serialize a task to a plain object', () => {
      // Arrange
      const task = new TaskBuilder()
        .withDescription('Task')
        .withStatus(TaskStatus.TODO)
        .withCreatedAt(new Date('2025-01-01'))
        .withUpdatedAt(new Date('2025-01-02'))
        .build();

      // Act
      const serializedTask = task.toJSON();

      // Assert
      equal(serializedTask.id, task.id);
      equal(serializedTask.description, task.description);
      equal(serializedTask.status, task.status);
      equal(serializedTask.createdAt, task.createdAt.toISOString());
      equal(serializedTask.updatedAt, task.updatedAt.toISOString());
    });

    it('should serialize a task to a plain object with missing createdAt, updatedAt', () => {
      // Arrange
      const task = new TaskBuilder()
        .withDescription('Task')
        .withStatus(TaskStatus.TODO)
        .withCreatedAt(null)
        .withUpdatedAt(null)
        .build();

      // Act
      const serializedTask = task.toJSON();

      // Assert
      equal(serializedTask.id, task.id);
      equal(serializedTask.description, task.description);
      equal(serializedTask.status, task.status);
      equal(new Date(serializedTask.createdAt) instanceof Date, true);
      equal(serializedTask.updatedAt, null);
    });
  });

  describe('fromJSON', () => {
    it('should deserialize a task from a plain object', () => {
      // Arrange
      const task = new TaskBuilder()
        .withDescription('Task')
        .withStatus(TaskStatus.TODO)
        .withCreatedAt(new Date('2025-01-01'))
        .withUpdatedAt(new Date('2025-01-02'))
        .build();
      const serializedTask = task.toJSON();

      // Act
      const deserializedTask = Task.fromJSON(serializedTask);

      // Assert
      equal(deserializedTask.id, task.id);
      equal(deserializedTask.description, task.description);
      equal(deserializedTask.status, task.status);
      equal(deserializedTask.createdAt.getSeconds(), task.createdAt.getSeconds());
      equal(deserializedTask.updatedAt.getSeconds(), task.updatedAt.getSeconds());
    });

    it('should deserialize a task from a plain object with missing properties', () => {
      // Arrange
      const task = {};

      // Act
      const deserializedTask = Task.fromJSON(task);

      // Assert
      equal(typeof deserializedTask.id, 'number');
      equal(deserializedTask.description, '');
      equal(deserializedTask.status, TaskStatus.TODO);
      equal(deserializedTask.createdAt instanceof Date, true);
      equal(deserializedTask.updatedAt, null);
    });
  });
});
