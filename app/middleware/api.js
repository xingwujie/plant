// This file is responsible for making the Ajax calls to
// the server as part of the store's dispatch(action) call.

import * as actions from '../actions';
const ajax = require('./ajax');

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
function saveFilesRequest(store, action, opts, next) {
  // console.log('apis.saveFileRequest action.payload:', action.payload);

  const data = new FormData();
  action.payload.files.forEach((file) => {
    data.append('file', file);
  });
  data.append('note', JSON.stringify(action.payload.note));

  const options = {
    contentType: 'multipart/form-data',
    data,
    failure: opts.failure,
    note: action.payload.note,
    success: opts.success,
    progress: actions.editNoteChange,
    type: 'POST',
    url: '/api/upload',
    fileUpload: true, // removed in ajax function
  };
  // console.log('api - saveFilesRequest:', options);
  ajax(store, options);
  next(action);
}

// action.payload is an object with two properties
// files: An optional array of files
// note: The note being created
function upsertNoteRequest(store, action, next) {
  function success(ajaxResult) {
    // This will cause the edit note window to close
    store.dispatch(actions.editNoteClose());
    return actions.upsertNoteSuccess(ajaxResult);
  }

  function failure(ajaxResult) {
    store.dispatch(actions.editNoteChange({
      errors: {
        general: ajaxResult.toString()
      }
    }));
    return actions.upsertNoteFailure(ajaxResult);
  }
  const opts = { success, failure };

  if(action.payload.files && action.payload.files.length) {
    saveFilesRequest(store, action, opts, next);
  } else {
    const options = {
      type: 'POST',
      url: '/api/note',
      data: action.payload.note,
      success,
      failure
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

function loadPlantRequest(store, action) {

  if(!action.payload._id) {
    console.error('No _id in loadPlantRequest', (new Error()).stack);
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
function loadPlantsRequest(store, action) {
  const userId = action.payload;
  const options = {
    url: `/api/plants/${userId}`,
    success: actions.loadPlantsSuccess,
    failure: actions.loadPlantsFailure
  };
  ajax(store, options);
}

// Get a specific user
function loadUserRequest(store, action) {
  const userId = action.payload;
  const options = {
    url: `/api/user/${userId}`,
    success: actions.loadUserSuccess,
    failure: actions.loadUserFailure
  };
  ajax(store, options);
}

// Get all the notes listed
// action.payload is an array of noteIds
function loadNotesRequest(store, action) {
  if(!action.payload || !action.payload.length) {
    console.error('No notes on payload, action:', action);
  }

  const options = {
    data: {noteIds: action.payload},
    failure: actions.loadNotesFailure,
    success: actions.loadNotesSuccess,
    type: 'POST', // Because we don't know how big the payload will be
    url: '/api/notes',
  };

  ajax(store, options);
}

export const apis = {
  [actions.LOGIN_REQUEST]: loginRequest,
  [actions.CREATE_PLANT_REQUEST]: createPlant,
  [actions.UPSERT_NOTE_REQUEST]: upsertNoteRequest,
  [actions.UPDATE_PLANT_REQUEST]: updatePlant,
  [actions.DELETE_PLANT_REQUEST]: deletePlant,
  [actions.DELETE_NOTE_REQUEST]: deleteNoteRequest,
  [actions.LOAD_PLANT_REQUEST]: loadPlantRequest,
  [actions.LOAD_NOTES_REQUEST]: loadNotesRequest,
  [actions.LOAD_USER_REQUEST]: loadUserRequest,
  [actions.LOAD_PLANTS_REQUEST]: loadPlantsRequest,
};

export default store => next => action => {
  if(apis[action.type]) {
    return apis[action.type](store, action, next);
  }

  return next(action);
};
