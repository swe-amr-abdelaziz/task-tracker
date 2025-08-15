import { equal } from 'node:assert';
import { describe, it } from 'node:test';

import { TaskStatus } from '../task.entity.js';
import { TaskBuilder } from '../task.builder.js';

describe('TaskBuilder', () => {
  describe('description', () => {
    it('should create a task with the default description', () => {
      const task = new TaskBuilder().build();
      equal(task.description, "Task");
    });

    it('should set the description', () => {
      const description = "New Description";
      const task = new TaskBuilder().withDescription(description).build();
      equal(task.description, description);
    });
  });

  describe('status', () => {
    it('should create a task with the default status', () => {
      const task = new TaskBuilder().build();
      equal(task.status, TaskStatus.TODO);
    });

    it('should set the status', () => {
      const status = TaskStatus.IN_PROGRESS;
      const task = new TaskBuilder().withStatus(status).build();
      equal(task.status, status);
    });
  });

  describe('createdAt', () => {
    it('should create a task with the default creation date', () => {
      const task = new TaskBuilder().build();
      equal(task.createdAt.getSeconds(), new Date().getSeconds());
    });

    it('should set the creation date', () => {
      const createdAt = new Date('2025-01-01');
      const task = new TaskBuilder().withCreatedAt(createdAt).build();
      equal(task.createdAt.getSeconds(), createdAt.getSeconds());
    });
  });

  describe('updatedAt', () => {
    it('should create a task with the default update date', () => {
      const task = new TaskBuilder().build();
      equal(task.updatedAt, null);
    });

    it('should set the update date', () => {
      const updatedAt = new Date('2025-01-01');
      const task = new TaskBuilder().withUpdatedAt(updatedAt).build();
      equal(task.updatedAt.getSeconds(), updatedAt.getSeconds());
    });
  });
});
