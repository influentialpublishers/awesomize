[![Build Status](https://travis-ci.org/influentialpublishers/awesomize.svg?branch=master)](https://travis-ci.org/influentialpublishers/awesomize)
[![Coverage Status](https://coveralls.io/repos/github/influentialpublishers/awesomize/badge.svg?branch=master)](https://coveralls.io/github/influentialpublishers/awesomize?branch=master)
[![codecov](https://codecov.io/gh/influentialpublishers/awesomize/branch/master/graph/badge.svg)](https://codecov.io/gh/influentialpublishers/awesomize)
[![Code Climate](https://codeclimate.com/github/influentialpublishers/awesomize/badges/gpa.svg)](https://codeclimate.com/github/influentialpublishers/awesomize)
[![Issue Count](https://codeclimate.com/github/influentialpublishers/awesomize/badges/issue_count.svg)](https://codeclimate.com/github/influentialpublishers/awesomize)
[![npm version](https://badge.fury.io/js/awesomize.svg)](https://badge.fury.io/js/awesomize)

# awesomize
Totally Awesome Validation/Sanitization/Normalization for your app.

## Installation

`npm install awesomize`

## `Awesomize`

First, require the module.

`const Awesomize = require 'awesomize'`

Then, build your awesomizer function.

```javascript
// Example inputs
const vals = {
  foo: 'foo'
, bar: 'bar'
};

// Your validator spec
const spec = Awesomize({}, (v) => {
  return {
    foo: {
      validate: [ v.required ]
    }
  , bar: {
      validate: [ v.required ]
    }
  }
});
```

This will return a function that you pass your object of values to, which then in turn returns a promise.

The function given to the Awesomizer will map to the values in the object that it is given. Each validate key is a list, and multiple validation functions can be provided. Each will be run on the associated values. If a key is not explicitly required, then it is optional.

## Sanitizers and Normalizers

In addition to simple validation, Awesomize allows you to add sanitization and normalization. Sanitization occurs before checking validation, and normalization occurs after.  Here we'll use Ramda for some example functions.

```javascript
const _ = require 'ramda'

const spec = Awesomize({}, (v) => {
  return {
    foo: {
      // Sanitize -> validate -> normalize
      sanitize: [ _.toLower ]
    , validate: [ v.required ]
    , normalize: [ _.toUpper ]
    }
  }  
})
```

## `Awesomize.dataOrError`

`Awesomize.dataOrError` works similarly to `Awesomize`, but allows you to pass an error function before the validation function. With this function, in the event that any of the validation fails, it throws the provided error function.

```javascript
const spec = Awesomize.dataOrError(errorFn)({}, (v) => {
  return {
    // validators
    ...
  }
});
```

## `read`

When included along-side validation, `read` allows you to form more complex information for the validator to check. the functions in `read` have access to the entire object passed to the Awesomize function.

```javascript
const _ = require 'ramda'

// gets the value at req.bar.baz and adds 1 to it.
const addOneToPath = _.compose(
    _.inc
  , _.path(['bar', 'baz'])
  );

const isTwo = (val) => { val === 2 };

const spec = Awesomize({}, (v) => {
  return {
    foo: {
      read: [ addOneToPath ]
    , validate: [ isTwo ]
    }
  }  
});
```

## Built-in validators

The following validation functions are built-in:

```javascript
// required
v.required

// not equal to (x)
v.notEqual(x)

// is array
v.isArray

// is function
v.isFunction

// is a list of (checkFn)
// Takes a function that returns a boolean and an optional message
v.listOf({(a) -> bool}, msg)
```

## Misc things

- You can call `Awesomize.Result.hasError` on a result set to see if any of them failed validation.
- You can specify your own functions and place them in the validate lists. If you do make your own function, it must be a function that takes a value and returns either `null` on successful validation, or a string on failed validation.
