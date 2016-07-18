
const _         = require('ramda');
const Bluebird  = require('bluebird');
const Check     = require('./lib/check');
const Field     = require('./lib/field');


const actionFold = (ctx, actionList) => {
  return Bluebird.reduce(actionList, _.flip(_.call), ctx);
};


const actionRunner = (ctx, actionPipeline) => {
  return Bluebird.reduce(actionPipeline, actionFold, ctx);
};


const Awesomize = (user_ctx, field_factory) => {
  if (typeof user_ctx !== 'object') {
    throw new TypeError('context parameter (ctx) must be an object');
  }

  if (typeof field_factory !== 'function') {
    throw new TypeError('field_factory parameter must be a function');
  }

  const field_config = field_factory(Check, user_ctx);

  if (!_.is(Object, field_config)) {
    throw new TypeError('field_factory must return an object');
  }

  const actions      = Field.configToActionList(field_config);

  return (request, current) => {
    const ctx = { request, current };

    return actionRunner(ctx, _.values(actions));
  };
};

Awesomize.MSG  = Check.MSG;

module.exports = Awesomize;
