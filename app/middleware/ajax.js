import _ from 'lodash';
import $ from 'jquery';
import moment from 'moment';

// import d from 'debug';
// const debug = d('plant:ajax');

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

const dateFormat = 'MM/DD/YYYY';

function demomentize(obj) {
  if(!obj) {
    return {};
  }

  if(_.isArray(obj)) {
    return obj.map(demomentize);
  }

  if(_.isObject(obj)) {
    if(moment.isMoment(obj)) {
      return obj.format(dateFormat);
    }
    Object.keys(obj).forEach( key => {
      if(moment.isMoment(obj[key])) {
        obj[key] = obj[key].format(dateFormat);
      }
      if(_.isObject(obj[key])) { // Includes arrays
        obj[key] = demomentize(obj[key]);
      }
    });
  }

  return obj;
}

export default (store, options) => {

  if(!options.url || !_.isFunction(options.success) || !_.isFunction(options.failure)) {
    console.error('Invalid options for ajax:', options);
  }

  const ajaxOptions = {
    type: options.type || 'GET',
    beforeSend: options.beforeSend || setJwtHeader.bind(null, store),
    url: options.url,
    data: demomentize(options.data),
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
