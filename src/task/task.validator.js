import { TaskStatus } from '../shared/enums.js';
import { messages } from '../shared/messages.js';

/**
 * Provides validation methods for task-related Data Transfer Objects (DTOs).
 * Each method checks the presence, type, and validity of properties
 * before they are processed by the controller or service layers.
 */
export class TaskValidator {
  /**
   * Validates the DTO used for adding a task.
   *
   * @static
   * @param {{ description: string }} dto - The DTO containing task description.
   * @throws {Error} If the task description is missing or invalid.
   */
  static validateAddDto(dto) {
    TaskValidator.#validateTaskDescription(dto.description);
  }

  /**
   * Validates the DTO used for updating a task.
   *
   * @static
   * @param {{ id: number|string, description: string }} dto - The DTO containing task id and new description.
   * @throws {Error} If the task id is missing/invalid or description is missing.
   */
  static validateUpdateDto(dto) {
    TaskValidator.#validateTaskId(dto.id);
    TaskValidator.#validateTaskDescription(dto.description);
  }

  /**
   * Validates the DTO used for deleting a task.
   *
   * @static
   * @param {{ id: number|string }} dto - The DTO containing task id.
   * @throws {Error} If the task id is missing or invalid.
   */
  static validateDeleteDto(dto) {
    TaskValidator.#validateTaskId(dto.id);
  }

  /**
   * Validates the DTO used for marking a task as 'in-progress'.
   *
   * @static
   * @param {{ id: number|string }} dto - The DTO containing task id.
   * @throws {Error} If the task id is missing or invalid.
   */
  static validateMarkAsInProgressDto(dto) {
    TaskValidator.#validateTaskId(dto.id);
  }

  /**
   * Validates the DTO used for marking a task as 'done'.
   *
   * @static
   * @param {{ id: number|string }} dto - The DTO containing task id.
   * @throws {Error} If the task id is missing or invalid.
   */
  static validateMarkAsDoneDto(dto) {
    TaskValidator.#validateTaskId(dto.id);
  }

  /**
   * Validates the DTO used for retrieving a task list.
   * Status is optional, but if provided, it must be valid.
   *
   * @static
   * @param {{ status?: TaskStatus }} dto - The DTO containing optional task status filter.
   * @throws {Error} If the status is provided but invalid.
   */
  static validateGetListDto(dto) {
    if (dto.status) {
      TaskValidator.#validateTaskStatus(dto.status);
    }
  }

  /**
   * Validates a task id.
   *
   * @static
   * @private
   * @param {number|string} id - The task id to validate.
   * @throws {Error} If id is missing or not a valid number.
   */
  static #validateTaskId(id) {
    if (!id) {
      throw new Error(messages.error.REQUIRED_TASK_ID);
    }
    if (isNaN(id)) {
      throw new Error(messages.error.INVALID_TASK_ID);
    }
  }


  /**
   * Validates a task description.
   *
   * @static
   * @private
   * @param {string} description - The task description to validate.
   * @throws {Error} If description is missing or empty after trimming.
   */
  static #validateTaskDescription(description) {
    if (!description?.trim()) {
      throw new Error(messages.error.REQUIRED_TASK_DESCRIPTION);
    }
  }

  /**
   * Validates a task status.
   *
   * @static
   * @private
   * @param {TaskStatus} status - The task status to validate.
   * @throws {Error} If status is not part of the predefined {@link TaskStatus}.
   */
  static #validateTaskStatus(status) {
    if (!Object.values(TaskStatus).includes(status)) {
      throw new Error(messages.error.INVALID_TASK_STATUS);
    }
  }
}
