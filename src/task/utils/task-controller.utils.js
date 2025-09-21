import { GetTasksListDto } from '../dtos/get-tasks-list.dto.js';
import { OrderDirection, TaskStatus, TaskTableColumn } from '../../shared/enums.js';
import { Task } from '../task.entity.js';
import { TaskController } from '../task.controller.js';

/**
 * Provides utility methods for {@link TaskController}.
 */
export class TaskControllerUtils {
  /**
   * Filters, sorts, and paginates tasks.
   *
   * @static
   * @param {Task[]} tasks - The tasks to be processed.
   * @param {GetTasksListDto} dto - The DTO containing the filters, sort, and pagination options.
   * @returns {Task[]} The tasks after processing.
   */
  static filterSortPaginate(tasks, dto) {
    const filteredTasks = this.#filterTasks(tasks, dto);
    const sortedTasks = this.#sortTasks(filteredTasks, dto);
    const paginatedTasks = this.#paginateTasks(sortedTasks, dto);
    return paginatedTasks;
  }

  /**
   * Filters tasks based on the provided filters.
   *
   * @static
   * @private
   * @param {Task[]} tasks - The tasks to be filtered.
   * @param {GetTasksListDto} dto - The DTO containing the filters.
   * @returns {Task[]} The filtered tasks.
   */
  static #filterTasks(tasks, dto) {
    const filters = [];

    if (dto.id) filters.push(task => task.id === dto.id);
    if (dto.description) filters.push(task => dto.description.test(task.description));
    if (dto.status) filters.push(task => task.status === dto.status);
    if (dto.createdAfter) filters.push(task => task.createdAt >= dto.createdAfter);
    if (dto.createdBefore) filters.push(task => task.createdAt <= dto.createdBefore);
    if (dto.updatedAfter) filters.push(task => task.updatedAt >= dto.updatedAfter);
    if (dto.updatedBefore) filters.push(task => task.updatedAt <= dto.updatedBefore);

    return tasks.filter(
      task => filters.every(condition => condition(task))
    );
  }

  /**
   * Sorts tasks based on the provided order by column name.
   *
   * @static
   * @private
   * @param {Task[]} tasks - The tasks to be sorted.
   * @param {GetTasksListDto} dto - The DTO containing the order by column name.
   * @returns {Task[]} The sorted tasks.
   */
  static #sortTasks(tasks, dto) {
    if (!dto.orderBy) return tasks;

    const direction = dto.orderDirection === OrderDirection.ASC ? 1 : -1;

    return [...tasks].sort((a, b) => {
      const valueA = a[dto.orderBy];
      const valueB = b[dto.orderBy];

      if (valueA instanceof Date && valueB instanceof Date) {
        return (valueA.getTime() - valueB.getTime()) * direction;
      }

      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return (valueA - valueB) * direction;
      }

      if (dto.orderBy === TaskTableColumn.STATUS) {
        const order = {
          [TaskStatus.TODO]: 1,
          [TaskStatus.IN_PROGRESS]: 2,
          [TaskStatus.DONE]: 3,
        };
        return (order[valueA] - order[valueB]) * direction;
      }

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return valueA.localeCompare(valueB) * direction;
      }
    });
  }

  /**
   * Paginates tasks based on the provided page number and limit.
   *
   * @static
   * @private
   * @param {Task[]} tasks - The tasks to be paginated.
   * @param {GetTasksListDto} dto - The DTO containing the page number and limit.
   * @returns {Task[]} The paginated tasks.
   */
  static #paginateTasks(tasks, dto) {
    const { page, limit } = dto;

    if (limit === 0) return tasks;

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    return tasks.slice(startIndex, endIndex);
  }
}
