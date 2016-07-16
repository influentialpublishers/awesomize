
/*eslint-env node, mocha */
const _           = require('ramda');
const expect      = require('chai').expect;
const { inspect } = require('util');


const Validator = require('../../../lib/validate/validator');


describe('awesomize/lib/validate/validator', () => {

  describe('::required', () => {

    it('should return null if is a non-zero length string', () => {

      const input = 'foo';
      const actual = Validator.required(input);

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
        const actual         = Validator.required(test_case);
        const test_case_name = inspect(test_case);

        expect(actual, test_case_name).to.eql(Validator.MSG.REQUIRED);
      };

      _.map(test, input);

    });

  });
});
