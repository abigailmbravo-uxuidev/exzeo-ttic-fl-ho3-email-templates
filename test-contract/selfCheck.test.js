'use strict';

const chai = require('chai');
chai.use(require('chai-shallow-deep-equal'));
const { expect } = chai;
const util = require('util');

const { getAccessToken } = require('./support/auth');
const { selfCheck } = require('./support/selfCheck');

context('Self Check', () => {
  describe('POST /selfCheck', () => {
    it('Returns correct body when all tests pass', async () => {
      const accessToken = await getAccessToken('TTIC_CSR_HO3');
      const response = await selfCheck({ accessToken });

      if (!response.data.result || !response.data.result.failedTests) {
        console.log(response.data);
        return Promise.resolve();
      }

      if (response.data.result.failedTests && response.data.result.failedTests.length > 0) {
        console.log(
          response.data.result.failedTests.filter(({ path }) => !!path)
            .map(
              ({ ruleCode, description, diff }) => ({
                ruleCode, description,
                message: diff.map(({ kind, path, lhs, rhs }) => `  Expected ${path.join('.')} to be ${util.inspect(rhs)} but got ${util.inspect(lhs)}.`)
              })
            )
            .map(({ ruleCode, description, message }) => `${ruleCode}: ${description}\n${message.join('\n')}`)
            .join('\n')
        );
        console.log(
          response.data.result.failedTests.filter(({ path }) => !path)
            .map(
              ({ ruleCode, description, diff }) => ({
                ruleCode, description,
                message: diff.map(({ kind, lhs, rhs }) => `  Expected \n${util.inspect(lhs)} but got ${util.inspect(rhs)}.`)
              })
            )
            .map(({ ruleCode, description, message }) => `${ruleCode}: ${description}\n${message.join('\n')}`)
            .join('\n')
        )
      }

      const { data: { result } } = response;
      expect(result.testsFailed).to.equal(0);
    });
  });
});
