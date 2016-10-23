const _ = require('lodash');
const async = require('async');
const constants = require('../../../app/libs/constants');
const read = require('./read');
const Create = require('./create');
const Update = require('./update');
const remove = require('./delete');
const mongodb = require('mongodb');
const utils = require('../../../app/libs/utils');

const {ObjectID} = mongodb;

const mongoConnection = `mongodb://${process.env.PLANT_DB_URL || '127.0.0.1'}/${process.env.PLANT_DB_NAME || 'plant'}`;

const logger = require('../../logging/logger').create('mongo-index');

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
      logger.trace('mongoConnection', {mongoConnection});
      mongodb.MongoClient.connect(mongoConnection, (err, db) => {
        if(err) {
          logger.error(`Connection to ${mongoConnection} failed:`, {err});
          return cb(err);
        } else {
          logger.trace('DB successfully connected.');
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
      return obj.map(this.convertIdToString, this);
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
      this.GetDb((err, db) => {
        return done(err, {db});
      });
    };

    // 2. data.db is now set
    //    Set the query to find the user
    const setQuery = (data, done) => {
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
      read(data.db, 'user', data.query, {}, {}, (readError, user) => {
        if(readError) {
          logger.error('user readError:', {readError});
          return done(readError);
        }

        if(user && user.length !== 1) {
          logger.error(`Unexpected user.length: ${user.length}`, {user});
        }

        if(user && user.length > 0) {
          data.user = this.convertIdToString(user[0]);
        }

        return done(null, data);
      });
    };

    // 4. If user not found then try find by email
    const getUserByEmail = (data, done) => {
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
      // If no user then skip this step
      if(!data.user) {
        return done(null, data);
      }
      _.merge(data.user, userDetails);
      const userData = _.omit(data.user, ['_id']);
      const query = {_id: new ObjectID(data.user._id)};
      Update.updateOne(data.db, 'user', query, userData, (err, result) => {
        if(!result || result.n === 0) {
          logger.error('User not updated', {data, result, query});
          return done(`update did not update any docs with query: ${JSON.stringify(query)}`);
        }
        if(err) {
          logger.error('Error in user update', {data}, {err}, {result});
        }
        return done(err, data);
      });
    };

    // 6. Create user
    const createUser = (data, done) => {
      if(data.user) {
        return done(null, data.user);
      }
      Create.createOne(data.db, 'user', userDetails, (createOneError, createdUser) => {
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

  // User R: Read user
  getUserByQuery(query, cb) {
    this.GetDb((err, db) => {
      const fields = {_id: true, name: true, createdAt: true};
      const options = {};

      read(db, 'user', query, fields, options, (readUserError, users) => {
        if(readUserError) {
          logger.error('getUserByQuery readUserError:', {readUserError, query});
          return cb(readUserError);
        } else {
          return cb(null, users);
        }
      });
    });
  }

  getUserById(userId, cb) {
    if(!constants.mongoIdRE.test(userId)) {
      return cb();
    }
    const userQuery = {
      _id: new ObjectID(userId)
    };

    this.getUserByQuery(userQuery, (getUserByQueryError, users) => {
      if(getUserByQueryError) {
        return cb(getUserByQueryError);
      } else if(users) {
        if(users.length !== 1) {
          logger.error(`Unexpected users.length: ${users.length}`, {users});
        }

        const plantQuery = {userId: users[0]._id};
        this.GetDb((err, db) => {
          read(db, 'plant', plantQuery, {_id: true}, {}, (plantReadError, plants) => {
            // Convert Mongo ObjectIds to strings
            const user = this.convertIdToString(users[0]);
            user.plantIds = (plants || []).map(plant => plant._id.toString());
            return cb(null, _.pick(user, ['_id', 'name', 'createdAt', 'plantIds']));
          });
        });
      } else {
        logger.warn('No user found in query', {userQuery});
        return cb();
      }
    });
  }

  getAllUsers(cb) {
    this.GetDb((err, db) => {
      let userQuery = {};
      const userFields = {_id: true, name: true, createdAt: true};
      const userOptions = {};

      read(db, 'user', userQuery, userFields, userOptions, (getUserError, users) => {
        if(getUserError) {
          return cb(getUserError, users);
        }

        const plantQuery = {};
        const plantFields = {_id: true, userId: true};
        const plantOptions = {};
        read(db, 'plant', plantQuery, plantFields, plantOptions, (plantReadError, plants) => {
          if(plantReadError) {
            return cb(null, users);
          }
          const stringPlants = (plants || []).map(plant => {
            return {
              _id: plant._id.toString(),
              userId: plant.userId.toString()
            };
          });
          const usersWithPlantIds = (users || []).map(user => {
            user.plantIds = stringPlants.filter(plant => plant.userId === user._id.toString()).map(p => p._id);
            return user;
          });
          return cb(null, usersWithPlantIds);
        });
      });
    });
  }

  // User U: No Update function for User yet
  // User D: No Delete function for User yet
  // End CRUD methods for collection "user"

  // CRUD operations for Plant collection

  // Plant C: cratePlant

  convertPlantDataTypesForSaving(plant) {
    if(plant._id) {
      plant._id = new ObjectID(plant._id);
    }
    plant.userId = new ObjectID(plant.userId);
    if(plant.plantedDate) {
      plant.plantedDate = utils.dateToInt(plant.plantedDate);
    }
    if(plant.purchasedDate) {
      plant.purchasedDate = utils.dateToInt(plant.purchasedDate);
    }
  }

  convertPlantDataForRead(plant, loggedInUserId) {
    if(!plant) {
      return plant;
    }
    if(_.isArray(plant)) {
      return plant.map(p => {
        return this.convertPlantDataForRead(p, loggedInUserId);
      }, this);
    } else {
      const convertedPlant = this.convertIdToString(plant);
      if(convertedPlant.userId) {
        convertedPlant.userId = convertedPlant.userId.toString();
      }

      // Only return the geoLocation of the plant if it's the logged in user requesting their own plant
      if(convertedPlant.userId !== loggedInUserId) {
        delete convertedPlant.loc;
      }
      return convertedPlant;
    }
  }

  createPlant(plant, loggedInUserId, cb) {
    this.GetDb((err, db) => {
      if(!plant.userId) {
        logger.warn('Missing plant.userId', {plant});
        return cb('userId must be specified as part of plant when creating a plant');
      }
      this.convertPlantDataTypesForSaving(plant);
      Create.createOne(db, 'plant', plant, (createOnePlantErr, createdPlant) => {
        if(createOnePlantErr) {
          logger.error('createOne plant error', {createOnePlantErr});
          return cb(createOnePlantErr);
        }
        return cb(null, this.convertPlantDataForRead(createdPlant, loggedInUserId));
      });
    });
  }

  // Plant R: getPlantById
  // Plant R: getPlantsByUserId
  // Plant R: getPlantsByIds

  /**
   * Gets all the user's plants and locations relative to the north west most plant.
   * @param {string} userId - the userId for which to retrieve locations
   * @param {Function} cb - callback for result
   * @returns {undefined}
   */
  getRelativeLayoutByUserId(userId, cb) {
    this.GetDb((err, db) => {
      userId = new ObjectID(userId);
      // Only retrieve the documents with 'loc'
      const plantQuery = {userId, loc: {$exists: true}};
      const plantFields = {_id: true, loc: true};
      const plantOptions = {};
      read(db, 'plant', plantQuery, plantFields, plantOptions, (readPlantError, plants) => {
        if(readPlantError) {
          logger.error('getRelativeLayoutByUserId read plants error:', {readPlantError});
          return cb(readPlantError);
        } else {
          return cb(null, utils.rebaseLocations(plants));
        }
      });
    });
  }

  /**
   * Gets the plant document from the plant collection and sets the
   * notes property of this document to an array of notes queried
   * from the notes collection.
   * @param {string} plantId - mongoId of plant to fetch
   * @param {string} loggedInUserId - the id of the user currently logged in or falsey if anonymous request
   * @param {Function} cb - callback for result
   * @returns {undefined}
   */
  getPlantById(plantId, loggedInUserId, cb) {
    if(!constants.mongoIdRE.test(plantId)) {
      return cb();
    }
    this.GetDb((err, db) => {
      let query = {
        _id: new ObjectID(plantId)
      };
      const fields = {};
      const options = {};

      read(db, 'plant', query, fields, options, (readError, plants) => {
        if(readError) {
          logger.error('plant readError:', {readError});
          return cb(readError);
        } else if(plants) {
          if(plants.length !== 1) {
            logger.error(`Unexpected plant.length: ${plants.length}`, {plants});
          }
          // {_id: {$in: splitNotes.singlePlantNotes}}
          const noteQuery = {plantIds: plants[0]._id};
          const noteFields = {_id: true};
          const noteOptions = { sort: [['date', 'asc']] };
          read(db, 'note', noteQuery, noteFields, noteOptions, (noteReadError, notes) => {
            if(noteReadError) {
              logger.error('note noteReadError', {noteReadError});
              return cb(noteReadError);
            }
            // Convert Mongo ObjectIds to strings
            const plant = this.convertPlantDataForRead(plants[0], loggedInUserId);
            plant.notes = (notes || []).map(note => note._id.toString());
            return cb(readError, plant);
          });
        } else {
          // readError and plant are both falsey
          logger.warn('No plant found in query', {query});
          return cb();
        }
      });
    });
  }

  /**
   * Gets all the plants belonging to a user. Does not populate the notes field.
   * @param {string} userId - the userId to query against the plant collection.
   * @param {string} loggedInUserId - the id of the user currently logged in or falsey if anonymous request
   * @param {Function} cb - callback for result
   * @return {undefined}
   */
  getPlantsByUserId(userId, loggedInUserId, cb) {
    if(!constants.mongoIdRE.test(userId)) {
      return cb();
    }
    this.GetDb((err, db) => {
      userId = new ObjectID(userId);
      const fields = {};
      const options = {};

      read(db, 'user', {_id: userId}, fields, options, (readUserError, user) => {
        if(readUserError) {
          logger.error('getPlantsByUserId read user error', {readUserError});
          return cb(readUserError);
        }
        if(user && user.length === 1) {
          const plantQuery = {userId};
          const plantFields = {};
          const plantOptions = { sort: [['title', 'asc']] };
          read(db, 'plant', plantQuery, plantFields, plantOptions, (readPlantError, plants) => {
            if(readPlantError) {
              logger.error('getPlantsByUserId read plants by userId error:', {readPlantError});
              return cb(readPlantError);
            } else {
              return cb(null, this.convertPlantDataForRead(plants || [], loggedInUserId));
            }
          });
        } else {
          logger.error(`getPlantsByUserId No user found for userId ${userId.toString()}`);
          return cb();
        }
      });
    });
  }

  getPlantsByIds(ids, loggedInUserId, cb) {
    const plantQuery = {
      _id: {$in: ids.map(id => new ObjectID(id))}
    };
    const plantFields = {};
    const plantOptions = { sort: [['title', 'asc']] };
    this.GetDb((err, db) => {
      read(db, 'plant', plantQuery, plantFields, plantOptions, (readPlantError, plants) => {
        if(readPlantError) {
          logger.error('getPlantsByIds read plants by ids error:', {readPlantError});
          return cb(readPlantError);
        } else {
          return cb(null, this.convertPlantDataForRead(plants || [], loggedInUserId));
        }
      });
    });
  }

  // Plant U: updatePlant

  updatePlant(plant, loggedInUserId, cb) {
    if(!plant._id || !plant.userId) {
      logger.error(`Must supply _id (${plant._id}) and userId (${plant.userId}) when updating a plant`);
      return cb(`Must supply _id (${plant._id}) and userId (${plant.userId}) when updating a plant`);
    }
    this.convertPlantDataTypesForSaving(plant);
    this.GetDb((err, db) => {
      const query = _.pick(plant, ['_id', 'userId']);
      const set = _.omit(plant, ['_id']);
      Update.updateOne(db, 'plant', query, set, (updatePlantError) => {
        return cb(updatePlantError, this.convertPlantDataForRead(plant, loggedInUserId));
      });
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
        const noteQuery = {plantIds: _id, userId};
        const noteFields = {};
        const noteOptions = { sort: [['date', 'asc']] };

        read(db, 'note', noteQuery, noteFields, noteOptions, (getNotesError, notesForPlant) => {
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
          remove(db, 'note', deleteQuery, (removeNoteErr /*, removeNoteResults*/) => {
            if(removeNoteErr) {
              logger.error('deleteNotes removeNoteErr', {removeNoteErr});
            }
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
            return Object.assign({},
              note,
              {plantIds: note.plantIds.filter(plantId => plantId !== _id)}
            );
          });
          async.each(updatedNotes, (updateNote, eachDone) => {
            const noteQuery = {_id: updateNote._id};
            const set = _.omit(updateNote, ['_id']);
            Update.updateOne(db, 'note', noteQuery, set, eachDone);
          }, (eachDoneErr) => {
            if(eachDoneErr) {
              logger.error('updateNotes error', {eachDoneErr});
            }
            done(eachDoneErr);
          });
        } else {
          return done();
        }
      }

      function deletePlant(done) {
        remove(db, 'plant', {_id, userId}, done);
      }

      async.waterfall([getNotes, deleteNotes, updateNotes, deletePlant], (waterfallError, deleteResult) => {
        if(waterfallError) {
          logger.error('delete plant finished with error', {waterfallError});
        }
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

  convertNoteDataTypesForSaving(note) {
    if(note._id) {
      note._id = new ObjectID(note._id);
    }
    if(note.date) {
      note.date = utils.dateToInt(note.date);
    }
    if(note.plantIds && note.plantIds.length > 0) {
      note.plantIds = note.plantIds.map(plantId => new ObjectID(plantId));
    }
    note.userId = new ObjectID(note.userId);
  }

  convertNoteDataForRead(note) {
    if(!note) {
      return note;
    }
    if(_.isArray(note)) {
      return note.map(this.convertNoteDataForRead, this);
    } else {
      const convertedNote = this.convertIdToString(note);
      if(convertedNote.userId) {
        convertedNote.userId = convertedNote.userId.toString();
      } else {
        logger.error('In convertNoteDataForRead() there is no userId', {note, convertedNote});
      }
      if(convertedNote.plantIds && convertedNote.plantIds.length) {
        convertedNote.plantIds = (convertedNote.plantIds || []).map(plantId => plantId.toString());
      }
      return convertedNote;
    }
  }

  createNote(note, cb) {
    this.GetDb((err, db) => {
      if(!note.userId) {
        logger.error('userId must be specified as part of note when creating a note', {note});
        return cb('userId must be specified as part of note when creating a note');
      }
      this.convertNoteDataTypesForSaving(note);
      note.plantIds = note.plantIds || [];
      Create.createOne(db, 'note', note, (createOneError, createdNote) => {
        logger.trace('createdNote', {createdNote});
        return cb(createOneError, this.convertNoteDataForRead(createdNote));
      });
    });
  }

  // Note R: getNoteById

  getNotesByQuery(query, cb) {
    this.GetDb((err, db) => {
      const noteFields = {};
      const noteOptions = { sort: [['date', 'asc']] };
      read(db, 'note', query, noteFields, noteOptions, (noteReadError, notes) => {
        if(noteReadError) {
          logger.error('getNotesByQuery error', {noteReadError});
          return cb(noteReadError);
        }

        if(notes && notes.length > 0) {
          return cb(null, this.convertNoteDataForRead(notes));
        } else {
          // This is okay - will happen during an upsert
          logger.trace('getNotesByQuery nothing found', {query});
          cb();
        }
      });
    });
  }

  getNoteByQuery(query, cb) {
    this.getNotesByQuery(query, (notesReadError, notes) => {
      if(notesReadError || !notes || !notes.length) {
        return cb(notesReadError, notes);
      }
      if(notes.length > 1) {
        logger.error('Only expecting 1 note back in getNoteByQuery', {query, notes});
      }
      return cb(null, this.convertNoteDataForRead(notes[0]));
    });
  }

  getNoteById(id, cb) {
    const _id = new ObjectID(id);
    this.getNoteByQuery({_id}, cb);
  }

  getNoteByImageId(imageId, cb) {
    const query = {
      images: { $elemMatch: { id: imageId } }
    };
    this.getNoteByQuery(query, cb);
  }

  getNotesByIds(ids, cb) {
    const query = {
      _id: {$in: ids.map(id => new ObjectID(id))}
    };
    this.getNotesByQuery(query, cb);
  }

  getNotesByPlantId(plantId, cb) {
    const query = {plantIds: new ObjectID(plantId)};
    this.getNotesByQuery(query, cb);
  }

  // Note U: updateNote

  updateNote(note, cb) {
    this.GetDb((err, db) => {
      if(!note.userId) {
        logger.error('userId must be specified as part of note when updating a note', {note});
        return cb('userId must be specified as part of note when updating a note');
      }
      this.convertNoteDataTypesForSaving(note);
      const query = _.pick(note, ['_id', 'userId']);
      const set = _.omit(note, ['_id']);
      Update.updateOne(db, 'note', query, set, (updateNoteError /*, results*/) => {
        // results => {n:1, nModified:1, ok:1}
        return cb(updateNoteError, this.convertNoteDataForRead(note));
      });
    });
  }

  addSizesToNoteImage(noteUpdate, cb) {
    this.GetDb((err, db) => {
      if(!noteUpdate.userId) {
        logger.error('userId must be specified as part of note when updating a note', {noteUpdate});
        return cb('userId must be specified as part of note when updating a note');
      }
      this.convertNoteDataTypesForSaving(noteUpdate);
      const query = _.pick(noteUpdate, ['_id', 'userId']);
      query.images = { $elemMatch: { id: noteUpdate.imageId } };
      const set = {$set: {'images.$.sizes': noteUpdate.sizes}};
      Update.updateOne(db, 'note', query, set, cb);
    });
  }

  // Note UI: upsertNote

  upsertNote(note, cb) {
    const {_id} = note;
    this.getNoteById(_id, (getNoteByIdError, foundNote) => {
      if(getNoteByIdError) {
        // Already logged
        return cb(getNoteByIdError);
      } else {
        if(foundNote) {
          this.updateNote(note, cb);
        } else {
          this.createNote(note, cb);
        }
      }
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

module.exports = new MongoDb();
