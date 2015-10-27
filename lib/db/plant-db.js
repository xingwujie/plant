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
          console.log('Error create:', err2.message);
          return cb(err2);
        }

        debug('Plant inserted:', body);

        return cb(null, body);
      });
    });

  }

};

export default Plant;
