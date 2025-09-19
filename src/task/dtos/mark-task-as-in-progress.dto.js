import { TaskValidator } from '../utils/task.validator.js';
import { messages } from '../../shared/messages.js';

/**
 * Data transfer object (DTO) for marking a task as 'in-progress'.
 * Encapsulates validation and parsing of CLI arguments
 * related to marking a task as 'in-progress'.
 */
export class MarkTaskAsInProgressDto {
  /**
   * The parsed id argument.
   * @private
   * @type {number}
   */
  #id;

  /**
   * Initializes a new MarkTaskAsInProgressDto from CLI arguments.
   *
   * @param {string[]} args - The CLI arguments passed by the user.
   * @throws {RangeError} If more than one argument is provided.
   * @throws {TypeError} If the task id is missing or invalid.
   */
  constructor(...args) {
    this.#validateArgs(args);
    this.#parseArgs(args);
  }

  /**
   * ID of the task to be updated.
   *
   * @readonly
   * @type {number}
   */
  get id() {
    return this.#id;
  }

  /**
   * Ensures the CLI arguments are valid.
   *
   * @private
   * @param {string[]} args - Raw CLI arguments.
   * @throws {RangeError} If more than one argument is provided.
   * @throws {TypeError} If the task id is missing or invalid.
   */
  #validateArgs(args) {
    if (args.length > 1) {
      throw new RangeError(messages.error.TOO_MANY_ARGS);
    }
    const [id] = args;
    TaskValidator.validateTaskId(id);
  }

  /**
   * Extracts the id from CLI arguments.
   *
   * @private
   * @param {string[]} args - Raw CLI arguments.
   */
  #parseArgs(args) {
    const [id] = args;
    this.#id = Number.parseInt(id);
  }
}
