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

  updateExec(objFunc, obj, key, cb) {

    if(typeof key === 'function') {
      cb = key;
      key = obj.id;
    }

    this.getDb((err, db) => {
      db.get(key, (error, existing) => {
        if(error){
          return cb(error);
        }

        db.insert(objFunc(obj, existing), key, cb);
      });
    });

  }

  // update follows the Mongo naming convention.
  // update: Wholesale replacement of object.
  // updateSet: Add or change any key/values, leave the rest unchanged
  // updateUnset: Remove the keys from the document
  update(obj, key, cb) {

    function objectUpdate(changeObj, existing) {
      changeObj._rev = existing._rev;
      return changeObj;
    }

    this.updateExec(objectUpdate, obj, key, cb);

  }

  // Set description above update())
  updateSet(obj, key, cb) {

    function objectUpdate(changeObj, existing) {
      _.assign(existing, changeObj);
      return existing;
    }

    this.updateExec(objectUpdate, obj, key, cb);

  }
}

export default BaseDB;
