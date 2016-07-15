
const _         = require('ramda');
const Bluebird  = require('bluebird');


const Field      = require('./field');
const ResultSet = require('./result-set');
const Test      = require('./test');

// @TODO - make TestContext contain the key
// @TODO - result set should be a list of tuples (Key, Either String Nothing)
// @TODO - validation error should translate ResultSet -> ResultDictionary

/**
 * type alias Value   = Scalar
 * type alias Request = Object
 * type alias Current = Object
 *
 * type alias Test = (Value, Request, Current) -> Either String Nothing
 *
 * type alias Field =
 *   { validation: Array Test
 *   , ...
 *   }
 * type alias FieldDictionary = { String = Field }
 *
 * type alias TestContext =
 *   { value = Value
 *   , target = Request
 *   , current = Current
 *   }
 * type alias TestDictionary = { String = (TestContext, Array Test) }
 */


// generateTestDictionary :: Request, Current -> FieldDictionary
//      -> TestDictionary
const generateTestDictionary = (request, current) => _.compose(
  Bluebird.resolve
, Field.dictionaryToTestDictionary(request, current)
);


// runTestDictionary :: TestDictionary -> Promise ResultSet : throws TypeError
const runTestDictionary = _.map(
  _.apply(Test.runList)
);


// validate :: Request, Current -> FieldDictionary
//      -> Request : throws TypeError, ValidationError
const validate = (request, current) => _.composeP(
  _.always(request)
, ResultSet.throwErrorIfNotValid
, runTestDictionary
, generateTestDictionary(request, current)
);

module.exports = {
  validate       : validate
}
