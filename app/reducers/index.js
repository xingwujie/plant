import { combineReducers } from 'redux';
import notes from './notes';
import plants from './plants';
import user from './user';
import users from './users';

const rootReducer = combineReducers({
  notes,
  plants,
  user,
  users,
});

export default rootReducer;

/*
State Shapes:

user: {
  _id: '',
  name: '',
  token: ''
},

users: { // Each user the same as user above but without token

},

plants: {
  plantId: {
    _id: <plant-id>,
    summary: true, // if true then notes have not been fetched
    userId: <user-id>,
    title: '',
    commonName: '',
    botanicalName: '',
    notes: [{
      _id = <note-id>,
      date: ''
    }] // if summary is false then this is complete
  }
}

notes: {
  nodeId: {
    _id: <note-id>
    date: a date
    plantIds: [plantId, plantId, ...]
    images: [{
      id: id of file on S3
      ext: file extension
      originalname: original file name
      size: a number,
      sizes: [{
        width: a number,
        name: 'thumb/orig?/sm/md/lg/xl'
      }]
    }, ...]
  }
}

*/
