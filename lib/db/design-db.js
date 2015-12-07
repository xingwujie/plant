// design-db.js is used for managing the designs in cloudant.
import async from 'async';
import * as BaseDB from './base-db';
import d from 'debug';
import designDocs from './design-docs';

const debug = d('plant:design-db');

export class DesignDB extends BaseDB.BaseDB {

  constructor() {
    super();
  }

  listDesigns(cb) {

    super.getDb((err, db) => {
      // TODO: Handle error
      db.index(function(error, result) {
        if (error) {
          // TODO: Log error
          debug('DesignDB.listDesigns error:', error);
          return cb(error);
        }

        debug('The database has %d indexes', result.indexes.length);
        result.indexes.forEach((index) => {
          debug('  %s (%s): %j', index.name, index.type, index.def);
        });
        return cb(null, result.indexes);
      });
    });

  }

  // Intention that this should be run each time that app bootstraps to
  // insert or update the design docs.
  // TODO: There should probably also be an updateAllIndexes() function that runs
  // when the app spins up to ensure that all indexes are up-to-date.
  updateAllDesigns(cb) {

    async.each(designDocs(),
      (ddoc, done) => {
        super.upsert(ddoc, function (err, result) {
          if (err || !result || !result.ok) {
            debug('upsert design doc failed:', err, result);
            return done(err);
          }

          debug('Created design document:', ddoc);

          // TODO: Should remove any designs that are no longer listed in
          // the result returned from designDocs() as these will be designs
          // that are still being indexed by couchDB but no longer used.
          // i.e.:
          // 1. Get all _design/* from DB
          // 2. Difference between #1 and designDocs()
          // 3. Delete result set from #2

          done();
        });
      }, cb);

  }

};
