
export default {

  initialize: () => {
    console.log('initialize');
    return (req, res, next) => {
      console.log('initialize called');
      next();
    };
  },

  authenticate: (type, cb) => {
    if(cb) {
      const err = null;
      const user = {}; // TODO: Finish this
      const info = {}; // What is this?
      return cb(err, user, info);
    } else {
      return (req, res, next) => {
        return next();
      };
    }
  },

  use: (/* strategy */) => {
    console.log('use:', arguments.length);
  }
};
