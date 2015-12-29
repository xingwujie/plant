import { createStore, applyMiddleware } from 'redux';
import reducers from '../reducers'; // combineReducers already called on reducers in here
import api from '../middleware/api';
import {setupSubscribe as userSubscribe} from './user';

// Add the api to the pipeline/chain
let createStoreWithMiddleware = applyMiddleware(api)(createStore);

let store = createStoreWithMiddleware(reducers);

userSubscribe(store);

export default store;

/*
Example state
{
  user: {
    id: '',
    name: '',
    token: '',
    plants: [] // id's of plants owned by this user
  },
  users: [], // Each user the same as user above but without token
  plants: {
    '<plant-id>': {
      id: <plant-id>,
      summary: true, // if true then notes have not been fetched
      userId: <user-id>,
      title: '',
      commonName: '',
      botanicalName: '',
      notes: [{
        date: ''
      }] // if summary is false then this is complete
    }
  }, // Collection of plants. Key is plant id.
};
*/
