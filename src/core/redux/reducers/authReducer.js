import {showLog} from '../../../utils/Methods';
import types from '../types';

const initialState = {
  user: null,
  Error: null,
  userData: null,
  signupData: null,
  updatedProfile: null,
  otherUserProfile: null,
  review: null,
  linkData: null,
  passwordCode: null,
};
export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.SIGN_IN:
      return {...state, user: action.payload};
    case types.SIGN_UP:
      return {...state, signupData: action.payload};
    case types.USER_DATA:
      return {...state, userData: action.payload};
    case types.REVIEW:
      return {...state, review: action.payload};
    case types.UPDATED_USER_DATA:
      return {...state, updatedProfile: action.payload};
    case types.SUCCES_FAIL:
      return {...state, Error: action.payload};
    case types.SIGN_OUT:
      return {...state, logout: action.payload};
    case types.FORGOT_PASSWORD_CODE:
      return {...state, passwordCode: action.payload};

    case types.CARLINK:
      return {...state, linkData: action.payload};
    case types.OTHER_DATA:
      return {...state, otherUserProfile: action.payload};
    default:
      return state;
  }
};
