

const Awesomize = (ctx, field_factory) => {
  if (typeof ctx !== 'object') {
    throw new TypeError('context parameter (ctx) must be an object');
  }

  if (typeof field_factory !== 'function') {
    throw new TypeError('field_factory parameter must be a function');
  }
  
};

module.exports = Awesomize;
