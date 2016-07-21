
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

        const requestTFF = { foo : 'bar', fizz : 'buzz', waldo : null  }
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
        const input      = null;
        
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
        const requestTTT = { foo : 'bar' , fizz : null , waldo : null }
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

});
