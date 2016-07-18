
module.exports = (v) => {
  return {
    read: {
      validate: [ v.isFunction ]
    }
  , sanitize: {
      validate: [ v.isArray ]
    }
  , validate: {
      validate: [ v.isArray ]
    }
  , normalize: {
      validate: [ v.isArray ]
    }
  };
};
