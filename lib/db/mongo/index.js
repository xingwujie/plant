const _ = require('lodash');
const async = require('async');
const constants = require('../../../app/libs/constants');
const read = require('./read');
const Create = require('./create');
const Update = require('./update');
const remove = require('./delete');
const mongodb = require('mongodb');
const utils = require('../../../app/libs/utils');

const { ObjectID } = mongodb;

const mongoConnection = `mongodb://${process.env.PLANT_DB_URL || '127.0.0.1'}/${process.env.PLANT_DB_NAME || 'plant'}`;

const logger = require('../../logging/logger').create('mongo-index');

// This stores a cache of the user's location
const locationLocCache = {};

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

  // eslint-disable-next-line class-methods-use-this
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
    if (this.db) {
      return cb(null, this.db);
    }
    logger.trace('mongoConnection', { mongoConnection });
    return mongodb.MongoClient.connect(mongoConnection, (err, db) => {
      if (err) {
        logger.error(`Connection to ${mongoConnection} failed:`, { err });
        return cb(err);
      }
      logger.trace('DB successfully connected.');
      this.db = db;
      return cb(err, db);
    });
  }

  _close() {
    this.GetDb((getDbErr, db) => {
      logger.trace('Closing...', { getDbErr });
      // db.disconnect();
      db.close(true, (closeErr) => {
        logger.trace('Callback from close', { closeErr });
      });
    });
  }

  /**
   * Helper function to convert _id from MongoId to string. Used in reads
   * @param {object} obj - Object that might have an _id
   * @returns {object} - the same object with a converted _id
   */
  convertIdToString(obj) {
    if (_.isArray(obj)) {
      return obj.map(this.convertIdToString, this);
    }
    if (obj && obj._id) {
      // eslint-disable-next-line no-param-reassign
      obj._id = obj._id.toString();
    }
    return obj;
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
      this.GetDb((err, db) => done(err, { db }));
    };

    // 2. data.db is now set
    //    Set the query to find the user
    const setQuery = (data, done) => {
      if (!_.get(userDetails, 'facebook.id') && !_.get(userDetails, 'google.id')) {
        return done(new Error('No facebook.id or google.id:', JSON.stringify(userDetails)));
      }

      // eslint-disable-next-line no-param-reassign
      data.query = userDetails.facebook
        ? {
          'facebook.id': userDetails.facebook.id,
        }
        : {
          'google.id': userDetails.google.id,
        };

      return done(null, data);
    };

    // 3. Find the user by OAuth provider id
    const getUser = (data, done) => {
      read(data.db, 'user', data.query, {}, {}, (readError, user) => {
        if (readError) {
          logger.error('user readError:', { readError });
          return done(readError);
        }

        if (user && user.length !== 1) {
          logger.error(`Unexpected user.length: ${user.length}`, { user });
        }

        if (user && user.length > 0) {
          // eslint-disable-next-line no-param-reassign
          data.user = this.convertIdToString(user[0]);
        }

        return done(null, data);
      });
    };

    // 4. If user not found then try find by email
    const getUserByEmail = (data, done) => {
      if (data.user) {
        return done(null, data);
      }
      if (userDetails.email) {
        // eslint-disable-next-line no-param-reassign
        data.query = {
          email: userDetails.email,
        };
        return getUser(data, done);
      }
      return done(null, data);
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
      if (!data.user) {
        return done(null, data);
      }
      _.merge(data.user, userDetails);
      const userData = _.omit(data.user, ['_id']);
      const query = { _id: new ObjectID(data.user._id) };
      return Update.updateOne(data.db, 'user', query, userData, (err, result) => {
        if (!result || result.n === 0) {
          logger.error('User not updated', { data, result, query });
          return done(`update did not update any docs with query: ${JSON.stringify(query)}`);
        }
        if (err) {
          logger.error('Error in user update', { data }, { err }, { result });
        }
        return done(err, data);
      });
    };

    // 6. Create user
    const createUser = (data, done) => {
      if (data.user) {
        this.getLocationsByUserId(data.user._id, (getLocationsByUserId, locations) => {
          // eslint-disable-next-line no-param-reassign
          data.user.locationIds = (locations || []).map(location => location._id.toString());
          return done(null, data.user);
        });
      } else {
        Create.createOne(data.db, 'user', userDetails, (createOneError, createdUser) => {
          this.convertIdToString(createdUser);
          if (createOneError) {
            return done(createOneError, createdUser);
          }
          const location = {
            userId: createdUser._id,
            userIds: [{ id: createdUser._id, role: 'owner' }],
            title: `${createdUser.name || ''} Yard`,
          };
          return this.createLocation(location, (createLocationError, createdLocation) => {
            // eslint-disable-next-line no-param-reassign
            createdUser.locationIds = [createdLocation._id];
            return done(createOneError, createdUser);
          });
        });
      }
    };

    async.waterfall([
      getDb,
      setQuery,
      getUser,
      getUserByEmail,
      updateUser,
      createUser,
    ], cb);
  }

  // User R: Read user
  getUserByQuery(query, cb) {
    this.GetDb((err, db) => {
      const fields = { _id: true, name: true, createdAt: true };
      const options = {};

      read(db, 'user', query, fields, options, (readUserError, users) => {
        if (readUserError) {
          logger.error('getUserByQuery readUserError:', { readUserError, query });
          return cb(readUserError);
        }
        return cb(null, users);
      });
    });
  }

  getUserById(userId, cb) {
    if (!constants.mongoIdRE.test(userId)) {
      return cb();
    }
    const userQuery = {
      _id: new ObjectID(userId),
    };

    return this.getUserByQuery(userQuery, (getUserByQueryError, users) => {
      if (getUserByQueryError) {
        return cb(getUserByQueryError);
      } else if (users) {
        if (users.length !== 1) {
          logger.error(`Unexpected users.length: ${users.length}`, { users });
        }

        const locationQuery = { 'userIds.id': users[0]._id };
        return this.GetDb((err, db) => {
          read(db, 'location', locationQuery, { _id: true, userIds: true }, {}, (locationReadError, locations) => {
            // Convert Mongo ObjectIds to strings
            const user = this.convertIdToString(users[0]);
            this.convertLocationDataForRead(locations);
            user.locationIds = (locations || []).map(location => location._id);
            return cb(null, _.pick(user, ['_id', 'name', 'createdAt', 'locationIds']));
          });
        });
      }

      logger.warn('No user found in query', { userQuery });
      return cb();
    });
  }

  /**
   * Given a collection of users and locations return a collection of users
   * with the locationIds populated for each user.
   * The Mongo ObjectIds should have already been stringified in each collection
   * @param {array} users - an array of users
   * @param {array} locations - an array of locations
   * @returns {array} an array of users
   */
  // eslint-disable-next-line class-methods-use-this
  getUsersWithLocations(users, locations) {
    return (users || []).map((user) => {
      const filteredLoc = (locations || []).filter(location =>
        location.userIds.find(userLoc => userLoc.id === user._id));
      // eslint-disable-next-line no-param-reassign
      user.locationIds = filteredLoc.map(p => p._id);
      return user;
    });
  }

  // User U: Update user

  _updateUser(user, cb) {
    const _id = typeof user._id === 'string' ? new ObjectID(user._id) : user._id;
    this.GetDb((err, db) => {
      const query = { _id };
      const set = _.omit(user, ['_id']);
      Update.updateOne(db, 'user', query, set, updateUserError => cb(updateUserError, user));
    });
  }

  // User D: No Delete function for User yet
  // End CRUD methods for collection "user"

  // CRUD operations for Plant collection

  // Plant C: cratePlant

  // eslint-disable-next-line class-methods-use-this
  convertPlantDataTypesForSaving(plant) {
    if (plant._id) {
      // eslint-disable-next-line no-param-reassign
      plant._id = new ObjectID(plant._id);
    }
    // eslint-disable-next-line no-param-reassign
    plant.userId = new ObjectID(plant.userId);
    // eslint-disable-next-line no-param-reassign
    plant.locationId = new ObjectID(plant.locationId);
    const dateFields = ['plantedDate', 'purchasedDate', 'terminatedDate'];
    dateFields.forEach((dateField) => {
      if (plant[dateField]) {
        // eslint-disable-next-line no-param-reassign
        plant[dateField] = utils.dateToInt(plant[dateField]);
      }
    });
  }

  /**
   * Rebases a plant based on the location's loc value
   * @param {object} plant - plant object with a loc property that needs rebasing
   * @param {object} loc - the location's loc object
   * @returns {object} - the rebased plant object.
   */
  // eslint-disable-next-line class-methods-use-this
  rebasePlant(plant, loc) {
    // eslint-disable-next-line no-param-reassign
    plant.loc.coordinates[0] = loc.coordinates[0] - plant.loc.coordinates[0];
    // eslint-disable-next-line no-param-reassign
    plant.loc.coordinates[1] = loc.coordinates[1] - plant.loc.coordinates[1];
    return plant;
  }

  /**
   * Rebase the plant's location by the location's "loc" location
   * If the location document does not have a loc property then assign
   * the loc property from the plant as the location's loc value.
   * @param {object} plant - the plant which needs the loc rebased
   * @param {function} cb - function to call once done
   * @returns {undefined}
   */
  rebasePlantByLoc(plant, cb) {
    if (locationLocCache[plant.locationId]) {
      return cb(null, this.rebasePlant(plant, locationLocCache[plant.locationId]));
    }
    return this.GetDb((err, db) => {
      const locationQuery = {
        _id: new ObjectID(plant.locationId),
      };
      const fields = {};
      const options = {};

      read(db, 'location', locationQuery, fields, options, (readLocationError, locations) => {
          // Might have been cached by a parallel async call so check again
        if (locationLocCache[plant.locationId]) {
          return cb(null, this.rebasePlant(plant, locationLocCache[plant.locationId]));
        }

        if (readLocationError) {
          logger.error('rebasePlantByLoc readLocationError:', { readLocationError, locationQuery });
          // eslint-disable-next-line no-param-reassign
          delete plant.loc;
          return cb(readLocationError, plant);
        }
        const locat = locations[0];
        if (locat.loc) {
          locationLocCache[plant.locationId] = locat.loc;
          return cb(null, this.rebasePlant(plant, locationLocCache[plant.locationId]));
        }
        locationLocCache[plant.locationId] = plant.loc;
        locat.loc = plant.loc;

        return Update.updateOne(db, 'location', locationQuery, locat, updateLocationError =>
          cb(updateLocationError, this.rebasePlant(plant, locationLocCache[plant.locationId])));
      });
    });
  }

  convertPlantDataForRead(plant, loggedInUserId, cb) {
    if (!plant) {
      return plant;
    }
    if (_.isArray(plant)) {
      const _this = this;
      return async.map(plant, (p, done) => {
        _this.convertPlantDataForRead(p, loggedInUserId, done);
      }, cb);
    }

    const convertedPlant = this.convertIdToString(plant);
    if (convertedPlant.userId) {
      convertedPlant.userId = convertedPlant.userId.toString();
    }

    // Only return the geoLocation of the plant if it's the
    // logged in user requesting their own plant
    if (convertedPlant.loc && convertedPlant.userId !== loggedInUserId) {
      return this.rebasePlantByLoc(convertedPlant, cb);
    }
    return cb(null, convertedPlant);
  }

  createPlant(plant, loggedInUserId, cb) {
    this.GetDb((err, db) => {
      if (!plant.userId) {
        logger.warn('Missing plant.userId', { plant });
        return cb('userId must be specified as part of plant when creating a plant');
      }
      this.convertPlantDataTypesForSaving(plant);
      return Create.createOne(db, 'plant', plant, (createOnePlantErr, createdPlant) => {
        if (createOnePlantErr) {
          logger.error('createOne plant error', { createOnePlantErr });
          return cb(createOnePlantErr);
        }
        return this.convertPlantDataForRead(createdPlant, loggedInUserId, cb);
      });
    });
  }

  /**
   * Gets the plant document from the plant collection and sets the
   * notes property of this document to an array of notes queried
   * from the notes collection.
   * @param {string} plantId - mongoId of plant to fetch
   * @param {string} loggedInUserId - the id of the user currently logged in or falsey if
   *   anonymous request
   * @param {Function} cb - callback for result
   * @returns {undefined}
   */
  getPlantById(plantId, loggedInUserId, cb) {
    if (!constants.mongoIdRE.test(plantId)) {
      return cb();
    }
    return this.GetDb((err, db) => {
      const query = {
        _id: new ObjectID(plantId),
      };
      const fields = {};
      const options = {};

      read(db, 'plant', query, fields, options, (readError, plants) => {
        if (readError) {
          logger.error('plant readError:', { readError });
          return cb(readError);
        } else if (plants) {
          if (plants.length !== 1) {
            logger.error(`Unexpected plant.length: ${plants.length}`, { plants });
          }
          // {_id: {$in: splitNotes.singlePlantNotes}}
          const noteQuery = { plantIds: plants[0]._id };
          const noteFields = { _id: true };
          const noteOptions = { sort: [['date', 'asc']] };
          return read(db, 'note', noteQuery, noteFields, noteOptions, (noteReadError, notes) => {
            if (noteReadError) {
              logger.error('note noteReadError', { noteReadError });
              return cb(noteReadError);
            }
            // Convert Mongo ObjectIds to strings
            return this.convertPlantDataForRead(plants[0], loggedInUserId,
              (convertPlantDataForReadError, plant) => {
                // eslint-disable-next-line no-param-reassign
                plant.notes = (notes || []).map(note => note._id.toString());
                return cb(readError, plant);
              });
          });
        }

        // readError and plant are both falsey
        logger.warn('No plant found in query', { query });
        return cb();
      });
    });
  }

  /**
   * Gets all the plants belonging to a user. Does not populate the notes field.
   * @param {string} locationId - the locationId to query against the plant collection.
   * @param {string} loggedInUserId - the id of the user currently logged in or
   *   falsey if anonymous request
   * @param {Function} cb - callback for result
   * @return {undefined}
   */
  getPlantsByLocationId(locationId, loggedInUserId, cb) {
    if (!constants.mongoIdRE.test(locationId)) {
      return cb();
    }
    return this.GetDb((err, db) => {
      const _id = new ObjectID(locationId);
      const fields = {};
      const options = {};

      read(db, 'location', { _id }, fields, options, (readLocationError, locations) => {
        if (readLocationError) {
          logger.error('getPlantsByLocationId read user error', { readLocationError });
          return cb(readLocationError);
        }
        if (locations && locations.length > 0) {
          const plantQuery = { locationId: _id };
          const plantFields = {};
          const plantOptions = { sort: [['title', 'asc']] };
          return read(db, 'plant', plantQuery, plantFields, plantOptions, (readPlantError, plants) => {
            if (readPlantError) {
              logger.error('getPlantsByLocationId read plants by locationId error:', { readPlantError });
              return cb(readPlantError);
            }
            return this.convertPlantDataForRead(plants || [], loggedInUserId, cb);
          });
        }

        logger.error(`getPlantsByLocationId No user found for locationId ${locationId}`);
        return cb();
      });
    });
  }

  getPlantsByIds(ids, loggedInUserId, cb) {
    const plantQuery = {
      _id: { $in: ids.map(id => new ObjectID(id)) },
    };
    const plantFields = {};
    const plantOptions = { sort: [['title', 'asc']] };
    this.GetDb((err, db) => {
      read(db, 'plant', plantQuery, plantFields, plantOptions, (readPlantError, plants) => {
        if (readPlantError) {
          logger.error('getPlantsByIds read plants by ids error:', { readPlantError });
          return cb(readPlantError);
        }
        return this.convertPlantDataForRead(plants || [], loggedInUserId, cb);
      });
    });
  }

  // Plant U: updatePlant

  updatePlant(plant, loggedInUserId, cb) {
    if (!plant._id || !plant.userId) {
      logger.error(`Must supply _id (${plant._id}) and userId (${plant.userId}) when updating a plant`);
      return cb(`Must supply _id (${plant._id}) and userId (${plant.userId}) when updating a plant`);
    }
    this.convertPlantDataTypesForSaving(plant);
    return this.GetDb((err, db) => {
      const query = _.pick(plant, ['_id', 'userId']);
      const set = _.omit(plant, ['_id']);
      Update.updateOne(db, 'plant', query, set, (updatePlantError) => {
        this.convertPlantDataForRead(plant, loggedInUserId,
          (convertPlantDataForReadErr, convertedPlant) => cb(updatePlantError, convertedPlant));
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
      // eslint-disable-next-line no-param-reassign
      _id = new ObjectID(_id);
      // eslint-disable-next-line no-param-reassign
      userId = new ObjectID(userId);

      function getNotes(done) {
        const noteQuery = { plantIds: _id, userId };
        const noteFields = {};
        const noteOptions = { sort: [['date', 'asc']] };

        read(db, 'note', noteQuery, noteFields, noteOptions, (getNotesError, notesForPlant) => {
          if (getNotesError) {
            return done(getNotesError);
          }
            // Split the notesForPlant array in 2:
            // 1. Those that only reference this plant - need to delete these
            // 2. Those that reference multiple plants - need to update these and
            //    remove this plant's reference
          const splitNotes = (notesForPlant || []).reduce((acc, note) => {
            if (note.plantIds.length === 1) {
              acc.singlePlantNotes.push(note._id);
            } else {
              acc.multiplePlantNotes.push(note);
            }
            return acc;
          }, { singlePlantNotes: [], multiplePlantNotes: [] });
          return done(null, splitNotes);
        });
      }

      function deleteNotes(splitNotes, done) {
        // TODO: Confirm that this does a bulk delete
        // Need tests where noteIds end up being array of:
        // 0, 1, 2 in length
        if (splitNotes.singlePlantNotes.length > 0) {
          const deleteQuery = { _id: { $in: splitNotes.singlePlantNotes } };
          remove(db, 'note', deleteQuery, (removeNoteErr /* , removeNoteResults*/) => {
            if (removeNoteErr) {
              logger.error('deleteNotes removeNoteErr', { removeNoteErr });
            }
            // TODO: Add a check that the number of documents removed in removeNoteResults
            // is same as length of array passed to _id.
            // Don't need the singlePlantNotes anymore so don't need to pass them on.
            done(removeNoteErr, splitNotes.multiplePlantNotes);
          });
        } else {
          done(null, splitNotes.multiplePlantNotes);
        }
      }

      function updateNotes(multiplePlantNotes, done) {
        if (multiplePlantNotes.length > 0) {
          const updatedNotes = multiplePlantNotes.map(note => Object.assign({},
              note,
              { plantIds: note.plantIds.filter(plantId => plantId !== _id) },
            ));
          return async.each(updatedNotes, (updateNote, eachDone) => {
            const noteQuery = { _id: updateNote._id };
            const set = _.omit(updateNote, ['_id']);
            Update.updateOne(db, 'note', noteQuery, set, eachDone);
          }, (eachDoneErr) => {
            if (eachDoneErr) {
              logger.error('updateNotes error', { eachDoneErr });
            }
            return done(eachDoneErr);
          });
        }
        return done();
      }

      function deletePlant(done) {
        remove(db, 'plant', { _id, userId }, done);
      }

      async.waterfall([getNotes, deleteNotes, updateNotes, deletePlant],
        (waterfallError, deleteResult) => {
          if (waterfallError) {
            logger.error('delete plant finished with error', { waterfallError });
          }
          cb(waterfallError, deleteResult);
        });
    });
  }

  // Only used for testing - so far - needs to delete notes as well if to be used in prod
  deleteAllPlantsByUserId(userId, cb) {
    this.GetDb((err, db) => {
      // eslint-disable-next-line no-param-reassign
      userId = new ObjectID(userId);
      remove(db, 'plant', { userId }, cb);
    });
  }

  // End CRUD methods for Plant collection

  // CRUD operations for Note collection

  // Note C: createNote

  // eslint-disable-next-line class-methods-use-this
  convertNoteDataTypesForSaving(note) {
    if (note._id) {
      // eslint-disable-next-line no-param-reassign
      note._id = new ObjectID(note._id);
    }
    if (note.date) {
      // eslint-disable-next-line no-param-reassign
      note.date = utils.dateToInt(note.date);
    }
    if (note.plantIds && note.plantIds.length > 0) {
      // eslint-disable-next-line no-param-reassign
      note.plantIds = note.plantIds.map(plantId => new ObjectID(plantId));
    }
    // eslint-disable-next-line no-param-reassign
    note.userId = new ObjectID(note.userId);
  }

  convertNoteDataForRead(note) {
    if (!note) {
      return note;
    }
    if (_.isArray(note)) {
      return note.map(this.convertNoteDataForRead, this);
    }
    const convertedNote = this.convertIdToString(note);
    if (convertedNote.userId) {
      convertedNote.userId = convertedNote.userId.toString();
    } else {
      logger.error('In convertNoteDataForRead() there is no userId', { note, convertedNote });
    }
    if (convertedNote.plantIds && convertedNote.plantIds.length) {
      convertedNote.plantIds = (convertedNote.plantIds || []).map(plantId => plantId.toString());
    }
    return convertedNote;
  }

  createNote(note, cb) {
    this.GetDb((err, db) => {
      if (!note.userId) {
        logger.error('userId must be specified as part of note when creating a note', { note });
        return cb('userId must be specified as part of note when creating a note');
      }
      this.convertNoteDataTypesForSaving(note);
      // eslint-disable-next-line no-param-reassign
      note.plantIds = note.plantIds || [];
      return Create.createOne(db, 'note', note, (createOneError, createdNote) => {
        logger.trace('createdNote', { createdNote });
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
        if (noteReadError) {
          logger.error('getNotesByQuery error', { noteReadError });
          return cb(noteReadError);
        }

        if (notes && notes.length > 0) {
          return cb(null, this.convertNoteDataForRead(notes));
        }
          // This is okay - will happen during an upsert
        logger.trace('getNotesByQuery nothing found', { query });
        return cb();
      });
    });
  }

  getNoteByQuery(query, cb) {
    this.getNotesByQuery(query, (notesReadError, notes) => {
      if (notesReadError || !notes || !notes.length) {
        return cb(notesReadError, notes);
      }
      if (notes.length > 1) {
        logger.error('Only expecting 1 note back in getNoteByQuery', { query, notes });
      }
      return cb(null, this.convertNoteDataForRead(notes[0]));
    });
  }

  getNoteById(id, cb) {
    const _id = new ObjectID(id);
    this.getNoteByQuery({ _id }, cb);
  }

  getNoteByImageId(imageId, cb) {
    const query = {
      images: { $elemMatch: { id: imageId } },
    };
    this.getNoteByQuery(query, cb);
  }

  getNotesByIds(ids, cb) {
    const query = {
      _id: { $in: ids.map(id => new ObjectID(id)) },
    };
    this.getNotesByQuery(query, cb);
  }

  getNotesByPlantId(plantId, cb) {
    const query = { plantIds: new ObjectID(plantId) };
    this.getNotesByQuery(query, cb);
  }

  // Note U: updateNote

  updateNote(note, cb) {
    this.GetDb((err, db) => {
      if (!note.userId) {
        logger.error('userId must be specified as part of note when updating a note', { note });
        return cb('userId must be specified as part of note when updating a note');
      }
      this.convertNoteDataTypesForSaving(note);
      const query = _.pick(note, ['_id', 'userId']);
      const set = _.omit(note, ['_id']);
      return Update.updateOne(db, 'note', query, set, updateNoteError =>
        // results => {n:1, nModified:1, ok:1}
         cb(updateNoteError, this.convertNoteDataForRead(note)));
    });
  }

  addSizesToNoteImage(noteUpdate, cb) {
    this.GetDb((err, db) => {
      if (!noteUpdate.userId) {
        logger.error('userId must be specified as part of note when updating a note', { noteUpdate });
        return cb('userId must be specified as part of note when updating a note');
      }
      this.convertNoteDataTypesForSaving(noteUpdate);
      const query = _.pick(noteUpdate, ['_id', 'userId']);
      query.images = { $elemMatch: { id: noteUpdate.imageId } };
      const set = { $set: { 'images.$.sizes': noteUpdate.sizes } };
      logger.info('mongo.addSizesToNoteImage', { query, set });
      return Update.updateOne(db, 'note', query, set, cb);
    });
  }

  // Note UI: upsertNote

  upsertNote(note, cb) {
    const { _id } = note;
    this.getNoteById(_id, (getNoteByIdError, foundNote) => {
      if (getNoteByIdError) {
        // Already logged
        return cb(getNoteByIdError);
      }
      return foundNote
        ? this.updateNote(note, cb)
        : this.createNote(note, cb);
    });
  }

  // Note D: deleteNote

  deleteNote(_id, userId, cb) {
    this.GetDb((err, db) => {
      remove(db, 'note', {
        _id: new ObjectID(_id),
        userId: new ObjectID(userId),
      }, cb);
    });
  }

  // End CRUD methods for Note collection

  // CRUD operations for Location collection

  // Location C: createLocation
  // eslint-disable-next-line class-methods-use-this
  convertLocationDataTypesForSaving(loc) {
    if (loc._id) {
      // eslint-disable-next-line no-param-reassign
      loc._id = new ObjectID(loc._id);
    }
    if (loc.userId) {
      // eslint-disable-next-line no-param-reassign
      loc.userId = new ObjectID(loc.userId);
    }
    (loc.userIds || []).forEach((userId) => {
      // eslint-disable-next-line no-param-reassign
      userId.id = new ObjectID(userId.id);
    });
  }

  convertLocationDataForRead(loc) {
    if (!loc) {
      return loc;
    }
    if (_.isArray(loc)) {
      return loc.map(this.convertLocationDataForRead, this);
    }
    const convertedLocation = this.convertIdToString(loc);
    (convertedLocation.userIds || []).forEach((userId) => {
      // eslint-disable-next-line no-param-reassign
      userId.id = userId.id.toString();
    });
    if (convertedLocation.userId) {
      convertedLocation.userId = convertedLocation.userId.toString();
    }
    return convertedLocation;
  }

  createLocation(loc, cb) {
    this.GetDb((err, db) => {
      if (!loc.userIds || !loc.userId) {
        const errMsg = 'userIds and userId must be specified as part of location when creating a location';
        logger.error(errMsg, { loc });
        return cb(errMsg);
      }
      this.convertLocationDataTypesForSaving(loc);
      return Create.createOne(db, 'location', loc, (createOneError, createdLocation) => {
        logger.trace('createdLocation', { createdLocation });
        return cb(createOneError, this.convertLocationDataForRead(createdLocation));
      });
    });
  }

  // Location R: getLocationById

  getAllUsers(cb) {
    this.GetDb((err, db) => {
      const userQuery = {};
      const userFields = { _id: true, name: true, createdAt: true };
      const userOptions = {};

      read(db, 'user', userQuery, userFields, userOptions, (getUserError, users) => {
        if (getUserError) {
          return cb(getUserError, users);
        }
        // eslint-disable-next-line no-param-reassign
        users = this.convertIdToString(users);

        const locationQuery = {};
        const locationFields = { _id: true, userIds: true };
        const locationOptions = {};
        return read(db, 'location', locationQuery, locationFields, locationOptions, (locationReadError, locations) => {
          if (locationReadError) {
            return cb(null, users);
          }
          this.convertLocationDataForRead(locations);
          const usersWithlocationIds = this.getUsersWithLocations(users, locations);
          return cb(null, usersWithlocationIds);
        });
      });
    });
  }

  getLocationsByQuery(query, cb) {
    this.GetDb((err, db) => {
      const locationFields = {};
      const locationOptions = {};
      read(db, 'location', query, locationFields, locationOptions, (locationReadError, locationsData) => {
        if (locationReadError) {
          logger.error('getLocationsByQuery error', { locationReadError });
          return cb(locationReadError);
        }

        const locations = this.convertLocationDataForRead(locationsData);
        const plantQuery = {};
        const plantFields = { _id: true, locationId: true };
        const plantOptions = {};
        return read(db, 'plant', plantQuery, plantFields, plantOptions, (plantReadError, plants) => {
          if (plantReadError) {
            return cb(null, locations);
          }
          const stringPlants = (plants || []).map(plant => ({
            _id: plant._id.toString(),
            locationId: plant.locationId.toString(),
          }));
          const locationsWithPlantIds = (locations || []).map((location) => {
            // eslint-disable-next-line no-param-reassign
            location.plantIds = stringPlants.filter(plant =>
              plant.locationId === location._id.toString()).map(p => p._id);
            return location;
          });
          return cb(null, locationsWithPlantIds);
        });
      });
    });
  }

  getAllLocations(cb) {
    this.getLocationsByQuery({}, cb);
  }

  getLocationById(id, cb) {
    const _id = new ObjectID(id);
    this.getLocationsByQuery({ _id }, cb);
  }

  getLocationsByIds(ids, cb) {
    const query = {
      _id: { $in: ids.map(id => new ObjectID(id)) },
    };
    this.getLocationsByQuery(query, cb);
  }

  /**
   * Gets all locations that the specified user manages or owns
   * @param {string} userId - the userId of the user
   * @param {function} cb - method to call with the results
   * @returns {undefined}
   */
  getLocationsByUserId(userId, cb) {
    const query = { 'userIds.id': new ObjectID(userId) };
    this.getLocationsByQuery(query, cb);
  }

  // Location U: updateLocation

  updateLocationById(loc, cb) {
    this.GetDb((err, db) => {
      if (!loc.userId) {
        const errMsg = 'userId must be specified as part of location when updating a location';
        logger.error(errMsg, { loc });
        return cb(errMsg);
      }
      this.convertLocationDataTypesForSaving(loc);
      const query = _.pick(loc, ['_id']);
      // The userId is the id of the user doing the update which needs to be an owner.
      query.userIds = { id: loc.userId, role: 'owner' };
      // Remove the userId so that the location creator remains the userId of this document
      const set = _.omit(loc, ['_id', 'userId']);
      return Update.updateOne(db, 'location', query, set, updateLocationError =>
        // results => {n:1, nModified:1, ok:1}
         cb(updateLocationError, this.convertLocationDataForRead(loc)));
    });
  }

  // Location D: deleteLocation

  deleteLocation(_id, userId, cb) {
    this.GetDb((err, db) => {
      remove(db, 'location', {
        _id: new ObjectID(_id),
        // TODO: Need to test this...
        userIds: {
          id: new ObjectID(userId),
          role: 'owner',
        },
      }, cb);
    });
  }

  // End CRUD methods for Location collection


  // Temporary function for setting the location value in the plant collection
  _setLocation(userId, locationId, cb) {
    // eslint-disable-next-line no-param-reassign
    userId = typeof userId === 'string' ? new ObjectID(userId) : userId;
    // eslint-disable-next-line no-param-reassign
    locationId = typeof locationId === 'string' ? new ObjectID(locationId) : locationId;
    this.GetDb((err, db) => {
      const query = { userId };
      const set = { $set: { locationId } };
      Update.updateMany(db, 'plant', query, set, (updateLocationError, results) =>
        // results => {n:1, nModified:1, ok:1}
         cb(updateLocationError, results));
    });
  }

  _getAllUsersOnly(cb) {
    this.GetDb((err, db) => {
      read(db, 'user', {}, {}, {}, cb);
    });
  }
}

module.exports = new MongoDb();
