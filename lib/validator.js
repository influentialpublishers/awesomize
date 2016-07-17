
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
const setResult = (key) => _.assocPath([ PROP_VALIDATED, key ])


// nilValidator : Key -> Context -> Promise ValidatedContext
const nilValidator = (key) => (context) => {
  return Bluebird.resolve(setResult(key)(null, context));
};


// runList : Key, Array Validator -> Context -> Promise ValidatedContext
const createMapper = (key, validators) => (context) => {

  const value   = _.path([ PROP_DATA, key ], context);
  const ctx     = [ value, context.data, context.current ];
  const reducer = (result, validator) => {
    return _.isNil(result) ? _.apply(validator, ctx) : result;
  };

  return Bluebird.reduce(validators, reducer, RESULT_INITIAL)

  .then((result) => setResult(key)(result, context));

};


module.exports = { createMapper, nilValidator }
