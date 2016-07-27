
const _ = require('ramda');

const isNotNil = _.compose(_.not, _.isNil);


const isNilOrEmpty = _.both(_.isNil, _.isEmpty);

const isNotEmpty = _.compose(_.not, _.isEmpty);

const notAnArray = _.compose(_.not, Array.isArray)

// http://goo.gl/a2lSWH
const alwaysArray = _.compose(
  _.when(notAnArray, _.of)
, _.defaultTo([])
);


module.exports = {
  isNotNil
, isNilOrEmpty
, alwaysArray
, isNotEmpty
};
