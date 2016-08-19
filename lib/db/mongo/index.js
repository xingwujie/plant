import _ from 'lodash';
import async from 'async';
import read from './read';
import Create from './create';
import update from './update';
import remove from './delete';
import mongodb from 'mongodb';
const mongoConnection = `mongodb://${process.env.PLANT_DB_URL || '127.0.0.1'}/${process.env.PLANT_DB_NAME || 'plant'}`;

import d from 'debug';
const debug = d('plant:mongo-index');

class MongoDb {
  constructor() {
    // Call GetDb() to setup connection but don't need to use it
    this.GetDb(() => {});
  }

  getDbConnection() {
    return mongoConnection;
  }

  GetDb(cb) {
    if(this.db) {
      return cb(null, this.db);
    } else {
      mongodb.MongoClient.connect(mongoConnection, (err, db) => {
        if(err) {
          debug(`Connection to ${mongoConnection} failed:`, err);
          return cb(err);
        } else {
          debug('DB successfully connected.');
          this.db = db;
          return cb(err, db);
        }
      });
    }
  }

  example(cb) {
    const query = {};
    const fields = {};
    const options = {
      limit: 50,
      skip: 0,
      sort: [['lastPageLoad', 'descending']]
    };
    read('user', query, fields, options, cb);
  }

  findOrCreateFacebookUser(userDetails, cb) {
    this.GetDb((err, db) => {
      if(!_.get(userDetails, 'facebook.id')) {
        return cb(new Error('No facebook.id:', JSON.stringify(userDetails)));
      }

      const query = {
        'facebook.id': userDetails.facebook.id
      };
      const fields = {};
      const options = {};

      read(db, 'user', query, fields, options, (readError, user) => {
        if(readError) {
          debug('user readError:', readError);
          return cb(readError, user);
        } else if(user) {
          if(user.length !== 1) {
            // TODO: Log this properly
            debug(`Unexpected user.length: ${user.length}`);
          }
          return cb(readError, user[0]);
        } else {
          Create.createOne(db, 'user', userDetails, cb);
        }
      });
    });
  }

  /**
   * Gets the plant document from the plant collection and sets the
   * notes property of this document to an array of notes queried
   * from the notes collection.
   * @param {string} plantId - mongoId of plant to fetch
   * @param {Function} cb - callback for result
   * @returns {undefined}
   */
  getPlantById(plantId, cb) {
    this.GetDb((err, db) => {
      const query = {
        _id: plantId
      };
      const fields = {};
      const options = {};

      read(db, 'plant', query, fields, options, (readError, plant) => {
        if(readError) {
          debug('plant readError:', readError);
          return cb(readError, plant);
        } else if(plant) {
          if(plant.length !== 1) {
            // TODO: Log this properly
            debug(`Unexpected plant.length: ${plant.length}`);
          }
          read(db, 'note', {plantIds: plant[0]._id}, {}, {}, (noteReadError, notes) => {
            if(noteReadError) {
              debug('note noteReadError:', noteReadError);
              return cb(noteReadError, notes);
            }
            plant[0].notes = notes || [];
            return cb(readError, plant[0]);
          });
        } else {
          return cb(readError, plant);
        }
      });
    });
  }

  getPlantsByUserId(userId, cb) {
    this.GetDb((err, db) => {
      const query = { userId };
      const fields = {};
      const options = {};

      read(db, 'user', {_id: userId}, fields, options, (readUserError, user) => {
        if(readUserError) {
          debug('getPlantsByUserId read user error:', readUserError);
          return cb(readUserError);
        }
        if(!user) {
          debug(`getPlantsByUserId No user found for userId ${userId}`);
          return cb();
        }
        read(db, 'plant', query, fields, options, (readError, plants) => {
          if(readError) {
            debug('getPlantsByUserId plants by userId readError:', readError);
            return cb(readError);
          } else {
            debug('getPlantsByUserId plants found #:', plants && plants.length);
            return cb(null, plants || []);
          }
        });
      });
    });
  }

  createPlant(plant, cb) {
    this.GetDb((err, db) => {
      Create.createOne(db, 'plant', plant, cb);
    });
  }

