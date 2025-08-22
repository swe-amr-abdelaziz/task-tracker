import { beforeEach, describe, it, mock } from 'node:test';
import { equal, notEqual, rejects } from 'node:assert';
import { setTimeout as sleep } from 'timers/promises';

import { Task, TaskStatus } from '../task.entity.js';
import { TaskBuilder } from '../task.builder.js';
import { TestUtils } from '../../shared/test-utils.js';
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

    it('should create three tasks with their ids = 1, 2, and 3 respectively', () => {
      const task1 = new TaskBuilder().build();
      const task2 = new TaskBuilder().build();
      const task3 = new TaskBuilder().build();

      equal(task1.id, 1);
      equal(task2.id, 2);
      equal(task3.id, 3);
    });

    it('should create a new task with id = count + 1', () => {
      const tasksCount = TestUtils.generateRandomInt();
      Task.setIdCount(tasksCount);

      const task = new TaskBuilder().build();

      equal(task.id, tasksCount + 1);
    });
  });

  describe('description', () => {
    it('should create a task if a valid description is provided', () => {
      const description = TestUtils.generateRandomString();

      const task = new TaskBuilder().withDescription(description).build();

      equal(task.description, description);
    });

    it('should throw an error message if description is undefined', async () => {
      const description = undefined;

      await rejects(
        async () => new TaskBuilder().withDescription(description).build(),
        { message: messages.error.REQUIRED_TASK_DESCRIPTION },
      );
    });

    it('should throw an error message if description equals empty string', async () => {
      const description = '';

      await rejects(
        async () => new TaskBuilder().withDescription(description).build(),
        { message: messages.error.REQUIRED_TASK_DESCRIPTION },
      );
    });

    it('should throw an error message if description equals whitespace', async () => {
      const description = '    ';

      await rejects(
        async () => new TaskBuilder().withDescription(description).build(),
        { message: messages.error.REQUIRED_TASK_DESCRIPTION },
      );
    });

    it('should call the touch method when the description is set', () => {
      const description = TestUtils.generateRandomString();
      const touchMock = mock.method(Task.prototype, '_touch', () => {});

      new TaskBuilder().withDescription(description).build();

      equal(touchMock.mock.callCount(), 2);

      touchMock.mock.restore();
    });
  });

  describe('status', () => {
    it('should create a task if a valid status is provided', () => {
      const status = TaskStatus.IN_PROGRESS;

      const task = new TaskBuilder().withStatus(status).build();

      equal(task.status, status);
    });

    it('should throw an error message if an invalid status is provided', async () => {
      const status = TestUtils.generateRandomString({ minLength: 10 });

      await rejects(
        async () => new TaskBuilder().withStatus(status).build(),
        { message: messages.error.INVALID_TASK_STATUS },
      );
    });

    it('should call the touch method when the status is set', () => {
      const status = TaskStatus.IN_PROGRESS;
      const touchMock = mock.method(Task.prototype, '_touch', () => {});

      new TaskBuilder().withStatus(status).build();

      equal(touchMock.mock.callCount(), 2);

      touchMock.mock.restore();
    });
  });

  describe('creation date', () => {
    it('should set the creation timestamp on task object creation', () => {
      const task = new TaskBuilder().build();

      equal(task.createdAt.getSeconds(), new Date().getSeconds());
    });

    it('should not override the creation timestamp on task object update', async () => {
      const description = TestUtils.generateRandomString();
      const waitTime = 1000;

      const task = new TaskBuilder().build();
      await sleep(waitTime);
      task.description = description;

      notEqual(task.createdAt.getSeconds(), new Date().getSeconds());
      equal(task.createdAt.getSeconds(), new Date().getSeconds() - (waitTime / 1000));
    });
  });

  describe('update date', () => {
    it('should set the update timestamp on task object creation', () => {
      const task = new TaskBuilder().build();

      equal(task.updatedAt.getSeconds(), new Date().getSeconds());
    });

    it('should override the update timestamp on task object update', async () => {
      const description = 'Task';
      const waitTime = 1000;

      const task = new TaskBuilder().build();
      await sleep(waitTime);
      task.description = description;

      notEqual(task.updatedAt.getSeconds(), new Date().getSeconds() - (waitTime / 1000));
      equal(task.updatedAt.getSeconds(), new Date().getSeconds());
    });
  });

  describe('toJSON', () => {
    it('should serialize a task to a plain object', () => {
      const task = new TaskBuilder()
        .withDescription(TestUtils.generateRandomString())
        .withStatus(TaskStatus.TODO)
        .build();

      const serializedTask = task.toJSON();

      equal(serializedTask.id, task.id);
      equal(serializedTask.description, task.description);
      equal(serializedTask.status, task.status);
      equal(new Date(serializedTask.createdAt).getSeconds(), new Date().getSeconds());
      equal(new Date(serializedTask.updatedAt).getSeconds(), new Date().getSeconds());
    });
  });

  describe('fromJSON', () => {
    it('should deserialize a task from a plain object', () => {
      const task = new TaskBuilder()
        .withDescription(TestUtils.generateRandomString())
        .withStatus(TaskStatus.TODO)
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
      const description = TestUtils.generateRandomString();
      const task = { description };

      const deserializedTask = Task.fromJSON(task);

      equal(typeof deserializedTask.id, 'number');
      equal(deserializedTask.description, description);
      equal(deserializedTask.status, TaskStatus.TODO);
      equal(deserializedTask.createdAt instanceof Date, true);
      equal(deserializedTask.updatedAt instanceof Date, true);
    });
  });
});
