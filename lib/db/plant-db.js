import _ from 'lodash';
import * as BaseDB from './base-db';
import d from 'debug';
import exampleByPlantId from './example-by-plant-id';

const debug = d('plant:plant-db');

export class Plant extends BaseDB.BaseDB {

  constructor() {
    super();
  }

  create(userId, plantDetail, cb) {

    super.getDb((err, db) => {
      plantDetail.type = 'plant';
      plantDetail.userId = userId;
      db.insert(plantDetail, function(err2, body /*, header*/) {
        if (err2) {
          debug('Error create:', err2.message);
          return cb(err2);
        }

        debug('Plant inserted:', body);

        return cb(null, body);
      });
    });

  }

  // Need to get the following documents to great the result set:
  // 1. Plant document
  // 2. Any scions on the plant
  // 3. Any notes on the plant or scions (by implication comments on each note)
  getByPlantId(plantId, cb) {
    return cb(null, exampleByPlantId);
  }

  // Should get an array of plants. Don't need
  // the scions, notes and comments in this call.
  getByUserId(userId, cb) {

    super.getDb((err, db) => {

      const params = {
        key: userId
      };

      db.view('plants', 'plants-by-user', params, (err2, body) => {
        if (err2 || !body) {
          if(err2.statusCode === 404) {
            // Not an error. No plants found.
            return cb();
          }
          debug('plants-by-user db.view error:', err2);
          return cb(err2);
        }

        debug('plants-by-user count:', body.rows.length);
        if(body.rows.length > 0) {
          const result = body.rows.map((row) => {
            return _.omit(row.value, ['type', 'userId']);
          });
          return cb(null, result);
        }

        return cb(err2, null);
      });

    });

  }

  addNote(userId, plantNote, cb) {

    if(!plantNote.plantId) {
      return cb({message: 'No plantId found in plantNote'});
    }

    super.getDb((err, db) => {
      plantNote.type = 'plant-note';
      plantNote.userId = userId;
      // TODO: Validate that the plantId belongs to this user (i.e. prevent a hacker from adding a note to another user's plant)
      db.insert(plantNote, function(err2, body /*, header*/) {
        if (err2) {
          debug('Error create:', err2.message);
          return cb(err2);
        }

        debug('Plant note inserted:', body);

        return cb(null, body);
      });
    });

  }

};
