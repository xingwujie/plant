import {initialState} from '../store/user';

import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT} from '../actions';

// The login reducer
export function login(state = initialState(), action) {
  switch(action.type) {
    case LOGIN_REQUEST:
      return {status:'fetching'};
    case LOGIN_SUCCESS:
      const user = Object.assign({status:'success', isLoggedIn: true}, action.payload);
      return user;
    case LOGIN_FAILURE:
      return Object.assign({status:'failed', isLoggedIn: false}, action.payload);
    case LOGOUT:
      return {};
    default:
      return state;
  };
}
