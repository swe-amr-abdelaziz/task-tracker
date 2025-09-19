import { Task } from './task.entity.js';
import { TaskController } from './task.controller.js';
import { TaskViewUtils } from './utils/task-view.utils.js';
import { Utils } from '../shared/utils.js';
import { messages } from '../shared/messages.js';

/**
 * Presentation layer responsible for displaying results to the user.
 *
 * The `TaskView`:
 * - Delegates all business logic and validation to the {@link TaskController}.
 * - Formats controller results into user-friendly messages and outputs them.
 * - Provides consistent success, error, and informational messaging.
 *
 * This class should never perform validation or persistence itself.
 * It should only deal with presentation concerns.
 */
export class TaskView {
  /**
   * Displays a list of tasks.
   *
   * @static
   * @param {string[]} args - The CLI arguments (filters, sort, etc.)
   */
  static getTasksList(...args) {
    const tasks = TaskController.getTasksList(...args);
    TaskViewUtils.printTasksTable(tasks);
  }

  /**
   * Adds a new task to the task list.
   *
   * @static
   * @param {string[]} args - The CLI arguments sent by the user.
   */
  static async addTask(...args) {
    const task = await TaskController.addTask(...args);
    this.#printSuccessMsgFollowedByTable(messages.success.TASK_ADDED, task);
  }

  /**
   * Updates an existing task with a new description.
   *
   * @static
   * @param {string[]} args - The CLI arguments sent by the user.
   */
  static async updateTask(...args) {
    const task = await TaskController.updateTask(...args);
    this.#printSuccessMsgFollowedByTable(messages.success.TASK_UPDATED, task);
  }

  /**
   * Marks an existing task as 'in-progress'.
   *
   * @static
   * @param {string[]} args - The CLI arguments sent by the user.
   */
  static async markTaskAsInProgress(...args) {
    const task = await TaskController.markTaskAsInProgress(...args);
    this.#printSuccessMsgFollowedByTable(messages.success.TASK_MARKED_AS_IN_PROGRESS, task);
  }

  /**
   * Marks an existing task as 'done'.
   *
   * @static
   * @param {string[]} args - The CLI arguments sent by the user.
   */
  static async markTaskAsDone(...args) {
    const task = await TaskController.markTaskAsDone(...args);
    this.#printSuccessMsgFollowedByTable(messages.success.TASK_MARKED_AS_DONE, task);
  }

  /**
   * Deletes an existing task.
   *
   * @static
   * @param {string[]} args - The CLI arguments sent by the user.
   */
  static async deleteTask(...args) {
    const task = await TaskController.deleteTask(...args);
    this.#printSuccessMsgFollowedByTable(messages.success.TASK_DELETED, task);
  }

  /**
   * Displays the help page for the given command.
   *
   * @static
   * @param {string[]} args - The CLI arguments sent by the user.
   */
  static async help(...args) {
    const helpPage = await TaskController.help(...args);
    console.log(helpPage);
  }

  /**
   * Logs a success message followed by a table of tasks.
   *
   * @static
   * @private
   * @param {string} msg - The success message to log.
   * @param {Task} task - The task to be displayed in the table.
   */
  static #printSuccessMsgFollowedByTable(msg, task) {
    Utils.logSuccessMsg(msg);
    TaskViewUtils.printTasksTable(task);
  }
}
