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
  const removed = state.filter(plant => plant.id !== action.payload.id);
  return [...removed, action.payload];
}

// User clicks save after update a plant
function updatePlantRequest(state, action) {
  // payload is an object of plant being PUTed to server
  // an id has already been assigned to this object
  const removed = state.filter(plant => plant.id !== action.payload.id);
  return [...removed, action.payload];
}

function deletePlantRequest(state, action) {
  // payload is {id} of plant being DELETEd from server
  return state.filter(plant => plant.id !== action.payload.id);
}

function loadPlantRequest(state, action) {
  console.log('loadPlantRequest:', action);
  return state;
}

function loadPlantSuccess(state, action) {
  const removed = state.filter(plant => plant.id !== action.payload.id);
  return [...removed, action.payload];
}

function loadPlantFailure(state, action) {
  const removed = state.filter(plant => plant.id !== action.payload.id);
  return [...removed, action.payload];
}

function loadPlantsRequest(state, action) {
  const ids = action.payload.map(plant => plant.id);
  const removed = state.filter(plant => ids.indexOf(plant.id >= 0));
  return [...removed, ...action.payload];
}

function loadPlantsFailure(state, action) {
  console.log('loadPlantsFailure:', action);
  return state;
}


export default (state = [], action) => {
  // console.log('plant reducer:', state, action);
  switch(action.type) {
    case CREATE_PLANT_REQUEST:
      return createPlantRequest(state, action);
    case CREATE_PLANT_FAILURE:
    case UPDATE_PLANT_FAILURE:
    case DELETE_PLANT_FAILURE:
      return ajaxPlantFailure(state, action);
    case UPDATE_PLANT_REQUEST:
      return updatePlantRequest(state, action);
    case DELETE_PLANT_REQUEST:
      return deletePlantRequest(state, action);
    case LOAD_PLANT_REQUEST:
      return loadPlantRequest(state, action);
    case LOAD_PLANT_SUCCESS:
      return loadPlantSuccess(state, action);
    case LOAD_PLANT_FAILURE:
      return loadPlantFailure(state, action);
    case LOAD_PLANTS_REQUEST:
      return loadPlantsRequest(state, action);
    case LOAD_PLANTS_FAILURE:
      return loadPlantsFailure(state, action);

    default:
      return state;
  };
};
