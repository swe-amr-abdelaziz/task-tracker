import { deepStrictEqual } from 'node:assert';
import { afterEach, describe, it } from 'node:test';

import { CliUtils } from '../cli-utils.js';
import { TestUtils } from '../test-utils.js';

describe('TestUtils', () => {
  describe('getAppArgs', () => {
    const originalArgv = process.argv;

    afterEach(() => {
      process.argv = originalArgv;
    });

    it('should return an empty array if no arguments are provided', () => {
      const argsCount = 2;
      process.argv = TestUtils.generateRandomStringArray(argsCount);

      const args = CliUtils.getAppArgs();

      deepStrictEqual(args, []);
    });

    it('should return cli arguments passed by the user', () => {
      const argsCount = 5;
      process.argv = TestUtils.generateRandomStringArray(argsCount);

      const args = CliUtils.getAppArgs();

      deepStrictEqual(args, process.argv.slice(2));
    });
  });
});
