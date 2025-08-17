import path from 'path';
import { promises as fs } from 'fs';

import { DB_FILENAME, DB_FILE_ENCODING } from '../shared/enums.js';
import { Task, TaskStatus } from './task.entity.js';
import { TaskBuilder } from './task.builder.js';
import { messages } from '../shared/messages.js';

/**
 * TaskModel is responsible for managing task entities in memory
 * and persisting them to a JSON file that acts as a simple database.
 *
 * It supports CRUD operations (create, read, update, delete)
 * and ensures changes are written to disk.
 * @class
 */
export class TaskModel {
  /** @type {string} Absolute path of the database file */
  static #dbPath = path.join(
    process.cwd(),
    DB_FILENAME,
  );

  /** @type {Task[]} In-memory list of tasks */
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
   * Retrieves the list of tasks, optionally filtered by status.
   *
   * @static
   * @param {TaskStatus} [status] - Optional status to filter tasks by.
   * @returns {Task[]} The filtered or complete list of tasks.
   */
  static getTasksList(status) {
    if (!status) {
      return TaskModel.#tasks;
    }
    return TaskModel.#tasks.filter(
      (task) => task.status === status
    );
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
   * @returns {Promise<void>}
   */
  static async addTask(description) {
    const task = new TaskBuilder()
      .withDescription(description)
      .withStatus(TaskStatus.TODO)
      .build();
    TaskModel.#tasks.push(task);
    await TaskModel._writeChangesToDb();
  }

  /**
   * Updates the description of an existing task.
   *
   * @static
   * @param {string} id - The unique identifier of the task.
   * @param {string} description - The new description for the task.
   * @returns {Promise<void>}
   */
  static async updateTaskDescription(id, description) {
    const task = TaskModel.getTaskById(id);
    if (task) {
      task.description = description;
      await TaskModel._writeChangesToDb();
    }
  }

  /**
   * Updates the status of an existing task.
   *
   * @static
   * @param {string} id - The unique identifier of the task.
   * @param {TaskStatus} status - The new status for the task.
   * @returns {Promise<void>}
   */
  static async updateTaskStatus(id, status) {
    const task = TaskModel.getTaskById(id);
    if (task) {
      task.status = status;
      await TaskModel._writeChangesToDb();
    }
  }

  /**
   * Deletes a task by its ID.
   *
   * @static
   * @param {string} id - The unique identifier of the task to delete.
   * @returns {Promise<void>}
   */
  static async deleteTask(id) {
    const tasksCount = TaskModel.#tasks.length;
    TaskModel.#tasks = TaskModel.#tasks.filter(
      (task) => task.id !== id
    );
    if (TaskModel.#tasks.length < tasksCount) {
      await TaskModel._writeChangesToDb();
    }
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
    } catch (e) {
      const message = messages.error.INVALID_TASK_COMMAND.replace('{0}', command);
      throw new Error(message);
    }
  }

  /**
   * Writes the in-memory tasks list to the database file.
   *
   * @static
   * @private
   * @returns {Promise<void>}
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
