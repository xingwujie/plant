
class FakePassport {
  constructor(user) {
    this.user = user;
  }

  getUserId() {
    return this.user._id;
  }

  initialize() {
    // debug('fake fb initialize setup');
    return (req, res, next) => {
      // debug('fake fb initialize called');
      next();
    };
  }

  authenticate(type, cb) {
    if(cb) {
      // debug('fake fb authenticate setup with cb');
      const err = null;
      const info = {};
      return () => {
        // debug('fake fb authenticate called with cb, arg.length:', arguments.length);
        return cb(err, this.user, info);
      };
    } else {
      // debug('fake fb authenticate setup');
      return (req, res, next) => {
        // debug('fake fb authenticate called, arg.length:', arguments.length);
        return next();
      };
    }
  }

  use(/* strategy */) {
    // debug('fake fb use:', arguments.length);
  }
};

module.exports = FakePassport;
