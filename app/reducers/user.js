import {initialState} from '../store/user';

import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT} from '../actions';

function loginRequest() {
  return Object.freeze({
    status:'fetching'
  });
}

function loginSuccess(state, action) {
  return Object.freeze({
    status:'success',
    isLoggedIn: true,
    ...action.payload
  });
}

function loginFailure(state, action) {
  return Object.freeze({
    status:'failed',
    isLoggedIn: false,
    ...action.payload
  });
}

function logout() {
  return Object.freeze({});
}

const reducers = {
  [LOGIN_REQUEST]: loginRequest,
  [LOGIN_SUCCESS]: loginSuccess,
  [LOGIN_FAILURE]: loginFailure,
  [LOGOUT]: logout,
};

// The login reducer
export default (state, action) => {
  if(reducers[action.type]) {
    return reducers[action.type](state, action);
  }

  if(!state) {
    return initialState();
  }

  return state;
};
