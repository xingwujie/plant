import _ from 'lodash';
import async from 'async';
import constants from '../../../app/libs/constants';
import read from './read';
import Create from './create';
import update from './update';
import remove from './delete';
import mongodb from 'mongodb';

const {ObjectID} = mongodb;

const mongoConnection = `mongodb://${process.env.PLANT_DB_URL || '127.0.0.1'}/${process.env.PLANT_DB_NAME || 'plant'}`;

import d from 'debug';
const debug = d('plant:mongo-index');

/**
 * All the CRUD operations for all collections are done through this class.
 * At some point in the future there might be justification in splitting each
 * collection into its own class. Because there are so few collections and it's
 * fairly simple they're all in here for now.
 *
 * This is the layer that all string to Mongo ObjectID conversion takes place.
 * Reads and Updates:
 *  query convert from string to ObjectID
 *  result Ids converted from ObjectID to string
 * Insert:
 *  Ids in documents converted to ObjectID
 *  result Ids converted from ObjectID to string
 * Delete:
 *  query convert from string to ObjectID
 *
 * Mongo ObjectID fields stored in collections that require conversion in this layer:
 * User:
 *  _id
 * Plant:
 *  _id, userId
 * Note:
 *  _id, userId, plantIds[]
 */
class MongoDb {
  constructor() {
    // Call GetDb() to setup connection but don't need to use it.
    // This just makes the app spin up a bit faster.
    this.GetDb(() => {});
  }

  getDbConnection() {
    return mongoConnection;
  }

  /**
   * Get the DB connection to use for a CRUD operation.
   * If it doesn't exist then create it.
   * @param {Function} cb - callback to call with connection or error
   * @return {undefined}
   */
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

  /**
   * Helper function to convert _id from MongoId to string. Used in reads
   * @param {object} obj - Object that might have an _id
   * @returns {object} - the same object with a converted _id
   */
  convertIdToString(obj) {
    if(_.isArray(obj)) {
      return obj.map(this.convertIdToString);
    } else {
      if(obj && obj._id) {
        obj._id = obj._id.toString();
      }
      return obj;
    }
  }

  // CRUD operations for User collection

  // User CR: Create and Read are in a single function for user

  /**
   * Gets the user from the user collection based on the user's facebook id.
   * If the user does not exist then creates the user first.
   * @param {object} userDetails - the object that Facebook OAuth returns
   * @param {Function} cb - callback function with result
   * @return {undefined}
   */
  findOrCreateUser(userDetails, cb) {
    // 1. Get the DB
    const getDb = (done) => {
      debug('focu #1');
      this.GetDb((err, db) => {
        return done(err, {db});
      });
    };

    // 2. data.db is now set
    //    Set the query to find the user
    const setQuery = (data, done) => {
      debug('focu #2');
      if(!_.get(userDetails, 'facebook.id') && !_.get(userDetails, 'google.id')) {
        return done(new Error('No facebook.id or google.id:', JSON.stringify(userDetails)));
      }

      data.query = userDetails.facebook
        ? {
          'facebook.id': userDetails.facebook.id
        }
        : {
          'google.id': userDetails.google.id
        };

      done(null, data);
    };

    // 3. Find the user by OAuth provider id
    const getUser = (data, done) => {
      debug('focu #3 enter:', _.omit(data, ['db']));
      read(data.db, 'user', data.query, {}, {}, (readError, user) => {
        debug('focu #3 user:', user);;
        if(readError) {
          debug('user readError:', readError);
          return done(readError);
        }

        if(user && user.length !== 1) {
          // TODO: Log this in the future logger
          debug(`Unexpected user.length: ${user.length}`);
        }

        if(user && user.length > 0) {
          data.user = this.convertIdToString(user[0]);
        }

        return done(null, data);
      });
    };

    // 4. If user not found then try find by email
    const getUserByEmail = (data, done) => {
      debug('focu #4');
      if(data.user) {
        return done(null, data);
      }
      if(userDetails.email) {
        data.query = {
          email: userDetails.email
        };
        return getUser(data, done);
      } else {
        return done(null, data);
      }
    };

    // 5. Update the user's details
    //    If they had previously signed in with Facebook and now with
    //    Google then theis will add their Google credentials to their
    //    account.
    //    If they've changed anything about themselves on the OAuth
    //    provider (e.g. updated an email address) then this will update
    //    that.
    const updateUser = (data, done) => {
      debug('focu #5');
      // If no user then skip this step
      if(!data.user) {
        return done(null, data);
      }
      debug('Before assign data.user:', data.user);
      debug('Before assign userDetails:', userDetails);
      _.merge(data.user, userDetails);
      const userData = _.omit(data.user, ['_id']);
      const query = {_id: new ObjectID(data.user._id)};
      // debug('user to update:', data.user);
      update(data.db, 'user', query, userData, (err, result) => {
        debug('update result:', result);
        if(result.n === 0) {
          return done(`update did not update any docs with query: ${JSON.stringify(query)}`);
        }
        return done(err, data);
      });
    };

    // 6. Create user
    const createUser = (data, done) => {
      debug('focu #6');
      if(data.user) {
        return done(null, data.user);
      }
      Create.createOne(data.db, 'user', userDetails, (createOneError, createdUser) => {
        debug('focu #7:', createOneError);
        return done(createOneError, this.convertIdToString(createdUser));
      });
    };

    async.waterfall([
      getDb,
      setQuery,
      getUser,
      getUserByEmail,
      updateUser,
      createUser
    ], cb);
  }

