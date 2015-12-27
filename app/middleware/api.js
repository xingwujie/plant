// This file is responsible for making the Ajax calls to
// the server as part of the store's dispatch(action) call.

import {LOGIN_REQUEST, loginSuccess, loginFailure} from '../actions';
import $ from 'jquery';

export default store => next => action => {

  if(action.type === LOGIN_REQUEST) {

    $.ajax({
      type: 'GET',
      url: `/auth/with?code=${action.code}`,
      // Success: Function( Anything data, String textStatus, jqXHR jqXHR )
      success: (user) => {
        store.dispath(loginSuccess(user));
      },
      // Error: Function( jqXHR jqXHR, String textStatus, String errorThrown )
      error: (jqXHR, textStatus, errorThrown) => {
        console.log('POST /api/plant failure:', errorThrown);
        store.dispath(loginFailure(errorThrown));
      }
    });
  } else {
    return next(action);
  }
};
