const { createStore, applyMiddleware } = require('redux');
const reducers = require('../reducers'); // combineReducers already called on reducers in her)e
const api = require('../middleware/api');
const logger = require('../middleware/logger');
const {setupSubscribe: userSubscribe} = require('./user');

// Add the api to the pipeline/chain
const createStoreWithMiddleware = applyMiddleware(logger, api)(createStore);

const store = createStoreWithMiddleware(reducers);

userSubscribe(store);

module.exports = store;
