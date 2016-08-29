import { combineReducers } from 'redux';
import notes from './notes';
import plants from './plants';
import user from './user';

const rootReducer = combineReducers({
  notes,
  plants,
  user,
});

export default rootReducer;
