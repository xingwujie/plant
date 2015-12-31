import {initialState} from '../store/user';

import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT} from '../actions';

// The login reducer
export default (state, action) => {
  let user;
  switch(action.type) {
    case LOGIN_REQUEST:
      user = {
        status:'fetching'
      };
      break;
    case LOGIN_SUCCESS:
      user = Object.assign({
        status:'success',
        isLoggedIn: true
      }, action.payload);
      break;
    case LOGIN_FAILURE:
      user = Object.assign({
        status:'failed',
        isLoggedIn: false
      }, action.payload);
      break;
    case LOGOUT:
      user = {};
      break;
    default:
      user = initialState();
      break;
  };

  return user;
};
