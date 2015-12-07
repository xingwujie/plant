// The function this module exports should be run once when
// the app starts up. It's designed to create or update the
// views that the app uses.

import _ from 'lodash';

const designs = [{
  _id: '_design/users',
  views: {
    'users-location': {
      map: function (doc) {
        if(doc.type === 'user' && doc.location) {
          emit(doc.location, doc);
        }
      }
    }
  }
}, {
  _id: '_design/plants',
  views: {
    'plants-by-user': {
      map: function (doc) {
        if(doc.type === 'plant' && doc.userId) {
          emit(doc.userId, doc);
        }
      }
    },
    'plants-by-cultivar': {
      map: function (doc) {
        if(doc.type === 'plant' && doc.cultivar) {
          emit(doc.cultivar, doc);
        }
      }
    }
  }
}, {
  _id: '_design/plant-notes',
  views: {
    'plant-notes-by-user': {
      map: function (doc) {
        if(doc.type === 'plant-note' && doc.userId) {
          emit(doc.userId, doc);
        }
      }
    }
  }
}];

export default () => {

  // Need to stringify the functions in the designs to insert
  // into the DB.
  return designs.map((design) => {
    if(design.views) {
      _.each(design.views, (view) => {
        if(view.map) {
          view.map = `(${view.map.toString()})`;
        }
      });
    }
    return design;
  });

};
