/**
 * The name of the database file.
 * @type {string}
 */
export const DB_FILENAME = 'tasks.json';

/**
 * The encoding of the database file.
 * @type {string}
 */
export const DB_FILE_ENCODING = 'utf-8';

/**
 * The maximum value of a 32-bit signed integer.
 * @type {number}
 */
export const MAX_INT32 = 2 ** 31 - 1

/**
 * The default padding value for table cells.
 * @type {number}
 */
export const PADDING_DEFAULT = 1;

/**
 * @enum {string} Valid task statuses.
 */
export const TaskStatus = Object.freeze({
  TODO: 'todo',
  IN_PROGRESS: 'in-progress',
  DONE: 'done',
});

/**
 * @enum {string} Task status icons.
 */
export const TaskStatusIcon = Object.freeze({
  [TaskStatus.TODO]: '🔴',
  [TaskStatus.IN_PROGRESS]: '🟡',
  [TaskStatus.DONE]: '🟢',
});

/**
 * @enum {string} Column names for the task table.
 */
export const TaskTableColumn = Object.freeze({
  ID: 'id',
  DESCRIPTION: 'description',
  STATUS: 'status',
  CREATED_AT: 'createdAt',
  UPDATED_AT: 'updatedAt',
});

/**
 * @enum {string} Task commands for the CLI.
 */
export const TaskCommand = Object.freeze({
  ADD: 'add',
  UPDATE: 'update',
  DELETE: 'delete',
  MARK_IN_PROGRESS: 'mark-in-progress',
  MARK_DONE: 'mark-done',
  LIST: 'list',
  HELP: 'help',
});

/**
 * @enum {string} Table border characters used for the responsive table.
 */
export const TableBorder = Object.freeze({
  // Top
  TOP_LEFT: '╭',
  TOP_CENTER: '┬',
  TOP_RIGHT: '╮',

  // Center
  CENTER_LEFT: '├',
  CENTER_CENTER: '┼',
  CENTER_RIGHT: '┤',

  // Bottom
  BOTTOM_LEFT: '╰',
  BOTTOM_CENTER: '┴',
  BOTTOM_RIGHT: '╯',

  // Lines
  HORIZONTAL: '─',
  VERTICAL: '│',
});

/**
 * @enum {string} Horizontal alignment options.
 */
export const HorizontalAlignment = Object.freeze({
  LEFT: 'LEFT',
  CENTER: 'CENTER',
  RIGHT: 'RIGHT',
});

export const TEXT_ALIGN_DEFAULT = HorizontalAlignment.LEFT;

/**
 * @enum {string} Vertical alignment options.
 */
export const VerticalAlignment = Object.freeze({
  TOP: 'TOP',
  CENTER: 'CENTER',
  BOTTOM: 'BOTTOM',
});

/**
 * @enum {string} Valid order directions.
 */
export const OrderDirection = Object.freeze({
  ASC: 'asc',
  DESC: 'desc',
});

/**
 * @enum {string} ANSI escape codes for styling text in the console.
 */
export const AnsiCodes = Object.freeze({
  // Reset
  RESET: '\x1b[0m',

  // Text Formatting
  BOLD: '\x1b[1m',
  DIM: '\x1b[2m',
  ITALIC: '\x1b[3m',
  UNDERLINE: '\x1b[4m',
  REVERSE: '\x1b[7m',
  STRIKE_THROUGH: '\x1b[9m',

  // Foreground Colors
  FG: {
    BLACK: '\x1b[30m',
    RED: '\x1b[31m',
    GREEN: '\x1b[32m',
    YELLOW: '\x1b[33m',
    BLUE: '\x1b[34m',
    MAGENTA: '\x1b[35m',
    CYAN: '\x1b[36m',
    WHITE: '\x1b[37m',
    // Bright colors
    BRIGHT_BLACK: '\x1b[90m',
    BRIGHT_RED: '\x1b[91m',
    BRIGHT_GREEN: '\x1b[92m',
    BRIGHT_YELLOW: '\x1b[93m',
    BRIGHT_BLUE: '\x1b[94m',
    BRIGHT_MAGENTA: '\x1b[95m',
    BRIGHT_CYAN: '\x1b[96m',
    BRIGHT_WHITE: '\x1b[97m',
  },

  // Background Colors
  BG: {
    BLACK: '\x1b[40m',
    RED: '\x1b[41m',
    GREEN: '\x1b[42m',
    YELLOW: '\x1b[43m',
    BLUE: '\x1b[44m',
    MAGENTA: '\x1b[45m',
    CYAN: '\x1b[46m',
    WHITE: '\x1b[47m',
    // Bright backgrounds
    BRIGHT_BLACK: '\x1b[100m',
    BRIGHT_RED: '\x1b[101m',
    BRIGHT_GREEN: '\x1b[102m',
    BRIGHT_YELLOW: '\x1b[103m',
    BRIGHT_BLUE: '\x1b[104m',
    BRIGHT_MAGENTA: '\x1b[105m',
    BRIGHT_CYAN: '\x1b[106m',
    BRIGHT_WHITE: '\x1b[107m',
  }
});
