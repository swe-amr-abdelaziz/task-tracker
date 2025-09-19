import { TaskValidator } from '../utils/task.validator.js';
import { messages } from '../../shared/messages.js';

/**
 * Data transfer object (DTO) for help.
 * Encapsulates validation and parsing of CLI arguments
 * related to displaying command help.
 */
export class HelpDto {
  /**
   * The parsed command argument.
   * @private
   * @type {string | undefined}
   */
  #command;

  /**
   * Initializes a new HelpDto from CLI arguments.
   *
   * @param {string[]} args - The CLI arguments passed by the user.
   * @throws {RangeError} If more than one argument is provided.
   * @throws {Error} If the command itself is "help".
   */
  constructor(...args) {
    this.#validateArgs(args);
    this.#parseArgs(args);
  }

  /**
   * The command for which to display help, if provided.
   *
   * @readonly
   * @type {string | undefined}
   */
  get command() {
    return this.#command;
  }

  /**
   * Ensures the CLI arguments are valid.
   *
   * @private
   * @param {string[]} args - Raw CLI arguments.
   * @throws {RangeError} If more than one argument is provided.
   * @throws {Error} If the command itself is "help".
   */
  #validateArgs(args) {
    if (args.length > 1) {
      throw new RangeError(messages.error.TOO_MANY_ARGS);
    }
    const [command] = args;
    TaskValidator.validateHelpCommand(command);
  }

  /**
   * Extracts the command from CLI arguments.
   *
   * @private
   * @param {string[]} args - Raw CLI arguments.
   */
  #parseArgs(args) {
    const [command] = args;
    this.#command = command;
  }
}
