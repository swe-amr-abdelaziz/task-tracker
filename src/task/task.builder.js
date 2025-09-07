import { Task } from './task.entity.js';
import { TaskStatus } from '../shared/enums.js';

/**
 * Builder for creating Task instances in a fluent and readable way.
 * @class
 */
export class TaskBuilder {
  #description = 'Task';
  #status = TaskStatus.TODO;

  /**
   * Set the task description.
   * @param {string} description - The task description.
   * @returns {TaskBuilder}
   */
  withDescription(description) {
    this.#description = description;
    return this;
  }

  /**
   * Set the task status.
   * @param {TaskStatus} status - The task status.
   * @returns {TaskBuilder}
   */
  withStatus(status) {
    this.#status = status;
    return this;
  }

  /**
   * Builds and returns a Task instance.
   * @returns {Task} The constructed Task object.
   */
  build() {
    return new Task(
      this.#description,
      this.#status,
    );
  }
}
