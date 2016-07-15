
const _ = require('ramda');


const ValidationError = require('./error');


const throwValidationError = (message_list) => {
  throw ValidationError(message_list, 'throwValidationError', 'invalid');
}


const withoutValid = _.filter(_.compose(_.not, _.isNil))


const hasErrors = _.compose(
  _.lte(0)
, _.length
, _.keys
, withoutValid
);


const throwErrorIfNotValid = _.when(hasErrors, throwValidationError);


module.exports = {
  throwValidationError : throwValidationError
, withoutValid         : withoutValid
, hasErrors            : hasErrors
, throwErrorIfNotValid : throwErrorIfNotValid
};
