// Get all the data from the DB for a single plant to be able
// to render it on the server

const db = require('./mongo');
const async = require('async');

function locations(cb) {
  db.getAllLocations(cb);
}

function emptyObject(cb) {
  cb(null, {});
}

function notes(plantId, cb) {
  db.getNotesByPlantId(plantId, (getNotesErr, retrievedNotes) => {
    if(getNotesErr) {
      return cb(getNotesErr);
    }
    if(retrievedNotes && retrievedNotes.length) {
      const reducedNotes = retrievedNotes.reduce((acc, note) => {
        acc[note._id] = note;
        return acc;
      }, {});
      return cb(null, reducedNotes);
    } else {
      return cb(null, {});
    }
  });
}

function plants(loggedInUser, plantId, cb) {
  const loggedInUserId = loggedInUser && loggedInUser._id;
  db.getPlantsByIds([plantId], loggedInUserId, (getPlantsErr, retrievedPlants) => {
    if(getPlantsErr) {
      return cb(getPlantsErr);
    }
    if(retrievedPlants && retrievedPlants.length) {
      return cb(null, {
        [retrievedPlants[0]._id]: retrievedPlants[0],
      });
    } else {
      return cb(null, {});
    }
  });
}

function user(loggedInUser, cb) {
  cb(null, loggedInUser || {});
}

function users(cb) {
  db.getAllUsers(cb);
}

module.exports = (loggedInUser, plantId, cb) => {
  async.parallel({
    interim: emptyObject,
    locations,
    notes: notes.bind(null, plantId),
    plants: plants.bind(null, loggedInUser, plantId),
    user: user.bind(null, loggedInUser),
    users,
  }, cb);
};

/*
Load:

Users
Locations
Plant
Notes

Final state:

intrim: {}
locations: { id1: {}, id2: {}, ...}
notes: { id1: {}, id2: {}, ...}
plants: { id1: {}}
user: {} - if logged in
users: { id1: {}, id2: {}, ...}

*/
