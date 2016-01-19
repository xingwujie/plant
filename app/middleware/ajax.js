import _ from 'lodash';
import $ from 'jquery';

function setJwtHeader(store, request) {
  // console.log('setJwtHeader:', store, request);
  const {user} = store.getState();
  if(user && user.jwt) {
    request.setRequestHeader('Authorization', 'Bearer ' + user.jwt);
  } else {
    // console.log('No user or user.jwt to add auth header:', user);
  }
}

function jqueryAjax(options) {
  return $.ajax(options);
};

export default (store, action, options) => {

  if(!options.url || !_.isFunction(options.success) || !_.isFunction(options.failure)) {
    console.error('Invalid options for ajax:', options);
  }

  const ajaxOptions = {
    type: options.type || 'GET',
    beforeSend: options.beforeSend || setJwtHeader.bind(null, store),
    url: options.url,
    data: options.data || {},
    // Success: Function( Anything data, String textStatus, jqXHR jqXHR )
    success: (result) => {
      if(options.success) {
        store.dispatch(options.success(result));
      }
    },
    // Error: Function( jqXHR jqXHR, String textStatus, String errorThrown )
    error: (jqXHR, textStatus, errorThrown) => {
      console.log(`${ajaxOptions.type} error for ${options.url}`, errorThrown);
      if(options.failure) {
        store.dispatch(options.failure(errorThrown));
      }
    }
  };

  jqueryAjax(ajaxOptions);

};
