
const _        = require('ramda');
const Bluebird = require('bluebird');


const Task     = require('./task');


const isNotNil = _.compose(_.not, _.isNil);

const throwValidationError = (results) => {
  throw results;
};


const filterForPartialUpdate = (current) => _.when(
  _.always(isNotNil(current))
  , _.filter(_.compose(
      _.not
    , _.equal(undefined)
    , _.head
  ))
);


const excludeValidResults = _.filter(_.compose(_.not, _.isNil))


const hasResults = _.compose(_.lte(0), _.length, _.keys)


const throwErrorIfResults = _.when(hasResults, throwValidationError);



const runTasks = _.compose(
  Bluebird.props
, _.map(_.apply(run))
);


const validate = (request, current) => _.composeP(
  _.always(request)
, throwErrorIfResults
, excludeValidResults
, runTasks
, filterForPartialUpdate
, Task.paramDictFromFieldDict(request, current)
);

module.exports = {
  validate       : validate
}
