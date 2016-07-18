
const _        = require('ramda');
const Bluebird = require('bluebird');


// PASS : Nothing
const PASS = _.always(null);

// FAIL : String -> (* -> String)
const FAIL = (msg) => _.always(msg);

const MSG  = {
  REQUIRED           : 'required'
, CANNOT_BE_EQUAL    : 'cannot_be_equal'
, NOT_FUNCTION       : 'not_function'
, NOT_ARRAY          : 'not_array'
, LIST_ITEM_NOT_SPEC : 'list_item_not_spec'
};


// basic : (a -> Bool), String -> (a -> Maybe String)
const basic = (test, msg) => _.ifElse(test, PASS, FAIL(msg));


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


// notEqual : a -> Maybe String
const notEqual = (x) => basic(
  _.compose(_.not, _.equals(x))
, MSG.CANNOT_BE_EQUAL
);


// isArray : a -> Maybe String
const isFunction = basic(_.is(Function), MSG.NOT_FUNCTION);

// isArray : a -> Maybe String
const isArray = basic(_.is(Array), MSG.NOT_ARRAY);


// listOf : (a -> Bool), String -> Array a -> Promise Maybe String
const listOf  = (check, msg) => (list) => {

  const validator = extern(check, msg || MSG.LIST_ITEM_NOT_SPEC);
  const reducer   = (result, item) => result ? result : validator(item);

  return Bluebird.reduce(list, reducer, null);
};


module.exports = {
  MSG
, extern
, required
, notEqual
, isFunction
, isArray
, listOf
};