  createNote(note, cb) {
    this.GetDb((err, db) => {
      Create.createOne(db, 'note', note, cb);
    });
  }

  updatePlant(plant, cb) {
    this.GetDb((err, db) => {
      update(db, 'plant', plant, cb);
    });
  }

  updateNote(note, cb) {
    this.GetDb((err, db) => {
      update(db, 'note', note, cb);
    });
  }

  getNoteById(_id, cb) {
    this.GetDb((err, db) => {
      read(db, 'note', {_id}, {}, {}, cb);
    });
  }

  deleteNote(_id, userId, cb) {
    this.GetDb((err, db) => {
      remove(db, 'note', {_id, userId}, cb);
    });
  }

  // Only used for testing - so far - needs to delete notes as well if to be used in prod
  deleteAllPlantsByUserId(userId, cb) {
    this.GetDb((err, db) => {
      remove(db, 'plant', {userId}, cb);
    });
  }

  /**
   * Removes the plant from the plant collection and also removes any notes that
   * reference this plant only. Any notes that reference multiple plants will be
   * updated and the reference to that plant removed.
   * @param {string} _id - Id of plant to delete
   * @param {string} userId - Id of user that plant belongs to
   * @param {function} cb - callback to call once complete
   * @returns {undefined}
   */
  deletePlant(_id, userId, cb) {
    // Steps to delete a plant
    // 1. Retrieve note documents associated with Plant
    // 2. Delete note documents that only reference this plant
    // 3. Update note documents that reference multiple plants by remove the
    //    reference to this plant.
    // 4. Delete plant document.
    this.GetDb((err, db) => {

      function getNotes(done) {
        read(db, 'note', {plantIds: _id, userId}, {}, {}, (getNotesError, notesForPlant) => {
          debug('#0 notesForPlant:', notesForPlant);
          if(getNotesError) {
            return done(getNotesError);
          } else {
            // Split the notesForPlant array in 2:
            // 1. Those that only reference this plant - need to delete these
            // 2. Those that reference multiple plants - need to update these and remove this plant's reference
            const splitNotes = (notesForPlant || []).reduce((acc, note) => {
              if(note.plantIds.length === 1) {
                acc.singlePlantNotes.push(note._id);
              } else {
                acc.multiplePlantNotes.push(note);
              }
              return acc;
            }, {singlePlantNotes: [], multiplePlantNotes: []});
            debug('#1 getNotes splitNotes:', splitNotes);
            return done(null, splitNotes);
          }
        });
      }

      function deleteNotes(splitNotes, done) {
        // TODO: Confirm that this does a bulk delete
        // Need tests where noteIds end up being array of:
        // 0, 1, 2 in length
        if(splitNotes.singlePlantNotes.length > 0) {
          const deleteQuery = {_id: {$in: splitNotes.singlePlantNotes}};
          remove(db, 'note', deleteQuery, (removeNoteErr, removeNoteResults) => {
            debug('#2 deleteNotes removeNoteResults', removeNoteResults);
            // TODO: Add a check that the number of documents removed in removeNoteResults is same as length
            // of array passed to _id.
            // Don't need the singlePlantNotes anymore so don't need to pass them on.
            done(removeNoteErr, splitNotes.multiplePlantNotes);
          });
        } else {
          done(null, splitNotes.multiplePlantNotes);
        }
      }

      function updateNotes(multiplePlantNotes, done) {
        if(multiplePlantNotes.length > 0) {
          const updatedNotes = multiplePlantNotes.map(note => {
            return {
              ...note,
              plantIds: note.plantIds.filter(ids => ids !== _id)
            };
          });
          update(db, 'note', updatedNotes, updateNotesError => {
            done(updateNotesError);
          });
        } else {
          return done();
        }
      }

      function deletePlant(done) {
        debug('#4 deletePlant');
        remove(db, 'plant', {_id, userId}, done);
      }

      async.waterfall([getNotes, deleteNotes, updateNotes, deletePlant], (waterfallError, deleteResult) => {
        debug(`delete plant finished with ${waterfallError ? `error: ${waterfallError}` : 'no error'}`);
        cb(waterfallError, deleteResult);
      });

    });
  }
};

export default new MongoDb();
