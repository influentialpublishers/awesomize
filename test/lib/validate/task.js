/*eslint-env node, mocha */
const expect = require('chai').expect;

describe.skip('/lib/validate/task.js', () => {

  describe('::paramsFromSettings', () => {

    it('should be a function with an arity of 2 that returns a function with' +
    ' an arity of 2', () => {
      expect(Task.paramsFromSettings).to.be.a('function');
      expect(Task.paramsFromSettings.length).to.eql(2);

      const fn = Task.paramsFromSettings({}, {});
      expect(fn).to.be.a('function');
      expect(fn.length).to.eql(2);
    });


    it('should take a request, current and field definition and return some' +
    ' task params.', () => {

      const v = () => null

      const request = { foo: 'bar', baz: 'buzz' };
      const current = undefined;
      const field   = {
        validation: [ v ]
      };
      const key     = 'test';

      const actual   = Task.paramsFromSettings(request, current)(field, key);
      const expected = [ key, request, field.validation, current ];

      expect(actual).to.deep.equal(expected);

    });

    it('should return an empty array if field does not have a validation key',
    () => {
 

      const request = { foo: 'bar', baz: 'buzz' };
      const current = undefined;
      const field   = {};
      const key     = 'test';

      const actual   = Task.paramsFromSettings(request, current)(field, key);
      const expected = [ key, request, [], current ];

      expect(actual).to.deep.equal(expected);

     
    });

  });


  describe('::paramDictFromFieldDict', () => {

    it('should be a function with an arity of 2 that returns a function.',
    () => {
      expect(Task.paramDictFromFieldDict).to.be.a('function');
      expect(Task.paramDictFromFieldDict.length).to.eql(2);

      const fn = Task.paramDictFromFieldDict({}, {});
      expect(fn).to.be.a('function');

    });


    it('should return a promise of a dictionary of params', () => {

      const v = () => null
      const x = () => null

      const request = { foo: 'bar', baz: 'buzz' };
      const current = undefined;
      const field_def = {
        foo: {
          validation: [ v ]
        },
        bar: {

        },
        baz: {
          validation: [ x ]
        }

      }

      return Task.paramDictFromFieldDict(request, current)(field_def)

      .then((actual) => {

        const expected = {
          foo: [ 'foo', request, field_def.foo.validation, current ]
        , bar: [ 'bar', request, [], current ]
        , baz: [ 'baz', request, field_def.baz.validation, current ]
        };

        expect(actual).to.be.deep.equal(expected);
      });
    });

  });

});
