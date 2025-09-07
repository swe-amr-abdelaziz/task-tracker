import { rejects } from 'node:assert';
import { describe, it } from 'node:test';

import { BaseEntity } from '../base.entity.js';
import { messages } from '../../messages.js';

describe('BaseEntity', () => {
  describe('new keyword', () => {
    it('should prevent object creation of BaseEntity abstract class', async () => {
      const errorMessage = messages.error.ABSTRACT_CLASS_OBJECT_CREATION.replace('{0}', 'BaseEntity');

      await rejects(
        async () => new BaseEntity(),
        { message: errorMessage },
      );
    });
  });
});
