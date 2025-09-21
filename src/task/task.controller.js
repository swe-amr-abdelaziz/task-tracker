import path from 'path';

import { AddTaskDto } from './dtos/add-task.dto.js';
import { DeleteTaskDto } from './dtos/delete-task.dto.js';
import { GetTasksListDto } from './dtos/get-tasks-list.dto.js';
import { HelpDto } from './dtos/help.dto.js';
import { MarkTaskAsDoneDto } from './dtos/mark-task-as-done.dto.js';
import { MarkTaskAsInProgressDto } from './dtos/mark-task-as-in-progress.dto.js';
import { Task } from './task.entity.js';
import { TaskControllerUtils } from './utils/task-controller.utils.js';
import { TaskModel } from './task.model.js';
import { TaskStatus } from '../shared/enums.js';
import { UpdateTaskDto } from './dtos/update-task.dto.js';
import { Utils } from '../shared/utils.js';
import { messages } from '../shared/messages.js';

/**
 * Controller layer responsible for handling requests related to tasks.
 *
 * The controller:
 * - Validates and transforms incoming data (via DTOs).
 * - Delegates persistence and retrieval to the {@link TaskModel}.
 * - Enforces business rules (e.g., preventing invalid status transitions).
 * - Returns results in a format suitable for the view layer.
 */
export class TaskController {
  /**
   * Retrieves a list of tasks based on the provided filters, sort, and pagination options.
   *
   * @static
   * @param {string[]} args - CLI arguments for retrieving tasks.
   * @returns {Task[]} A list of tasks.
   */
  static getTasksList(...args) {
    const dto = new GetTasksListDto(...args);
    const tasks = TaskModel.getTasksList();
    return TaskControllerUtils.filterSortPaginate(tasks, dto);
  }

  /**
   * Adds a new task.
   *
   * @static
   * @param {string[]} args - CLI arguments for creating the task.
   * @returns {Promise<Task>} The newly created task.
   */
  static async addTask(...args) {
    const { description } = new AddTaskDto(...args);
    return TaskModel.addTask(description);
  }

  /**
   * Updates the description of an existing task.
   *
   * @static
   * @param {string[]} args - CLI arguments containing task ID and new description.
   * @returns {Promise<Task>} The updated task.
   * @throws {Error} If the task does not exist.
   */
  static async updateTask(...args) {
    const { id, description } = new UpdateTaskDto(...args);
    const task = TaskModel.getTaskById(id);

    if (!task) {
      throw new Error(messages.error.TASK_NOT_FOUND);
    }

    return TaskModel.updateTaskDescription(id, description);
  }

  /**
   * Marks a task as "in progress".
   *
   * @static
   * @param {string[]} args - CLI arguments containing the task ID.
   * @returns {Promise<Task>} The updated task with status set to "in progress".
   * @throws {Error} If the task does not exist, is already in progress,
   * or has already been completed.
   */
  static async markTaskAsInProgress(...args) {
    const { id } = new MarkTaskAsInProgressDto(...args);
    const task = TaskModel.getTaskById(id);

    if (!task) {
      throw new Error(messages.error.TASK_NOT_FOUND);
    }
    if (task.status === TaskStatus.IN_PROGRESS) {
      throw new Error(messages.error.TASK_ALREADY_IN_PROGRESS);
    }
    if (task.status === TaskStatus.DONE) {
      throw new Error(messages.error.CANNOT_MARK_DONE_AS_IN_PROGRESS);
    }

    return TaskModel.updateTaskStatus(id, TaskStatus.IN_PROGRESS);
  }

  /**
   * Marks a task as "done".
   *
   * @static
   * @param {string[]} args - CLI arguments containing the task ID.
   * @returns {Promise<Task>} The updated task with status set to "done".
   * @throws {Error} If the task does not exist, is already done,
   * or is still in "todo" state.
   */
  static async markTaskAsDone(...args) {
    const { id } = new MarkTaskAsDoneDto(...args);
    const task = TaskModel.getTaskById(id);

    if (!task) {
      throw new Error(messages.error.TASK_NOT_FOUND);
    }
    if (task.status === TaskStatus.TODO) {
      throw new Error(messages.error.CANNOT_MARK_TODO_AS_DONE);
    }
    if (task.status === TaskStatus.DONE) {
      throw new Error(messages.error.TASK_ALREADY_DONE);
    }

    return TaskModel.updateTaskStatus(id, TaskStatus.DONE);
  }

  /**
   * Deletes a task.
   *
   * @static
   * @param {string[]} args - CLI arguments containing the task ID.
   * @returns {Promise<Task>} The deleted task.
   * @throws {Error} If the task does not exist.
   */
  static async deleteTask(...args) {
    const { id } = new DeleteTaskDto(...args);
    const task = TaskModel.getTaskById(id);

    if (!task) {
      throw new Error(messages.error.TASK_NOT_FOUND);
    }

    return TaskModel.deleteTask(id);
  }

  /**
   * Reads the help page for a given command.
   *
   * @static
   * @param {string[]} args - CLI arguments containing the command name.
   * @returns {Promise<string>} The help page content.
   */
  static async help(...args) {
    const { command } = new HelpDto(...args);
    const docsPath = TaskController.#getHelpPagePath(command);
    return TaskModel.readHelpPage(docsPath, command);
  }

  /**
   * Constructs the path to the help page for a given command.
   *
   * @static
   * @private
   * @param {string} command - The command for which to read the help page.
   * @returns {string} The full path to the help page file.
   */
  static #getHelpPagePath(command) {
    const filename = `${command ?? 'help'}.txt`
    return path.join(
      Utils.dirname(import.meta.url),
      '..',
      'docs',
      'help',
      filename,
    );
  }
}
