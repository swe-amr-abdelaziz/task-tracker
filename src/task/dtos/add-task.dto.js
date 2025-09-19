import { TaskValidator } from '../utils/task.validator.js';
import { messages } from '../../shared/messages.js';

/**
 * Data transfer object (DTO) for adding a task.
 * Encapsulates validation and parsing of CLI arguments
 * related to adding a new task.
 */
export class AddTaskDto {
  /**
   * The parsed description argument.
   * @private
   * @type {string}
   */
  #description;

  /**
   * Initializes a new AddTaskDto from CLI arguments.
   *
   * @param {string[]} args - The CLI arguments passed by the user.
   * @throws {RangeError} If more than one argument is provided.
   * @throws {TypeError} If the task description is missing or invalid.
   */
  constructor(...args) {
    this.#validateArgs(args);
    this.#parseArgs(args);
  }

  /**
   * The description of the task to be added.
   *
   * @readonly
   * @type {string}
   */
  get description() {
    return this.#description;
  }

  /**
   * Ensures the CLI arguments are valid.
   *
   * @private
   * @param {string[]} args - Raw CLI arguments.
   * @throws {RangeError} If more than one argument is provided.
   * @throws {TypeError} If the task description is missing or invalid.
   */
  #validateArgs(args) {
    if (args.length > 1) {
      throw new RangeError(messages.error.TOO_MANY_ARGS);
    }
    const [description] = args;
    TaskValidator.validateTaskDescription(description);
  }

  /**
   * Extracts the description from CLI arguments.
   *
   * @private
   * @param {string[]} args - Raw CLI arguments.
   */
  #parseArgs(args) {
    const [description] = args;
    this.#description = description;
  }
}
