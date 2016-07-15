
const _            = require('ramda');


const { isNotNil } = require('../helper');

/**
 * type alias Key     = String
 * type alias Value   = Scalar
 * type alias Request = Object
 * type alias Current = Object
 *
 * type alias TestContext =
 *   { value = Value
 *   , target = Request
 *   , current = Current
 *   }
 *
 * type alias Field =
 *   { validation: Array Validator
 *   , ...
 *   }
 *
 * type alias FieldDictionary =
 *   { String = Field }
 *
 * type alias TestResult = Either String Nothing
 *
 * type alias Test = (Value, Request, Current) -> TestResult
 *
 * type alias Token = (Key, TestContext, Array Test)
 *
 * type alias TestDictionary =
 *   { String = (TestContext, Array Test) }
 */


// tokenize :: Request, Current -> Field, Key -> Token
const tokenize = (request, current) => (field, key) => [
  key
, request
, _.propOr([], 'validation', field)
, current
];


// filterForPartialUpdate :: Object -> TaskParamDict -> TaskParamDict
const filterForPartialUpdate = (current) => _.when(
  _.always(isNotNil(current))
, _.filter(_.compose(
    _.not
  , _.equal(undefined)
  , _.head
))
)


// http://goo.gl/hAVr5t
// dictionaryToTestDictionary :: Request, Current -> FieldDictionary
//      -> TestDictionary
const dictionaryToTestDictionary = (request, current) => _.compose(
  filterForPartialUpdate(current)
, _.mapObjIndexed(tokenize(request, current))
);


module.exports = {
  tokenize                   : tokenize
, filterForPartialUpdate     : filterForPartialUpdate
, dictionaryToTestDictionary : dictionaryToTestDictionary
}
