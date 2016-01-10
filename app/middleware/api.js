// This file is responsible for making the Ajax calls to
// the server as part of the store's dispatch(action) call.

import _ from 'lodash';
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

function ajax(store, action, options) {

  if(!options.url || !_.isFunction(options.success) || !_.isFunction(options.failure)) {
    console.error('Invalid options for ajax:', options);
  }

  const ajaxOptions = {
    type: options.type || 'GET',
    beforeSend: options.beforeSend || setJwtHeader.bind(null, store),
    url: options.url,
    data: options.data || {},
    // Success: Function( Anything data, String textStatus, jqXHR jqXHR )
    success: (result) => {
      store.dispatch(options.success(result));
    },
    // Error: Function( jqXHR jqXHR, String textStatus, String errorThrown )
    error: (jqXHR, textStatus, errorThrown) => {
      console.log(`${ajaxOptions.type} error for ${options.url}`, errorThrown);
      store.dispatch(options.failure(errorThrown));
    }
  };

  $.ajax(ajaxOptions);

}

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

function updatePlant(store, action) {
  const options = {
    type: 'PUT',
    url: '/api/plant',
    data: action.payload,
    success: actions.updatePlantSuccess,
    failure: actions.updatePlantFailure,
  };
  ajax(store, action, options);
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
