import { Task, TaskStatus } from "./task.entity.js";

/**
 * Builder for creating Task instances in a fluent and readable way.
 * @class
 */
export class TaskBuilder {
  #description = "Task";
  #status = TaskStatus.TODO;
  #createdAt = new Date();
  #updatedAt = null;

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
   * Set the creation date.
   * @param {Date} createdAt - The creation date.
   * @returns {TaskBuilder}
   */
  withCreatedAt(createdAt) {
    this.#createdAt = createdAt;
    return this;
  }

  /**
   * Set the updated date.
   * @param {Date|null} updatedAt - The update date or null.
   * @returns {TaskBuilder}
   */
  withUpdatedAt(updatedAt) {
    this.#updatedAt = updatedAt;
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
      this.#createdAt,
      this.#updatedAt
    );
  }
}
