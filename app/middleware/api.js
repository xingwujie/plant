// This file is responsible for making the Ajax calls to
// the server as part of the store's dispatch(action) call.

import * as actions from '../actions';
import $ from 'jquery';

function setJwtHeader(store, request) {
  // console.log('setJwtHeader:', store, request);
  const {user} = store.getState();
  if(user && user.jwt) {
    request.setRequestHeader('Authorization', 'Bearer ' + user.jwt);
  } else {
    console.log('No user or user.jwt to add auth header:', user);
  }
}

function loginRequest(store, action) {
  // console.log('action:', action);

  $.ajax({
    type: 'GET',
    url: `/auth/with?code=${action.payload}`,
    // Success: Function( Anything data, String textStatus, jqXHR jqXHR )
    success: (user) => {
      store.dispatch(actions.loginSuccess(user));
    },
    // Error: Function( jqXHR jqXHR, String textStatus, String errorThrown )
    error: (jqXHR, textStatus, errorThrown) => {
      console.log('POST /api/plant failure:', errorThrown);
      store.dispatch(actions.loginFailure(errorThrown));
    }
  });
}

function createPlant(store, action, next) {
  // console.log('api createPlant:', store, action);
  $.ajax({
    type: 'POST',
    url: '/api/plant',
    data: action.payload,
    beforeSend: setJwtHeader.bind(null, store),
    // Success: Function( Anything data, String textStatus, jqXHR jqXHR )
    success: (createdPlant) => {
      console.log('POST /api/plant success:', createdPlant);
      store.dispatch(actions.plantCreateSuccess(createdPlant));
    },
    // Error: Function( jqXHR jqXHR, String textStatus, String errorThrown )
    error: (jqXHR, textStatus, errorThrown) => {
      console.log('POST /api/plant failure:', errorThrown);
      store.dispatch(actions.plantCreateFailure(errorThrown));
    }
  });
  return next(action);
}

function updatePlant(store, action) {
  $.ajax({
    type: 'PUT',
    url: '/api/plant',
    data: action.payload,
    beforeSend: setJwtHeader.bind(null, store),
    // Success: Function( Anything data, String textStatus, jqXHR jqXHR )
    success: (updatedPlant) => {
      store.dispatch(actions.plantUpdateSuccess(updatedPlant));
    },
    // Error: Function( jqXHR jqXHR, String textStatus, String errorThrown )
    error: (jqXHR, textStatus, errorThrown) => {
      console.log('PUT /api/plant failure:', errorThrown);
      store.dispatch(actions.plantUpdateFailure(errorThrown));
    }
  });
}

function deletePlant(store, action) {
  $.ajax({
    type: 'DELETE',
    url: `/api/plant/${action.payload.id}`,
    beforeSend: setJwtHeader.bind(null, store),
    // Success: Function( Anything data, String textStatus, jqXHR jqXHR )
    success: (deletedPlant) => {
      store.dispatch(actions.plantDeleteSuccess(deletedPlant));
    },
    // Error: Function( jqXHR jqXHR, String textStatus, String errorThrown )
    error: (jqXHR, textStatus, errorThrown) => {
      console.log('DELETE /api/plant failure:', errorThrown);
      store.dispatch(actions.plantDeleteFailure(errorThrown));
    }
  });
}


function loadOne(store, action) {
  console.log('api loadOne:', action.payload);
  $.ajax({
    type: 'GET',
    url: `/api/plant/${action.payload._id}`,
    beforeSend: setJwtHeader.bind(null, store),
    // Success: Function( Anything data, String textStatus, jqXHR jqXHR )
    success: (retrievedPlant) => {
      store.dispatch(actions.loadPlantSuccess(retrievedPlant));
    },
    // Error: Function( jqXHR jqXHR, String textStatus, String errorThrown )
    error: (jqXHR, textStatus, errorThrown) => {
      console.log(`GET /api/plant/${action.payload} failure:`, errorThrown);
      store.dispatch(actions.plantLoadFailure(errorThrown));
    }
  });
}

// Get all the plants a user has created
function load(store, action) {
  const userId = action.payload;
  $.ajax({
    type: 'GET',
    url: `/api/plants/${userId}`,
    beforeSend: setJwtHeader.bind(null, store),
    // Success: Function( Anything data, String textStatus, jqXHR jqXHR )
    success: (plants) => {
      store.dispatch(actions.plantsLoadSuccess(plants));
      // TODO: Implement below...
      // const {user} = store.getState();
      // if(user && user.id === retrievedPlant.userId) {
      //   store.dispatch(actions.userPlantAdd(action.payload.id));
      // }
    },
    // Error: Function( jqXHR jqXHR, String textStatus, String errorThrown )
    error: (jqXHR, textStatus, errorThrown) => {
      console.log('PlantAction.loadError:', errorThrown);
      store.dispatch(actions.plantsLoadFailure(errorThrown));
    }
  });
}

const apis = {
  [actions.LOGIN_REQUEST]: loginRequest,
  [actions.CREATE_PLANT_REQUEST]: createPlant,
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
