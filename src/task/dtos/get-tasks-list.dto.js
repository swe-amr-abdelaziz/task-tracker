import { CliUtils } from '../../shared/cli-utils.js';
import { OrderDirection, TaskStatus, TaskTableColumn } from '../../shared/enums.js';
import { messages } from '../../shared/messages.js';

/**
 * Data transfer object (DTO) for retrieving a list of tasks.
 * Encapsulates validation and parsing of CLI arguments
 * related to retrieving a list of tasks.
 */
export class GetTasksListDto {
  /**
   * The task ID.
   * @type {number=}
   * @private
   */
  #id;

  /**
   * The task description regex.
   * @type {RegExp=}
   * @private
   */
  #description;

  /**
   * The task status.
   * @type {TaskStatus=}
   * @private
   */
  #status;

  /**
   * The task creation date lower bound.
   * @type {Date=}
   * @private
   */
  #createdAfter;

  /**
   * The task creation date upper bound.
   * @type {Date=}
   * @private
   */
  #createdBefore;

  /**
   * The task update date lower bound.
   * @type {Date=}
   * @private
   */
  #updatedAfter;

  /**
   * The task update date upper bound.
   * @type {Date=}
   * @private
   */
  #updatedBefore;

  /**
   * The task order by property.
   * @type {TaskTableColumn=}
   * @private
   */
  #orderBy;

  /**
   * The task order direction.
   * @type {OrderDirection}
   * @default 'asc'
   * @private
   */
  #orderDirection;

  /**
   * The page number.
   * @type {number}
   * @default 1
   * @private
   */
  #page;

  /**
   * The number of tasks per page, 0 for no limit.
   * @type {number}
   * @default 0
   * @private
   */
  #limit;

