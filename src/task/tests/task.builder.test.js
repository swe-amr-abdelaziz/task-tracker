import { equal } from 'node:assert';
import { describe, it } from 'node:test';

import { TaskBuilder } from '../task.builder.js';
import { TaskStatus } from '../task.entity.js';

describe('TaskBuilder', () => {
  describe('description', () => {
    it('should create a task with the default description', () => {
      // Arrange
      let task;

      // Act
      task = new TaskBuilder().build();

      // Assert
      equal(task.description, "Task");
    });

    it('should set the description', () => {
      // Arrange
      let task;
      const description = "New Description";

      // Act
      task = new TaskBuilder().withDescription(description).build();

      // Assert
      equal(task.description, description);
    });
  });

  describe('status', () => {
    it('should create a task with the default status', () => {
      // Arrange
      let task;

      // Act
      task = new TaskBuilder().build();

      // Assert
      equal(task.status, TaskStatus.TODO);
    });

    it('should set the status', () => {
      // Arrange
      let task;
      const status = TaskStatus.IN_PROGRESS;

      // Act
      task = new TaskBuilder().withStatus(status).build();

      // Assert
      equal(task.status, status);
    });
  });

  describe('createdAt', () => {
    it('should create a task with the default creation date', () => {
      // Arrange
      let task;

      // Act
      task = new TaskBuilder().build();

      // Assert
      equal(task.createdAt.getSeconds(), new Date().getSeconds());
    });

    it('should set the creation date', () => {
      // Arrange
      let task;
      const createdAt = new Date('2025-01-01');

      // Act
      task = new TaskBuilder().withCreatedAt(createdAt).build();

      // Assert
      equal(task.createdAt.getSeconds(), createdAt.getSeconds());
    });
  });

  describe('updatedAt', () => {
    it('should create a task with the default update date', () => {
      // Arrange
      let task;

      // Act
      task = new TaskBuilder().build();

      // Assert
      equal(task.updatedAt, null);
    });

    it('should set the update date', () => {
      // Arrange
      let task;
      const updatedAt = new Date('2025-01-01');

      // Act
      task = new TaskBuilder().withUpdatedAt(updatedAt).build();

      // Assert
      equal(task.updatedAt.getSeconds(), updatedAt.getSeconds());
    });
  });
});
