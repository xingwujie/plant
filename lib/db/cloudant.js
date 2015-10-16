import _ from 'lodash';
import Cloudant from 'cloudant';

const account = process.env.CLOUDANT_ACCOUNT;
const password = process.env.CLOUDANT_PASSWORD;
const dbName = process.env.CLOUDANT_DB_NAME;

const cloudant = Cloudant({
  account:account,
  password:password
});

var database;

function getDb(cb) {
  if(database) {
    return cb(null, database);
  }

  cloudant.db.list(function(err, allDbs) {
    console.log('All databases:', allDbs);
    if(!_.contains(allDbs, dbName)) {
      cloudant.db.create(dbName, function() {
        console.log('Created DB:', dbName);
        database = cloudant.db.use(dbName);
        return cb(null, database);
      });
    } else {
      database = cloudant.db.use(dbName);
      return cb(null, database);
    }
  });
}

export function createUser(userDetails, cb) {

  getDb((err, db) => {
    userDetails.collection = 'user';
    db.insert(userDetails, userDetails.email, function(err, body, header) {
      if (err) {
        console.log('Error createUser:', err.message);
        return cb(err);
      }

      console.log('User inserted:', body);
      return cb(null, body);
    });
  });

}

export function readUser(email, cb) {

  getDb((err, db) => {
    userDetails.collection = 'user';
    db.get(userDetails, userDetails.email, function(err, body, header) {
      if (err) {
        console.log('Error createUser:', err.message);
        return cb(err);
      }

      console.log('User inserted:', body);
      return cb(null, body);
    });
  });

}
