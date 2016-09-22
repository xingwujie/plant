// The most difficult part of creating this module was naming it.
// "interim" is the least worst of all the bad names I came up with.

const _ = require('lodash');
const actions = require('../actions');

// action.payload:
// note object
function editNoteClick(state, action) {
  const note = Object.freeze(action.payload);
  return Object.freeze({
    ...state,
    note
  });
}

// action.payload:
// Empty
function editNoteRemove(state) {
  // Just remove note element if editing is canceled
  // or if the note has been saved
  return Object.freeze(_.omit(state, ['note']));
}

// action.payload:
// {value: e.loaded, max: e.total, note: options.note}
function fileUploadProgress(state, action) {
  const note = Object.freeze({
    ...state.note,
    fileUploadProgress: action.payload
  });
  return Object.freeze({
    ...state,
    note
  });
}

// action.payload:
// {note-key: note-value, ...}
function editNoteChange(state, action) {
  const note = Object.freeze({
    ...state.note,
    ...action.payload
  });
  return Object.freeze({
    ...state,
    note
  });
}

const reducers = {
  [actions.EDIT_NOTE_CLICK]: editNoteClick,
  [actions.EDIT_NOTE_CHANGE]: editNoteChange,
  [actions.EDIT_NOTE_CANCEL]: editNoteRemove,
  [actions.EDIT_NOTE_SAVE]: editNoteRemove,
  [actions.FILE_UPLOAD_PROGRESS]: fileUploadProgress,
};

module.exports = (state = {}, action) => {
  if(reducers[action.type]) {
    return reducers[action.type](state, action);
  }

  return state;
};

/*
This state is WIP
{
  note: {
    id: 'some-mongo-id',
    mode: 'new/update',
    fileUploadStatus: 'some string percent or object ??'
  }
}
*/
