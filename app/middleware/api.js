// This file is responsible for making the Ajax calls to
// the server as part of the store's dispatch(action) call.

import * as actions from '../actions';
import ajax from './ajax';


function loginRequest(store, action) {
  const options = {
    url: `/auth/with?code=${action.payload}`,
    success: actions.loginSuccess,
    failure: actions.loginFailure,
    beforeSend: () => {}
  };
  ajax(store, action, options);
}

function createPlant(store, action, next) {

  const options = {
    type: 'POST',
    url: '/api/plant',
    data: action.payload,
    success: actions.createPlantSuccess,
    failure: actions.createPlantFailure
  };
  ajax(store, action, options);
  next(action);
}

function createNote(store, action, next) {
  console.log('About to POST /api/note');
  const options = {
    type: 'POST',
    url: '/api/note',
    data: action.payload,
    success: actions.createNoteSuccess,
    failure: actions.createNoteFailure
  };
  ajax(store, action, options);
  next(action);
}

function updatePlant(store, action, next) {
  const options = {
    type: 'PUT',
    url: '/api/plant',
    data: action.payload,
    // success: () => {},
    success: actions.updatePlantSuccess,
    failure: actions.updatePlantFailure,
  };
  ajax(store, action, options);
  return next(action);
}

function deletePlant(store, action, next) {
  const options = {
    type: 'DELETE',
    url: `/api/plant/${action.payload}`,
    success: actions.deletePlantSuccess,
    failure: actions.deletePlantFailure
  };
  ajax(store, action, options);
  next(action);
}


function loadOne(store, action) {

  const options = {
    url: `/api/plant/${action.payload._id}`,
    success: actions.loadPlantSuccess,
    failure: actions.loadPlantFailure,
  };
  ajax(store, action, options);
}

// Get all the plants a user has created
function load(store, action) {
  const userId = action.payload;
  const options = {
    url: `/api/plants/${userId}`,
    success: actions.loadPlantsSuccess,
    failure: actions.loadPlantsFailure
  };
  ajax(store, action, options);
}

export const apis = {
  [actions.LOGIN_REQUEST]: loginRequest,
  [actions.CREATE_PLANT_REQUEST]: createPlant,
  [actions.CREATE_NOTE_REQUEST]: createNote,
  [actions.UPDATE_PLANT_REQUEST]: updatePlant,
  [actions.DELETE_PLANT_REQUEST]: deletePlant,
  [actions.LOAD_PLANT_REQUEST]: loadOne,
  [actions.LOAD_PLANTS_REQUEST]: load,
};

export default store => next => action => {
  if(apis[action.type]) {
    return apis[action.type](store, action, next);
  }

  return next(action);
};
