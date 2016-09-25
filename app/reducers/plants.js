// An array of plants loaded from the server.
// Plants could be for any user.
// If a user is logged in then some of the items in the array
// might be plants belonging to the user.

import cloneDeep from 'lodash/cloneDeep';
import uniq from 'lodash/uniq';
const moment = require('moment');
const actions = require('../actions');

/**
 * This is a helper function for when the action.payload holds a new plant
 * that needs to replace an existing plant in the state object.
 * @param {object} state - existing object of plants. Each key is a mongoId
 * @param {object} action - has type and payload
 * @returns {object} - new state
 */
function replaceInPlace(state, action) {
  return Object.freeze({
    ...state,
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
  // payload is {id} of plant being DELETEd from server
  const newState = {...state};
  delete newState[action.payload];
  return Object.freeze(newState);
}

// action.payload: <noteId>
// payload is {id} of note being DELETEd from server
function deleteNoteRequest(state, action) {
  const newState = Object.keys(state).reduce((acc, plantId) => {
    const plant = state[plantId];
    if((plant.notes || []).indexOf(action.payload) >= 0) {
      acc[plantId] = Object.freeze({
        ...plant,
        notes: plant.notes.filter(noteId => noteId !== action.payload)
      });
    } else {
      acc[plantId] = plant;
    }
    return acc;
  }, {});
  return Object.freeze(newState);
}

// action.payload is a plant object
function loadPlantSuccess(state, action) {
  const {payload: plant} = action;

  if(plant.plantedDate) {
    plant.plantedDate = moment(new Date(plant.plantedDate));
  }
  if(plant.purchasedDate) {
    plant.purchasedDate = moment(new Date(plant.purchasedDate));
  }

  return replaceInPlace(state, {payload: plant});
}

function loadPlantFailure(state, action) {
  return replaceInPlace(state, Object.freeze(action));
}

/**
 * Takes an array of objects that have an _id property and changes
 * it into an object with the _id as the key for each item in the object
 * @param {array} plants - An array to convert
 * @returns {object} - the array expressed as an object.
 */
function plantArrayToObject(plants) {
  return (plants || []).reduce((acc, plant) => {
    if(plant) {
      acc[plant._id] = plant;
    }
    return acc;
  }, {});
}

// action.payload is an array of plant objects
function loadPlantsSuccess(state, action) {
  if(action.payload && action.payload.length > 0) {
    const plants = plantArrayToObject(action.payload);
    return Object.freeze(Object.assign({}, state, plants));
  } else {
    return state;
  }
}

// action.payload:
// {_id <plant-id>, mode: 'create/update/read'}
function setPlantMode(state, action) {
  if(!action.payload._id) {
    return state;
  }
  const plant = cloneDeep(state[action.payload._id]);
  plant.mode = action.payload.mode;
  return replaceInPlace(state, {payload: plant});
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
  }

  const plants = plantIds.map(plantId => {
    const plant = state[plantId];
    if(plant) {
      return {
        ...plant,
        notes: uniq((plant.notes || []).concat(_id))
      };
    } else {
      return undefined;
    }
  });

  return Object.freeze(Object.assign({}, state, plantArrayToObject(plants)));
}

const reducers = {
  [actions.CANCEL_PLANT_CREATE_MODE]: deletePlant,
  [actions.UPSERT_NOTE_SUCCESS]: upsertNoteSuccess,
  [actions.CREATE_PLANT_FAILURE]: ajaxPlantFailure,
  [actions.CREATE_PLANT_REQUEST]: createPlantRequest,
  [actions.DELETE_PLANT_FAILURE]: ajaxPlantFailure,
  [actions.DELETE_PLANT_REQUEST]: deletePlant,
  [actions.DELETE_NOTE_REQUEST]: deleteNoteRequest,
  [actions.LOAD_PLANT_FAILURE]: loadPlantFailure,
  [actions.LOAD_PLANT_SUCCESS]: loadPlantSuccess,
  [actions.LOAD_PLANTS_SUCCESS]: loadPlantsSuccess,
  [actions.SET_PLANT_MODE]: setPlantMode,
  [actions.UPDATE_PLANT_FAILURE]: ajaxPlantFailure,
  [actions.UPDATE_PLANT_REQUEST]: updatePlantRequest,
};

module.exports = (state = {}, action) => {
  if(reducers[action.type]) {
    return reducers[action.type](state, action);
  }

  return state;
};
