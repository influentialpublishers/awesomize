
/*eslint-env node, mocha */
const _           = require('ramda');
const expect      = require('chai').expect;
const { inspect } = require('util');


const Check = require('../../lib/check');


describe('awesomize/lib/check', () => {

  describe('::required', () => {

    it('should return null if is a non-zero length string', () => {

      const input = 'foo';
      const actual = Check.required(input);

      expect(actual).to.be.null;

    });

    it('should return required for all nil/empty values', () => {

      const input = [
        '',
        null,
        undefined,
        [],
        {}
      ];

      const test = (test_case) => {
        const actual         = Check.required(test_case);
        const test_case_name = inspect(test_case);

        expect(actual, test_case_name).to.eql(Check.MSG.REQUIRED);
      };

      _.map(test, input);

    });

  });


  describe('::requireArray', () => {

    it('should return null if it is an array', () => {

      const input = [];
      const actual = Check.requireArray(input);

      expect(actual).to.be.null;

    });

    it('should return requireArray for all other non-array type', () => {

      const input = [
        '',
        null,
        undefined,
        {},
        () => { },
        1
      ];

      const test = (test_case) => {
        const actual         = Check.requireArray(test_case);
        const test_case_name = inspect(test_case);

        expect(actual, test_case_name).to.eql(Check.MSG.REQUIRE_ARRAY);
      };

      _.map(test, input);

    });

  });


  describe('::isInt', () => {

    it('should return MSG.NOT_INT if the value given is not an integer',
    () => {

      const actual = Check.isInt('foo');
      expect(actual).to.eql(Check.MSG.NOT_INT);

    });


    it('should return null if the value given is an integer',
    () => {

      const actual = Check.isInt('123');
      expect(actual).to.be.null;

    });

  });

  describe('::notEqual', () => {

    it('should return MSG.CANNOT_BE_EQUAL if the values are equal', () => {

      const input  = 'foo';
      const actual = Check.notEqual('foo')(input);

      expect(actual).to.eql(Check.MSG.CANNOT_BE_EQUAL);

    });

    it('should return null if the values are not equal', () => {

      const input = 'foo';
      const actual = Check.notEqual('bar')(input);

      expect(actual).to.be.null;

    });

  });

  describe('::notNullable', () => {

    it(`should return null if value and current[key] are not null`, () => {

        const current = { foo : 'bar' }
        const input   = 1;
        const actual = Check.notNullable(input,{},current,'foo')

        expect(actual).to.be.null;

      });

    it(`should return Check.MSG.NOT_NULLABLE if either value or current[key] is
      null`, () => {

        const current     = { foo : 'bar' }
        const nullCurrent = { foo : null }
        const input       = 1
        const nullInput   = null

        const TF = Check.notNullable(input, {}, nullCurrent, 'foo')
        expect(TF).to.eql(Check.MSG.NOT_NULLABLE);

        const FT = Check.notNullable(nullInput, {}, current, 'foo')
        expect(FT).to.eql(Check.MSG.NOT_NULLABLE);

        const FF = Check.notNullable(nullInput, {}, nullCurrent, 'foo')
        expect(FF).to.eql(Check.MSG.NOT_NULLABLE);

      });

  });

  describe('::immutable', () => {

    it(`should return null if value and current[key] are equal`, () => {

        const current = { foo : 'bar' }
        const input   = 'bar';
        const actual = Check.immutable(input,{},current,'foo')

        expect(actual).to.be.null;

      });

    it(`should return Check.MSG.IMMUTABLE if value and current[key] are not
      equal`, () => {

        const current = { foo : 'bar' }
        const input   = 'buzz';
        const actual = Check.immutable(input,{},current,'foo')

        expect(actual).to.eql(Check.MSG.IMMUTABLE);

      });

  });

  describe('::reqIfHasAny', () => {

    it(`should return null if value is truthy and any of the specified
      request[key] are truthy`, () => {

        const requestTTF = { foo : 'bar', fizz : 'buzz', waldo : null  }
        const requestTFT = { foo : 'bar', fizz : null , waldo : 'fred' }
        const requestTTT = { foo : 'bar', fizz : 'buzz' , waldo : 'fred' }
        const input     = 'bar';

        const TTF = Check.reqIfHasAny(['fizz', 'waldo'])(input, requestTTF)
        expect(TTF).to.be.null;

        const TFT = Check.reqIfHasAny(['fizz', 'waldo'])(input, requestTFT)
        expect(TFT).to.be.null;

        const TTT = Check.reqIfHasAny(['fizz', 'waldo'])(input, requestTTT)
        expect(TTT).to.be.null;

      });

    it(`should return null if value is truthy and none of the specified
      request[key] are truthy`, () => {

        const requestTFF = { foo : 'bar', fizz : null, waldo : null  }
        const input     = 'bar';

        const TFF = Check.reqIfHasAny(['fizz', 'waldo'])(input, requestTFF)
        expect(TFF).to.be.null;

      });

    it(`should return Check.MSG.REQUIRED if value is falsey and any of the
      specified request[key] are truthy`, () => {

        const requestFTF = { foo : null , fizz : 'buzz', waldo : null  }
        const requestFFT = { foo : null , fizz : null , waldo : 'fred' }
        const requestFTT = { foo : null , fizz : 'buzz' , waldo : 'fred' }
        const input      = null;

        const FTF = Check.reqIfHasAny(['fizz', 'waldo'])(input, requestFTF)
        expect(FTF).to.eql(Check.MSG.REQUIRED);

        const FFT = Check.reqIfHasAny(['fizz', 'waldo'])(input, requestFFT)
        expect(FFT).to.eql(Check.MSG.REQUIRED);

        const FTT = Check.reqIfHasAny(['fizz', 'waldo'])(input, requestFTT)
        expect(FTT).to.eql(Check.MSG.REQUIRED);

      });

    it(`should return null if value is falsey and none of the specified
      request[key] are truthy`, () => {

        const requestFFF = { foo : null , fizz : null, waldo : null  }
        const input      = null;

        const FFF = Check.reqIfHasAny(['fizz', 'waldo'])(input, requestFFF)
        expect(FFF).to.be.null;

      });

  });

  describe('::reqIfHasAll', () => {

    it(`should return null if value is truthy and all of the specified
      request[key] are truthy`, () => {

        const requestTTT = { foo : 'bar', fizz : 'buzz', waldo : 'fred'  }
        const input     = 'bar';

        const TTT = Check.reqIfHasAll(['fizz', 'waldo'])(input, requestTTT)
        expect(TTT).to.be.null;

      });

    it(`should return null if value is truthy and not all of the specified
      request[key] are truthy`, () => {

        const requestTTF = { foo : 'bar' , fizz : 'buzz', waldo : null  }
        const requestTFT = { foo : 'bar' , fizz : null , waldo : 'fred' }
        const requestTFF = { foo : 'bar' , fizz : null , waldo : null }
        const input      = 'bar';

        const TTF = Check.reqIfHasAll(['fizz', 'waldo'])(input, requestTTF)
        expect(TTF).to.be.null;

        const TFT = Check.reqIfHasAll(['fizz', 'waldo'])(input, requestTFT)
        expect(TFT).to.be.null;

        const TFF = Check.reqIfHasAll(['fizz', 'waldo'])(input, requestTFF)
        expect(TFF).to.be.null;

      });

    it(`should return Check.MSG.REQUIRED if value is falsey and all of the
      specified request[key] are truthy`, () => {

        const requestFTT = { foo : null , fizz : 'buzz' , waldo : 'fred' }
        const input      = null;

        const FTT = Check.reqIfHasAll(['fizz', 'waldo'])(input, requestFTT)
        expect(FTT).to.eql(Check.MSG.REQUIRED);

      });

    it(`should return null if value is falsey and not all of the specified
      request[key] are truthy`, () => {

        const requestFTF = { foo : null , fizz : 'buzz', waldo : null  }
        const requestFFT = { foo : null , fizz : null , waldo : 'fred' }
        const requestFFF = { foo : null , fizz : null , waldo : null }
        const input      = null;

        const FTF = Check.reqIfHasAll(['fizz', 'waldo'])(input, requestFTF)
        expect(FTF).to.be.null;

        const FFT = Check.reqIfHasAll(['fizz', 'waldo'])(input, requestFFT)
        expect(FFT).to.be.null;

        const FFF = Check.reqIfHasAll(['fizz', 'waldo'])(input, requestFFF)
        expect(FFF).to.be.null;

      });

  });

  describe('::notReqIfHasAny', () => {

    it(`should return null if value is truthy and none of the specified
      request[key] are truthy`, () => {

        const requestTFF = { foo : 'bar', fizz : null, waldo : null  }
        const input     = 'bar';

        const TFF = Check.notReqIfHasAny(['fizz', 'waldo'])(input, requestTFF)
        expect(TFF).to.be.null;

      });

    it(`should return null if value is truthy and any of the specified
      request[key] are truthy`, () => {

        const requestTTF = { foo : 'bar' , fizz : 'buzz', waldo : null  }
        const requestTFT = { foo : 'bar' , fizz : null , waldo : 'fred' }
        const requestTTT = { foo : 'bar' , fizz : 'buzz' , waldo : 'fred' }
        const input      = 'bar';

        const TTF = Check.notReqIfHasAny(['fizz', 'waldo'])(input, requestTTF)
        expect(TTF).to.be.null;

        const TFT = Check.notReqIfHasAny(['fizz', 'waldo'])(input, requestTFT)
        expect(TFT).to.be.null;

        const TTT = Check.notReqIfHasAny(['fizz', 'waldo'])(input, requestTTT)
        expect(TTT).to.be.null;

      });

    it(`should return Check.MSG.REQUIRED if value is falsey and none of the
      specified request[key] are truthy`, () => {

        const requestFFF = { foo : null , fizz : null , waldo : null }
        const input      = null;

        const FFF = Check.notReqIfHasAny(['fizz', 'waldo'])(input, requestFFF)
        expect(FFF).to.eql(Check.MSG.REQUIRED);

      });

    it(`should return null if value is falsey and any of the specified
      request[key] are truthy`, () => {

        const requestFTF = { foo : null , fizz : 'buzz', waldo : null  }
        const requestFFT = { foo : null , fizz : null , waldo : 'fred' }
        const requestFTT = { foo : null , fizz : 'buzz' , waldo : 'fred' }
        const input      = null;

        const FTF = Check.notReqIfHasAny(['fizz', 'waldo'])(input, requestFTF)
        expect(FTF).to.be.null;

        const FFT = Check.notReqIfHasAny(['fizz', 'waldo'])(input, requestFFT)
        expect(FFT).to.be.null;

        const FTT = Check.notReqIfHasAny(['fizz', 'waldo'])(input, requestFTT)
        expect(FTT).to.be.null;

      });

  });

  describe('::notReqIfHasAll', () => {

    it(`should return null if value is truthy and not all of the specified
      request[key] are truthy`, () => {

        const requestTTF = { foo : 'bar', fizz : 'buzz', waldo : null  }
        const requestTFT = { foo : 'bar', fizz : null , waldo : 'fred' }
        const requestTFF = { foo : 'bar', fizz : null , waldo : null }
        const input     = 'bar';

        const TTF = Check.notReqIfHasAll(['fizz', 'waldo'])(input, requestTTF)
        expect(TTF).to.be.null;

        const TFT = Check.notReqIfHasAll(['fizz', 'waldo'])(input, requestTFT)
        expect(TFT).to.be.null;

        const TFF = Check.notReqIfHasAll(['fizz', 'waldo'])(input, requestTFF)
        expect(TFF).to.be.null;

      });

    it(`should return null if value is truthy and all of the specified
      request[key] are truthy`, () => {

        const requestTTT = { foo : 'bar', fizz : 'buzz', waldo : 'fred'  }
        const input      = 'bar';

        const TTT = Check.notReqIfHasAll(['fizz', 'waldo'])(input, requestTTT)
        expect(TTT).to.be.null;

      });

    it(`should return Check.MSG.REQUIRED if value is falsey and not all of the
      specified request[key] are truthy`, () => {

        const requestFTF = { foo : null , fizz : 'buzz', waldo : null  }
        const requestFFT = { foo : null , fizz : null , waldo : 'fred' }
        const requestFFF = { foo : null , fizz : null , waldo : null }
        const input      = null;

        const FTF = Check.notReqIfHasAll(['fizz', 'waldo'])(input, requestFTF)
        expect(FTF).to.eql(Check.MSG.REQUIRED);

        const FFT = Check.notReqIfHasAll(['fizz', 'waldo'])(input, requestFFT)
        expect(FFT).to.eql(Check.MSG.REQUIRED);

        const FFF = Check.notReqIfHasAll(['fizz', 'waldo'])(input, requestFFF)
        expect(FFF).to.eql(Check.MSG.REQUIRED);

      });

    it(`should return null if value is falsey and all of the specified
      request[key] are truthy`, () => {

        const requestFTT = { foo : null , fizz : 'buzz' , waldo : 'fred' }
        const input      = null;

        const FTT = Check.notReqIfHasAll(['fizz', 'waldo'])(input, requestFTT)
        expect(FTT).to.be.null;

      });

  });


  describe('::isString', function() {

    it('should return null if the given value is a string', function() {

      const strings = [
        'foo', "bar", `baz`, ``, '', ""
      ];


      const actual = _.compose(
        _.all(_.isNil)
      , _.map(Check.isString)
      )(strings);

      expect(actual).to.be.true;

    });


    it('should return "not_string" if the given value is not a string',
    function() {

      const strings = [
        () => {}, null, {}, undefined, 123, [ "foo" ], 123.4
      ];


      const actual = _.compose(
        _.all(_.equals('not_string'))
      , _.map(Check.isString)
      )(strings);

      expect(actual).to.be.true;

    });

  });

  describe('::isLength', () => {

    it(`should return null if value.length is inclusively within range`, () => {
      const min_edge     = 2;
      const max_edge     = 5;
      const min_non_edge = 1;
      const max_non_edge = 6;
      const input        = 'abcde';

      const edge     = Check.isLength(min_edge, max_edge)(input)
      const non_edge = Check.isLength(min_non_edge, max_non_edge)(input)

      expect(edge).to.be.null
      expect(non_edge).to.be.null
    });

    it(`should return null if value is empty string`, () => {
      const min = 0;
      const max = 0;
      const input     = '';

      const actual = Check.isLength(min, max)(input);

      expect(actual).to.be.null
    });

    it(`should return Check.MSG.NOT_IN_RANGE if value.length is outise of given
      bounds`, () => {
        const min = 2;
        const max = 5;

        const input_lt_edge = 'a';
        const input_lt      = '';
        const input_gt_edge = 'abcdef';
        const input_gt      = 'abcdefghi';

        const test = Check.isLength(min, max);

        const actual_lt_edge = test(input_lt_edge);
        const actual_lt      = test(input_lt);
        const actual_gt_edge = test(input_gt_edge);
        const actual_gt      = test(input_gt);

        expect(actual_lt_edge).to.be.eql(Check.MSG.NOT_IN_RANGE);
        expect(actual_lt).to.be.eql(Check.MSG.NOT_IN_RANGE);
        expect(actual_gt_edge).to.be.eql(Check.MSG.NOT_IN_RANGE);
        expect(actual_gt).to.be.eql(Check.MSG.NOT_IN_RANGE);
      });

  });

  describe('::isIn', () => {

    it('should return null if value is in the given array', () => {

      const options = ['a','b','c','d','e'];

      const test = Check.isIn(options)

      const results = _.map(test, options)

      expect(_.all(_.equals(null), results)).to.be.true
    });


    it('should return Checl.MSG.NOT_IN if value not in options array', () => {

      const options = ['a','b','c','d','e'];

      const inputs = ['z','y','x','w','v'];

      const test = Check.isIn(options)

      const results = _.map(test, inputs)

      expect(_.all(_.equals(Check.MSG.NOT_IN), results)).to.be.true
    })

  });

  describe('::isBool', () => {

    it('should return null if passed a boolean value', () => {

      const inputs = [0,1,'0','1',true,false]

      const test = Check.isBool

      const results = _.map(test, inputs)

      expect(_.all(_.equals(null), results)).to.be.true
    });

    it('should return Check.MSG.NOT_BOOL if passed invalid value', () => {

      const inputs = [-1,2,'-1','2',null,undefined,'asdf']

      const test = Check.isBool

      const results = _.map(test, inputs)

      expect(_.all(_.equals(Check.MSG.NOT_BOOL), results)).to.be.true

    });

  });

  describe('::isInRangeInclusive', () => {

    it('should return null if value in range', () => {

      const min = 2;
      const max = 8;

      const inputs = [2,3,4,5,6,7,8];
      const inputs_str = ['2','3','4','5','6','7','8'];

      const test = Check.isInRangeInclusive(min, max);

      const results = _.map(test, inputs);
      const results_str = _.map(test, inputs);

      expect(_.all(_.equals(null), results)).to.be.true
      expect(_.all(_.equals(null), results_str)).to.be.true
    });

    it('should return Check.MSG.NOT_IN_RANGE', () => {

      const min = 2;
      const max = 8;

      const inputs = [0,1,9,10,'0','1','9','10',null,undefined,'asdf'];

      const test = Check.isInRangeInclusive(min, max);

      const results = _.map(test, inputs);

      expect(_.all(_.equals(Check.MSG.NOT_IN_RANGE), results)).to.be.true
    });
  });

  describe('::defined', () => {

    it('should return Check.MSG.REQUIRED if value is undefined', () => {

      const input = undefined

      const actual  = Check.defined(input)

      expect(actual).to.eql(Check.MSG.REQUIRED)

    });

    it('should return null if values are defined', () => {

      const inputs = [-1,2,'-1','2',null,'asdf']

      const test = Check.defined

      const results = _.map(test, inputs)

      expect(_.all(_.equals(null), results)).to.be.true

    });

  });

  describe('::min', () => {

    it(`should return Check.MSG.MINIMUM_NOT_MET if value is value is not equal
      or greater than minimum`, () => {

        const min = 0

        const input = -1

        const actual  = Check.min(min, input)

        expect(actual).to.eql(Check.MSG.MINIMUM_NOT_MET)

    });

    it('should return null if value is equal to the minimum value', () => {

      const min = 0

      const input = 0

      const actual  = Check.min(min, input)

      expect(actual).to.be.null

    });

    it(`should return null if value is equal greater than the minimum value
      `, () => {

        const min = 0

        const input = 1

        const actual  = Check.min(min, input)

        expect(actual).to.be.null

    });

  });

  describe('::isValidEmail', () => {

    it('should return Check.MSG.INVALID_EMAIL if email is invalid', () => {

      const email = 'tester@'

      const actual = Check.isValidEmail(email)

      expect(actual).to.eql(Check.MSG.INVALID_EMAIL)

    });

    it('should return null if email is valid', () => {

      const email = 'tester@mail.com'

      const actual = Check.isValidEmail(email)

      expect(actual).to.be.null

    })
  })

});
