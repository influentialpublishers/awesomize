/*eslint-env node, mocha */
const _      = require('ramda');
const expect = require('chai').expect;


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
      expect(actual[0][0]({ foo: 'bar'})).to.eql('bar');

    });

  });

  describe('::configToAction', () => {

    it('should generate a default action on a key only config', () => {

      const test_key = 'key';

      const test_input = {
        'key' : 'funky town'
      };

     const actual = Field.configToAction({ key: test_key });

      expect(actual[0](test_input)).to.eql('funky town');
      expect(actual[1](test_input)).to.deep.eql(test_input);
      expect(actual[2](test_input)).to.deep.eql(null);
      expect(actual[3](test_input)).to.deep.eql(test_input);
    });

  });

});
