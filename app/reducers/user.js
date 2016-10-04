const {initialState} = require('../store/user');
const Immutable = require('immutable');

const {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT} = require('../actions');

function loginRequest() {
  return Immutable.fromJS({
    status:'fetching'
  });
}

function loginSuccess(state, action) {
  return Immutable.fromJS({
    status:'success',
    isLoggedIn: true,
    ...action.payload
  });
}

function loginFailure(state, action) {
  return Immutable.fromJS({
    status:'failed',
    isLoggedIn: false,
    ...action.payload
  });
}

function logout() {
  return Immutable.fromJS({});
}

const reducers = {
  [LOGIN_REQUEST]: loginRequest,
  [LOGIN_SUCCESS]: loginSuccess,
  [LOGIN_FAILURE]: loginFailure,
  [LOGOUT]: logout,
};

// The login reducer
module.exports = (state, action) => {
  if(reducers[action.type]) {
    return reducers[action.type](state, action);
  }

  if(!state) {
    return initialState();
  }

  return state;
};
