import { createStore, applyMiddleware } from 'redux';
import reducers from '../reducers'; // combineReducers already called on reducers in here
import api from '../middleware/api';
import logger from '../middleware/logger';
import {setupSubscribe as userSubscribe} from './user';

// Add the api to the pipeline/chain
const createStoreWithMiddleware = applyMiddleware(logger, api)(createStore);

const store = createStoreWithMiddleware(reducers);

userSubscribe(store);

export default store;


