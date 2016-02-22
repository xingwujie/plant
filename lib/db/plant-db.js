// import _ from 'lodash';
import * as BaseDB from './base-db';
import async from 'async';

// import d from 'debug';
// const debug = d('plant:plant-db');

export class Plant extends BaseDB.BaseDB {

  constructor() {
    super();
  }

  // Need to get the following documents to create the result set:
  // 1. Single Plant document
  // 2. Any scions on the plant (don't know how this will be handled yet)
  // 3. Any notes on the plant or scions (by implication comments on each note)
  getByPlantId(plantId, cb) {
    // TODO: This function should also be doing items listed above.
    super.getById(plantId, (err, plant) => {
      if(err || !plant) {
        return cb(err, plant);
      }

      const params = {
        key: plant._id
      };

      // TODO: Test "include_docs: true" in the params
      // Note: include_docs will cause a single document lookup per returned view
      // result row. This adds significant strain on the storage system if you
      // are under high load or return a lot of rows per request. If you are
      // concerned about this, you can emit the full doc in each row; this will
      // increase view index time and space requirements, but will make view
      // reads optimally fast.

      super.getByView('notes', 'notes-by-plant', params, (notesByPlantErr, notes) => {
        if(notesByPlantErr) {
          return cb(notesByPlantErr, plant);
        }
        // Returning an empty array signals to the client that there are no
        // notes for this plant. (As opposed to no notes property which means
        // that only a summary plant object was returned.)
        plant.notes = notes || [];
        return cb(null, plant);
      });
    });
  }

  // Should get an array of plants. Don't need
  // the scions, notes and comments in this call.
  getByUserId(userId, cb) {
    const params = {
      key: userId
    };

    // debug('getByUserId:', params);

    super.getByView('plants', 'plants-by-user', params, cb);
  }

  // At time of writing this only used by tests and not exposed through API
  deleteByUserId(userId, cb) {
    this.getByUserId(userId, (err, plants) => {
      async.each(plants, (plant, done) => {
        super.delete(plant._id, userId, (err2, result) => {
          done(err2, result);
        });
      }, (asyncErr) => {
        return cb(asyncErr);
      });
    });
  }

  delete(id, userId, cb) {
    // 1. Get plant
    // 2. Delete/update notes first (prevents orphaned notes in the event
    // that plant delete works and then failure afterwards)
    // 3. Delete plant.

    // 1. Get plant
    this.getByPlantId(id, (err, plant) => {
      if(err || !plant) {
        return cb(err, plant);
      }

      if(!plant.notes || !plant.notes.length) {
        return super.delete(id, userId, cb);
      }

      // 2. Delete/update notes first (prevents orphaned notes in the event
      // that plant delete works and then failure afterwards)
      async.each(plant.notes, (note, done) => {
        if(note.plantIds.length === 1) {
          super.delete(note._id, userId, done);
        } else {
          note.plantIds = note.plantIds.filter( plantId => plantId !== id);
          super.update(note, done);
        }
      }, (asyncErr) => {
        if(asyncErr) {
          return cb(asyncErr);
        }

        // 3. Delete plant.
        super.delete(id, userId, cb);

      });

    });
  }

};
