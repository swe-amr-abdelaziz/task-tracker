import { deepStrictEqual, doesNotReject, rejects } from 'node:assert';
import { afterEach, describe, it } from 'node:test';

import { CliUtils } from '../cli-utils.js';
import { TestUtils } from '../test-utils.js';
import { messages } from '../messages.js';

describe('CliUtils', () => {
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

  describe('parseArgs', () => {
    const getArgs = () => [
      '--status=done',
      '--created-before=2025-01-01',
      '--updated-after=2020-01-01',
      '--order-by=id',
      '--desc',
      '--page=1',
      '--limit=10',
    ];
    const getValidArgs = () => [
      'status',
      'createdBefore',
      'updatedAfter',
      'orderBy',
      'desc',
      'page',
      'limit',
    ];
    const getAliases = () => ({
      s: 'status',
      cb: 'createdBefore',
      ua: 'updatedAfter',
      o: 'orderBy',
      p: 'page',
      l: 'limit',
    });

    it('should throw a TypeError if args is missing', async () => {
      await rejects(
        async () => CliUtils.parseArgs(),
        {
          name: 'TypeError',
          message: messages.error.REQUIRED_ARGS,
        }
      );
    });

    it('should throw a TypeError if args is not an array', async () => {
      const args = TestUtils.generateRandomString();

      await rejects(
        async () => CliUtils.parseArgs(args),
        {
          name: 'TypeError',
          message: messages.error.INVALID_ARGS_TYPE,
        }
      );
    });

    it('should throw a TypeError if args contains non-string values', async () => {
      const args = TestUtils.generateRandomStringArray();
      args[0] = TestUtils.generateRandomInt();

      await rejects(
        async () => CliUtils.parseArgs(args),
        {
          name: 'TypeError',
          message: messages.error.INVALID_ARGS_TYPE,
        }
      );
    });

    it('should throw a TypeError if validArgs is missing', async () => {
      const args = getArgs();

      await rejects(
        async () => CliUtils.parseArgs(args),
        {
          name: 'TypeError',
          message: messages.error.REQUIRED_VALID_ARGS,
        }
      );
    });

    it('should throw a TypeError if validArgs is not an array', async () => {
      const args = getArgs();
      const validArgs = TestUtils.generateRandomString();

      await rejects(
        async () => CliUtils.parseArgs(args, validArgs),
        {
          name: 'TypeError',
          message: messages.error.INVALID_VALID_ARGS_TYPE,
        }
      );
    });

    it('should throw a TypeError if validArgs contains non-string values', async () => {
      const args = getArgs();
      const validArgs = getValidArgs();
      validArgs[0] = TestUtils.generateRandomInt();

      await rejects(
        async () => CliUtils.parseArgs(args, validArgs),
        {
          name: 'TypeError',
          message: messages.error.INVALID_VALID_ARGS_TYPE,
        }
      );
    });

    it('should throw a TypeError if aliases is not an object', async () => {
      const args = getArgs();
      const validArgs = getValidArgs();
      const aliases = TestUtils.generateRandomString();

      await rejects(
        async () => CliUtils.parseArgs(args, validArgs, aliases),
        {
          name: 'TypeError',
          message: messages.error.INVALID_ARGS_ALIASES_TYPE,
        }
      );
    });

    it('should throw an Error if aliases contains values not included in validArgs', async () => {
      const args = getArgs();
      const validArgs = getValidArgs();
      const aliases = getAliases();
      aliases['l'] = 'length';

      await rejects(
        async () => CliUtils.parseArgs(args, validArgs, aliases),
        {
          name: 'SyntaxError',
          message: messages.error.ARGS_ALIASES_NOT_MATCHIING_VALID_ARGS,
        }
      );
    });

    it('should not throw any errors if all arguments are valid', async () => {
      const args = getArgs();
      const validArgs = getValidArgs();
      const aliases = getAliases();

      await doesNotReject(
        async () => CliUtils.parseArgs(args, validArgs, aliases),
      );
    });

    it('should throw a SyntaxError if an empty argument is provided', async () => {
      const args = getArgs();
      const validArgs = getValidArgs();
      const aliases = getAliases();
      args[0] = '';

      await rejects(
        async () => CliUtils.parseArgs(args, validArgs, aliases),
        {
          name: 'SyntaxError',
          message: messages.error.EMPTY_CLI_ARG,
        }
      );
    });

    it('should throw a SyntaxError if an argument with value only is provided', async () => {
      const args = getArgs();
      const validArgs = getValidArgs();
      const aliases = getAliases();
      args[0] = '=true';

      await rejects(
        async () => CliUtils.parseArgs(args, validArgs, aliases),
        {
          name: 'SyntaxError',
          message: messages.error.EMPTY_CLI_ARG,
        }
      );
    });

    it('should throw a SyntaxError if key is not included in validArgs', async () => {
      const args = getArgs();
      const validArgs = getValidArgs();
      const aliases = getAliases();
      args[0] = '--invalid-arg=true';

      await rejects(
        async () => CliUtils.parseArgs(args, validArgs, aliases),
        {
          name: 'SyntaxError',
          message: messages.error.INVALID_CLI_ARG.replace('{0}', 'invalidArg'),
        }
      );
    });

    it('should throw a SyntaxError if key is duplicated', async () => {
      const args = getArgs();
      const validArgs = getValidArgs();
      const aliases = getAliases();
      args[0] = '--status=todo';
      args[1] = '--status=done';

      await rejects(
        async () => CliUtils.parseArgs(args, validArgs, aliases),
        {
          name: 'SyntaxError',
          message: messages.error.DUPLICATE_CLI_ARG.replace('{0}', 'status'),
        }
      );
    });

    it('should throw a SyntaxError if key is duplicated (aliases)', async () => {
      const args = getArgs();
      const validArgs = getValidArgs();
      const aliases = getAliases();
      args[0] = '-s=todo';
      args[1] = '--status=done';

      await rejects(
        async () => CliUtils.parseArgs(args, validArgs, aliases),
        {
          name: 'SyntaxError',
          message: messages.error.DUPLICATE_CLI_ARG.replace('{0}', 'status'),
        }
      );
    });

    it('should parse arguments correctly', () => {
      const args = getArgs();
      const validArgs = getValidArgs();
      const aliases = getAliases();

      const parsed = CliUtils.parseArgs(args, validArgs, aliases);

      deepStrictEqual(parsed, {
        status: 'done',
        createdBefore: '2025-01-01',
        updatedAfter: '2020-01-01',
        orderBy: 'id',
        desc: true,
        page: '1',
        limit: '10',
      });
    });
  });
});
