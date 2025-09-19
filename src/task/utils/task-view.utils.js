import { HorizontalAlignment, TaskStatusIcon } from '../../shared/enums.js';
import { ResponsiveTable } from '../../shared/responsive-table/responsive-table.js';
import { Task } from '../task.entity.js';
import { TaskValidator } from './task.validator.js';
import { Utils } from '../../shared/utils.js';
import { messages } from '../../shared/messages.js';

/**
 * Provides utility methods for displaying task-related data.
 */
export class TaskViewUtils {
  /**
   * Prints a table of tasks to the console.
   *
   * @static
   * @param {Task/Task[]} data - The task(s) to print.
   */
  static printTasksTable(data) {
    if (data) {
      TaskValidator.validateTasksType(data);
    }
    const tasks = TaskViewUtils.#formatTasks(data);
    if (tasks.length === 0) {
      Utils.logInfoMsg(messages.success.NO_TASKS_FOUND);
      return;
    }

    const headerData = [
      { key: 'id', label: 'ID', isFixed: true, textAlign: HorizontalAlignment.RIGHT },
      { key: 'description', label: 'Description', isFixed: false },
      { key: 'status', label: 'Status', isFixed: true },
      { key: 'createdAt', label: 'Creation Date', isFixed: false },
      { key: 'updatedAt', label: 'Update Date', isFixed: false },
    ];
    const table = new ResponsiveTable(tasks, headerData);
    table.print();
  }

  /**
   * Formats task / an array of tasks into a more readable format.
   *
   * @static
   * @private
   * @param {Task|Task[]} data - The task(s) to format.
   * @returns {Task[]} The formatted tasks.
   */
  static #formatTasks(data) {
    if (!data) {
      return [];
    }
    const tasks = Array.isArray(data) ? data : [data];
    return tasks.map(task => {
      task = task.toJSON();
      return {
        ...task,
        status: TaskViewUtils.#formatTaskStatus(task.status),
        createdAt: Utils.formatDate(task.createdAt),
        updatedAt: Utils.formatDate(task.updatedAt),
      };
    });
  }

  /**
   * Formats a task status into a more readable format.
   *
   * @static
   * @private
   * @param {TaskStatus} status - The task status to format.
   * @returns {string} The formatted task status.
   */
  static #formatTaskStatus(status) {
    return `${TaskStatusIcon[status]} ${status}`;
  }
}
