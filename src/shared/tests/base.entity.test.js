import { rejects } from 'node:assert';
import { describe, it } from 'node:test';

import { BaseEntity } from '../../shared/entities/base.entity.js';
import { messages } from '../../shared/messages.js';

describe('BaseEntity', () => {
  describe('new keyword', () => {
    it('should throw an error if an instance of BaseEntity is created', async () => {
      // Act & Arrange
      await rejects(
        async () => new BaseEntity(),
        { message: messages.error.BASE_ENTITY_OBJECT_CREATION },
      );
    });
  });
});
