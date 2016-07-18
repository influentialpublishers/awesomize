
const _        = require('ramda');
const Bluebird = require('bluebird');

// Mapper : FieldConfig, Key -> Context -> Context
const Mapper = (config_key, config, key) => (context) => {
  const reader  = _.defaultTo(_.prop(key), _.prop(config_key, config));
  const request = _.defaultTo({}, context.request);
  const current = context.current;

  return Bluebird.resolve(reader(request, current))

  .then((value) => _.assocPath([ 'data', key ], value, context));
};


module.exports = { Mapper };
