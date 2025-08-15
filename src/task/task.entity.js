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
