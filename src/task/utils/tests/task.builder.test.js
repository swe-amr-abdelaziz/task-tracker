import { equal, ok } from 'node:assert';
import { describe, it } from 'node:test';

import { Task } from '../../task.entity.js';
import { TaskBuilder } from '../task.builder.js';
import { TaskStatus } from '../../../shared/enums.js';
import { TestUtils } from '../../../shared/test-utils.js';

describe('TaskBuilder', () => {
  describe('description', () => {
    it('should create a task with the default description', () => {
      const description = 'Task';

      const task = new TaskBuilder().build();

      equal(task.description, description);
    });

    it('should set the description', () => {
      const description = TestUtils.generateRandomString({ excludeSpecialCharacters: true });

      const task = new TaskBuilder().withDescription(description).build();

      equal(task.description, description);
    });
  });

  describe('status', () => {
    it('should create a task with the default status', () => {
      const status = TaskStatus.TODO;

      const task = new TaskBuilder().build();

      equal(task.status, status);
    });

    it('should set the status', () => {
      const status = TaskStatus.IN_PROGRESS;

      const task = new TaskBuilder().withStatus(status).build();

      equal(task.status, status);
    });
  });

  describe('build', () => {
    it('should return an instance of Task class', () => {
      const task = new TaskBuilder().build();

      ok(task instanceof Task, true);
    });
  });
});
