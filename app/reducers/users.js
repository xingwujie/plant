
const actions = require('../actions');

// The action.payload is the returned user from the server.
function loadUserSuccess(state, action) {
  return Object.freeze({
    ...state,
    [action.payload._id]: action.payload
  });
}

const reducers = {
  [actions.LOAD_USER_SUCCESS]: loadUserSuccess,
};

module.exports = (state = {}, action) => {
  if(reducers[action.type]) {
    return reducers[action.type](state, action);
  }

  return state;
};
