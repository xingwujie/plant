import d from 'debug';
const debug = d('plant:test.fake-passport');

export default {

  initialize: () => {
    debug('fake fb initialize setup');
    return (req, res, next) => {
      debug('fake fb initialize called');
      next();
    };
  },

  authenticate: (type, cb) => {
    if(cb) {
      debug('fake fb authenticate called with cb');
      const err = null;
      const user = {}; // TODO: Finish this
      const info = {}; // What is this?
      return cb(err, user, info);
    } else {
      debug('fake fb authenticate setup');
      return (req, res, next) => {
        debug('fake fb authenticate called');
        return next();
      };
    }
  },

  use: (/* strategy */) => {
    debug('fake fb use:', arguments.length);
  }
};
