import { combineReducers } from 'redux';
import user from './login';
import plants from './plants';

const rootReducer = combineReducers({
  user,
  plants
});

export default rootReducer;
