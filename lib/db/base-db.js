import _ from 'lodash';
import Cloudant from 'cloudant';
import d from 'debug';
import secrets from '../config/secrets';

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
      if(err) {
        debug('getDb() db.list error:', err);
        return cb(err);
      }

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
      existing = {...existing, ...changeObj};
      return existing;
    }

    this.updateExec(objectUpdate, obj, key, cb);

  }

  // Create a new document if it does not exist or...
  // ...update an existing document.
  // Update is Wholesale.
  upsert(obj, cb) {

    this.getDb((err, db) => {
      if(err) {
        return cb(err);
      }

      if(obj._id) {
        db.get(obj._id, (error, existing) => {
          if(error && error.statusCode !== 404) {
            debug('upsert db.get error:', error);
            return cb(error);
          }

          if(existing) {
            obj._rev = existing._rev;
          }
          db.insert(obj, cb);
        });
      } else {
        db.insert(obj, cb);
      }
    });
  }

  // Updates a document if the document's userId matches the userId param.
  // Does Wholesale replacement. i.e. all fields not in the doc param are
  // removed from the document.
  updateByUser(doc, cb) {
    this.getDb((err, db) => {
      if(err) {
        return cb(err);
      }

      db.get(doc._id, (error, existing) => {
        if(error || !existing) {
          debug('updateByUser db.get error (or missing existing):', error, existing);
          return cb(error);
        }

        if(existing.userId !== doc.userId) {
          debug(`updateByUser failed because document belongs to ${existing.userId} and doc.userId param is ${doc.userId}`);
          return cb({statusCode: 403, message: `userId mismatch in update`});
        }

        doc = {...doc, ..._.pick(existing, ['_rev', 'userId', 'type'])};

        db.insert(doc, cb);
      });

    });

  }

  delete(id, userId, cb) {

    this.getDb((err, db) => {
      if(err) {
        return cb(err);
      }

      if(!id || !userId) {
        return cb(new Error(`id (${id}) or userId (${userId}) is missing`));
      }

      db.get(id, (error, existing) => {
        if(error) {
          debug('delete db.get error:', error);
          return cb(error);
        }

        debug('delete existing:', existing);
        if(existing && existing.userId === userId) {
          db.destroy(existing._id, existing._rev, cb);
        } else {
          cb(new Error(`No record or user does not match`));
        }
      });
    });
  }
}