  /**
   * The valid options for the CLI arguments.
   * @type {string[]}
   * @private
   */
  #validOptions = [
    'id',
    'description',
    'status',
    'createdBefore',
    'createdAfter',
    'updatedBefore',
    'updatedAfter',
    'orderBy',
    'asc',
    'desc',
    'page',
    'limit',
  ];

  /**
   * The aliases for the CLI arguments.
   * @type {object}
   * @private
   */
  #aliases = {
    d: 'description',
    s: 'status',
    ca: 'createdAfter',
    cb: 'createdBefore',
    ua: 'updatedAfter',
    ub: 'updatedBefore',
    o: 'orderBy',
    p: 'page',
    l: 'limit',
  };

  /**
   * Initializes a new GetTasksListDto from CLI arguments.
   *
   * @param {string[]} args - The CLI arguments passed by the user.
   */
  constructor(...args) {
    const options = CliUtils.parseArgs(args, this.#validOptions, this.#aliases);
    this.id = options.id;
    this.description = options.description;
    this.status = options.status;
    this.createdAfter = options.createdAfter;
    this.createdBefore = options.createdBefore;
    this.updatedAfter = options.updatedAfter;
    this.updatedBefore = options.updatedBefore;
    this.orderBy = options.orderBy;
    this.orderDirection = this.#getOrderDirection(options.asc, options.desc);
    this.page = options.page;
    this.limit = options.limit;
  }

  /**
   * Gets the task ID.
   *
   * @type {number=}
   */
  get id() {
    return this.#id;
  }

  /**
   * Sets the task ID.
   *
   * @param {string=} id
   * @throws {SyntaxError} If id is empty.
   * @throws {TypeError} If id is not a number.
   */
  set id(id) {
    if (id === undefined) return;

    if (!id.toString().trim()) {
      throw new SyntaxError(messages.error.EMPTY_CLI_ARG_VALUE);
    }
    this.#id = Number.parseInt(id, 10);
    if (Number.isNaN(this.#id)) {
      throw new TypeError(messages.error.INVALID_ID_ARG_TYPE);
    }
  }

  /**
   * Gets the task description regex.
   *
   * @type {RegExp=}
   */
  get description() {
    return this.#description;
  }

  /**
   * Sets the task description regex.
   *
   * @param {string=} description
   * @throws {SyntaxError} If regular expression is invalid.
   */
  set description(description) {
    if (description === undefined) return;

    if (!description.toString().trim()) {
      throw new SyntaxError(messages.error.EMPTY_CLI_ARG_VALUE);
    }
    try {
      this.#description = new RegExp(description, 'gi');
    }
    catch (err) {
      throw new SyntaxError(messages.error.INVALID_DESCRIPTION_REGEX);
    }
  }

  /**
   * Gets the task status.
   *
   * @type {TaskStatus=}
   */
  get status() {
    return this.#status;
  }

  /**
   * Sets the task status.
   *
   * @param {string=} status
   * @throws {SyntaxError} If status is empty.
   * @throws {TypeError} If status is not a valid status.
   */
  set status(status) {
    if (status === undefined) return;

    if (!status.toString().trim()) {
      throw new SyntaxError(messages.error.EMPTY_CLI_ARG_VALUE);
    }
    const validStatuses = Object.values(TaskStatus);
    if (!validStatuses.includes(status)) {
      throw new TypeError(messages.error.INVALID_STATUS_ARG_TYPE);
    }
    this.#status = status;
  }

  /**
   * Gets the task creation date lower bound.
   *
   * @type {Date=}
   */
  get createdAfter() {
    return this.#createdAfter;
  }

  /**
   * Sets the task creation date lower bound.
   *
   * @param {string=} createdAfter
   * @throws {SyntaxError} If createdAfter is empty.
   * @throws {TypeError} If createdAfter is not a valid date.
   */
  set createdAfter(createdAfter) {
    if (createdAfter === undefined) return;

    if (!createdAfter.toString().trim()) {
      throw new SyntaxError(messages.error.EMPTY_CLI_ARG_VALUE);
    }
    if (Number.isNaN(Date.parse(createdAfter))) {
      throw new TypeError(messages.error.INVALID_CREATED_AFTER_ARG_TYPE);
    }
    this.#createdAfter = new Date(createdAfter);
  }

  /**
   * Gets the task creation date upper bound.
   *
   * @type {Date=}
   */
  get createdBefore() {
    return this.#createdBefore;
  }

  /**
   * Sets the task creation date upper bound.
   *
   * @param {string=} createdBefore
   * @throws {SyntaxError} If createdBefore is empty.
   * @throws {TypeError} If createdBefore is not a valid date.
   */
  set createdBefore(createdBefore) {
    if (createdBefore === undefined) return;

    if (!createdBefore.toString().trim()) {
      throw new SyntaxError(messages.error.EMPTY_CLI_ARG_VALUE);
    }
    if (Number.isNaN(Date.parse(createdBefore))) {
      throw new TypeError(messages.error.INVALID_CREATED_BEFORE_ARG_TYPE);
    }
    this.#createdBefore = new Date(createdBefore);
  }

  /**
   * Gets the task update date lower bound.
   *
   * @type {Date=}
   */
  get updatedAfter() {
    return this.#updatedAfter;
  }

  /**
   * Sets the task update date lower bound.
   *
   * @param {string=} updatedAfter
   * @throws {SyntaxError} If updatedAfter is empty.
   * @throws {TypeError} If updatedAfter is not a valid date.
   */
  set updatedAfter(updatedAfter) {
    if (updatedAfter === undefined) return;

    if (!updatedAfter.toString().trim()) {
      throw new SyntaxError(messages.error.EMPTY_CLI_ARG_VALUE);
    }
    if (Number.isNaN(Date.parse(updatedAfter))) {
      throw new TypeError(messages.error.INVALID_UPDATED_AFTER_ARG_TYPE);
    }
    this.#updatedAfter = new Date(updatedAfter);
  }

  /**
   * Gets the task update date upper bound.
   *
   * @type {Date=}
   */
  get updatedBefore() {
    return this.#updatedBefore;
  }

  /**
   * Sets the task update date upper bound.
   *
   * @param {string=} updatedBefore
   * @throws {SyntaxError} If updatedBefore is empty.
   * @throws {TypeError} If updatedBefore is not a valid date.
   */
  set updatedBefore(updatedBefore) {
    if (updatedBefore === undefined) return;

    if (!updatedBefore.toString().trim()) {
      throw new SyntaxError(messages.error.EMPTY_CLI_ARG_VALUE);
    }
    if (Number.isNaN(Date.parse(updatedBefore))) {
      throw new TypeError(messages.error.INVALID_UPDATED_BEFORE_ARG_TYPE);
    }
    this.#updatedBefore = new Date(updatedBefore);
  }

  /**
   * Gets the order by column for sorting.
   *
   * @type {TaskTableColumn=}
   */
  get orderBy() {
    return this.#orderBy;
  }

  /**
   * Sets the order by column for sorting.
   *
   * @param {string=} orderBy
   * @throws {SyntaxError} If orderBy is empty.
   * @throws {TypeError} If orderBy is not within valid column names.
   */
  set orderBy(orderBy) {
    if (orderBy === undefined) return;

    if (!orderBy.toString().trim()) {
      throw new SyntaxError(messages.error.EMPTY_CLI_ARG_VALUE);
    }
    const validColumnNames = Object.values(TaskTableColumn);
    if (!validColumnNames.includes(orderBy)) {
      throw new TypeError(messages.error.INVALID_ORDER_BY_ARG_TYPE);
    }
    this.#orderBy = orderBy;
  }

  /**
   * Gets the order direction for sorting.
   *
   * @type {OrderDirection}
   */
  get orderDirection() {
    return this.#orderDirection;
  }

  /**
   * Sets the order direction for sorting.
   *
   * @param {string} orderDirection
   */
  set orderDirection(orderDirection) {
    this.#orderDirection = orderDirection;
  }

  /**
   * Gets the page number.
   *
   * @type {number}
   */
  get page() {
    return this.#page;
  }

  /**
   * Sets the page number.
   *
   * @param {string=} page
   * @throws {SyntaxError} If page number is empty.
   * @throws {TypeError} If page number is not a number.
   * @throws {RangeError} If page number is less than 1.
   */
  set page(page) {
    if (page === undefined) {
      this.#page = 1;
      return;
    }

    if (!page.toString().trim()) {
      throw new SyntaxError(messages.error.EMPTY_CLI_ARG_VALUE);
    }
    this.#page = Number.parseInt(page, 10);
    if (Number.isNaN(this.#page)) {
      throw new TypeError(messages.error.INVALID_PAGE_ARG_TYPE);
    }
    if (this.#page < 1) {
      throw new RangeError(messages.error.PAGE_NUMBER_OUT_OF_RANGE);
    }
  }

  /**
   * Gets the page limit.
   *
   * @type {number}
   */
  get limit() {
    return this.#limit;
  }

  /**
   * Sets the page limit.
   *
   * @param {string=} limit
   * @throws {SyntaxError} If page limit is empty.
   * @throws {TypeError} If page limit is not a number.
   * @throws {RangeError} If page limit is less than 0.
   */
  set limit(limit) {
    if (limit === undefined) {
      this.#limit = 0;
      return;
    }

    if (!limit.toString().trim()) {
      throw new SyntaxError(messages.error.EMPTY_CLI_ARG_VALUE);
    }
    this.#limit = Number.parseInt(limit, 10);
    if (Number.isNaN(this.#limit)) {
      throw new TypeError(messages.error.INVALID_PAGE_LIMIT_ARG_TYPE);
    }
    if (this.#limit < 0) {
      throw new RangeError(messages.error.PAGE_LIMIT_OUT_OF_RANGE);
    }
    if (this.#limit === 0 && this.#page !== 1) {
      throw new RangeError(messages.error.PAGE_WITH_UNLIMITED_LIMIT);
    }
  }

  /**
   * Gets the order direction for sorting.
   *
   * @private
   * @param {boolean} asc - Whether to sort ascending.
   * @param {boolean} desc - Whether to sort descending.
   * @returns {OrderDirection} The order direction.
   * @throws {SyntaxError} If both 'asc' and 'desc' are provided.
   */
  #getOrderDirection(asc, desc) {
    if (asc && desc) {
      throw new SyntaxError(messages.error.CONFLICTING_ORDER_DIRECTIONS);
    }
    return desc ? OrderDirection.DESC : OrderDirection.ASC;
  }
}
