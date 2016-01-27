import _ from 'lodash';
import * as BaseDB from './base-db';
import d from 'debug';

const debug = d('plant:user-db');

export class User extends BaseDB.BaseDB {

  constructor() {
    super();
  }

  findOrCreateFacebookUser(userDetails, cb) {

    // debug('findOrCreateFacebookUser:', userDetails);

    if(!_.get(userDetails, 'facebook.id')) {
      return cb(new Error('No facebook.id:', JSON.stringify(userDetails)));
    }

    super.getDb((err, db) => {
      if(err) {
        return cb(err);
      }

      this.getUserByFacebookId(db, userDetails.facebook.id, (err2, user) => {
        if(err2) {
          debug('getUserByFacebookId error:', err2);
          return cb(err2);
        }

        if(user) {
          return cb(null, user);
        }

        userDetails.type = 'user';
        // debug('inserting user:', userDetails);
        db.insert(userDetails, function(err3, body /*, header*/) {
          if (err3) {
            debug('Error findOrCreateFacebookUser:', err3.message);
            return cb(err3);
          }

          // debug('User inserted:', body);
          userDetails._id = body.id;
          return cb(null, userDetails);
        });
      });
    });

  }

  getUserByFacebookId(db, facebookId, cb) {

    const params = {
      key: facebookId
    };

    // debug('getUserByFacebookId(%s), params: %o', facebookId, params);

    db.view('users', 'users-by-facebook-id', params, (err, body) => {
      if (err || !body) {
        if(err.statusCode === 404) {
          // Not an error. No user found.
          return cb();
        }
        debug('users-by-facebook-id db.view error:', err);
        return cb(err);
      }

      // debug('users-by-facebook-id view body:', body);
      // { total_rows: 0, offset: 0, rows: [] }

      // body.rows.forEach((row) => {
      //   debug('  Doc:', row);
      // });

      if(body.rows > 1) {
        // TODO: Log an error
        debug('More than 1 user document with same facebookId:', body.rows);
      }

      return cb(err, body.rows.length > 0 ? body.rows[0].value : null);

    });

  }

};
