import _ from 'lodash';
import * as BaseDB from './base-db';
import d from 'debug';

const debug = d('plant:plant-db');

export class Plant extends BaseDB.BaseDB {

  constructor() {
    super();
  }

  // Need to get the following documents to great the result set:
  // 1. Plant document
  // 2. Any scions on the plant
  // 3. Any notes on the plant or scions (by implication comments on each note)
  getByPlantId(plantId, cb) {
    // TODO: This function should also be doing items listed above.
    super.getById(plantId, cb);
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
          const result = _.map(body.rows, 'value');
          return cb(null, result);
        }

        return cb(err2, null);
      });

    });

  }

};
