
const _ = require('ramda');


const PASS = _.always(null);
const FAIL = (msg) => _.always(msg);

const MSG  = {
  REQUIRED        : 'required'
, CANNOT_BE_EQUAL : 'cannot_be_equal'
};


const basic = (test, msg) => _.ifElse(test, PASS, FAIL(msg));


const required = basic(
  _.compose(_.not, _.either(_.isEmpty, _.isNil))
, MSG.REQUIRED
);


const notEqual = (x) => basic(
  _.compose(_.not, _.equals(x))
, MSG.CANNOT_BE_EQUAL
);


module.exports = {
  MSG
, required
, notEqual
};
