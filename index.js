
const _         = require('ramda');
const Check     = require('./lib/check');


const Awesomize = (user_ctx, field_factory) => {
  if (typeof user_ctx !== 'object') {
    throw new TypeError('context parameter (ctx) must be an object');
  }

  if (typeof field_factory !== 'function') {
    throw new TypeError('field_factory parameter must be a function');
  }

  const fields = field_factory(Check, user_ctx);

  if (!_.is(Object, fields)) {
    throw new TypeError('field_factory must return an object');
  }

  return (request, current) => {
    const ctx = {
      request: request
    , current: current
    };
    const results = _.compose(

      _.mapObjIndexed((field, key) => {

      })
    )(request);

    console.log(results);

  };
};

Awesomize.MSG  = Check.MSG;

module.exports = Awesomize;
