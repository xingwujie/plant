
import {
  CREATE_PLANT_REQUEST,
  CREATE_PLANT_SUCCESS,
  CREATE_PLANT_FAILURE
  } from '../actions';

const initialState = {
  plants: []
};

// The login reducer
export function plant(state = initialState, action) {
  switch(action.type) {
    case CREATE_PLANT_REQUEST:
      return state;
    case CREATE_PLANT_SUCCESS:
      return state;
    case CREATE_PLANT_FAILURE:
      return state;
    default:
      return state;
  };
}
