import _ from 'lodash';
import Cloudant from 'cloudant';
import secrets from '../config/secrets';

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
      console.log('All databases:', allDbs);
      if(!_.contains(allDbs, dbName)) {
        cloudant.db.create(dbName, function() {
          console.log('Created DB:', dbName);
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
