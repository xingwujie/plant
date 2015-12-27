// Example state
// {
//   user: {
//     id: '',
//     name: '',
//     token: '',
//     plants: [] // id's of plants owned by this user
//   },
//   users: [], // Each user the same as user above but without token
//   plants: {
//     '<plant-id>': {
//       id: <plant-id>,
//       summary: true, // if true then notes have not been fetched
//       userId: <user-id>,
//       title: '',
//       commonName: '',
//       botanicalName: '',
//       notes: [{
//         date: ''
//       }] // if summary is false then this is complete
//     }
//   }, // Collection of plants. Key is plant id.
// };

import { combineReducers } from 'redux';

import {login} from './login';
import {plant} from './plant';

const rootReducer = combineReducers({
  login,
  plant
});

export default rootReducer;
