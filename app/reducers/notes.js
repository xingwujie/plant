/*
Object of notes:
{
  <mongoId>: {
    meta: {
      // new = created in UI but not saved yet
      // saved = upsertNoteSuccess has been received
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

import _ from 'lodash';
import * as actions from '../actions';
import moment from 'moment';

/**
 * Raised when a save event is triggered for a note.
 * @param {object} state - existing object of notes
 * @param {object} action - action.payload.note holds new note
 * @returns {object} state - the new object of notes
 */
function upsertNoteRequest(state, action) {
  const {_id, date} = action.payload.note || {};

  return Object.freeze({
    ...state,
    [_id]: Object.freeze({
      ...action.payload.note,
      date: moment(new Date(date))
    })
  });
}

/**
 * Response from server with success for note create
 * @param {object} state - existing object of notes
 * @param {object} action - action.payload holds new note
 * @returns {object} state - the new object of notes
 */
function upsertNoteSuccess(state, action) {
  console.log('upsertNoteSuccess:', action);
  const {note = {}} = action.payload;
  const {_id} = note;
  note.date = moment(new Date(note.date));
  delete note.fileUploadProgress;

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
function upsertNoteFailure(state, action) {
  const {_id} = action.payload || {};
  const note = {...state[_id]};
  note.meta = {
    ...note.meta,
    ...action.payload.meta,
    state: 'error'
  };
  delete note.fileUploadProgress;

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
function deleteNoteRequest(state, action) {
  return Object.freeze(_.omit(state, [action.payload]));
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

// action.payload is an array of notes from the server
function loadNotesSuccess(state, action) {
  const notes = action.payload;
  if(notes && notes.length) {

    const newNotes = notes.reduce((acc, note) => {
      note.date = moment(new Date(note.date));
      acc[note._id] = note;
      return acc;
    }, {});

    return Object.freeze(Object.assign({}, state, newNotes));
  } else {
    console.warn('Nothing loaded from server in loadNotesSuccess:', action);
    return state;
  }
}

export const reducers = Object.freeze({
  [actions.CREATE_NOTE_REQUEST]: upsertNoteRequest,
  [actions.CREATE_NOTE_SUCCESS]: upsertNoteSuccess,
  [actions.CREATE_NOTE_FAILURE]: upsertNoteFailure,

  [actions.UPDATE_NOTE_REQUEST]: upsertNoteRequest,
  [actions.UPDATE_NOTE_SUCCESS]: upsertNoteSuccess,
  [actions.UPDATE_NOTE_FAILURE]: upsertNoteFailure,

  [actions.DELETE_NOTE_REQUEST]: deleteNoteRequest,
  [actions.DELETE_NOTE_SUCCESS]: deleteNoteSuccess,
  [actions.DELETE_NOTE_FAILURE]: deleteNoteFailure,

  [actions.LOAD_NOTES_SUCCESS]: loadNotesSuccess,

});

export default (state = {}, action) => {
  if(reducers[action.type]) {
    return reducers[action.type](state, action);
  }

  return state;
};
