// An array of plants loaded from the server.
// Plants could be for any user.
// If a user is logged in then some of the items in the array
// might be plants belonging to the user.

const actions = require('../actions');
const Immutable = require('immutable');

/**
 * This is a helper function for when the action.payload holds a new plant
 * that needs to replace an existing plant in the state object.
 * @param {object} state - existing object of plants. Each key is a mongoId
 * @param {object} action - has type and payload
 * @returns {object} - new state
 */
function replaceInPlace(state, action) {
  return state.mergeDeep({
    [action.payload._id]: action.payload
  });
}

// User clicks save after creating a new plant
function createPlantRequest(state, action) {
  // payload is an object of new plant being POSTed to server
  // an id has already been assigned to this object
  return replaceInPlace(state, action);
}

function ajaxPlantFailure(state, action) {
  return replaceInPlace(state, action);
}

function updatePlantRequest(state, action) {
  // payload is an object of plant being PUT to server
  return replaceInPlace(state, action);
}

// action.payload: <plant-id>
function deletePlant(state, action) {
  // payload is _id of plant being DELETEd from server
  return state.delete(action.payload);
}

// action.payload: <noteId>
// payload is {id} of note being DELETEd from server
// Need to remove this note from the notes array in all plants
function deleteNoteRequest(state, action) {
  return state.map(plant => {
    const noteIds = plant.get('notes');
    if(noteIds && noteIds.size) {
      const index = noteIds.indexOf(action.payload);
      if(index !== -1) {
        const a = noteIds.splice(index, 1);
        return plant.set('notes', a);
      } else {
        return plant;
      }
    } else {
      return plant;
    }
  });
}

// action.payload is a plant object
function loadPlantSuccess(state, action) {
  return replaceInPlace(state, action);
}

function loadPlantFailure(state, action) {
  return replaceInPlace(state, action);
}

// action.payload is an array of plant objects
function loadPlantsSuccess(state, action) {
  if(action.payload && action.payload.length > 0) {
    // const plants = plantArrayToObject(action.payload);
    // return Object.freeze(Object.assign({}, state, plants));
    return state.mergeDeep(action.payload.reduce((acc, plant) => {
      acc[plant._id] = plant;
      return acc;
    }, {}));
  } else {
    return state;
  }
}

// action.payload:
// {_id <plant-id>, mode: 'create/update/read'}
function setPlantMode(state, action) {
  const {_id, mode} = action.payload;
  if(!_id) {
    return state;
  }
  const plant = {[_id]: {mode}};
  return state.mergeDeep(plant);
}

// The action.payload.note is the returned note from the
// server.
function upsertNoteSuccess(state, action) {
  const {
    _id,
    plantIds = []
  } = action.payload.note;

  if(!plantIds.length) {
    console.error('No plantIds in upsertNoteSuccess:', action);
    return state;
  }

  return state.map((plant, plantId) => {
    if(plantIds.indexOf(plantId) === -1) {
      return plant;
    }
    const noteIds = plant.get('notes');
    const index = noteIds.indexOf(_id);
    if(index === -1) {
      return plant.set('notes', noteIds.push(_id));
    } else {
      return plant;
    }
  });
}

const reducers = {
  [actions.CANCEL_PLANT_CREATE_MODE]: deletePlant,
  [actions.CREATE_PLANT_FAILURE]: ajaxPlantFailure,
  [actions.CREATE_PLANT_REQUEST]: createPlantRequest,
  [actions.DELETE_NOTE_REQUEST]: deleteNoteRequest,
  [actions.DELETE_PLANT_FAILURE]: ajaxPlantFailure,
  [actions.DELETE_PLANT_REQUEST]: deletePlant,
  [actions.LOAD_PLANT_FAILURE]: loadPlantFailure,
  [actions.LOAD_PLANT_SUCCESS]: loadPlantSuccess,
  [actions.LOAD_PLANTS_SUCCESS]: loadPlantsSuccess,
  [actions.SET_PLANT_MODE]: setPlantMode,
  [actions.UPDATE_PLANT_FAILURE]: ajaxPlantFailure,
  [actions.UPDATE_PLANT_REQUEST]: updatePlantRequest,
  [actions.UPSERT_NOTE_SUCCESS]: upsertNoteSuccess,
};

module.exports = (state = new Immutable.Map(), action) => {
  if(reducers[action.type]) {
    return reducers[action.type](state, action);
  }

  return state;
};
