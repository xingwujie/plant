import BaseDB from './base-db';
import d from 'debug';

const debug = d('plant:user-db');

class User extends BaseDB {

  constructor() {
    super();
  }

  findOrCreateUser(userDetails, cb) {

    super.getDb((err, db) => {
      this.getUserByEmail(db, userDetails.email, (err2, user) => {
        if(err2) {
          return cb(err2);
        }

        if(user) {
          return cb(null, user);
        }

        userDetails.type = 'user';
        db.insert(userDetails, function(err3, body /*, header*/) {
          if (err3) {
            debug('Error findOrCreateUser:', err3.message);
            return cb(err3);
          }

          debug('User inserted:', body);
          return cb(null, body);
        });
      });
    });

  }

  // TODO: What if user has changed their email address?
  // Find by email is good if we want to link multiple social accounts together.
  // We can do find by facebook id if Facebook is the only way to login. This
  // would solve the problem in the short term.
  getUserByEmail(db, email, cb) {

    const selector = {
      selector: {
        type: 'user',
        email: email
      }
    };

    db.find(selector, (err, result) => {
      if (err) {
        debug('db.find error:', err);
        return cb(err);
      }

      debug('Found %d documents with email %s', result.docs.length, email);
      for (var i = 0; i < result.docs.length; i++) {
        debug('  Doc:', result.docs[i]);
      }

      return cb(err, result.docs.length > 0 ? result.docs[0] : null);

    });

  }

};

export default User;
