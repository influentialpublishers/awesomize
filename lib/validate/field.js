
const _            = require('ramda');


const { isNotNil } = require('../helper');

// @TODO - This should be generic for the sanitize, normalize, validate
//      sets of actions.

/**
 * type alias Key     = String
 * type alias Value   = Scalar
 * type alias Request = Object
 * type alias Current = Object
 *
 * type alias TestContext =
 *   { key = Key
 *   , value = Value
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
 * type alias Token = (TestContext, Array Test)
 *
 * type alias TestDictionary =
 *   { String = (TestContext, Array Test) }
 */


// tokenize :: Request, Current -> Field, Key -> Token
const tokenize = (request, current) => (field, key) => [
  { key: key
  , value: _.prop(key, request)
  , target: request
  , current: current
  }
, _.propOr([], 'validation', field)
];


// filterForPartialUpdate :: Current -> Array Token -> Array Token
const filterForPartialUpdate = (current) => _.when(
  _.always(isNotNil(current))
, _.filter(_.compose(
    _.not
  , _.propEq('value', undefined)
  , _.head
))
)


// http://goo.gl/hAVr5t
// dictionaryTokenize :: Request, Current -> FieldDictionary
//      -> Array Token
const dictionaryTokenize = (request, current) => _.compose(
  filterForPartialUpdate(current)
, _.mapObjIndexed(tokenize(request, current))
);


module.exports = {
  tokenize               : tokenize
, filterForPartialUpdate : filterForPartialUpdate
, dictionaryTokenize     : dictionaryTokenize
}
