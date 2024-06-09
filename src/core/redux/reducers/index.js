import AsyncStorage from '@react-native-async-storage/async-storage';
import {combineReducers} from 'redux';
import types from '../types';
import {authReducer} from './authReducer';
import {listingReducer} from './listingReducer';
import {otherReducer} from './otherReducer';
import {snackReducer} from './snackbarReducer';

const appReducer = combineReducers({
  auth: authReducer,
  other: otherReducer,
  lisitng: listingReducer,
  snackbar: snackReducer,
});

const rootReducer = (state, action) => {
  if (action.type == types.SIGN_OUT) {
    AsyncStorage.removeItem('persist:root');
    return appReducer(undefined, action);
  }
  return appReducer(state, action);
};
export default rootReducer;
