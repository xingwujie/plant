
const actions = require('../actions');
const cloneDeep = require('lodash/cloneDeep');

// The action.payload is the returned user from the server.
function loadUserSuccess(state, action) {
  return Object.freeze({
    ...state,
    [action.payload._id]: action.payload
  });
}

// The action.payload are the returned users from the server.
function loadUsersSuccess(state, action) {
  console.log('loadUsersSuccess:', action);
  const users = (action.payload || []).reduce((acc, user) => {
    acc[user._id] = user;
    return acc;
  }, {});
  return Object.freeze({
    ...state,
    ...users
  });
}

// User clicks save after creating a new plant
// action.payload is a plant object created in the browser
// Some of the fields:
// _id
// title
// userId
function createPlantRequest(state, action) {
  // payload is an object of new plant being POSTed to server
  // an _id has already been assigned to this object
  const plant = action.payload;
  const user = state[plant.userId];
  if(user) {
    return Object.freeze({
      ...state,
      [user._id]: {
        ...user,
        plantIds: [...(user.plantIds || [])].concat(plant._id)
      }
    });
  } else {
    console.warn(`No user found in users createPlantRequest reducer ${plant.userId}`);
    return state;
  }
}

// action.payload is an array of plant objects
function loadPlantsSuccess(state, action) {
  if(action.payload && action.payload.length > 0) {
    const users = action.payload.reduce((acc, plant) => {
      const user = state[plant.userId];
      if(user) {
        acc[user._id] = acc[user._id] || cloneDeep(user);
        acc[user._id].plantIds = acc[user._id].plantIds || [];
        if(acc[user._id].plantIds.indexOf(plant._id) === -1) {
          acc[user._id].plantIds.push(plant._id);
        }
      }
      return acc;
    }, {});

    return Object.freeze(Object.assign({}, state, users));
  } else {
    return state;
  }
}

// action.payload: <plant-id>
function deletePlantRequest(state /*, action*/) {
  // payload is {id} of plant being DELETEd from server
  // TODO: Remove this plantId from user.
  // Update the DELETE_PLANT_REQUEST action so that it sends the whole plant object
  // so we can get the userId off the object to make this function simple.
  return state;
}

const reducers = {
  [actions.CREATE_PLANT_REQUEST]: createPlantRequest,
  [actions.DELETE_PLANT_REQUEST]: deletePlantRequest,
  [actions.LOAD_PLANTS_SUCCESS]: loadPlantsSuccess,
  [actions.LOAD_USER_SUCCESS]: loadUserSuccess,
  [actions.LOAD_USERS_SUCCESS]: loadUsersSuccess,
};

module.exports = (state = {}, action) => {
  if(reducers[action.type]) {
    return reducers[action.type](state, action);
  }

  return state;
};

// This state is an object with userId's as keys and each value is an object with:
// _id
// createdAt
// name
// plantIds: [plantId1, ...]
