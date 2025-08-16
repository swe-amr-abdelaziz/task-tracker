import { BaseEntity } from "../shared/entities/base.entity.js";
import { messages } from "../shared/messages.js";
import { Utils } from "../shared/utils.js";

/**
 * Represents a task with a description, status, and base entity members.
 * @class
 */
export class Task extends BaseEntity {
  #description;
  #status;

  /**
   * Create a new Task instance.
   * @param {string} description - The description of the task.
   * @param {string} [status=TaskStatus.TODO] - The status of the task.
   * @param {Date} [createdAt=new Date()] - The creation timestamp.
   * @param {Date|null} [updatedAt=null] - The last updated timestamp.
   */
  constructor(
    description,
    status = TaskStatus.TODO,
    createdAt = new Date(),
    updatedAt = null,
  ) {
    super(createdAt, updatedAt);
    this.description = description;
    this.status = status;
  }

  /**
   * @returns {string} The task description.
   */
  get description() {
    return this.#description;
  }

  /**
   * @param {string} description - The new task description.
   */
  set description(description) {
    if (!description.trim()) {
      Utils.logErrorMsg(messages.error.REQUIRED_TASK_DESCRIPTION);
    }
    this.#description = description;
  }


  /**
   * @returns {TaskStatus} The current status of the task.
   */
  get status() {
    return this.#status;
  }

  /**
   * @param {TaskStatus} status - The new task status.
   */
  set status(status) {
    const validStatuses = [TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.DONE];
    if (!validStatuses.includes(status)) {
      Utils.logErrorMsg(messages.error.INVALID_TASK_STATUS);
    }
    this.#status = status;
  }

  /**
   * Serialize Task to a plain object for JSON storage.
   * Dates are converted to ISO strings for portability.
   *
   * @returns {{id:number, description:string, status:string, createdAt:string, updatedAt:string|null}}
   */
  toJSON() {
    return {
      id: this.id,
      description: this.description,
      status: this.status,
      createdAt: this.createdAt ? this.createdAt.toISOString() : new Date().toISOString(),
      updatedAt: this.updatedAt ? this.updatedAt.toISOString() : null,
    };
  }

  /**
   * Restore a Task instance from a plain object (reverse of toJSON).
   *
   * @static
   * @param {{id:number, description:string, status:string, createdAt:string, updatedAt:string|null}} obj
   * @returns {Task}
   */
  static fromJSON(obj) {
    const description = obj.description ?? '';
    const status = obj.status ?? TaskStatus.TODO;
    const createdAt = obj.createdAt ? new Date(obj.createdAt) : new Date();
    const updatedAt = obj.updatedAt ? new Date(obj.updatedAt) : null;

    const task = new Task(description, status, createdAt, updatedAt);

    task._id = typeof obj.id === 'number' ? obj.id : ++BaseEntity.count;
    Task.setIdCount(Math.max(BaseEntity.count, task._id));

    return task;
  }

  /**
   * Set the count of tasks.
   *
   * @static
   * @param {number} _count - The count of tasks.
   */
  static setIdCount(_count) {
    BaseEntity.count = _count;
  }
};


/**
 * @enum {string} Valid task statuses.
 */
export const TaskStatus = {
  TODO: 'todo',
  IN_PROGRESS: 'in-progress',
  DONE: 'done',
};
