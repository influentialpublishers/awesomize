/*eslint-env node, mocha */
const _                   = require('ramda');
const expect              = require('chai').expect;

const Awesomize           = require('../index');
const Spec                = require('../lib/spec');

const EMPTY_FIELD_FACTORY = _.always({});

describe('awesomize/index.js', () => {

  it('should be a function with an arity of 2', () => {
    expect(Awesomize).to.be.a('function');
    expect(Awesomize.length).to.eql(2);
  });

  it('should require the second parameter to be a function', () => {
    function AwsomizeTest() {
      Awesomize({}, 'not a function');
    }

    expect(AwsomizeTest).to.throw(
      /field_factory parameter must be a function/
    );
  });

  it('should require the first parameter to be an object', () => {
    function AwsomizeTest() {
      Awesomize('not an object', EMPTY_FIELD_FACTORY);
    }

    expect(AwsomizeTest).to.throw(
      /context parameter \(ctx\) must be an object/
    );
  });

  it('should return a function with an arity of 2', () => {
    const actual = Awesomize({}, EMPTY_FIELD_FACTORY);

    expect(actual).to.be.a('function');
    expect(actual.length).to.eql(2);
  });

  it('should call the field factory with the given context', (done) => {

    const expected = { test: 'foo' };

    Awesomize(expected, (v, ctx) => {
      expect(ctx).to.deep.eql(expected);
      done();

      return {};
    });

  });

  it('should require that our field spec be an object', () => {

    const test = () => Awesomize({}, () => null);

    expect(test).to.throw(/field_factory must return an object/);

  });


  it('should expose the Validator.MSG constant.', () => {
    expect(Awesomize.MSG).to.be.a('object');
    expect(Awesomize.MSG.REQUIRED).to.not.be.undefined;
  });


  it('should require a field when the spec denotes it', () => {

    const spec = Awesomize({}, (v) => {
      return {
        read: {
          validate: [ v.required ]
        }
      };
    });

    return spec({}).then((awesomized) => {
      expect(awesomized.validated.read).to.eql(Awesomize.MSG.REQUIRED);
    });

  });

  it('should throw an error when you specify a validation that is not a ' +
  'function', () => {

    const test = () => Awesomize({}, (v) => {
      return {

        read: {
          validate: [ v.thisDoesNotExist ]
        }

      };
    });

    expect(test).to.throw(/Invalid validation test for key: <read>/);

  });


  describe('Validation of the Awesomize Spec Spec', () => {

    it.skip('should catch failures', () => {
      const spec = Awesomize({}, Spec);
      const test = {
        read: 'not a function'
      , sanitize: { not: 'an array' }
      , validate: 'not an array'
      , normalize: 13245
      };

      return spec(test).then((result) => {
        //console.log(result);
        expect(result.validated.read).to.eql(Awesomize.MSG.NOT_FUNCTION);
        expect(result.validated.sanitize).to.eql(Awesomize.MSG.NOT_ARRAY);
        expect(result.validated.validate).to.eql(Awesomize.MSG.NOT_ARRAY);
        expect(result.validated.normalize).to.eql(Awesomize.MSG.NOT_ARRAY);
      });
    });

  });

});
