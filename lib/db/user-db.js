import * as BaseDB from './base-db';
import d from 'debug';

const debug = d('plant:user-db');

export class User extends BaseDB.BaseDB {

  constructor() {
    super();
  }

  findOrCreateUser(userDetails, cb) {

    super.getDb((err, db) => {
      if(err) {
        return cb(err);
      }

      this.getUserByEmail(db, userDetails.email, (err2, user) => {
        if(err2) {
          debug('getUserByEmail error:', err2);
          return cb(err2);
        }

        if(user) {
          return cb(null, user);
        }

        userDetails.type = 'user';
        debug('inserting user:', userDetails);
        db.insert(userDetails, function(err3, body /*, header*/) {
          if (err3) {
            debug('Error findOrCreateUser:', err3.message);
            return cb(err3);
          }

          debug('User inserted:', body);
          userDetails._id = body.id;
          return cb(null, userDetails);
        });
      });
    });

  }

  // TODO: What if user has changed their email address?
  // Find by email is good if we want to link multiple social accounts together.
  // We can do find by facebook id if Facebook is the only way to login. This
  // would solve the problem in the short term.
  getUserByEmail(db, email, cb) {

    const params = {
      key: email
    };

    debug('getUserByEmail(%s), params: %o', email, params);

    db.view('users', 'users-by-email', params, (err, body) => {
      if (err || !body) {
        if(err.statusCode === 404) {
          // Not an error. No user found.
          return cb();
        }
        debug('db.find error:', err);
        return cb(err);
      }

      debug('users-by-email view body:', body);
      // { total_rows: 0, offset: 0, rows: [] }

      body.rows.forEach((row) => {
        debug('  Doc:', row);
      });

      if(body.total_rows > 1) {
        // TODO: Log an error
        debug('More than 1 user document with same email:', body.rows);
      }

      return cb(err, body.rows.length > 0 ? body.rows[0].value : null);

    });

  }

};
