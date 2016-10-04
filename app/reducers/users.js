
const actions = require('../actions');
const Immutable = require('immutable');

// The action.payload is the returned user from the server.
function loadUserSuccess(state, action) {
  const user = action.payload;
  if(user.plantIds && user.plantIds.length) {
    user.plantIds = Immutable.Set(user.plantIds);
  }
  return state.mergeDeep({
    [user._id]: user
  });
}

// The action.payload are the returned users from the server.
function loadUsersSuccess(state, action) {
  const users = (action.payload || []).reduce((acc, user) => {
    if(user.plantIds && user.plantIds.length) {
      user.plantIds = Immutable.Set(user.plantIds);
    }
    acc[user._id] = user;
    return acc;
  }, {});
  return state.mergeDeep({
    ...users
  });
}

// User clicks save after creating a new plant, we need to
// add this to the list of plants owned by this user.
// action.payload is a plant object created in the browser
// Some of the fields:
// _id
// title
// userId
function createPlantRequest(state, action) {
  // payload is an object of new plant being POSTed to server
  // an _id has already been assigned to this object
  const plant = action.payload;
  const user = state.get(plant.userId);
  if(user) {
    const plantIds = user.get('plantIds', Immutable.Set()).add(plant._id);
    return state.set(plant.userId, user.set('plantIds', plantIds));
  } else {
    console.warn(`No user found in users createPlantRequest reducer ${plant.userId}`);
    return state;
  }
}

// If a bunch of plants are loaded then check that the plant
// is on the user's plantIds list
// action.payload is an array of plant objects
function loadPlantsSuccess(state, action) {
  if(action.payload && action.payload.length > 0) {

    // Create an object with users:
    // {'u1': {plantIds: ['p1', p2]}, 'u2': {...}}
    const users = action.payload.reduce((acc, plant) => {
      if(state.get(plant.userId)) {
        acc[plant.userId] = acc[plant.userId] || { plantIds: Immutable.Set() };
        acc[plant.userId].plantIds = acc[plant.userId].plantIds.add(plant._id);
      }
      return acc;
    }, {});

    console.log('users:', users);

    // const isList = List.isList
    const isSet = Immutable.Set.isSet;
    function merger(a, b) {
      if (isSet(a) && isSet(b)) {
        return a.union(b);
      } else if(a && a.mergeWith) {
        return a.mergeWith(merger, b);
      } else {
        return b;
      }
    }

    return state.mergeDeepWith(merger, users);
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

module.exports = (state = new Immutable.Map(), action) => {
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
