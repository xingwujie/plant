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
  ajax(store, options);
}

function createPlant(store, action, next) {

  const options = {
    type: 'POST',
    url: '/api/plant',
    data: action.payload,
    success: actions.createPlantSuccess,
    failure: actions.createPlantFailure
  };
  ajax(store, options);
  next(action);
}

// Upload files
// action.payload is an array of file objects:
/*
lastModified: 1472318340000
lastModifiedDate: Sat Aug 27 2016 10:19:00 GMT-0700 (MST)
name: "2016-08-27 10.19.00.jpg"
preview: "blob:http://localhost:8080/43590135-cb1a-42f6-9d75-ea737ea2ce91"
size: 6674516
type: "image/jpeg"
webkitRelativePath:""
*/
function saveFilesRequest(store, action) {
  console.log('apis.saveFileRequest action.payload:', action.payload);

  const data = new FormData();
  action.payload.files.forEach((file) => {
    data.append('file', file);
  });
  data.append('note', JSON.stringify(action.payload.note));

  const options = {
    contentType: 'multipart/form-data',
    data,
    failure: actions.saveFilesFailure,
    success: actions.saveFilesSuccess,
    type: 'POST',
    url: '/api/upload',
    fileUpload: true, // removed in ajax function
  };
  console.log('api - saveFilesRequest:', options);
  ajax(store, options);
}

// action.payload is an object with two properties
// files: An optional array of files
// note: The note being created
function createNoteRequest(store, action, next) {
  if(action.payload.files) {
    saveFilesRequest(store, action);
  } else {
    const options = {
      type: 'POST',
      url: '/api/note',
      data: action.payload.note,
      // bind the existing payload to the success action so that we
      // can get to the plantId to close the create note form.
      success: actions.createNoteSuccess.bind(null, action.payload.note),
      failure: actions.createNoteFailure
    };
    ajax(store, options);
    next(action);
  }
}

function updatePlant(store, action, next) {
  const options = {
    type: 'PUT',
    url: '/api/plant',
    data: action.payload,
    success: actions.updatePlantSuccess,
    failure: actions.updatePlantFailure,
  };
  ajax(store, options);
  return next(action);
}

function updateNote(store, action, next) {
  const options = {
    type: 'PUT',
    url: '/api/note',
    data: action.payload,
    success: actions.updateNoteSuccess,
    failure: actions.updateNoteFailure,
  };
  ajax(store, options);
  return next(action);
}

function deletePlant(store, action, next) {
  const options = {
    type: 'DELETE',
    url: `/api/plant/${action.payload}`,
    success: actions.deletePlantSuccess,
    failure: actions.deletePlantFailure
  };
  ajax(store, options);
  next(action);
}

function deleteNoteRequest(store, action, next) {
  const options = {
    type: 'DELETE',
    url: `/api/note/${action.payload}`,
    success: actions.deleteNoteSuccess,
    failure: actions.deleteNoteFailure
  };
  ajax(store, options);
  next(action);
}

function loadOne(store, action) {

  if(!action.payload._id) {
    console.error('No _id in loadOne', (new Error()).stack);
  } else {
    const options = {
      url: `/api/plant/${action.payload._id}`,
      success: actions.loadPlantSuccess,
      failure: actions.loadPlantFailure,
    };
    ajax(store, options);
  }
}

// Get all the plants a user has created
function load(store, action) {
  const userId = action.payload;
  const options = {
    url: `/api/plants/${userId}`,
    success: actions.loadPlantsSuccess,
    failure: actions.loadPlantsFailure
  };
  ajax(store, options);
}

export const apis = {
  [actions.LOGIN_REQUEST]: loginRequest,
  [actions.CREATE_PLANT_REQUEST]: createPlant,
  [actions.CREATE_NOTE_REQUEST]: createNoteRequest,
  [actions.UPDATE_PLANT_REQUEST]: updatePlant,
  [actions.UPDATE_NOTE_REQUEST]: updateNote,
  [actions.DELETE_PLANT_REQUEST]: deletePlant,
  [actions.DELETE_NOTE_REQUEST]: deleteNoteRequest,
  [actions.LOAD_PLANT_REQUEST]: loadOne,
  [actions.LOAD_PLANTS_REQUEST]: load,
};

export default store => next => action => {
  if(apis[action.type]) {
    return apis[action.type](store, action, next);
  }

  return next(action);
};
