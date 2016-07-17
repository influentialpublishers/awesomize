/*eslint-env node, mocha */
const _         = require('ramda');
const expect    = require('chai').expect;
const Check     = require('../../lib/check');


const Field  = require('../../lib/field');

describe('awesomize/lib/field.js', () => {

  describe('::configToActionList', () => {

    it('should return an empty action list given an empty config', () => {

      const input    = {};
      const expected = [];

      const actual   = Field.configToActionList(input);

      expect(actual).to.deep.eql(expected);

    });

    it('should return a single item action list given single item config',
    () => {

      const input  = {
        foo: {}
      };
      const actual = Field.configToActionList(input);

      expect(actual.length).to.eql(1);

    });

    it('should use the key as the prop field when a read function is not ' +
    'given', () => {

      const input = {
        foo: {}
      };

      const test = {
        foo: 'bar'
      }

      const actionList = Field.configToActionList(input);
      const actual     = actionList[0].action[0](test)

      expect(actual).to.eql('bar');

    });

    it('should use the provided read function', () => {

      const input = {
        foo: {
          read: _.path(['foo', 'bar'])
        }
      };

      const test = {
        foo: { bar: 'baz' }
      };

      const actionList = Field.configToActionList(input);
      const actual     = actionList[0].action[0](test);

      expect(actual).to.eql('baz');

    });

    it('should use the provided list of validation functions', () => {
      const input = {
        foo: {
          validate: [ Check.required, Check.notEqual('initial') ]
        }
      };

      const test = {
        data: {
          foo: 'initial'
        }
      };

      const actionList = Field.configToActionList(input);

      actionList[0].action[2](test)

      .then((actual) => {
        expect(actual.validated.foo).to.eql(Check.MSG.CANNOT_BE_EQUAL);
      });

    });

    it('should just pass return null when no validation is passed', () => {

      const input = {
        foo: {}
      };

      const test = {
        data: {
          foo: 'initial'
        }
      };

      const actionList = Field.configToActionList(input);

      actionList[0].action[2](test)

      .then((actual) => {
        expect(actual.validated.foo).to.be.null;
      });

    });


    it('should sanitize using the set functions.', () => {

      const input = {
        foo: {
          sanitize: [ _.trim, _.toUpper ]
        }
      };

      const test = {
        data: {
          foo: ' dirty '
        }
      };


      const actionList = Field.configToActionList(input);

      return actionList[0].action[1](test)

      .then((actual) => {
        expect(actual.data.foo).to.eql('DIRTY');
      });

    });

  });
});
