
const _        = require('ramda');
const Bluebird = require('Bluebird');


const { isNilOrEmpty } = require('../helper');


/**
 * type alias Value = Scalar
 * type alias Target = Object
 * type alias Current = Object
 * type alias Context =
 *   { value : Value
 *   , target: Target
 *   , current: Current
 *   }
 *
 *  type alias TestPass = Nothing
 *
 *  type alias TestResult = Either String TestPass
 *
 *  type alias Test = (Value, Target, Current) -> TestResult
 */


// throwErrorIfNotFunction :: Test -> Test : throws TypeError
const throwErrorIfNotFunction = _.when(
  _.compose(_.not, _.is(Function))
, () => { throw new TypeError('InvalidTest') }
);


// shouldRunTest :: Context -> Test -> Bool
const shouldRunTest = _.curry((ctx, test) => _.either(
  isNilOrEmpty(ctx.value), _.prop('always_run', test)
));


// runTest :: Context -> Test -> TestResult
const runTest = _.curry((ctx, test) => {
  return test(ctx.value, ctx.target, ctx.current);
});


// returnSuccess :: TestPass
const returnSuccess = _.always(null);


// run :: Context -> TestResult : throws TypeError
const runSingle = (ctx) => _.compose(
  _.ifElse(shouldRunTest(ctx), runTest(ctx), returnSuccess)
, throwErrorIfNotFunction
);
 

// This will run tests in series and bail out on the first failure.
// runList :: Context -> Array Test -> TestResult : throws TypeError
const runList = _.curry((ctx, tests) => {

  const runIfNotResponse = (response, test) => {
    return response ? response : runSingle(ctx)(test);
  }

  return Bluebird.reduce(tests, runIfNotResponse, null);
});


module.exports = {
  runSingle : runSingle
, runList   : runList
};
