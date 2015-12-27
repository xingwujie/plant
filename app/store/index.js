import { createStore, combineReducers, applyMiddleware } from 'redux';
import reducers from '../reducers';
import api from '../middleware/api';
import {setupSubscribe as userSubscribe} from './user';

// Add the api to the pipeline/chain
let createStoreWithMiddleware = applyMiddleware(api)(createStore);

let reducer = combineReducers(reducers);
let store = createStoreWithMiddleware(reducer);

userSubscribe(store);

export default store;
