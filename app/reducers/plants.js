// A list of plants loaded from the server.
// Plants could be for any user.
// If a user is logged in then some of the items in the list
// might be unsaved new or partially edited items.

// Each item in the plants array represents a plant.
// All the properties except the 'meta' property are saved to the DB.
// The '_id' property for newly created and unsaved plants will be
// generated on the client and replaced by a successful Ajax POST.

// meta object:
// status: 'create', 'create-saving', 'update', 'update-saving', 'delete-saving', 'error'
// original: If in 'edit' or 'edit-saving' status then a copy of the original object
// error: A string representing the reason why the status is 'error'

import {
  CREATE_PLANT,
  CREATE_PLANT_REQUEST,
  CREATE_PLANT_SUCCESS,
  CREATE_PLANT_FAILURE
  } from '../actions';

// User clicks save after creating a new plant
function createPlantRequest(state, action) {
  // payload is id of plant being POSTed to server
  return state.map((plant) => {
    if(plant._id === action.payload) {
      return Object.assign({}, plant, {meta: {status: 'create-saving'}});
    } else {
      return plant;
    }
  });
}

// User clicks "Add" (new plant)
function createPlant(state, action) {
  // payload is client generated _id for plant
}

export default (state = [], action) => {
  console.log('plant reducer:', state, action);
  switch(action.type) {
    case CREATE_PLANT:
      return createPlant(state, action);
    case CREATE_PLANT_REQUEST:
      return createPlantRequest(state, action);
    case CREATE_PLANT_SUCCESS:
      return state;
    case CREATE_PLANT_FAILURE:
      return state;
    default:
      return state;
  };
};
