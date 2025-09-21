import { deepEqual, equal } from 'node:assert';
import { afterEach, describe, it } from 'node:test';

import { GetTasksListDto } from '../../dtos/get-tasks-list.dto.js';
import { OrderDirection, TaskStatus, TaskTableColumn } from '../../../shared/enums.js';
import { Task } from '../../task.entity.js';
import { TaskControllerUtils } from '../task-controller.utils.js';

describe('TaskControllerUtils', () => {
  describe('filterSortPaginate', () => {
    const getSampleTasks = () => {
      const date = new Date('2025-02-01');

      const sampleTasks = [
        new Task('Fix login bug', TaskStatus.TODO),
        new Task('Write unit tests', TaskStatus.IN_PROGRESS),
        new Task('Deploy to staging', TaskStatus.DONE),
        new Task('Refactor auth service', TaskStatus.TODO),
        new Task('Update dependencies', TaskStatus.IN_PROGRESS),
        new Task('Design new landing page', TaskStatus.TODO),
        new Task('Prepare release notes', TaskStatus.DONE),
        new Task('Research GraphQL', TaskStatus.TODO),
        new Task('Fix CSS issues', TaskStatus.IN_PROGRESS),
        new Task('Plan sprint retrospective', TaskStatus.DONE),
      ];

      return sampleTasks.map((task, index) => {
        task._restoreTimestamps(
          new Date(date - 1000 * 60 * 60 * 24 * (index * 2)),
          new Date(date - 1000 * 60 * 60 * 24 * (index * 5)),
        );
        return task;
      });
    };

    const mapTasksToIds = (tasks) => tasks.map((task) => task.id);

    afterEach(() => {
      Task.setIdCount(0);
    });

    describe('filterTasks', () => {
      it('should return all tasks if no filters are provided', () => {
        const tasks = getSampleTasks();
        const dto = new GetTasksListDto();

        const filteredTasks = TaskControllerUtils.filterSortPaginate(tasks, dto);
        const ids = mapTasksToIds(filteredTasks);
        const expectedIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

        equal(ids.length, expectedIds.length);
        deepEqual(ids, expectedIds);
      });

      it('should return tasks with matching IDs', () => {
        const tasks = getSampleTasks();
        const dto = new GetTasksListDto();
        dto.id = 3;

        const filteredTasks = TaskControllerUtils.filterSortPaginate(tasks, dto);
        const ids = mapTasksToIds(filteredTasks);
        const expectedIds = [3];

        equal(ids.length, expectedIds.length);
        deepEqual(ids, expectedIds);
      });

      it('should return tasks with matching descriptions', () => {
        const tasks = getSampleTasks();
        const dto = new GetTasksListDto();
        dto.description = 'css';

        const filteredTasks = TaskControllerUtils.filterSortPaginate(tasks, dto);
        const ids = mapTasksToIds(filteredTasks);
        const expectedIds = [9];

        equal(ids.length, expectedIds.length);
        deepEqual(ids, expectedIds);
      });

      it('should return tasks with matching descriptions (regular expression)', () => {
        const tasks = getSampleTasks();
        const dto = new GetTasksListDto();
        dto.description = 'es$';

        const filteredTasks = TaskControllerUtils.filterSortPaginate(tasks, dto);
        const ids = mapTasksToIds(filteredTasks);
        const expectedIds = [5, 7, 9];

        equal(ids.length, expectedIds.length);
        deepEqual(ids, expectedIds);
      });

      it('should return tasks with matching statuses', () => {
        const tasks = getSampleTasks();
        const dto = new GetTasksListDto();
        dto.status = TaskStatus.DONE;

        const filteredTasks = TaskControllerUtils.filterSortPaginate(tasks, dto);
        const ids = mapTasksToIds(filteredTasks);
        const expectedIds = [3, 7, 10];

        equal(ids.length, expectedIds.length);
        deepEqual(ids, expectedIds);
      });

      it('should return tasks with matching created dates', () => {
        const tasks = getSampleTasks();
        const dto = new GetTasksListDto();
        dto.createdAfter = '2025-01-20';
        dto.createdBefore = '2025-01-27';

        const filteredTasks = TaskControllerUtils.filterSortPaginate(tasks, dto);
        const ids = mapTasksToIds(filteredTasks);
        const expectedIds = [4, 5, 6, 7];

        equal(ids.length, expectedIds.length);
        deepEqual(ids, expectedIds);
      });

      it('should return tasks with matching updated dates', () => {
        const tasks = getSampleTasks();
        const dto = new GetTasksListDto();
        dto.updatedAfter = '2025-01-01';
        dto.updatedBefore = '2025-02-01';

        const filteredTasks = TaskControllerUtils.filterSortPaginate(tasks, dto);
        const ids = mapTasksToIds(filteredTasks);
        const expectedIds = [1, 2, 3, 4, 5, 6, 7];

        equal(ids.length, expectedIds.length);
        deepEqual(ids, expectedIds);
      });
    });

    describe('sortTasks', () => {
      it('should return tasks sorted by ID ascending', () => {
        const tasks = getSampleTasks();
        const dto = new GetTasksListDto();
        dto.orderBy = TaskTableColumn.ID;
        dto.orderDirection = OrderDirection.ASC;

        const sortedTasks = TaskControllerUtils.filterSortPaginate(tasks, dto);
        const ids = mapTasksToIds(sortedTasks);
        const expectedIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

        equal(ids.length, expectedIds.length);
        deepEqual(ids, expectedIds);
      });

      it('should return tasks sorted by ID descending', () => {
        const tasks = getSampleTasks();
        const dto = new GetTasksListDto();
        dto.orderBy = TaskTableColumn.ID;
        dto.orderDirection = OrderDirection.DESC;

        const sortedTasks = TaskControllerUtils.filterSortPaginate(tasks, dto);
        const ids = mapTasksToIds(sortedTasks);
        const expectedIds = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1];

        equal(ids.length, expectedIds.length);
        deepEqual(ids, expectedIds);
      });

      it('should return tasks sorted by description ascending', () => {
        const tasks = getSampleTasks();
        const dto = new GetTasksListDto();
        dto.orderBy = TaskTableColumn.DESCRIPTION;
        dto.orderDirection = OrderDirection.ASC;

        const sortedTasks = TaskControllerUtils.filterSortPaginate(tasks, dto);
        const ids = mapTasksToIds(sortedTasks);
        const expectedIds = [3, 6, 9, 1, 10, 7, 4, 8, 5, 2];

        equal(ids.length, expectedIds.length);
        deepEqual(ids, expectedIds);
      });

      it('should return tasks sorted by description descending', () => {
        const tasks = getSampleTasks();
        const dto = new GetTasksListDto();
        dto.orderBy = TaskTableColumn.DESCRIPTION;
        dto.orderDirection = OrderDirection.DESC;

        const sortedTasks = TaskControllerUtils.filterSortPaginate(tasks, dto);
        const ids = mapTasksToIds(sortedTasks);
        const expectedIds = [2, 5, 8, 4, 7, 10, 1, 9, 6, 3];

        equal(ids.length, expectedIds.length);
        deepEqual(ids, expectedIds);
      });

      it('should return tasks sorted by status ascending', () => {
        const tasks = getSampleTasks();
        const dto = new GetTasksListDto();
        dto.orderBy = TaskTableColumn.STATUS;
        dto.orderDirection = OrderDirection.ASC;

        const sortedTasks = TaskControllerUtils.filterSortPaginate(tasks, dto);
        const ids = mapTasksToIds(sortedTasks);
        const expectedIds = [1, 4, 6, 8, 2, 5, 9, 3, 7, 10];

        equal(ids.length, expectedIds.length);
        deepEqual(ids, expectedIds);
      });

      it('should return tasks sorted by status descending', () => {
        const tasks = getSampleTasks();
        const dto = new GetTasksListDto();
        dto.orderBy = TaskTableColumn.STATUS;
        dto.orderDirection = OrderDirection.DESC;

        const sortedTasks = TaskControllerUtils.filterSortPaginate(tasks, dto);
        const ids = mapTasksToIds(sortedTasks);
        const expectedIds = [3, 7, 10, 2, 5, 9, 1, 4, 6, 8];

        equal(ids.length, expectedIds.length);
        deepEqual(ids, expectedIds);
      });

      it('should return tasks sorted by createdAt ascending', () => {
        const tasks = getSampleTasks();
        const dto = new GetTasksListDto();
        dto.orderBy = TaskTableColumn.CREATED_AT;
        dto.orderDirection = OrderDirection.ASC;

        const sortedTasks = TaskControllerUtils.filterSortPaginate(tasks, dto);
        const ids = mapTasksToIds(sortedTasks);
        const expectedIds = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1];

        equal(ids.length, expectedIds.length);
        deepEqual(ids, expectedIds);
      });

      it('should return tasks sorted by createdAt descending', () => {
        const tasks = getSampleTasks();
        const dto = new GetTasksListDto();
        dto.orderBy = TaskTableColumn.CREATED_AT;
        dto.orderDirection = OrderDirection.DESC;

        const sortedTasks = TaskControllerUtils.filterSortPaginate(tasks, dto);
        const ids = mapTasksToIds(sortedTasks);
        const expectedIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

        equal(ids.length, expectedIds.length);
        deepEqual(ids, expectedIds);
      });

      it('should return tasks sorted by updatedAt ascending', () => {
        const tasks = getSampleTasks();
        const dto = new GetTasksListDto();
        dto.orderBy = TaskTableColumn.UPDATED_AT;
        dto.orderDirection = OrderDirection.ASC;

        const sortedTasks = TaskControllerUtils.filterSortPaginate(tasks, dto);
        const ids = mapTasksToIds(sortedTasks);
        const expectedIds = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1];

        equal(ids.length, expectedIds.length);
        deepEqual(ids, expectedIds);
      });

      it('should return tasks sorted by updatedAt descending', () => {
        const tasks = getSampleTasks();
        const dto = new GetTasksListDto();
        dto.orderBy = TaskTableColumn.UPDATED_AT;
        dto.orderDirection = OrderDirection.DESC;

        const sortedTasks = TaskControllerUtils.filterSortPaginate(tasks, dto);
        const ids = mapTasksToIds(sortedTasks);
        const expectedIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

        equal(ids.length, expectedIds.length);
        deepEqual(ids, expectedIds);
      });
    });

    describe('paginateTasks', () => {
      it('should return all tasks if no pagination options are provided', () => {
        const tasks = getSampleTasks();
        const dto = new GetTasksListDto();

        const paginatedTasks = TaskControllerUtils.filterSortPaginate(tasks, dto);
        const ids = mapTasksToIds(paginatedTasks);
        const expectedIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

        equal(ids.length, expectedIds.length);
        deepEqual(ids, expectedIds);
      });

      it('should return tasks with the specified page number and limit', () => {
        const tasks = getSampleTasks();
        const dto = new GetTasksListDto();
        dto.page = 2;
        dto.limit = 3;

        const paginatedTasks = TaskControllerUtils.filterSortPaginate(tasks, dto);
        const ids = mapTasksToIds(paginatedTasks);
        const expectedIds = [4, 5, 6];

        equal(ids.length, expectedIds.length);
        deepEqual(ids, expectedIds);
      });

      it('should return tasks with partially filled pagination options', () => {
        const tasks = getSampleTasks();
        const dto = new GetTasksListDto();
        dto.page = 4;
        dto.limit = 3;

        const paginatedTasks = TaskControllerUtils.filterSortPaginate(tasks, dto);
        const ids = mapTasksToIds(paginatedTasks);
        const expectedIds = [10];

        equal(ids.length, expectedIds.length);
        deepEqual(ids, expectedIds);
      });

      it('should return all tasks if page limit is greater than total tasks', () => {
        const tasks = getSampleTasks();
        const dto = new GetTasksListDto();
        dto.page = 1;
        dto.limit = 20;

        const paginatedTasks = TaskControllerUtils.filterSortPaginate(tasks, dto);
        const ids = mapTasksToIds(paginatedTasks);
        const expectedIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

        equal(ids.length, expectedIds.length);
        deepEqual(ids, expectedIds);
      });

      it('should return empty array if page number exceeds available pages', () => {
        const tasks = getSampleTasks();
        const dto = new GetTasksListDto();
        dto.page = 5;
        dto.limit = 3;

        const paginatedTasks = TaskControllerUtils.filterSortPaginate(tasks, dto);
        const ids = mapTasksToIds(paginatedTasks);
        const expectedIds = [];

        equal(ids.length, expectedIds.length);
        deepEqual(ids, expectedIds);
      });
    });

    describe('integrityTests', () => {
      it('filtration + sorting', () => {
        const tasks = getSampleTasks();
        const dto = new GetTasksListDto();
        dto.status = TaskStatus.DONE;
        dto.orderBy = TaskTableColumn.DESCRIPTION;
        dto.orderDirection = OrderDirection.DESC;

        const result = TaskControllerUtils.filterSortPaginate(tasks, dto);
        const ids = mapTasksToIds(result);
        const expectedIds = [7, 10, 3];

        equal(ids.length, expectedIds.length);
        deepEqual(ids, expectedIds);
      });

      it('sorting + pagination', () => {
        const tasks = getSampleTasks();
        const dto = new GetTasksListDto();
        dto.orderBy = TaskTableColumn.STATUS;
        dto.orderDirection = OrderDirection.DESC;
        dto.page = 2;
        dto.limit = 2;

        const result = TaskControllerUtils.filterSortPaginate(tasks, dto);
        const ids = mapTasksToIds(result);
        const expectedIds = [10, 2];

        equal(ids.length, expectedIds.length);
        deepEqual(ids, expectedIds);
      });

      it('pagination + filtration', () => {
        const tasks = getSampleTasks();
        const dto = new GetTasksListDto();
        dto.status = TaskStatus.DONE;
        dto.page = 2;
        dto.limit = 2;

        const result = TaskControllerUtils.filterSortPaginate(tasks, dto);
        const ids = mapTasksToIds(result);
        const expectedIds = [10];

        equal(ids.length, expectedIds.length);
        deepEqual(ids, expectedIds);
      });

      it('filtration + sorting + pagination', () => {
        const tasks = getSampleTasks();
        const dto = new GetTasksListDto();
        dto.status = TaskStatus.DONE;
        dto.orderBy = TaskTableColumn.DESCRIPTION;
        dto.orderDirection = OrderDirection.DESC;
        dto.page = 2;
        dto.limit = 2;

        const result = TaskControllerUtils.filterSortPaginate(tasks, dto);
        const ids = mapTasksToIds(result);
        const expectedIds = [3];

        equal(ids.length, expectedIds.length);
        deepEqual(ids, expectedIds);
      });
    });
  });
});
