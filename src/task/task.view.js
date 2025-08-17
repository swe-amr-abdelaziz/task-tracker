import { promises as fs } from 'fs';
import path from 'path';

import { DB_FILE_ENCODING } from '../shared/enums.js';
import { Utils } from '../shared/utils.js';
import { messages } from '../shared/messages.js';

export class TaskView {
  static getTasksList(status) {}

  static addTask(description) {}

  static updateTask(id, description) {}

  static markTaskAsInProgress(id) {}

  static markTaskAsDone(id) {}

  static deleteTask(id) {}

  static async help(command) {
    try {
      const docsPath = path.join(
        Utils.dirname(import.meta.url),
        '..',
        'docs',
        'help',
        `${command ?? 'help'}.txt`,
      );
      const raw = await fs.readFile(docsPath, DB_FILE_ENCODING);
      console.log(raw);
    } catch (e) {
      const message = messages.error.INVALID_TASK_COMMAND.replace('{0}', command);
      throw new Error(message);
    }
  }
}