  // User U: No Update function for User yet
  // User D: No Delete function for User yet
  // End CRUD methods for collection "user"

  // CRUD operations for Plant collection

  // Plant C: cratePlant

  convertPlantDataTypes(plant) {
    if(plant._id) {
      plant._id = new ObjectID(plant._id);
    }
    plant.userId = new ObjectID(plant.userId);
    if(plant.plantedDate) {
      plant.plantedDate = new Date(plant.plantedDate);
    }
    if(plant.purchasedDate) {
      plant.purchasedDate = new Date(plant.purchasedDate);
    }
  }

  createPlant(plant, cb) {
    this.GetDb((err, db) => {
      debug('createPlant:', plant);
      if(!plant.userId) {
        debug('Missing plant.userId');
        return cb('userId must be specified as part of plant when creating a plant');
      }
      this.convertPlantDataTypes(plant);
      Create.createOne(db, 'plant', plant, (createOnePlantErr, createdPlant) => {
        if(createOnePlantErr) {
          return cb(createOnePlantErr);
        }
        createdPlant = this.convertIdToString(createdPlant);
        createdPlant.userId = createdPlant.userId.toString();
        debug('returning created plant:', createdPlant);
        return cb(null, createdPlant);
      });
    });
  }

  // Plant R: getPlantById
  // Plant R: getPlanstByUserId

  /**
   * Gets the plant document from the plant collection and sets the
   * notes property of this document to an array of notes queried
   * from the notes collection.
   * @param {string} plantId - mongoId of plant to fetch
   * @param {Function} cb - callback for result
   * @returns {undefined}
   */
  getPlantById(plantId, cb) {
    if(!constants.mongoIdRE.test(plantId)) {
      return cb();
    }
    this.GetDb((err, db) => {
      let query = {
        _id: new ObjectID(plantId)
      };
      const fields = {};
      const options = {};

      read(db, 'plant', query, fields, options, (readError, plant) => {
        if(readError) {
          debug('plant readError:', readError);
          return cb(readError);
        } else if(plant) {
          if(plant.length !== 1) {
            // TODO: Log this properly
            debug(`Unexpected plant.length: ${plant.length}`);
          }
          // {_id: {$in: splitNotes.singlePlantNotes}}
          query = {plantIds: plant[0]._id};
          debug('getPlantById note query:', query);
          debug('typeof plant[0]._id', typeof plant[0]._id);
          read(db, 'note', query, {}, {}, (noteReadError, notes) => {
            if(noteReadError) {
              debug('note noteReadError:', noteReadError);
              return cb(noteReadError);
            }
            debug('getPlantById read note result:', notes);
            // Convert Mongo ObjectIds to strings
            plant = this.convertIdToString(plant[0]);
            plant.userId = plant.userId.toString();
            plant.notes = (notes || []).map(note => {
              return {
                ...note,
                _id: note._id.toString(),
                plantIds: (notes.plantIds || []).map(pId => pId.toString())
              };
            });
            debug('getPlantById final result:', plant);
            return cb(readError, plant);
          });
        } else {
          // readError and plant are both falsey
          return cb();
        }
      });
    });
  }

