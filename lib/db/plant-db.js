import BaseDB from './base-db';
import d from 'debug';

const debug = d('plant:plant-db');

class Plant extends BaseDB {

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

  getByUserId(userId, cb) {

    super.getDb((err, db) => {

      const selector = {
        type: 'plant',
        userId: userId
      };

      db.find(selector, (err2, result) => {

        if(err2) {
          debug('Error in getByUserId:', err2);
          return cb(err2);
        }

        return cb(err, result.docs.length > 0 ? result.docs : null);
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

export default Plant;
