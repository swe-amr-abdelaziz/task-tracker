import { deepStrictEqual, strictEqual } from 'node:assert';
import { describe, it, mock } from 'node:test';

import { BaseEntity } from '../../shared/entities/base.entity.js';
import { Utils } from '../../shared/utils.js';
import { messages } from '../../shared/messages.js';

describe('BaseEntity', () => {
  describe('new keyword', () => {
    it('should throw an error if an instance of BaseEntity is created', () => {
      const logErrorMock = mock.method(Utils, 'logErrorMsg', () => {});
      new BaseEntity();

      strictEqual(logErrorMock.mock.calls.length, 1);
      deepStrictEqual(
        logErrorMock.mock.calls[0].arguments,
        [messages.error.BASE_ENTITY_OBJECT_CREATION]
      );
    });
  });
});
