[![Build Status](https://travis-ci.org/influentialpublishers/awesomize.svg?branch=master)](https://travis-ci.org/influentialpublishers/awesomize)
[![Coverage Status](https://coveralls.io/repos/github/influentialpublishers/awesomize/badge.svg?branch=master)](https://coveralls.io/github/influentialpublishers/awesomize?branch=master)
[![Code Climate](https://codeclimate.com/github/influentialpublishers/awesomize/badges/gpa.svg)](https://codeclimate.com/github/influentialpublishers/awesomize)
[![Issue Count](https://codeclimate.com/github/influentialpublishers/awesomize/badges/issue_count.svg)](https://codeclimate.com/github/influentialpublishers/awesomize)

# awesomize
Totally Awesome Validation/Sanitization/Normalization for your app.

## Installation

`npm install awesomize`

## Use

First, require the module.

`const Awesomize = require 'awesomize'`

Then, build your awesomizer function.

```
// Example inputs
const vals = {
  foo: 'foo'
  bar: 'bar'
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

This will return a function that you pass your object of values to.

```
spec(vals);
// this will give back an object with the same keys as the input object,
// and values representing whether or not the validation passed (null if passed)
```

The function given to the Awesomizer will map to the values in the object that it is given. Each validate key is a list, and multiple validation functions can be provided. Each will be run on the given values. If a key is not explicitly required, then it is optional.

The following validation functions are built-in:

```
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
v.listOf(fn, msg)
```

## Misc things

- You can call `Awesomize.Result.hasError` on a result set to see if any of them failed validation.
- You can specify your own functions and place them in the validate lists. If you do make your own function, it must be a function that takes a value and returns either `null` on successful validation, or a string on failed validation.
