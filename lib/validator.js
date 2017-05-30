
/**
 * type alias Value    = Scalar
 * type alias Request  = Object
 * type alias Current  = Dict String Any
 * type alias Data     = Dict String Any
 *
 * type alias ValidatorContext = ( Value, Request, Current )
 *
 * type alias ValidatedContext =
 *   { request   = Request
 *   , current   = Current
 *   , data      = Data
 *   , validated = MessageDictionary
 *   }
 */
const _              = require('ramda');
const Bluebird       = require('bluebird');

const PROP_DATA      = 'data';
const PROP_VALIDATED = 'validated';

const RESULT_INITIAL = null


const throwIfNotFunction = (key) => _.when(
  _.compose(_.not, _.is(Function))
, () => { throw new TypeError(`Invalid validation test for key: <${key}>`) }
);


// setResult :: Key -> Result, Context -> ValidatedContext
const setResult = _.curry((key, context, result) =>
  _.assocPath([ PROP_VALIDATED, key ], result, context)
);


// nilValidator : Key -> Context -> Promise ValidatedContext
const nilValidator = _.curry((key, context) =>
  Bluebird.resolve(setResult(key, context, null))
);


const shouldRun = (validator, value) => _.or(
  _.compose(_.not, _.either(_.equals(undefined), _.equals(null)))(value)
, _.prop('always_run', validator)
);


const run = (validator, params) => {
  if (shouldRun(validator, _.head(params))) {
    return _.apply(validator, params);
  }
  return null;
};


const validatorReducer = (key, context) => {
  const value  = _.path([ PROP_DATA, key ], context);
  const params = [ value, context.data, context.current, key ]

  return (result, validator) => {
    return _.isNil(result) ? run(validator, params) : result;
  }
};


const validatorListRun = (validators, key) => {

  _.map(throwIfNotFunction(key), validators);

  return (context) => {
    const reducer = validatorReducer(key, context);

    return Bluebird.reduce(validators, reducer, RESULT_INITIAL)

    .then(setResult(key, context));
  }
};


// runList : Key, Array Validator -> (Context -> Promise ValidatedContext)
const Mapper = _.curry((config_key, config, context_key) => {

  const validators    = _.prop([ config_key ], config);
  const hasValidators = Array.isArray(validators) && validators.length > 0;

  return _.not(hasValidators) ? nilValidator(context_key) :
    validatorListRun(validators, context_key);

});


module.exports = { Mapper };
