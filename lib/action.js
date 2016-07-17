
const _         = require('ramda');
const Bluebird  = require('bluebird');


const PROP_DATA = 'data';


const nilAction = _.compose(Bluebird.resolve, _.identity);


const updateContext = (key, context) => {
  return _.assocPath([ PROP_DATA, key ], context);
};


const actionReducer = (key) => (context, action) => {

  const value  = _.path([ PROP_DATA, key ], context);
  const params = [ value, context.data, context.current ];

  return Bluebird.resolve(_.apply(action, params))

  .then(updateContext(key, context));
};


const Mapper = _.curry((config_key, config, context_key) => (context) => {

  const actions    = _.prop(config_key, config);
  const hasActions = Array.isArray(actions) && actions.length > 0;

  return _.not(hasActions) ? nilAction :
    Bluebird.reduce(actions, actionReducer(context_key), context);

});


module.exports = { Mapper };
