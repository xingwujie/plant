const { initialState } = require('../store/user');
const Immutable = require('immutable');
const actions = require('../actions');

function loginRequest() {
  return Immutable.fromJS({
    status: 'fetching',
  });
}

function loginSuccess(state, action) {
  return Immutable.fromJS(Object.assign({}, {
    status: 'success',
    isLoggedIn: true },
    action.payload),
  );
}

function loginFailure(state, action) {
  return Immutable.fromJS(Object.assign({}, {
    status: 'failed',
    isLoggedIn: false },
    action.payload),
  );
}

function logout() {
  return Immutable.fromJS({});
}

// The action.payload are the returned locations from the server.
function loadLocationsSuccess(state, action) {
  if (state.get('isLoggedIn', false) && !state.get('activeLocationId', '')) {
    const _id = state.get('_id');

    const location = (action.payload || []).find(loc => loc.userIds.some(userId => userId.id === _id));
    if (location) {
      console.log('found location');
      return state.set('activeLocationId', location._id);
    }
    console.log('no location found');
  }
  return state;
}

const reducers = {
  [actions.LOAD_LOCATIONS_SUCCESS]: loadLocationsSuccess,
  [actions.LOGIN_FAILURE]: loginFailure,
  [actions.LOGIN_REQUEST]: loginRequest,
  [actions.LOGIN_SUCCESS]: loginSuccess,
  [actions.LOGOUT]: logout,
};

// The login reducer
module.exports = (state, action) => {
  if (reducers[action.type]) {
    return reducers[action.type](state, action);
  }

  if (!state) {
    return initialState();
  }

  return state;
};
