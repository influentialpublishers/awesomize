
const _                 = require('ramda');
const Check             = require('./lib/check');
const Field             = require('./lib/field');
const Action            = require('./lib/action');

const MSG_USER_CTX      = 'context parameter (ctx) must be an object';
const MSG_FIELD_FACTORY = 'field_factory parameter must be a function';
const MSG_FIELD_CONFIG  = 'field_factory must return an object';


const checkParam = (test, msg) =>
  _.unless(test, () => { throw new TypeError(msg) });


const parseActions = (user_ctx, field_factory) => _.compose(
  _.values
, Field.configToActionList
, checkParam(_.is(Object), MSG_FIELD_CONFIG)
, field_factory
)(Check, user_ctx)


const Awesomize = (user_ctx, field_factory) => {
  checkParam(_.is(Object), MSG_USER_CTX)(user_ctx)
  checkParam(_.is(Function), MSG_FIELD_FACTORY)(field_factory);

  const actions = parseActions(user_ctx, field_factory);

  return (request, current) => Action.Runner({ request, current }, actions);
};

Awesomize.MSG  = Check.MSG;

module.exports = Awesomize;
