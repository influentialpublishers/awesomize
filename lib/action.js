
const _         = require('ramda');
const Bluebird  = require('bluebird');


const PROP_DATA = 'data';


const nilAction = _.compose(Bluebird.resolve, _.identity);


const updateContext = _.curry((key, context) => (result) => {
  return _.assocPath([ PROP_DATA, key ], result, context);
});


const actionReducer = (key) => (context, action) => {

  const value  = _.path([ PROP_DATA, key ], context);
  const params = [ value, context.data, context.current ];

  return Bluebird.resolve(_.apply(action, params))

  .then(updateContext(key, context));
};


const Mapper = _.curry((config_key, config, context_key) => {

  const actions    = _.prop(config_key, config);
  const hasActions = Array.isArray(actions) && actions.length > 0;


  return (context) => _.not(hasActions) ? nilAction(context) :
    Bluebird.reduce(actions, actionReducer(context_key), context);

});


const actionFold = (ctx, actionList) => {
  return Bluebird.reduce(actionList, _.flip(_.call), ctx);
};


const Runner = (ctx, actionPipeline) => {
  return Bluebird.reduce(actionPipeline, actionFold, ctx);
};


module.exports = { Mapper, Runner };
