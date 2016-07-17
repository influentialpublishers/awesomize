
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


// setResult :: Key -> Result, Context -> ValidatedContext
const setResult = _.curry((key, context, result) => {
  return _.assocPath([ PROP_VALIDATED, key ], result, context)
});


// nilValidator : Key -> Context -> Promise ValidatedContext
const nilValidator = _.curry((key, context) => {
  return Bluebird.resolve(setResult(key, context, null));
});


const validatorReducer = (key, context) => {
  const value  = _.path([ PROP_DATA, key ], context);
  const params = [ value, context.data, context.current ]

  return (result, validator) => {
    return _.isNil(result) ? _.apply(validator, params) : result;
  }
};


const validatorListRun = (validators, key) => (context) => {
  const reducer = validatorReducer(key, context);

  return Bluebird.reduce(validators, reducer, RESULT_INITIAL)

  .then(setResult(key, context));
};


// runList : Key, Array Validator -> (Context -> Promise ValidatedContext)
const Mapper = _.curry((config_key, config, context_key) => {

  const validators    = _.prop([ config_key ], config);
  const hasValidators = Array.isArray(validators) && validators.length > 0;

  return _.not(hasValidators) ? nilValidator(context_key) :
    validatorListRun(validators, context_key);

});


module.exports = { Mapper };
