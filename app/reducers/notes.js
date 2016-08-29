/*
Object of notes:
{
  <mongoId>: {
    meta: {
      // new = created in UI but not saved yet
      // saved = createNoteSuccess has been received
      // error = an error happened saving / validating etc.
      // deleted = ajax request to delete object not complete yet
      state: 'new',
      errors: 'an array of errors'
    },
    _id: 'mongoId - same as key'
    date: 'moment object',
    note: 'string',
    plantIds: 'an array of strings',
    userId: 'mongoId - identifies user'
  }
}
*/

import * as actions from '../actions';

/**
 * Raised when a save event is triggered for a note.
 * @param {object} state - existing object of notes
 * @param {object} action - action.payload holds new note
 * @returns {object} state - the new object of notes
 */
function createNoteRequest(state, action) {
  const {_id} = action.payload || {};

  return Object.freeze({
    ...state,
    [_id]: Object.freeze(action.payload)
  });
}

/**
 * Response from server with success for note create
 * @param {object} state - existing object of notes
 * @param {object} action - action.payload holds new note
 * @returns {object} state - the new object of notes
 */
function createNoteSuccess(state, action) {
  const {_id} = action.payload || {};
  const note = {...state[_id]};
  note.meta = {
    ...note.meta,
    state: 'saved'
  };

  return Object.freeze({
    ...state,
    [_id]: Object.freeze(note)
  });
}

/**
 *
 * @param {object} state - existing object of notes
 * @param {object} action - action.payload holds new note
 * @returns {object} state - the new object of notes
 */
function createNoteFailure(state, action) {
  const {_id} = action.payload || {};
  const note = {...state[_id]};
  note.meta = {
    ...note.meta,
    ...action.payload.meta,
    state: 'error'
  };

  return Object.freeze({
    ...state,
    [_id]: Object.freeze(note)
  });
}

/**
 *
 * @param {object} state - existing object of notes
 * @param {object} action - action.payload holds new note
 * @returns {object} state - the new object of notes
 */
function updateNoteRequest(state /*, action*/) {
  return state;
}

/**
 *
 * @param {object} state - existing object of notes
 * @param {object} action - action.payload holds new note
 * @returns {object} state - the new object of notes
 */
function updateNoteSuccess(state /*, action*/) {
  return state;
}

/**
 *
 * @param {object} state - existing object of notes
 * @param {object} action - action.payload holds new note
 * @returns {object} state - the new object of notes
 */
function updateNoteFailure(state /*, action*/) {
  return state;
}

/**
 *
 * @param {object} state - existing object of notes
 * @param {object} action - action.payload holds new note
 * @returns {object} state - the new object of notes
 */
function deleteNoteRequest(state /*, action*/) {
  return state;
}

/**
 *
 * @param {object} state - existing object of notes
 * @param {object} action - action.payload holds new note
 * @returns {object} state - the new object of notes
 */
function deleteNoteSuccess(state /*, action*/) {
  return state;
}

/**
 *
 * @param {object} state - existing object of notes
 * @param {object} action - action.payload holds new note
 * @returns {object} state - the new object of notes
 */
function deleteNoteFailure(state /*, action*/) {
  return state;
}

const reducers = {
  [actions.CREATE_NOTE_REQUEST]: createNoteRequest,
  [actions.CREATE_NOTE_SUCCESS]: createNoteSuccess,
  [actions.CREATE_NOTE_FAILURE]: createNoteFailure,

  [actions.UPDATE_NOTE_REQUEST]: updateNoteRequest,
  [actions.UPDATE_NOTE_SUCCESS]: updateNoteSuccess,
  [actions.UPDATE_NOTE_FAILURE]: updateNoteFailure,

  [actions.DELETE_NOTE_REQUEST]: deleteNoteRequest,
  [actions.DELETE_NOTE_SUCCESS]: deleteNoteSuccess,
  [actions.DELETE_NOTE_FAILURE]: deleteNoteFailure,
};

export default (state = {}, action) => {
  if(reducers[action.type]) {
    return reducers[action.type](state, action);
  }

  return state;
};
