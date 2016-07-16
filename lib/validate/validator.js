
const _ = require('ramda');


const PASS = _.always(null);
const FAIL = (msg) => _.always(msg);

const MSG  = {
  REQUIRED : 'required'
};


const basic = (test, msg) => _.ifElse(test, PASS, FAIL(msg));


const required = basic(
  _.compose(_.not, _.either(_.isEmpty, _.isNil))
, MSG.REQUIRED
);


module.exports = {
  MSG      : MSG
, required : required
};
