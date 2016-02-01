// The function this module exports should be run once when
// the app starts up. It's designed to create or update the
// views that the app uses.

// import d from 'debug';
// const debug = d('plant:design-docs');

// Note: map functions must be strings for code coverage with istanbul
// to work. See: https://github.com/gotwarlost/istanbul/issues/310
// Instanbul will instrument the functions which means they'll be
// inserted into CouchDB as mangled functions that won't work.

const designs = [{
  _id: '_design/users',
  views: {
    'users-by-location': {
      map: `function (doc) {
        if(doc.type === 'user' && doc.location) {
          emit(doc.location, doc);
        }
      }`
    },
    'users-by-facebook-id': {
      map: `function (doc) {
        if(doc.type === 'user' && doc.facebook && doc.facebook.id) {
          emit(doc.facebook.id, doc);
        }
      }`
    }
  }
}, {
  _id: '_design/plants',
  views: {
    'plants-by-user': {
      map: `function (doc) {
        if(doc.type === 'plant' && doc.userId) {
          emit(doc.userId, doc);
        }
      }`
    },
    'plants-by-cultivar': {
      map: `function (doc) {
        if(doc.type === 'plant' && doc.cultivar) {
          emit(doc.cultivar, doc);
        }
      }`
    }
  }
}, {
  _id: '_design/notes',
  views: {
    'notes-by-plant': {
      map: `function (doc) {
        if(doc.type === 'note' && doc.plantId) {
          emit(doc.plantId, doc);
        }
      }`
    }
  }
}];

export default () => {

  // Need to stringify the functions in the designs to insert
  // into the DB.
  return designs.map((design) => {
    if(design.views) {
      Object.keys(design.views).forEach((key) => {
        const view = design.views[key];
        if(view.map) {
          view.map = `(${view.map.toString()})`;
        }
      });
    }
    return design;
  });

};
