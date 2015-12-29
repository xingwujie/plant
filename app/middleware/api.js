// This file is responsible for making the Ajax calls to
// the server as part of the store's dispatch(action) call.

import * as actions from '../actions';
import $ from 'jquery';

function setJwtHeader(store, request) {
  console.log('setJwtHeader:', store, request);
  const {user} = store.getState();
  if(user && user.jwt) {
    request.setRequestHeader('Authorization', 'Bearer ' + user.jwt);
  }
}

function loginRequest(store, action) {
  console.log('action:', action);

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

function createPlant(store, action) {
  $.ajax({
    type: 'POST',
    url: '/api/plant',
    data: action.payload,
    beforeSend: setJwtHeader.bind(null, store),
    // Success: Function( Anything data, String textStatus, jqXHR jqXHR )
    success: (createdPlant) => {
      store.dispatch(actions.plantCreateSuccess(createdPlant));
    },
    // Error: Function( jqXHR jqXHR, String textStatus, String errorThrown )
    error: (jqXHR, textStatus, errorThrown) => {
      console.log('POST /api/plant failure:', errorThrown);
      store.dispatch(actions.plantCreateFailure(errorThrown));
    }
  });
  store.dispatch(actions.userPlantAdd(action.payload.id));
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
  store.dispatch(actions.userPlantDelete(action.payload.id));
}


function loadOne(store, action) {
  $.ajax({
    type: 'GET',
    url: `/api/plant/${action.payload}`,
    beforeSend: setJwtHeader.bind(null, store),
    // Success: Function( Anything data, String textStatus, jqXHR jqXHR )
    success: (retrievedPlant) => {
      store.dispatch(actions.plantLoadSuccess(retrievedPlant));
      const {user} = store.getState();
      if(user && user.id === retrievedPlant.userId) {
        store.dispatch(actions.userPlantAdd(action.payload.id));
      }
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

export default store => next => action => {

  switch(action.type) {
    case actions.LOGIN_REQUEST:
      return loginRequest(store, action);
    case actions.CREATE_PLANT_REQUEST:
      return createPlant(store, action);
    case actions.UPDATE_PLANT_REQUEST:
      return updatePlant(store, action);
    case actions.DELETE_PLANT_REQUEST:
      return deletePlant(store, action);
    case actions.LOAD_PLANT_REQUEST:
      return loadOne(store, action);
    case actions.LOAD_PLANTS_REQUEST:
      return load(store, action);
    default:
      return next(action);
  }
};
