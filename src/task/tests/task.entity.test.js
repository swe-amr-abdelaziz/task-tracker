import { beforeEach, describe, it, mock } from 'node:test';
import { equal, notEqual, rejects } from 'node:assert';
import { setTimeout as sleep } from 'timers/promises';

import { Task, TaskStatus } from '../task.entity.js';
import { TaskBuilder } from '../task.builder.js';
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

    it('should throw an error message if an invalid description is provided', async () => {
      // Arrange
      const description = '    ';

      // Act & Assert
      await rejects(
        async () => new TaskBuilder().withDescription(description).build(),
        { message: messages.error.REQUIRED_TASK_DESCRIPTION },
      );
    });

    it('should call the touch method when the description is set', () => {
      // Arrange
      let task;
      const description = 'This is a test description';
      const touchMock = mock.method(Task.prototype, '_touch', () => {});

      // Act
      task = new TaskBuilder().withDescription(description).build();

      // Assert
      equal(touchMock.mock.callCount(), 2);

      // Teardown
      touchMock.mock.restore();
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

    it('should throw an error message if an invalid status is provided', async () => {
      // Arrange
      const status = 'invalid-status';

      // Act & Assert
      await rejects(
        async () => new TaskBuilder().withStatus(status).build(),
        { message: messages.error.INVALID_TASK_STATUS },
      );
    });

    it('should call the touch method when the status is set', () => {
      // Arrange
      let task;
      const status = TaskStatus.IN_PROGRESS;
      const touchMock = mock.method(Task.prototype, '_touch', () => {});

      // Act
      task = new TaskBuilder().withStatus(status).build();

      // Assert
      equal(touchMock.mock.callCount(), 2);

      // Teardown
      touchMock.mock.restore();
    });
  });

  describe('creation date', () => {
    it('should set the creation timestamp on task object creation', () => {
      // Arrange
      let task;

      // Act
      task = new TaskBuilder().build();

      // Assert
      equal(task.createdAt.getSeconds(), new Date().getSeconds());
    });

    it('should not override the creation timestamp on task object update', async () => {
      // Arrange
      let task;
      const description = 'Task';

      // Act
      task = new TaskBuilder().build();
      const waitTime = 1000;
      await sleep(waitTime);
      task.description = description;

      // Assert
      notEqual(task.createdAt.getSeconds(), new Date().getSeconds());
      equal(task.createdAt.getSeconds(), new Date().getSeconds() - (waitTime / 1000));
    });
  });

  describe('update date', () => {
    it('should set the update timestamp on task object creation', () => {
      // Arrange
      let task;

      // Act
      task = new TaskBuilder().build();

      // Assert
      equal(task.updatedAt.getSeconds(), new Date().getSeconds());
    });

    it('should override the update timestamp on task object update', async () => {
      // Arrange
      let task;
      const description = 'Task';

      // Act
      task = new TaskBuilder().build();
      const waitTime = 1000;
      await sleep(waitTime);
      task.description = description;

      // Assert
      notEqual(task.updatedAt.getSeconds(), new Date().getSeconds() - (waitTime / 1000));
      equal(task.updatedAt.getSeconds(), new Date().getSeconds());
    });
  });

  describe('toJSON', () => {
    it('should serialize a task to a plain object', () => {
      // Arrange
      const task = new TaskBuilder()
        .withDescription('Task')
        .withStatus(TaskStatus.TODO)
        .build();

      // Act
      const serializedTask = task.toJSON();

      // Assert
      equal(serializedTask.id, task.id);
      equal(serializedTask.description, task.description);
      equal(serializedTask.status, task.status);
      equal(new Date(serializedTask.createdAt).getSeconds(), new Date().getSeconds());
      equal(new Date(serializedTask.updatedAt).getSeconds(), new Date().getSeconds());
    });
  });

  describe('fromJSON', () => {
    it('should deserialize a task from a plain object', () => {
      // Arrange
      const task = new TaskBuilder()
        .withDescription('Task')
        .withStatus(TaskStatus.TODO)
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
      const description = 'Task';
      const task = { description };

      // Act
      const deserializedTask = Task.fromJSON(task);

      // Assert
      equal(typeof deserializedTask.id, 'number');
      equal(deserializedTask.description, description);
      equal(deserializedTask.status, TaskStatus.TODO);
      equal(deserializedTask.createdAt instanceof Date, true);
      equal(deserializedTask.updatedAt instanceof Date, true);
    });
  });
});
