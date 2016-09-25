
const actions = require('../actions');

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

const reducers = {
  [actions.CREATE_PLANT_REQUEST]: createPlantRequest,
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
