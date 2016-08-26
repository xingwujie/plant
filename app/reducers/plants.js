// A collection of plants loaded from the server. (an object)
// Plants could be for any user.
// If a user is logged in then some of the items in the object
// might be plants belonging to the user.

// Each key in the plants object is a document id that represents a plant.

// meta object:
// status: 'create', 'create-saving', 'update', 'update-saving', 'delete-saving', 'error'
// error: A string representing the reason why the status is 'error'
import moment from 'moment';

import * as actions from '../actions';

// User clicks save after creating a new plant
function createPlantRequest(state, action) {
  // payload is an object of new plant being POSTed to server
  // an id has already been assigned to this object
  return Object.freeze([...state, action.payload]);
}

// User clicks save after creating a new plant
function ajaxPlantFailure(state, action) {
  const keepers = state.filter(plant => plant._id !== action.payload._id);
  return Object.freeze([...keepers, action.payload]);
}

// User clicks save after update a plant
function updatePlantRequest(state, action) {
  // payload is an object of plant being PUT to server
  // an id has already been assigned to this object
  const keepers = state.filter(plant => plant._id !== action.payload._id);
  return Object.freeze([...keepers, action.payload]);
}

// action.payload: <plant-id>
function deletePlant(state, action) {
  // payload is {id} of plant being DELETEd from server
  return Object.freeze(state.filter(plant => plant._id !== action.payload));
}

function loadPlantRequest(state /*, action*/) {
  return state;
}

// action.payload is a plant object
function loadPlantSuccess(state, action) {
  const keepers = state.filter(p => p._id !== action.payload._id);
  let plant = action.payload;
  // TODO: Move this logic into a transformPlants() helper so it can be
  // used by other methods
  if(plant.notes && plant.notes.length) {
    plant.notes = plant.notes.map(n => {
      return {
        ...n,
        date: moment(new Date(n.date))
      };
    });
    plant.notes = plant.notes.sort((a, b) => {
      if(a.date.isSame(b.date)) {
        return 0;
      }
      return a.date.isAfter(b.date) ? 1 : -1;
    });
  }
  plant.plantedDate = plant.plantedDate ? moment(new Date(plant.plantedDate)) : plant.plantedDate;
  plant.purchasedDate = plant.purchasedDate ? moment(new Date(plant.purchasedDate)) : plant.purchasedDate;
  return Object.freeze([...keepers, plant]);
}

function loadPlantFailure(state, action) {
  const keepers = state.filter(plant => plant._id !== action.payload._id);
  return Object.freeze([...keepers, action.payload]);
}

function loadPlantsRequest(state /*, action*/) {
  // Placeholder. Can put a flag in the state in future indicating that a load is in progress
  return state;
}

function loadPlantsSuccess(state, action) {
  if(action.payload && action.payload.length > 0) {
    const ids = action.payload.map(plant => plant._id);
    const keepers = state.filter(plant => ids.indexOf(plant._id >= 0));
    return Object.freeze([...keepers, ...action.payload]);
  }
  return state;
}

function loadPlantsFailure(state, action) {
  console.log('loadPlantsFailure:', action);
  return state;
}

// action.payload:
// {_id <plant-id>, mode: 'create/update/read'}
function setPlantMode(state, action) {
  return Object.freeze(state.map( plant => {
    if (plant._id === action.payload._id) {
      return {...plant, mode: action.payload.mode};
    } else {
      return plant;
    }
  }));
}

// action.payload: {_id <plant-id>, enable: true/false}
function createNote(state, action) {
  return Object.freeze(state.map( plant => {
    if (plant._id === action.payload._id) {
      return {...plant, createNote: action.payload.enable};
    } else {
      return plant;
    }
  }));
}

// The action.payload here was bound to the action.payload
// in the request and not the return object from the server
// so that we could get to the plantId from the request.
function createNoteSuccess(state, action) {
  return Object.freeze(state.map( plant => {
    console.log('createNoteSuccess:', action);
    if (plant._id === action.payload.plantId) {

      const plantNotes = [...(plant.notes || [])];
      const note = {
        ...action.payload,
        date: moment(new Date(action.payload.date))
      };

      plantNotes.push(note);

      const notes = plantNotes.sort((a, b) => {
        if(a.date.isSame(b.date)) {
          return 0;
        }
        return a.date.isAfter(b.date) ? 1 : -1;
      });

      return {
        ...plant,
        createNote: false,
        notes
      };
    } else {
      return plant;
    }
  }));
}

const reducers = {
  [actions.CANCEL_PLANT_CREATE_MODE]: deletePlant,
  [actions.CREATE_NOTE]: createNote,
  [actions.CREATE_NOTE_SUCCESS]: createNoteSuccess,
  [actions.CREATE_PLANT_FAILURE]: ajaxPlantFailure,
  [actions.CREATE_PLANT_REQUEST]: createPlantRequest,
  [actions.DELETE_PLANT_FAILURE]: ajaxPlantFailure,
  [actions.DELETE_PLANT_REQUEST]: deletePlant,
  [actions.LOAD_PLANT_FAILURE]: loadPlantFailure,
  [actions.LOAD_PLANT_REQUEST]: loadPlantRequest,
  [actions.LOAD_PLANT_SUCCESS]: loadPlantSuccess,
  [actions.LOAD_PLANTS_FAILURE]: loadPlantsFailure,
  [actions.LOAD_PLANTS_REQUEST]: loadPlantsRequest,
  [actions.LOAD_PLANTS_SUCCESS]: loadPlantsSuccess,
  [actions.SET_PLANT_MODE]: setPlantMode,
  [actions.UPDATE_PLANT_FAILURE]: ajaxPlantFailure,
  [actions.UPDATE_PLANT_REQUEST]: updatePlantRequest,
};

export default (state = [], action) => {
  if(reducers[action.type]) {
    return reducers[action.type](state, action);
  }

  return state;
};