  /**
   * Gets all the plants belonging to a user. Does not populate the notes field.
   * @param {string} userId - the userId to query against the plant collection.
   * @param {Function} cb - callback for result
   * @return {undefined}
   */
  getPlantsByUserId(userId, cb) {
    if(!constants.mongoIdRE.test(userId)) {
      return cb();
    }
    this.GetDb((err, db) => {
      userId = new ObjectID(userId);
      const fields = {};
      const options = {};

      read(db, 'user', {_id: userId}, fields, options, (readUserError, user) => {
        if(readUserError) {
          debug('getPlantsByUserId read user error:', readUserError);
          return cb(readUserError);
        }
        if(user && user.length === 1) {
          read(db, 'plant', { userId }, fields, options, (readError, plants) => {
            if(readError) {
              debug('getPlantsByUserId plants by userId readError:', readError);
              return cb(readError);
            } else {
              debug('getPlantsByUserId plants found #:', plants && plants.length);
              return cb(null, (plants || []).map(this.convertIdToString));
            }
          });
        } else {
          debug(`getPlantsByUserId No user found for userId ${userId.toString()}`);
          return cb();
        }
      });
    });
  }

  // Plant U: updatePlant

  updatePlant(plant, cb) {
    if(!plant._id || !plant.userId) {
      debug(`Must supply _id (${plant._id}) and userId (${plant.userId}) when updating a plant`);
      return cb(`Must supply _id (${plant._id}) and userId (${plant.userId}) when updating a plant`);
    }
    this.convertPlantDataTypes(plant);
    debug('updatePlant plant:', plant);
    this.GetDb((err, db) => {
      const query = _.pick(plant, ['_id', 'userId']);
      const set = _.omit(plant, ['_id']);
      update(db, 'plant', query, set, cb);
    });
  }

  // Plant D: deletePlant
  // Plant D: deleteAllPlantsByUserId

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
      _id = new ObjectID(_id);
      userId = new ObjectID(userId);

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
            debug('#2.1 deleteNotes removeNoteErr:', removeNoteErr);
            debug('#2.2 deleteNotes removeNoteResults:', removeNoteResults);
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
              plantIds: note.plantIds.filter(plantId => plantId !== _id)
            };
          });
          debug('#3 updatedNotes:', updatedNotes);
          async.each(updatedNotes, (updateNote, eachDone) => {
            debug('#3.1 updateNote:', updateNote);
            const noteQuery = {_id: updateNote._id};
            const set = _.omit(updateNote, ['_id']);
            update(db, 'note', noteQuery, set, eachDone);
          }, (eachDoneErr) => {
            done(eachDoneErr);
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

  // Only used for testing - so far - needs to delete notes as well if to be used in prod
  deleteAllPlantsByUserId(userId, cb) {
    this.GetDb((err, db) => {
      userId = new ObjectID(userId);
      remove(db, 'plant', {userId}, cb);
    });
  }

  // End CRUD methods for Plant collection

  // CRUD operations for Note collection

  // Note C: createNote

  convertNoteDataTypes(note) {
    if(note._id) {
      note._id = new ObjectID(note._id);
    }
    if(note.date) {
      note.date = new Date(note.date);
    }
    if(note.plantIds && note.plantIds.length > 0) {
      note.plantIds = note.plantIds.map(plantId => new ObjectID(plantId));
    }
    note.userId = new ObjectID(note.userId);
  }

  createNote(note, cb) {
    this.GetDb((err, db) => {
      if(!note.userId) {
        return cb('userId must be specified as part of note when creating a note');
      }
      this.convertNoteDataTypes(note);
      note.plantIds = (note.plantIds || []).map(plantId => new ObjectID(plantId));
      debug('createNote:', note);
      Create.createOne(db, 'note', note, cb);
    });
  }

  // Note R: getNoteById

  getNoteById(_id, cb) {
    this.GetDb((err, db) => {
      _id = new ObjectID(_id);
      read(db, 'note', {_id}, {}, {}, (noteReadError, note) => {
        if(noteReadError) {
          return cb(noteReadError);
        }
        if(note) {
          note = this.convertIdToString(note);
          note.userId = note.userId.toString();
          note.plantIds = (note.plantIds || []).map(plantId => plantId.toString());
          return cb(null, note);
        } else {
          cb();
        }
      });
    });
  }

  // Note U: updateNote

  updateNote(note, cb) {
    this.GetDb((err, db) => {
      debug('updateNote note:', note);
      if(!note.userId) {
        debug('userId must be specified as part of note when updating a note');
        return cb('userId must be specified as part of note when updating a note');
      }
      this.convertNoteDataTypes(note);
      const query = _.pick(note, ['_id', 'userId']);
      const set = _.omit(note, ['_id']);
      debug('updateNote query:', query);
      debug('updateNote set:', set);
      update(db, 'note', query, set, cb);
    });
  }

  // Note D: deleteNote

  deleteNote(_id, userId, cb) {
    this.GetDb((err, db) => {
      remove(db, 'note', {
        _id: new ObjectID(_id),
        userId: new ObjectID(userId)
      }, cb);
    });
  }

  // End CRUD methods for Note collection

};

export default new MongoDb();
