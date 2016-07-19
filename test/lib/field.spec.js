/*eslint-env node, mocha */
const _         = require('ramda');
const expect    = require('chai').expect;
const Check     = require('../../lib/check');


const Field  = require('../../lib/field');

describe('awesomize/lib/field.js', () => {

  describe('::configToActionList', () => {

    it('should return an empty action list given an empty config', () => {

      const input    = {};
      const expected = {};

      const actual   = Field.configToActionList(input);

      expect(actual).to.deep.eql(expected);

    });

    it('should return a single item action list given single item config',
    () => {

      const input  = {
        foo: {}
      };
      const actual = Field.configToActionList(input);
      expect(_.keys(actual)).to.eql([ 'foo' ]);

    });

    it('should return undefined for any field when request is undefined',
    () => {

      const input = {
        foo: {}
      , bar: {}
      };

      const test = {}

      const actionList = Field.configToActionList(input);

      return actionList.foo[0](test)

      .then((actual) => {
        expect(actual.data.foo).to.be.undefined;
      });

    });

    it('should use the key as the prop field when a read function is not ' +
    'given', () => {

      const input = {
        foo: {}
      };

      const test = {
        request: {
          foo: 'bar'
        }
      }

      const actionList = Field.configToActionList(input);

      return actionList.foo[0](test)

      .then((actual) => expect(actual.data.foo).to.eql('bar'));

    });

    it('should use the provided read function', () => {

      const input = {
        foo: {
          read: _.path(['foo', 'bar'])
        }
      };

      const test = {
        request: {
          foo: { bar: 'baz' }
        }
      };

      const actionList = Field.configToActionList(input);

      return actionList.foo[0](test)

      .then((actual) => expect(actual.data.foo).to.eql('baz'));

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

      return actionList.foo[2](test)

      .then((actual) =>
        expect(actual.validated.foo).to.eql(Check.MSG.CANNOT_BE_EQUAL)
      );

    });

    it('should just pass (return null) when no validation is passed', () => {

      const input = {
        foo: {}
      };

      const test = {
        data: {
          foo: 'initial'
        }
      };

      const actionList = Field.configToActionList(input);

      return actionList.foo[2](test)

      .then((actual) => expect(actual.validated.foo).to.be.null);

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

      return actionList.foo[1](test)

      .then((actual) => expect(actual.data.foo).to.eql('DIRTY'));

    });


    it('should normalize using the set functions', () => {

      const input = {
        foo: {
          normalize: [ _.replace(/-/g, '_'), _.toLower ]
        }
      };


      const test = {
        data: {
          foo: 'My-fanCy-tEST'
        }
      };

      const actionList = Field.configToActionList(input);

      return actionList.foo[3](test)

      .then((actual) => expect(actual.data.foo).to.eql('my_fancy_test'));

    });

  });
});
