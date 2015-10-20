import BaseDB from './base-db';

class User extends BaseDB {

  constructor() {
    super();
  }

  createUser(userDetails, cb) {

    super.getDb((err, db) => {
      userDetails.collection = 'user';
      db.insert(userDetails, userDetails.email, function(err, body /*, header*/) {
        if (err) {
          console.log('Error createUser:', err.message);
          return cb(err);
        }

        console.log('User inserted:', body);
        return cb(null, body);
      });
    });

  }

  getUserByEmail(email, cb) {

    super.getDb((err, db) => {
      // TODO: Complete this function
      return cb(null, null);
    });

  }

  getUserById(id, cb) {

    super.getDb((err, db) => {
      // TODO: Complete this function
      return cb(null, null);
    });

  }
};

export default User;
