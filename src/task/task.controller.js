import path from 'path';

import { TaskModel } from "./task.model.js";
import { Utils } from '../shared/utils.js';

/**
 * TaskController is responsible for handling requests to the task model.
 *
 * It delegates the actual work to the {@link TaskModel} and returns the results
 * in a format suitable for the view layer.
 * @class
 */
export class TaskController {
  /**
   * Reads the help page for the given command.
   *
   * @static
   * @param {string} command - The command for which to read the help page.
   * @returns {Promise<string>} The help page content.
   */
  static async help(command) {
    const docsPath = TaskController.#getHelpPagePath(command);
    return TaskModel.readHelpPage(docsPath, command);
  }

  /**
   * Constructs the path to the help page for a given command.
   *
   * @static
   * @private
   * @param {string} command - The command for which to read the help page.
   * @returns {string} The path to the help page file.
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
