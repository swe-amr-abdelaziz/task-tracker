import { CliUtils } from './src/shared/cli-utils.js';
import { TaskModel } from './src/task/task.model.js';
import { TaskRouter } from './src/task/task.router.js';
import { Utils } from './src/shared/utils.js';

console.log(); // Print a newline to separate the CLI prompt from the output

TaskModel.populateData()
  .then(async () => {
    const args = CliUtils.getAppArgs();
    return TaskRouter.route(args);
  }).catch((err) => {
    Utils.logErrorMsg(err.message);
  });
