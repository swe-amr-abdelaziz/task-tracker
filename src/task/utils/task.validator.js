import { Task } from '../task.entity.js';
import { TaskCommand } from '../../shared/enums.js';
import { messages } from '../../shared/messages.js';

/**
 * Provides validation methods for task-related Data Transfer Objects (DTOs).
 * Each method checks the presence, type, and validity of properties
 * before they are processed by the controller or service layers.
 */
export class TaskValidator {
  /**
   * Validates the task id.
   *
   * @static
   * @param {number|string} id - The task id to validate.
   * @throws {TypeError} If id is missing or not a valid number.
   */
  static validateTaskId(id) {
    if (!id) {
      throw new TypeError(messages.error.REQUIRED_TASK_ID);
    }
    if (isNaN(id)) {
      throw new TypeError(messages.error.INVALID_TASK_ID);
    }
  }

  /**
   * Validates the task description.
   *
   * @static
   * @param {string} description - The task description to validate.
   * @throws {TypeError} If description is missing or empty after trimming.
   * @throws {TypeError} If description is not a valid string.
   */
  static validateTaskDescription(description) {
    if (!description?.toString()?.trim()) {
      throw new TypeError(messages.error.REQUIRED_TASK_DESCRIPTION);
    }
    if (typeof description !== 'string') {
      throw new TypeError(messages.error.INVALID_TASK_DESCRIPTION);
    }
  }

  /**
   * Validates the help command.
   *
   * @static
   * @param {string} command - The help command to validate.
   * @throws {Error} If the command itself is "help".
   */
  static validateHelpCommand(command) {
    if (command === TaskCommand.HELP) {
      throw new Error(messages.error.INVALID_HELP_COMMAND);
    }
  }

  /**
   * Validates the type of the tasks data.
   *
   * @static
   * @param {Task|Task[]} data - The tasks data to validate.
   * @throws {TypeError} If data is not a task instance or an array that contains non-task instances.
   */
  static validateTasksType(data) {
    if (Array.isArray(data)) {
      if (!data.every((task) => task instanceof Task)) {
        throw new TypeError(messages.error.INVALID_TASKS_DATA_TYPE);
      }
    }
    else {
      if (!(data instanceof Task)) {
        throw new TypeError(messages.error.INVALID_TASK_DATA_TYPE);
      }
    }
  }
}
