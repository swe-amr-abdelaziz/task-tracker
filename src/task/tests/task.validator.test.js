import { doesNotThrow, rejects } from 'node:assert';
import { describe, it } from 'node:test';

import { TaskStatus } from '../task.entity.js';
import { TaskValidator } from '../task.validator.js';
import { TestUtils } from '../../shared/test-utils.js';
import { messages } from '../../shared/messages.js';

describe('TaskValidator', () => {
  describe('validateAddDto', () => {
    it('should not throw an error if the dto is valid', () => {
      const dto = {
        description: TestUtils.generateRandomString(),
      };

      doesNotThrow(() => {
        TaskValidator.validateAddDto(dto);
      });
    });

    it('should throw an error if the dto is missing the description property', async () => {
      const dto = {};

      await rejects(
        async () => TaskValidator.validateAddDto(dto),
        { message: messages.error.REQUIRED_TASK_DESCRIPTION },
      );
    });

    it('should throw an error if the description is empty (whitespace)', async () => {
      const dto = { description: '    ' };

      await rejects(
        async () => TaskValidator.validateAddDto(dto),
        { message: messages.error.REQUIRED_TASK_DESCRIPTION },
      );
    });
  });

  describe('validateUpdateDto', () => {
    it('should not throw an error if the dto is valid', () => {
      const dto = {
        id: TestUtils.generateRandomInt(),
        description: TestUtils.generateRandomString(),
      };

      doesNotThrow(() => {
        TaskValidator.validateUpdateDto(dto);
      });
    });

    it('should throw an error if the dto is missing the id property', async () => {
      const dto = {
        description: TestUtils.generateRandomString(),
      };

      await rejects(
        async () => TaskValidator.validateUpdateDto(dto),
        { message: messages.error.REQUIRED_TASK_ID },
      );
    });

    it('should throw an error if the id is not a number', async () => {
      const dto = {
        id: TestUtils.generateRandomString(),
        description: TestUtils.generateRandomString(),
      };

      await rejects(
        async () => TaskValidator.validateUpdateDto(dto),
        { message: messages.error.INVALID_TASK_ID },
      );
    });

    it('should throw an error if the dto is missing the description property', async () => {
      const dto = {
        id: TestUtils.generateRandomInt(),
      };

      await rejects(
        async () => TaskValidator.validateUpdateDto(dto),
        { message: messages.error.REQUIRED_TASK_DESCRIPTION },
      );
    });

    it('should throw an error if the description is empty (whitespace)', async () => {
      const dto = {
        id: TestUtils.generateRandomInt(),
        description: '    ',
      };

      await rejects(
        async () => TaskValidator.validateUpdateDto(dto),
        { message: messages.error.REQUIRED_TASK_DESCRIPTION },
      );
    });
  });

  describe('validateDeleteDto', () => {
    it('should not throw an error if the dto is valid', () => {
      const dto = {
        id: TestUtils.generateRandomInt(),
      };

      doesNotThrow(() => {
        TaskValidator.validateDeleteDto(dto);
      });
    });

    it('should throw an error if the dto is missing the id property', async () => {
      const dto = {};

      await rejects(
        async () => TaskValidator.validateDeleteDto(dto),
        { message: messages.error.REQUIRED_TASK_ID },
      );
    });

    it('should throw an error if the id is not a number', async () => {
      const dto = {
        id: TestUtils.generateRandomString(),
      };

      await rejects(
        async () => TaskValidator.validateDeleteDto(dto),
        { message: messages.error.INVALID_TASK_ID },
      );
    });
  });

  describe('validateMarkAsInProgressDto', () => {
    it('should not throw an error if the dto is valid', () => {
      const dto = {
        id: TestUtils.generateRandomInt(),
      };

      doesNotThrow(() => {
        TaskValidator.validateMarkAsInProgressDto(dto);
      });
    });

    it('should throw an error if the dto is missing the id property', async () => {
      const dto = {};

      await rejects(
        async () => TaskValidator.validateMarkAsInProgressDto(dto),
        { message: messages.error.REQUIRED_TASK_ID },
      );
    });

    it('should throw an error if the id is not a number', async () => {
      const dto = {
        id: TestUtils.generateRandomString(),
      };

      await rejects(
        async () => TaskValidator.validateMarkAsInProgressDto(dto),
        { message: messages.error.INVALID_TASK_ID },
      );
    });
  });

  describe('validateMarkAsDoneDto', () => {
    it('should not throw an error if the dto is valid', () => {
      const dto = {
        id: TestUtils.generateRandomInt(),
      };

      doesNotThrow(() => {
        TaskValidator.validateMarkAsDoneDto(dto);
      });
    });

    it('should throw an error if the dto is missing the id property', async () => {
      const dto = {};

      await rejects(
        async () => TaskValidator.validateMarkAsDoneDto(dto),
        { message: messages.error.REQUIRED_TASK_ID },
      );
    });

    it('should throw an error if the id is not a number', async () => {
      const dto = {
        id: TestUtils.generateRandomString(),
      };

      await rejects(
        async () => TaskValidator.validateMarkAsDoneDto(dto),
        { message: messages.error.INVALID_TASK_ID },
      );
    });
  });

  describe('validateGetListDto', () => {
    it('should not throw an error if the dto is valid', () => {
      const dto = { status: TaskStatus.DONE };

      doesNotThrow(() => {
        TaskValidator.validateGetListDto(dto);
      });
    });

    it('should not throw an error if the dto is missing the status property', () => {
      const dto = {};

      doesNotThrow(() => {
        TaskValidator.validateGetListDto(dto);
      });
    });

    it('should throw an error if the status is invalid', async () => {
      const dto = {
        status: TestUtils.generateRandomString({ minLength: 10 }),
      };

      await rejects(
        async () => TaskValidator.validateGetListDto(dto),
        { message: messages.error.INVALID_TASK_STATUS },
      );
    });
  });
});
