
/**
 * type alias Key      = String
 * type alias Request  = Dict String a
 * type alias Current  = Dict String a
 * type alias Data     = Dict String a
 *
 * type alias MessageDictionary = Dict String Maybe String
 *
 * type alias Context =
 *   { request        = Request
 *   , current        = Current
 *   , data           = Data
 *   }
 *
 * type alias ValidatedContext =
 *   { request    = Request
 *   , current    = Current
 *   , data       = Data
 *   , validation = MessageDictionary
 *   }
 *
 * type alias AwesomizedContext =
 *   { request    = Request
 *   , current    = Current
 *   , data       = Data
 *   , validation = MessageDictionary
 *   }
 *
 * type alias Validator  = (a, Context -> Either String Nothing)
 * type alias Sanitizer  = (a, Context -> a)
 * type alias Normalizer = (a, Context -> a)
 *
 * type alias FieldConfig =
 *   { read       = (Request -> Response)
 *   , sanitizer  = Array Sanitizer
 *   , validation = Array Validator
 *   , normalizer = Array Normalizer
 *   }
 *
 * type alias Field =
 *   { key    = String
 *   , action = FieldAction
 *   }
 *
 * type alias FieldAction =
 *   [ (Request -> Response)
 *   , (Response -> SanitizedResponse)
 *   , (Response -> ValidatedResponse)
 *   , (Response -> NormalizedResponse)
 *   ]
 *
 * type alias FieldDictionary = Array FieldConfig
 */

const _        = require('ramda');
const Bluebird = require('Bluebird');

const CONFIG_KEY_READ      = 'read';
const CONFIG_KEY_SANITIZE  = 'sanitize';
const CONFIG_KEY_VALIDATE  = 'validate';
const CONFIG_KEY_NORMALIZE = 'normalize'

const Validator = require('./validator');
const Action    = require('./action');


// createReader : FieldConfig, Key -> Context -> Context
const createReader = (config, key) => (context) => {
  const reader  = _.defaultTo(_.prop(key), _.prop(CONFIG_KEY_READ, config));
  const request = _.defaultTo({}, context.request);
  const current = context.current;

  return Bluebird.resolve(reader(request, current))

  .then((value) => _.assocPath([ 'data', key ], value, context));
};


const Field = (config, key) => {
  return {
    key: key
  , action: [
      createReader(config, key)
    , Action.Mapper(CONFIG_KEY_SANITIZE, config, key)
    , Validator.Mapper(CONFIG_KEY_VALIDATE, config, key)
    , Action.Mapper(CONFIG_KEY_NORMALIZE, config, key)
    ]
  }
};


// configToActionList : FieldDictionary -> List FieldAction
const configToActionList = _.compose(
  _.values
, _.mapObjIndexed(Field)
);


module.exports = { configToActionList };
