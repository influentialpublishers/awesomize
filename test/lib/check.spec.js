
/*eslint-env node, mocha */
const _           = require('ramda');
const expect      = require('chai').expect;
const { inspect } = require('util');


const Check = require('../../lib/check');


describe('awesomize/lib/check', () => {

  describe('::required', () => {

    it('should return null if is a non-zero length string', () => {

      const input = 'foo';
      const actual = Check.required(input);

      expect(actual).to.be.null;

    });

    it('should return required for all nil/empty values', () => {

      const input = [
        '',
        null,
        undefined,
        [],
        {}
      ];

      const test = (test_case) => {
        const actual         = Check.required(test_case);
        const test_case_name = inspect(test_case);

        expect(actual, test_case_name).to.eql(Check.MSG.REQUIRED);
      };

      _.map(test, input);

    });

  });

  describe('::notEqual', () => {

    it('should return MSG.CANNOT_BE_EQUAL if the values are equal', () => {

      const input  = 'foo';
      const actual = Check.notEqual('foo')(input);

      expect(actual).to.eql(Check.MSG.CANNOT_BE_EQUAL);

    });

    it('should return null if the values are not equal', () => {

      const input = 'foo';
      const actual = Check.notEqual('bar')(input);

      expect(actual).to.be.null;

    });

  });
});
