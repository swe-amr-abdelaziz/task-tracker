import { TaskCommand } from "../shared/enums.js";
import { TaskView } from "./task.view.js";
import { messages } from "../shared/messages.js";

/**
 * Routes CLI task commands to the appropriate {@link TaskView} handler methods.
 *
 * The router resolves the first argument as a {@link TaskCommand} and delegates
 * execution to the corresponding `TaskView` method.
 *
 * Example:
 * ```ts
 * TaskRouter.route(["add", "My task name"]);
 * // Calls TaskView.addTask("My task name")
 * ```
 * @class
 */
export class TaskRouter {
  /**
   * A mapping between {@link TaskCommand} values and their corresponding handler functions.
   *
   * Each handler delegates execution to a method on {@link TaskView}.
   *
   * @type {Record<TaskCommand, (...args: string[]) => void>}
   * @static
   * @private
   */
  static #commandHandlers = {
    [TaskCommand.ADD]: (...args) => TaskView.addTask(...args),
    [TaskCommand.UPDATE]: (...args) => TaskView.updateTask(...args),
    [TaskCommand.DELETE]: (...args) => TaskView.deleteTask(...args),
    [TaskCommand.MARK_IN_PROGRESS]: (...args) => TaskView.markTaskAsInProgress(...args),
    [TaskCommand.MARK_DONE]: (...args) => TaskView.markTaskAsDone(...args),
    [TaskCommand.LIST]: (...args) => TaskView.getTasksList(...args),
    [TaskCommand.HELP]: (...args) => TaskView.help(...args),
  };

  /**
   * Routes a CLI command to the appropriate task handler.
   *
   * @static
   * @param {string[]} args - The CLI arguments where the first element
   *   is expected to be a {@link TaskCommand}. The remaining elements
   *   are passed to the handler.
   *
   * @returns {Promise<void>}
   *
   * @example
   * ```ts
   * TaskRouter.route(["add", "Buy groceries"]);
   * // Calls TaskView.addTask("Buy groceries")
   *
   * TaskRouter.route(["list"]);
   * // Calls TaskView.getTasksList()
   *
   * TaskRouter.route(["invalid"]);
   * // Logs an error: INVALID_TASK_COMMAND
   * ```
   */
  static async route(args) {
    const command = args[0] ?? TaskCommand.HELP;
    const handler = TaskRouter.#commandHandlers[command];

    if (!handler) {
      const message = messages.error.INVALID_TASK_COMMAND.replace('{0}', command);
      throw new Error(message);
    }

    const [_, ...rest] = args;
    await handler(...rest);
  }
}
