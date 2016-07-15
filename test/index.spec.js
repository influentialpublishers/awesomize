/*eslint-env node, mocha */
const expect = require('chai').expect;

const Awesomize = require('../index');

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
      Awesomize('not an object', () => {});
    }

    expect(AwsomizeTest).to.throw(
      /context parameter \(ctx\) must be an object/
    );
  });

});
