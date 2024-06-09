import {showLog} from '../../../utils/Methods';
import types from '../types';

const initialState = {
  mood: [],
};
export const moodReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.MOODS:
      return {...state, moodList: action.payload};
    default:
      return state;
  }
};
