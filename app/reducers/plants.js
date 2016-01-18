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
  LOAD_PLANTS_FAILURE,
  SET_PLANT_MODE,
  CANCEL_PLANT_CREATE_MODE,
  } from '../actions';

// User clicks save after creating a new plant
function createPlantRequest(state, action) {
  // payload is an object of new plant being POSTed to server
  // an id has already been assigned to this object
  return [...state, action.payload];
}

// User clicks save after creating a new plant
function ajaxPlantFailure(state, action) {
  const keepers = state.filter(plant => plant._id !== action.payload._id);
  return [...keepers, action.payload];
}

// User clicks save after update a plant
function updatePlantRequest(state, action) {
  // payload is an object of plant being PUT to server
  // an id has already been assigned to this object
  const keepers = state.filter(plant => plant._id !== action.payload._id);
  return [...keepers, action.payload];
}

// action.payload: <plant-id>
function deletePlant(state, action) {
  // payload is {id} of plant being DELETEd from server
  return state.filter(plant => plant._id !== action.payload);
}

function loadPlantRequest(state /*, action*/) {
  return state;
}

function loadPlantSuccess(state, action) {
  const keepers = state.filter(plant => plant._id !== action.payload._id);
  return [...keepers, action.payload];
}

function loadPlantFailure(state, action) {
  const keepers = state.filter(plant => plant._id !== action.payload._id);
  return [...keepers, action.payload];
}

function loadPlantsRequest(state /*, action*/) {
  // Placeholder. Can put a flag in the state in future indicating that a load is in progress
  return state;
}

function loadPlantsSuccess(state, action) {
  if(action.payload && action.payload.length > 0) {
    const ids = action.payload.map(plant => plant._id);
    const keepers = state.filter(plant => ids.indexOf(plant._id >= 0));
    return [...keepers, ...action.payload];
  }
  return state;
}

function loadPlantsFailure(state, action) {
  console.log('loadPlantsFailure:', action);
  return state;
}

// action.payload:
// {_id <plant-id>, mode: 'create/update/read'}
function setPlantMode(state, action) {
  return state.map( plant => {
    if (plant._id === action.payload._id) {
      return {...plant, mode: action.payload.mode};
    } else {
      return plant;
    }
  });
}

const reducers = {
  [SET_PLANT_MODE]: setPlantMode,
  [CANCEL_PLANT_CREATE_MODE]: deletePlant,
  [CREATE_PLANT_REQUEST]: createPlantRequest,
  [CREATE_PLANT_FAILURE]: ajaxPlantFailure,
  [UPDATE_PLANT_FAILURE]: ajaxPlantFailure,
  [DELETE_PLANT_FAILURE]: ajaxPlantFailure,
  [UPDATE_PLANT_REQUEST]: updatePlantRequest,
  [DELETE_PLANT_REQUEST]: deletePlant,
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
