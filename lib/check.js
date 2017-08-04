
const _        = require('ramda');
const Bluebird = require('bluebird');
const v        = require('validator');

const MSG  = {
  REQUIRED                : 'required'
, REQUIRE_ARRAY           : 'require_array'
, CANNOT_BE_EQUAL         : 'cannot_be_equal'
, NOT_INT                 : 'not_int'
, NOT_STRING              : 'not_string'
, NOT_FUNCTION            : 'not_function'
, NOT_ARRAY               : 'not_array'
, LIST_ITEM_NOT_SPEC      : 'list_item_not_spec'
, NOT_NULLABLE            : 'cannot_be_null'
, IMMUTABLE               : 'cannot_change_immutable'
, NOT_IN_RANGE            : 'not_in_range'
, NOT_IN                  : 'not_in'
, NOT_BOOL                : 'not_bool'
, MINIMUM_NOT_MET         : 'minimum_not_met'
, MINIMUM_LENGTH_NOT_MET  : 'min_length_not_met'
, MAXIMUM_LENGTH_EXCEEDED : 'maximum_length_exceeded'
, DOES_NOT_MATCH          : 'does_not_match'
, INVALID_EMAIL           : 'invalid_email'
};


// basic : (a -> Bool), String -> (a -> Maybe String)
const basic = (test, msg) => (...args) => {
  return test.apply(null, args) ? null : msg
}

// extern : (a -> Bool), String -> (a -> Maybe String)
const extern = (test, msg) => _.composeP(
  basic(_.equals(true), msg)
, _.when(_.isNil, _.T)
, _.compose(Bluebird.resolve, test)
);


// required : a -> Maybe String
const required = basic(
  _.compose(_.not, _.either(_.isEmpty, _.isNil))
, MSG.REQUIRED
);
required.always_run = true;


// requireArray : a -> Maybe String
const requireArray = basic(_.is(Array), MSG.REQUIRE_ARRAY);
requireArray.always_run = true;


// notEqual : a -> Maybe String
const notEqual = (x) => basic(
  _.compose(_.not, _.equals(x))
, MSG.CANNOT_BE_EQUAL
);


// isInt : a -> Maybe String
const isInt = basic(_.unary(v.isInt), MSG.NOT_INT);


// isString : a -> Maybe String
const isString = basic(_.is(String), MSG.NOT_STRING);


// isFunction : a -> Maybe String
const isFunction = basic(_.is(Function), MSG.NOT_FUNCTION);


// isArray : a -> Maybe String
const isArray = basic(_.is(Array), MSG.NOT_ARRAY);


// listOf : (a -> Bool), String -> Array a -> Promise Maybe String
const listOf  = (check, msg) => (list) => {

  const validator = extern(check, msg || MSG.LIST_ITEM_NOT_SPEC);
  const reducer   = (result, item) => result ? result : validator(item);

  return Bluebird.reduce(list, reducer, null);
};


// notNullable : a -> Maybe String
const notNullable = basic(
  (value, request, current, key) => { return _.all(
    _.compose(_.not, _.equals(null))
    , [ value, _.prop(key, current) ]
    )
  }
  , MSG.NOT_NULLABLE
);

// immutable : a -> Maybe String
const immutable = basic(
  (value, request, current, key) => { return _.propEq(key, value, current) }
  , MSG.IMMUTABLE
);


// _satisfies : Function -> [ String ] -> Bool
const _satisfies = (condFn) => (keys) => _.compose(
  _.not
  , condFn(_.compose(_.not, _.isNil)),
  _.props(keys)
)


// reqIf : Function -> [ String ] -> Maybe String
const _reqIf = (condFn) => (keys) => basic(
  _.useWith(_.or, [ _.identity , _satisfies(condFn)(keys) ])
  , MSG.REQUIRED
)


// reqIfHasAny : [ String ] -> a , Request -> Maybe String
const reqIfHasAny = _reqIf(_.any);


// reqIfHasAll : [ String ] -> a , Request -> Maybe String
const reqIfHasAll = _reqIf(_.all);


// notReqIfHasAny : [ String ] -> a , Request -> Maybe String
const notReqIfHasAny = _reqIf(_.curryN(2, _.compose(_.not, _.any)))


// notReqIfHasAll : [ String ] -> a , Request -> Maybe String
const notReqIfHasAll = _reqIf(_.curryN(2, _.compose(_.not, _.all)))


// _isInRangeInc : Int, Int -> (Int -> Bool)
const _isBetweenInc = (min, max) => _.allPass([ _.lte(min), _.gte(max) ])


// _isBetween : Int -> Maybe String
const _betweenIf = _.ifElse(
  _.identity
, _.always(null)
, _.always(MSG.NOT_IN_RANGE)
);


// isLength : Int, Int -> (a -> Maybe String)
const isLength = (min, max) => _.compose(
  _betweenIf
, _isBetweenInc(min, max)
, _.length
)

// isIn :: Array -> * -> Maybe String
const isIn = (options) => _.ifElse(
  _.flip(_.contains)(options)
, _.always(null)
, _.always(MSG.NOT_IN)
)

// isBool :: Integer -> Maybe String
const isBool = _.ifElse(
 _.either(
  _.flip(_.contains)([true, false]),
  _.compose(
    _.flip(_.contains)([0,1]),
    (i) => parseInt(i, 10)
  )
 )
, _.always(null)
, _.always(MSG.NOT_BOOL)
)

// isInRangeInclusive :: Integer, Integer -> value -> Maybe String
const isInRangeInclusive = (min, max) => _.ifElse(
  _.compose(
    _isBetweenInc(min, max)
  , (i) => parseInt(i,10)
  )
, _.always(null)
, _.always(MSG.NOT_IN_RANGE)
)

// _isNot :: a -> (a -> Bool)
const _isNot = (val) => _.compose(_.not, _.equals(val))

// defined "" a -> Maybe String
const defined = basic( _isNot(undefined), MSG.REQUIRED)

// min :: Integer -> Integer -> Maybe String
const min = basic(_.lte, MSG.MINIMUM_NOT_MET)

// _isAtLeastMin :: Integer -> String -> Bool
const _isAtLeastMin = (min, text) => _.compose(_.lte(min), _.length)(text)

// minLength :: Integer -> String -> Maybe String
const minLength = _.curryN(2, basic(_isAtLeastMin, MSG.MINIMUM_LENGTH_NOT_MET))

// _isLessThanMax :: Integer -> String -> Bool
const _isLessThanMax = (max, text) => _.compose(_.gte(max), _.length)(text)

// maxLength :: Integer -> String -> Maybe String
const maxLength = _.curryN(2, basic(_isLessThanMax, MSG.MAXIMUM_LENGTH_EXCEEDED))


// isEqualTo :: String -> Value, Object -> Maybe String
const isEqualTo = _.curryN(3, basic(_.propEq, MSG.DOES_NOT_MATCH))

// checkEmail :: String -> Bool
const checkEmail = (val) => (v.isEmail(val))

// isValidEmail :: String -> Maybe String
const isValidEmail = basic(checkEmail, MSG.INVALID_EMAIL)

module.exports = {
  MSG
, extern
, required
, requireArray
, notEqual
, isInt
, isString
, isFunction
, isArray
, listOf
, notNullable
, immutable
, reqIfHasAny
, reqIfHasAll
, notReqIfHasAny
, notReqIfHasAll
, isLength
, isIn
, isBool
, isInRangeInclusive
, defined
, min
, minLength
, maxLength
, isEqualTo
, isValidEmail
};
