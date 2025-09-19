import path from 'path';
import { promises as fs } from 'fs';

import { DB_FILENAME, DB_FILE_ENCODING, TaskStatus } from '../shared/enums.js';
import { Task } from './task.entity.js';
import { TaskBuilder } from './utils/task.builder.js';
import { messages } from '../shared/messages.js';

/**
 * Data access layer responsible for managing {@link Task} entities.
 *
 * The `TaskModel` provides:
 * - In-memory storage for tasks (acting as a cache).
 * - Persistent storage in a JSON file that serves as a lightweight database.
 * - Full CRUD operations (create, read, update, delete).
 * - Utility methods for reading help documentation.
 *
 * This class should only be used by the controller layer.
 * The view layer must never interact with the model directly.
 */
export class TaskModel {
  /**
   * The absolute path of the database file.
   * @static
   * @private
   * @type {string}
   */
  static #dbPath = path.join(
    process.cwd(),
    DB_FILENAME,
  );

  /**
   * The in-memory list of tasks.
   * @static
   * @private
   * @type {Task[]}
   */
  static #tasks = [];

  /**
   * Populates the in-memory tasks list from the database file.
   * If the file does not exist, it initializes an empty list and creates the file.
   *
   * @static
   * @returns {Promise<Task[]>} The list of tasks loaded from the database.
   * @throws {Error} If reading or parsing the database fails unexpectedly.
   */
  static async populateData() {
    try {
      const raw = await fs.readFile(TaskModel.#dbPath, DB_FILE_ENCODING);
      const plainTasks = JSON.parse(raw);
      TaskModel.#tasks = plainTasks.map((task) => Task.fromJSON(task));
      return TaskModel.#tasks;
    } catch (err) {
      if (err.code === 'ENOENT') {
        await TaskModel._writeChangesToDb();
        return TaskModel.#tasks;
      } else {
        throw new Error(messages.error.READ_DB_FAILED);
      }
    }
  }

  /**
   * Retrieves the list of tasks.
   *
   * @static
   * @returns {Task[]} The list of tasks.
   */
  static getTasksList() {
    return TaskModel.#tasks;
  }

  /**
   * Retrieves a task by its unique ID.
   *
   * @static
   * @param {string} id - The unique identifier of the task.
   * @returns {Task | undefined} The matching task, or undefined if not found.
   */
  static getTaskById(id) {
    return TaskModel.#tasks.find(
      (task) => task.id === id
    );
  }

  /**
   * Creates and adds a new task with the provided description.
   *
   * @static
   * @param {string} description - The description of the new task.
   * @returns {Promise<Task | undefined>} The newly created task.
   */
  static async addTask(description) {
    const task = new TaskBuilder()
      .withDescription(description)
      .withStatus(TaskStatus.TODO)
      .build();
    TaskModel.#tasks.push(task);
    await TaskModel._writeChangesToDb();
    return task;
  }

  /**
   * Updates the description of an existing task.
   *
   * @static
   * @param {string} id - The unique identifier of the task.
   * @param {string} description - The new description for the task.
   * @returns {Promise<Task | undefined>} The updated task, or undefined if not found.
   */
  static async updateTaskDescription(id, description) {
    const task = TaskModel.getTaskById(id);
    if (task) {
      task.description = description;
      await TaskModel._writeChangesToDb();
    }
    return task;
  }

  /**
   * Updates the status of an existing task.
   *
   * @static
   * @param {string} id - The unique identifier of the task.
   * @param {TaskStatus} status - The new status for the task.
   * @returns {Promise<Task | undefined>} The updated task, or undefined if not found.
   */
  static async updateTaskStatus(id, status) {
    const task = TaskModel.getTaskById(id);
    if (task) {
      task.status = status;
      await TaskModel._writeChangesToDb();
    }
    return task;
  }

  /**
   * Deletes a task by its ID.
   *
   * @static
   * @param {string} id - The unique identifier of the task to delete.
   * @returns {Promise<Task | undefined>} The deleted task, or undefined if not found.
   */
  static async deleteTask(id) {
    const task = TaskModel.getTaskById(id);
    if (task) {
      TaskModel.#tasks = TaskModel.#tasks.filter(
        (task) => task.id !== id
      );
      await TaskModel._writeChangesToDb();
    }
    return task;
  }

  /**
   * Reads the help page for the given command.
   *
   * @static
   * @param {string} docsPath - The path to the help page file.
   * @param {string} command - The command for which to read the help page.
   * @returns {Promise<string>} The help page content.
   */
  static async readHelpPage(docsPath, command) {
    try {
      const helpPage = await fs.readFile(docsPath, DB_FILE_ENCODING);
      return helpPage;
    } catch (_) {
      const message = messages.error.INVALID_TASK_COMMAND.replace('{0}', command);
      throw new Error(message);
    }
  }

  /**
   * Writes the in-memory tasks list to the database file.
   *
   * @static
   * @private
   */
  static async _writeChangesToDb() {
    const tasks = TaskModel.#tasks.map((task) => task.toJSON());
    await fs.writeFile(
      TaskModel.#dbPath,
      JSON.stringify(tasks, null, 2),
      DB_FILE_ENCODING,
    );
  }
}
