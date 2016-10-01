import isFunction from 'lodash/isFunction';
import $ from 'jquery';

// import d from 'debug';
// const debug = d('plant:ajax');

function setJwtHeader(store, request) {
  const {user} = store.getState().toJS();
  if(user && user.jwt) {
    request.setRequestHeader('Authorization', 'Bearer ' + user.jwt);
  }
}

function jqueryAjax(options) {
  return $.ajax(options);
};

module.exports = (store, options) => {

  if(!options.url || !isFunction(options.success) || !isFunction(options.failure)) {
    console.error('Invalid options for ajax:', options);
  }

  const ajaxOptions = {
    type: options.type || 'GET',
    beforeSend: options.beforeSend || setJwtHeader.bind(null, store),
    url: options.url,
    // Success: Function( Anything data, String textStatus, jqXHR jqXHR )
    success: (result) => {
      if(options.success) {
        store.dispatch(options.success(result));
      }
    },
    // Error: Function( jqXHR jqXHR, String textStatus, String errorThrown )
    error: (jqXHR, textStatus, errorThrown) => {
      console.error(`${ajaxOptions.type} error for ${options.url}`, errorThrown);
      if(options.failure) {
        store.dispatch(options.failure(errorThrown));
      }
    }
  };

  function progressHandlingFunction(e){
    if(e.lengthComputable){
      const uploadProgress = {value: e.loaded, max: e.total, note: options.note};
      console.log('progressHandlingFunction', {uploadProgress});
      if(options.progress) {
        store.dispatch(options.progress({uploadProgress}));
      } else {
        console.warn('options does not have progress function in progressHandlingFunction');
      }
    } else {
      console.error('e.lengthComputable is falsey in progressHandlingFunction:', e.lengthComputable);
    }
  }

  if(options.fileUpload) {
    delete options.fileUpload;
    ajaxOptions.contentType = false;
    ajaxOptions.processData = false;
    ajaxOptions.cache = false;
    // ajaxOptions.uploadProgess = (e, position, total, percentComplete) => {
    //   console.log('uploadProgess', e, position, total, percentComplete);
    // };
    // ajaxOptions.complete = (xhr) => {
    //   console.log('complete:', xhr);
    //   // status.html(xhr.responseText);
    // };

    // Custom XMLHttpRequest
    ajaxOptions.xhr = function() {
      var xhr = $.ajaxSettings.xhr();
      if(xhr.upload){ // Check if upload property exists
        xhr.upload.addEventListener('progress', progressHandlingFunction, false); // For handling the progress of the upload
      } else {
        console.error('No upload on xhr');
      }
      return xhr;
    };
  }
  ajaxOptions.data = options.data;

  jqueryAjax(ajaxOptions);

};
