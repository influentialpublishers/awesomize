
const _        = require('ramda');
const Bluebird = require('bluebird');


const PASS = _.always(null);
const FAIL = (msg) => _.always(msg);

const MSG  = {
  REQUIRED           : 'required'
, CANNOT_BE_EQUAL    : 'cannot_be_equal'
, NOT_FUNCTION       : 'not_function'
, NOT_ARRAY          : 'not_array'
, LIST_ITEM_NOT_SPEC : 'list_item_not_spec'
};


const basic = (test, msg) => _.ifElse(test, PASS, FAIL(msg));


const extern = (test, msg) => _.composeP(
  basic(_.equals(true), msg)
, _.when(_.isNil, _.T)
, _.compose(Bluebird.resolve, test)
);


const required = basic(
  _.compose(_.not, _.either(_.isEmpty, _.isNil))
, MSG.REQUIRED
);


const notEqual = (x) => basic(
  _.compose(_.not, _.equals(x))
, MSG.CANNOT_BE_EQUAL
);


const isFunction = basic(_.is(Function), MSG.NOT_FUNCTION);


const isArray = basic(_.is(Array), MSG.NOT_ARRAY);


const listOf  = (check, msg) => (list) => {

  const validator = extern(check, msg || MSG.LIST_ITEM_NOT_SPEC);

  return Bluebird.reduce(list, (result, item) => {

    return result ? result : validator(item);

  }, null);
  
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
