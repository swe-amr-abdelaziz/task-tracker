import { TaskController } from './task.controller.js';
import { Utils } from '../shared/utils.js';

/**
 * TaskView is responsible for displaying results to the user.
 *
 * It delegates the actual work to the {@link TaskController} and formats
 * the results for display.
 * @class
 */
export class TaskView {
  static getTasksList(status) {}

  static addTask(description) {}

  static updateTask(id, description) {}

  static markTaskAsInProgress(id) {}

  static markTaskAsDone(id) {}

  static deleteTask(id) {}

  /**
   * Displays the help page for the given command.
   *
   * @static
   * @param {string} command - The command for which to display the help page.
   * @returns {Promise<void>}
   */
  static async help(command) {
    const helpPage = await TaskController.help(command);
    console.log(helpPage);
  }
}
