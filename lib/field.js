
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
 *   , validation     = MessageDictionary
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
 *   [ (Request -> Response)
 *   , (Response -> SanitizedResponse)
 *   , (Response -> ValidatedResponse)
 *   , (Response -> NormalizedResponse)
 *   ]
 *
 * type alias FieldDictionary = Dictionary String FieldConfig
 */

const _           = require('ramda');
const PropsCheck  = require('props-check')

const CONFIG_KEY_READ      = 'read';
const CONFIG_KEY_SANITIZE  = 'sanitize';
const CONFIG_KEY_VALIDATE  = 'validate';
const CONFIG_KEY_NORMALIZE = 'normalize'

const SPEC = {
  read      : 'Function'
, sanitize  : '[Function]'
, validate  : '[Function]'
, normalize : '[Function]'
};

const Reader    = require('./reader');
const Validator = require('./validator');
const Action    = require('./action');
const Helper    = require('./helper');


const throwPropsCheckError = (config) => {
  throw new Error(PropsCheck.human(SPEC, config))
}


// checkProps : FieldConfig -> Maybe Error
const checkProps = (config) => { return _.compose(
    _.when(_.any(Helper.isNotEmpty), throwPropsCheckError.bind(null, config))
    , _.values
    , PropsCheck(SPEC, _.__)
  )(config)
}


// Field : FieldConfig, Key -> Field
const Field = (config, key) => {

  checkProps(config)

  return [
    Reader.Mapper(CONFIG_KEY_READ, config, key)
  , Action.Mapper(CONFIG_KEY_SANITIZE, config, key)
  , Validator.Mapper(CONFIG_KEY_VALIDATE, config, key)
  , Action.Mapper(CONFIG_KEY_NORMALIZE, config, key)
  ];

}


// configToActionList : FieldDictionary -> List Field
const configToActionList = _.mapObjIndexed(Field);


module.exports = { configToActionList };
