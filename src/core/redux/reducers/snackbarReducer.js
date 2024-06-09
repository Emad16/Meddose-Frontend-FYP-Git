import types from '../types';

const initialState = {
  visible: false,
  medicationFromList: null,
};
export const snackReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.SNACKBAR:
      return {...state, visible: action.payload};
    case types.CURRENT_MEDICATION:
      return {...state, medicationFromList: action.payload};
    default:
      return state;
  }
};
