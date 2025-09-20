import { TaskValidator } from '../utils/task.validator.js';
import { messages } from '../../shared/messages.js';

/**
 * Data transfer object (DTO) for updating a task.
 * Encapsulates validation and parsing of CLI arguments
 * related to updating a task.
 */
export class UpdateTaskDto {
  /**
   * The parsed id argument.
   * @private
   * @type {number}
   */
  #id;

  /**
   * The parsed description argument.
   * @private
   * @type {string}
   */
  #description;

  /**
   * Initializes a new UpdateTaskDto from CLI arguments.
   *
   * @param {string[]} args - The CLI arguments passed by the user.
   * @throws {RangeError} If more than two arguments are provided.
   * @throws {TypeError} If the task id is missing or invalid.
   * @throws {TypeError} If the task description is missing or invalid.
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
   * The description of the task to be updated.
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
   * @throws {RangeError} If more than two arguments are provided.
   * @throws {TypeError} If the task id is missing or invalid.
   * @throws {TypeError} If the task description is missing or invalid.
   */
  #validateArgs(args) {
    if (args.length > 2) {
      throw new RangeError(messages.error.TOO_MANY_ARGS);
    }
    const [id, description] = args;
    TaskValidator.validateTaskId(id);
    TaskValidator.validateTaskDescription(description);
  }

  /**
   * Extracts the id and description from CLI arguments.
   *
   * @private
   * @param {string[]} args - Raw CLI arguments.
   */
  #parseArgs(args) {
    const [id, description] = args;
    this.#id = Number.parseInt(id, 10);
    this.#description = description;
  }
}
