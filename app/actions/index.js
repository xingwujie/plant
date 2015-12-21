// Redux Actions

export const CREATE_PLANT_REQUEST = 'CREATE_PLANT_REQUEST';
export const CREATE_PLANT_SUCCESS = 'CREATE_PLANT_SUCCESS';
export const CREATE_PLANT_FAILURE = 'CREATE_PLANT_FAILURE';
export const UPDATE_PLANT_REQUEST = 'UPDATE_PLANT_REQUEST';
export const UPDATE_PLANT_SUCCESS = 'UPDATE_PLANT_SUCCESS';
export const UPDATE_PLANT_FAILURE = 'UPDATE_PLANT_FAILURE';
export const DELETE_PLANT_REQUEST = 'DELETE_PLANT_REQUEST';
export const DELETE_PLANT_SUCCESS = 'DELETE_PLANT_SUCCESS';
export const DELETE_PLANT_FAILURE = 'DELETE_PLANT_FAILURE';
export const LOAD_PLANT_REQUEST = 'LOAD_PLANT_REQUEST';
export const LOAD_PLANT_SUCCESS = 'LOAD_PLANT_SUCCESS';
export const LOAD_PLANT_FAILURE = 'LOAD_PLANT_FAILURE';
export const LOAD_PLANTS_REQUEST = 'LOAD_PLANTS_REQUEST';
export const LOAD_PLANTS_SUCCESS = 'LOAD_PLANTS_SUCCESS';
export const LOAD_PLANTS_FAILURE = 'LOAD_PLANTS_FAILURE';

export function addPlant(payload) {
  return {
    type: CREATE_PLANT_REQUEST,
    payload
  };
}

export function updatePlant(payload) {
  return {
    type: UPDATE_PLANT_REQUEST,
    payload
  };
}

export function deletePlant(payload) {
  return {
    type: DELETE_PLANT_REQUEST,
    payload
  };
}

export function loadPlant(payload) {
  return {
    type: LOAD_PLANT_REQUEST,
    payload
  };
}

export function loadPlants(payload) {
  return {
    type: LOAD_PLANTS_REQUEST,
    payload
  };
}
