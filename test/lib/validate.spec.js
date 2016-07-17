/*eslint-env node, mocha */
const _         = require('ramda');
const Bluebird  = require('bluebird');
const expect    = require('chai').expect;
const sinon     = require('sinon');
const Check     = require('../../lib/check');
const Validator = require('../../lib/validator');


describe('awesomize/lib/validate.js', () => {


  describe('::runList', () => {

    it('should run a list of validators against a value in a given context',
    () => {

      const validators = [ Check.required ];
      const context    = { data: {} };

      return Validator.createMapper('foo', validators)(context)

      .then((actual) => {

        expect(actual.validated.foo).to.eql(Check.MSG.REQUIRED);

      });

    });


    it('should return a string when a check fails', () => {

      const validators = [ Check.required, Check.notEqual('bar') ];
      const context    = { data: { foo: 'bar' } };

      return Validator.createMapper('foo', validators)(context)

      .then((actual) => {

        expect(actual.validated.foo).to.eql(Check.MSG.CANNOT_BE_EQUAL);

      });

    });


    it('should set the context.validated.<key> value to null when all the ' +
    'tests pass', () => {

      const validators = [ Check.required, Check.notEqual('bar') ];
      const context    = { data: { foo: 'baz' } };

      return Validator.createMapper('foo', validators)(context)

      .then((actual) => {

        expect(actual.validated.foo).to.be.null;

      });

    });


    it('should allow validators to return promises', () => {

      const test = _.always(Bluebird.resolve(null));
      const validators = [ Check.required, test, Check.notEqual('bar') ];
      const context = { data: { foo: 'baz' } };

      return Validator.createMapper('foo', validators)(context)

      .then((actual) => {

        expect(actual.validated.foo).to.be.null;

      });

    });


    it('should short circuit when a validator fails.', () => {

      const test = sinon.stub().returns(null);
      const validators = [ Check.required, Check.notEqual('bar'), test ];
      const context = { data: { foo: 'bar' } };

      return Validator.createMapper('foo', validators)(context)

      .then((actual) => {

        expect(test.called).to.be.false;
        expect(actual.validated.foo).to.eql(Check.MSG.CANNOT_BE_EQUAL);

      });


    });

  });

});
