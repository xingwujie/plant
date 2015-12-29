import { combineReducers } from 'redux';
import user from './user';
import plants from './plants';

const rootReducer = combineReducers({
  user,
  plants
});

export default rootReducer;
