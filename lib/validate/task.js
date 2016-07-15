
const _        = require('ramda');
const Bluebird = require('bluebird');

/**
 * type alias Key = String
 * type alias Request = Object
 * type alias Current = Object
 *
 * type alias Field =
 *   { validation: Array Validator
 *   , ...
 *   }
 *
 * type alias FieldDict =
 *   { String = Field }
 *
 * type alias Validator = (* -> Maybe String)
 *
 * type alias TaskParams =
 *   [ Key
 *   , Request
 *   , Array Validator
 *   , Current
 *   ]
 *
 * type alias TaskParamDict =
 *   { String = TaskParams }
 */


// paramsFromSettings :: Object, Object -> Field -> TaskParams
const paramsFromSettings = (request, current) => (field, key) => [
  key
, request
, _.propOr([], 'validation', field)
, current
];


// http://goo.gl/hAVr5t
// paramDictFromFieldDict :: Object, Object -> FieldDict
//      -> Promise TaskParamDict
const paramDictFromFieldDict = (request, current) => _.compose(
  Bluebird.resolve
, _.mapObjIndexed(paramsFromSettings(request, current))
);


module.exports = {
  paramsFromSettings     : paramsFromSettings
, paramDictFromFieldDict : paramDictFromFieldDict
}
