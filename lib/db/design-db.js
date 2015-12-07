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

  // Intention that this is to be used against a fresh DB that is being
  // setup for the first time. e.g. if an integration test is being run
  // then a temporary DB might be setup.
  // There should probably be an updateAllIndexes() function that runs
  // when the app spins up to ensure that all indexes are up-to-date.
  createAllDesigns(cb) {

    super.getDb((err, db) => {
      async.each(designDocs(),
        function(ddoc, done) {
          db.insert(ddoc, function (er, result) {
            if (er) {
              return done(er);
            }

            debug('design doc insert result:', result);
            debug('Created design document:', ddoc);

            done();
          });
        }, cb);
    });

  }

};
