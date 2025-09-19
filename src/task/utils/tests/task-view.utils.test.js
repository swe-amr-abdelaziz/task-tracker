import { equal } from 'node:assert';
import { after, afterEach, describe, it, mock } from 'node:test';

import { STARTS_WITH_NEWLINE_REGEX } from '../../../shared/regex.js';
import { Task } from '../../task.entity.js';
import { TaskStatus } from '../../../shared/enums.js';
import { TaskValidator } from '../task.validator.js';
import { TaskViewUtils } from '../task-view.utils.js';
import { Utils } from '../../../shared/utils.js';
import { messages } from '../../../shared/messages.js';

describe('TaskViewUtils', () => {
  describe('printTasksTable', () => {
    const logInfoMsgFn = mock.method(Utils, 'logInfoMsg', () => {});
    const consoleLogFn = mock.method(console, 'log', () => {});
    const date = new Date('2025-01-01T08:45:00');

    function generateData() {
      const task1 = { id: 1, description: 'Task 1', status: TaskStatus.TODO, createdAt: date, updatedAt: date };
      const task2 = { id: 2, description: 'Task 2', status: TaskStatus.DONE, createdAt: date, updatedAt: date };
      return [
        Task.fromJSON(task1),
        Task.fromJSON(task2),
      ];
    };
    function removeFirstNewline(str) {
      return str.replace(STARTS_WITH_NEWLINE_REGEX, '');
    }

    afterEach(() => {
      logInfoMsgFn.mock.resetCalls();
      consoleLogFn.mock.resetCalls();
    });

    after(() => {
      logInfoMsgFn.mock.restore();
      consoleLogFn.mock.restore();
    });

    it('should validate the data type if provided', () => {
      const validateTasksTypeFn = mock.method(TaskValidator, 'validateTasksType', () => {});
      const tasks = generateData();

      TaskViewUtils.printTasksTable(tasks);

      equal(validateTasksTypeFn.mock.callCount(), 1);
      equal(validateTasksTypeFn.mock.calls[0].arguments[0], tasks);
    });

    it('should print "no tasks found" message if data is undefined', () => {
      let data;

      TaskViewUtils.printTasksTable(data);

      equal(logInfoMsgFn.mock.callCount(), 1);
      equal(logInfoMsgFn.mock.calls[0].arguments[0], messages.success.NO_TASKS_FOUND);
    });

    it('should print "no tasks found" message if data is an empty array', () => {
      const data = [];

      TaskViewUtils.printTasksTable(data);

      equal(logInfoMsgFn.mock.callCount(), 1);
      equal(logInfoMsgFn.mock.calls[0].arguments[0], messages.success.NO_TASKS_FOUND);
    });

    it('should print tasks list if data is a non-empty array', () => {
      const data = generateData();
      process.stdout.columns = 100;

      TaskViewUtils.printTasksTable(data);

      const formattedDate = Utils.formatDate(date);
      const actualTable = Utils.clearAnsiSequences(consoleLogFn.mock.calls[0].arguments[0]);
      const expectedTable = `
╭────┬─────────────┬─────────┬─────────────────────────┬─────────────────────────╮
│ ID │ Description │ Status  │      Creation Date      │       Update Date       │
├────┼─────────────┼─────────┼─────────────────────────┼─────────────────────────┤
│  1 │ Task 1      │ 🔴 todo │ ${   formattedDate    } │ ${   formattedDate    } │
├────┼─────────────┼─────────┼─────────────────────────┼─────────────────────────┤
│  2 │ Task 2      │ 🟢 done │ ${   formattedDate    } │ ${   formattedDate    } │
╰────┴─────────────┴─────────┴─────────────────────────┴─────────────────────────╯`;

      equal(consoleLogFn.mock.callCount(), 1);
      equal(actualTable, removeFirstNewline(expectedTable));
    });

    it('should print task if data is an instance of Task', () => {
      const data = generateData()[0];
      process.stdout.columns = 100;

      TaskViewUtils.printTasksTable(data);

      const formattedDate = Utils.formatDate(date);
      const actualTable = Utils.clearAnsiSequences(consoleLogFn.mock.calls[0].arguments[0]);
      const expectedTable = `
╭────┬─────────────┬─────────┬─────────────────────────┬─────────────────────────╮
│ ID │ Description │ Status  │      Creation Date      │       Update Date       │
├────┼─────────────┼─────────┼─────────────────────────┼─────────────────────────┤
│  1 │ Task 1      │ 🔴 todo │ ${   formattedDate    } │ ${   formattedDate    } │
╰────┴─────────────┴─────────┴─────────────────────────┴─────────────────────────╯`;

      equal(consoleLogFn.mock.callCount(), 1);
      equal(actualTable, removeFirstNewline(expectedTable));
    });
  });
});

