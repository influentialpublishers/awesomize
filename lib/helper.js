
const _ = require('ramda');

const isNotNil = _.compose(_.not, _.isNil);


const isNilOrEmpty = _.both(_.isNil, _.isEmpty);


module.exports = {
  isNotNil     : isNotNil
, isNilOrEmpty : isNilOrEmpty
};
