
/**
 * type alias Request  = Dict String a
 * type alias Current  = Dict String a
 * type alias Data     = Dict String a
 *
 * type alias MessageDictionary = Dict String Maybe String
 *
 * type alias Response = 
 *   { data    = Data
 *   , current = Current
 *   }
 *
 * type alias SanitizedResponse =
 *   { data          = Data
 *   , current       = Current
 *   , not_sanitized = Data
 *   }
 *
 * type alias ValidatedResponse =
 *   { data          = Data
 *   , current       = Current
 *   , validation    = MessageDictionary
 *   }
 * 
 * type alias NormalizedResponse =
 *   { data           = Data
 *   , current        = Current
 *   , not_normalized = Data
 *   }
 *
 * type alias AwesomizedResponse =
 *   { data           = Data
 *   , current        = Current
 *   , not_sanitized  = Data
 *   , not_normalized = Data
 *   , validation     = MessageDictionary
 *   } 
 *
 * type alias Context =
 *   { request = Request
 *   , current = Current
 *   }
 *
 * type alias Validator  = (a, Context -> Either String Nothing)
 * type alias Sanitizer  = (a, Context -> a)
 * type alias Normalizer = (a, Context -> a)
 *
 * type alias FieldConfig =
 *   { key        = String
 *   , read       = (Request -> Response)
 *   , sanitizer  = Array Sanitizer
 *   , validation = Array Validator
 *   , normalizer = Array Normalizer
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

const _ = require('ramda');


const emptyAction = (key) => [
  _.prop(key)
, _.identity
, _.always(null)
, _.identity
];


// configToAction : FieldConfig -> FieldAction
const configToAction = (config) => emptyAction(config.key);


// configAndKeyToAction : FieldConfig, String -> FieldAction
const _configAndKeyToAction = (config, key) => {
  return configToAction(_.assoc('key', key, config));
}
 
// configToActionList : FieldDictionary -> List FieldAction
const configToActionList = _.compose(
  _.values
, _.mapObjIndexed(_configAndKeyToAction)
);


module.exports = {
  configToAction     : configToAction
, configToActionList : configToActionList
};
