import _ from 'lodash';
import Cloudant from 'cloudant';
import secrets from '../config/secrets';
import d from 'debug';

const debug = d('plant:base-db');

const cloudant = Cloudant({
  account: secrets.cloudant.account,
  password: secrets.cloudant.password
});

const dbName = secrets.cloudant.dbName;

class BaseDB {
  constructor() {
  }

  getDb(cb) {
    if(this.database) {
      return cb(null, this.database);
    }

    cloudant.db.list((err, allDbs) => {
      debug('All databases:', allDbs);
      if(!_.contains(allDbs, dbName)) {
        cloudant.db.create(dbName, function() {
          debug('Created DB:', dbName);
          this.database = cloudant.db.use(dbName);
          return cb(null, this.database);
        });
      } else {
        this.database = cloudant.db.use(dbName);
        return cb(null, this.database);
      }
    });
  }

  getById(id, cb) {

    this.getDb((err, db) => {
      db.get(id, (err2, result) => {
        debug('getById:', err2, result);
        return cb(err2, result);
      });
    });

  }

}

export default BaseDB;
