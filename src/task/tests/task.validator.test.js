import { doesNotThrow, rejects } from 'node:assert';
import { describe, it } from 'node:test';

import { TaskStatus } from '../task.entity.js';
import { TaskValidator } from '../task.validator.js';
import { messages } from '../../shared/messages.js';

describe('TaskValidator', () => {
  describe('validateAddDto', () => {
    it('should not throw an error if the dto is valid', () => {
      // Arrange
      const dto = { description: 'This is a test description' };

      // Act & Assert
      doesNotThrow(() => {
        TaskValidator.validateAddDto(dto);
      });
    });

    it('should throw an error if the dto is missing the description property', async () => {
      // Arrange
      const dto = {};

      // Act & Assert
      await rejects(
        async () => TaskValidator.validateAddDto(dto),
        { message: messages.error.REQUIRED_TASK_DESCRIPTION },
      );
    });

    it('should throw an error if the description is empty (whitespace)', async () => {
      // Arrange
      const dto = { description: '    ' };

      // Act & Assert
      await rejects(
        async () => TaskValidator.validateAddDto(dto),
        { message: messages.error.REQUIRED_TASK_DESCRIPTION },
      );
    });
  });

  describe('validateUpdateDto', () => {
    it('should not throw an error if the dto is valid', () => {
      // Arrange
      const dto = {
        id: 1,
        description: 'This is a test description',
      };

      // Act & Assert
      doesNotThrow(() => {
        TaskValidator.validateUpdateDto(dto);
      });
    });

    it('should throw an error if the dto is missing the id property', async () => {
      // Arrange
      const dto = { description: 'This is a test description' };

      // Act & Assert
      await rejects(
        async () => TaskValidator.validateUpdateDto(dto),
        { message: messages.error.REQUIRED_TASK_ID },
      );
    });

    it('should throw an error if the id is not a number', async () => {
      // Arrange
      const dto = { id: 'invalid-id', description: '    ' };

      // Act & Assert
      await rejects(
        async () => TaskValidator.validateUpdateDto(dto),
        { message: messages.error.INVALID_TASK_ID },
      );
    });

    it('should throw an error if the dto is missing the description property', async () => {
      // Arrange
      const dto = { id: 1 };

      // Act & Assert
      await rejects(
        async () => TaskValidator.validateUpdateDto(dto),
        { message: messages.error.REQUIRED_TASK_DESCRIPTION },
      );
    });

    it('should throw an error if the description is empty (whitespace)', async () => {
      // Arrange
      const dto = { id: 1, description: '    ' };

      // Act & Assert
      await rejects(
        async () => TaskValidator.validateUpdateDto(dto),
        { message: messages.error.REQUIRED_TASK_DESCRIPTION },
      );
    });
  });

  describe('validateDeleteDto', () => {
    it('should not throw an error if the dto is valid', () => {
      // Arrange
      const dto = { id: 1 };

      // Act & Assert
      doesNotThrow(() => {
        TaskValidator.validateDeleteDto(dto);
      });
    });

    it('should throw an error if the dto is missing the id property', async () => {
      // Arrange
      const dto = {};

      // Act & Assert
      await rejects(
        async () => TaskValidator.validateDeleteDto(dto),
        { message: messages.error.REQUIRED_TASK_ID },
      );
    });

    it('should throw an error if the id is not a number', async () => {
      // Arrange
      const dto = { id: 'invalid-id' };

      // Act & Assert
      await rejects(
        async () => TaskValidator.validateDeleteDto(dto),
        { message: messages.error.INVALID_TASK_ID },
      );
    });
  });

  describe('validateMarkAsInProgressDto', () => {
    it('should not throw an error if the dto is valid', () => {
      // Arrange
      const dto = { id: 1 };

      // Act & Assert
      doesNotThrow(() => {
        TaskValidator.validateMarkAsInProgressDto(dto);
      });
    });

    it('should throw an error if the dto is missing the id property', async () => {
      // Arrange
      const dto = {};

      // Act & Assert
      await rejects(
        async () => TaskValidator.validateMarkAsInProgressDto(dto),
        { message: messages.error.REQUIRED_TASK_ID },
      );
    });

    it('should throw an error if the id is not a number', async () => {
      // Arrange
      const dto = { id: 'invalid-id' };

      // Act & Assert
      await rejects(
        async () => TaskValidator.validateMarkAsInProgressDto(dto),
        { message: messages.error.INVALID_TASK_ID },
      );
    });
  });

  describe('validateMarkAsDoneDto', () => {
    it('should not throw an error if the dto is valid', () => {
      // Arrange
      const dto = { id: 1 };

      // Act & Assert
      doesNotThrow(() => {
        TaskValidator.validateMarkAsDoneDto(dto);
      });
    });

    it('should throw an error if the dto is missing the id property', async () => {
      // Arrange
      const dto = {};

      // Act & Assert
      await rejects(
        async () => TaskValidator.validateMarkAsDoneDto(dto),
        { message: messages.error.REQUIRED_TASK_ID },
      );
    });

    it('should throw an error if the id is not a number', async () => {
      // Arrange
      const dto = { id: 'invalid-id' };

      // Act & Assert
      await rejects(
        async () => TaskValidator.validateMarkAsDoneDto(dto),
        { message: messages.error.INVALID_TASK_ID },
      );
    });
  });

  describe('validateGetListDto', () => {
    it('should not throw an error if the dto is valid', () => {
      // Arrange
      const dto = { status: TaskStatus.DONE };

      // Act & Assert
      doesNotThrow(() => {
        TaskValidator.validateGetListDto(dto);
      });
    });

    it('should not throw an error if the dto is missing the status property', () => {
      // Arrange
      const dto = {};

      // Act & Assert
      doesNotThrow(() => {
        TaskValidator.validateGetListDto(dto);
      });
    });

    it('should throw an error if the status is invalid', async () => {
      // Arrange
      const dto = { status: 'invalid-status' };

      // Act & Assert
      await rejects(
        async () => TaskValidator.validateGetListDto(dto),
        { message: messages.error.INVALID_TASK_STATUS },
      );
    });
  });
});
