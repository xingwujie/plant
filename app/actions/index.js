// Redux Actions

export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const LOGOUT = 'LOGOUT';

export function logout() {
  return {
    type: LOGOUT
  };
}

export function loginRequest(code) {
  return {
    type: LOGIN_REQUEST,
    payload: code
  };
}

export function loginSuccess(user) {
  return {
    type: LOGIN_SUCCESS,
    payload: user
  };
}

export function loginFailure(error) {
  return {
    type: LOGIN_FAILURE,
    payload: error,
    error: true
  };
}

export const CREATE_PLANT_REQUEST = 'CREATE_PLANT_REQUEST';
export const CREATE_PLANT_SUCCESS = 'CREATE_PLANT_SUCCESS';
export const CREATE_PLANT_FAILURE = 'CREATE_PLANT_FAILURE';

export function addPlant(payload) {
  return {
    type: CREATE_PLANT_REQUEST,
    payload
  };
}

export function createPlantSuccess(payload) {
  return {
    type: CREATE_PLANT_SUCCESS,
    payload
  };
}

export function createPlantFailure(payload) {
  return {
    type: CREATE_PLANT_FAILURE,
    payload
  };
}



export const UPDATE_PLANT_REQUEST = 'UPDATE_PLANT_REQUEST';
export const UPDATE_PLANT_SUCCESS = 'UPDATE_PLANT_SUCCESS';
export const UPDATE_PLANT_FAILURE = 'UPDATE_PLANT_FAILURE';

export function updatePlantRequest(payload) {
  return {
    type: UPDATE_PLANT_REQUEST,
    payload
  };
}

export function updatePlantSuccess(payload) {
  return {
    type: UPDATE_PLANT_SUCCESS,
    payload
  };
}

export function updatePlantFailure(payload) {
  return {
    type: UPDATE_PLANT_FAILURE,
    payload
  };
}

export const DELETE_PLANT_REQUEST = 'DELETE_PLANT_REQUEST';
export const DELETE_PLANT_SUCCESS = 'DELETE_PLANT_SUCCESS';
export const DELETE_PLANT_FAILURE = 'DELETE_PLANT_FAILURE';

export function deletePlantRequest(payload) {
  return {
    type: DELETE_PLANT_REQUEST,
    payload
  };
}

export function deletePlantSuccess(payload) {
  return {
    type: DELETE_PLANT_SUCCESS,
    payload
  };
}

export function deletePlantFailure(payload) {
  return {
    type: DELETE_PLANT_FAILURE,
    payload
  };
}

export const LOAD_PLANT_REQUEST = 'LOAD_PLANT_REQUEST';
export const LOAD_PLANT_SUCCESS = 'LOAD_PLANT_SUCCESS';
export const LOAD_PLANT_FAILURE = 'LOAD_PLANT_FAILURE';

export function loadPlant(payload) {
  return {
    type: LOAD_PLANT_REQUEST,
    payload
  };
}

export function loadPlantSuccess(payload) {
  return {
    type: LOAD_PLANT_SUCCESS,
    payload
  };
}

export function loadPlantFailure(payload) {
  return {
    type: LOAD_PLANT_FAILURE,
    payload
  };
}


export const LOAD_PLANTS_REQUEST = 'LOAD_PLANTS_REQUEST';
export const LOAD_PLANTS_SUCCESS = 'LOAD_PLANTS_SUCCESS';
export const LOAD_PLANTS_FAILURE = 'LOAD_PLANTS_FAILURE';

export function loadPlants(payload) {
  return {
    type: LOAD_PLANTS_REQUEST,
    payload
  };
}

export function loadPlantsSuccess(payload) {
  return {
    type: LOAD_PLANTS_SUCCESS,
    payload
  };
}

export function loadPlantsFailure(payload) {
  return {
    type: LOAD_PLANTS_FAILURE,
    payload
  };
}
