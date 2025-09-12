import { BaseEntity } from '../shared/entities/base.entity.js';
import { TaskStatus } from '../shared/enums.js';
import { messages } from '../shared/messages.js';

/**
 * Represents a task with a description, status, and base entity members.
 *
 * @extends BaseEntity
 */
export class Task extends BaseEntity {
  /**
   * The description of the task.
   * @type {string}
   * @private
   */
  #description;

  /**
   * The status of the task.
   * @type {TaskStatus}
   * @private
   */
  #status;

  /**
   * Create a new Task instance.
   *
   * @constructor
   * @param {string} description - The description of the task.
   * @param {string} [status=TaskStatus.TODO] - The status of the task.
   */
  constructor(description, status = TaskStatus.TODO) {
    super();
    this.description = description;
    this.status = status;
  }

  /**
   * Gets the description of the task.
   *
   * @type {string}
   */
  get description() {
    return this.#description;
  }

  /**
   * Sets the description of the task.
   *
   * @param {string} description - The new task description.
   */
  set description(description) {
    if (!description?.trim()) {
      throw new Error(messages.error.REQUIRED_TASK_DESCRIPTION);
    }
    this.#description = description;
    this._touch();
  }

  /**
   * Gets the current status of the task.
   *
   * @type {TaskStatus}
   */
  get status() {
    return this.#status;
  }

  /**
   * Sets the current status of the task.
   *
   * @param {TaskStatus} status - The new task status.
   */
  set status(status) {
    if (!Object.values(TaskStatus).includes(status)) {
      throw new Error(messages.error.INVALID_TASK_STATUS);
    }
    this.#status = status;
    this._touch();
  }

  /**
   * Serialize Task to a plain object for JSON storage.
   * Dates are converted to ISO strings for portability.
   *
   * @returns {{id:number, description:string, status:string, createdAt:string, updatedAt:string}}
   */
  toJSON() {
    return {
      id: this.id,
      description: this.description,
      status: this.status,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }

  /**
   * Restore a Task instance from a plain object (reverse of toJSON).
   *
   * @static
   * @param {{id:number, description:string, status:string, createdAt:string, updatedAt:string}} obj
   * @returns {Task}
   */
  static fromJSON(obj) {
    const description = obj.description;
    const status = obj.status ?? TaskStatus.TODO;
    const createdAt = new Date(obj.createdAt);
    const updatedAt = new Date(obj.updatedAt);

    const task = new Task(description, status);
    task._restoreTimestamps(createdAt, updatedAt);

    task._id = typeof obj.id === 'number' ? obj.id : ++BaseEntity.count;
    Task.setIdCount(Math.max(BaseEntity.count, task._id));

    return task;
  }

  /**
   * Set the count of tasks.
   *
   * @static
   * @param {number} count - The count of tasks.
   */
  static setIdCount(count) {
    BaseEntity.count = count;
  }
};
