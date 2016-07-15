/*eslint-env node, mocha */
const Task   = require('../../../lib/validate/task');
const expect = require('chai').expect;

describe('/lib/validate/task.js', () => {

  describe('::paramsFromSettings', () => {

    it('should be a function with an arity of 2 that returns a function with' +
    ' an arity of 2', () => {
      expect(Task.paramsFromSettings).to.be.a('function');
      expect(Task.paramsFromSettings.length).to.eql(2);

      const fn = Task.paramsFromSettings({}, {});
      expect(fn).to.be.a('function');
      expect(fn.length).to.eql(2);
    });

  });

});
