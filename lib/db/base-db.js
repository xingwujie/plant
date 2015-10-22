import _ from 'lodash';
import Cloudant from 'cloudant';
import secrets from '../config/secrets';
import deb from 'debug';

const debug = deb('plant:base-db');

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
}

export default BaseDB;
