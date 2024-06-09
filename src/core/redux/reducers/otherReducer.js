import {showLog} from '../../../utils/Methods';
import types from '../types';

const initialState = {
  medication: [],
};
export const otherReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.MEDICATIONS:
      return {...state, medication: action.payload};
    default:
      return state;
  }
};
