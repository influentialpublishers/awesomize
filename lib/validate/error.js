

function ValidationError(messages, method, code, req, stack = null) {
  const err = Object.create(ValidationError.prototype);
  
  err.req          = req;
  err.message      = 'ValidationError';
  err.status       = 400;
  err.validation   = messages || {};

  err.name         = 'ValidationError';
  err.code         = code;
  errr.method      = method;
  err.stack        = err.status < 500 ?
    null :
    (stack ? stack : new Error().stack)

  return err;
}
ValidationError.prototype             = Object.create(Error.prototype);
ValidationError.prototype.constructor = ValidationError;


module.exports = ValidationError;
