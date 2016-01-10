// A collection of plants loaded from the server. (an object)
// Plants could be for any user.
// If a user is logged in then some of the items in the object
// might be plants belonging to the user.

// Each key in the plants object is a document id that represents a plant.

// meta object:
// status: 'create', 'create-saving', 'update', 'update-saving', 'delete-saving', 'error'
// error: A string representing the reason why the status is 'error'

import {
  CREATE_PLANT_REQUEST,
  CREATE_PLANT_FAILURE,
  UPDATE_PLANT_REQUEST,
  UPDATE_PLANT_FAILURE,
  DELETE_PLANT_REQUEST,
  DELETE_PLANT_FAILURE,
  LOAD_PLANT_REQUEST,
  LOAD_PLANT_FAILURE,
  LOAD_PLANT_SUCCESS,
  LOAD_PLANTS_REQUEST,
  LOAD_PLANTS_SUCCESS,
  LOAD_PLANTS_FAILURE
  } from '../actions';

// User clicks save after creating a new plant
function createPlantRequest(state, action) {
  // payload is an object of new plant being POSTed to server
  // an id has already been assigned to this object
  console.log('reducer createPlantRequest:', action);
  return [...state, action.payload];
}

// User clicks save after creating a new plant
function ajaxPlantFailure(state, action) {
  const removed = state.filter(plant => plant._id !== action.payload.id);
  return [...removed, action.payload];
}

// User clicks save after update a plant
function updatePlantRequest(state, action) {
  // payload is an object of plant being PUTed to server
  // an id has already been assigned to this object
  const removed = state.filter(plant => plant._id !== action.payload.id);
  return [...removed, action.payload];
}

function deletePlantRequest(state, action) {
  // payload is {id} of plant being DELETEd from server
  console.group('deletePlantRequest');
  console.log(state, action);
  const rVal = state.filter(plant => plant._id !== action.payload);
  console.log(rVal);
  console.groupEnd();
  return rVal;
}

function loadPlantRequest(state, action) {
  console.log('loadPlantRequest:', action);
  return state;
}

function loadPlantSuccess(state, action) {
  const removed = state.filter(plant => plant._id !== action.payload.id);
  return [...removed, action.payload];
}

function loadPlantFailure(state, action) {
  const removed = state.filter(plant => plant._id !== action.payload.id);
  return [...removed, action.payload];
}

function loadPlantsRequest(state /*, action*/) {
  // Placeholder. Can put a flag in the state in future indicating that a load is in progress
  return state;
}

function loadPlantsSuccess(state, action) {
  const ids = action.payload.map(plant => plant._id);
  const removed = state.filter(plant => ids.indexOf(plant._id >= 0));
  return [...removed, ...action.payload];
}

function loadPlantsFailure(state, action) {
  console.log('loadPlantsFailure:', action);
  return state;
}

const reducers = {
  [CREATE_PLANT_REQUEST]: createPlantRequest,
  [CREATE_PLANT_FAILURE]: ajaxPlantFailure,
  [UPDATE_PLANT_FAILURE]: ajaxPlantFailure,
  [DELETE_PLANT_FAILURE]: ajaxPlantFailure,
  [UPDATE_PLANT_REQUEST]: updatePlantRequest,
  [DELETE_PLANT_REQUEST]: deletePlantRequest,
  [LOAD_PLANT_REQUEST]: loadPlantRequest,
  [LOAD_PLANT_SUCCESS]: loadPlantSuccess,
  [LOAD_PLANT_FAILURE]: loadPlantFailure,
  [LOAD_PLANTS_REQUEST]: loadPlantsRequest,
  [LOAD_PLANTS_SUCCESS]: loadPlantsSuccess,
  [LOAD_PLANTS_FAILURE]: loadPlantsFailure,
};

export default (state = [], action) => {
  if(reducers[action.type]) {
    return reducers[action.type](state, action);
  }

  return state;
};
