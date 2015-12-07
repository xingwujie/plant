import _ from 'lodash';
import Cloudant from 'cloudant';
import secrets from '../config/secrets';
import d from 'debug';

const debug = d('plant:base-db');

const dbName = secrets.cloudant.dbName;

// TODO: Log errors
export class BaseDB {
  constructor() {
    this.cloudant = Cloudant({
      account: secrets.cloudant.account,
      password: secrets.cloudant.password
    });
  }

  getDb(cb) {
    if(this.database) {
      return cb(null, this.database);
    }

    this.cloudant.db.list((err, allDbs) => {
      // debug('All databases:', allDbs);
      if(!_.contains(allDbs, dbName)) {
        this.cloudant.db.create(dbName, (err2) => {
          debug('DB not found. Created. Err/name:', err2, dbName);
          this.database = this.cloudant.db.use(dbName);
          return cb(null, this.database);
        });
      } else {
        this.database = this.cloudant.db.use(dbName);
        return cb(null, this.database);
      }
    });
  }

  getById(id, cb) {

    this.getDb((err, db) => {
      db.get(id, (err2, result) => {
        // debug('getById:', err2, result);
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
      // Wholesale replacement of object
      changeObj._rev = existing._rev;
      return changeObj;
    }

    this.updateExec(objectUpdate, obj, key, cb);

  }

  // See description above update())
  updateSet(obj, key, cb) {

    function objectUpdate(changeObj, existing) {
      // Add new values from changeObj.
      // Overwrite existing values in existing
      _.assign(existing, changeObj);
      return existing;
    }

    this.updateExec(objectUpdate, obj, key, cb);

  }

  // Create a new document if it does not exist.
  // Update an existing document.
  // Update is Wholesale.
  // upsert(obj, key, cb) {
  //
  // }
}
