import types from '../types';

export const showSnackBar = data => {
  return dispatch => dispatch({type: types.SNACKBAR, payload: data});
};

export const storeCurrentMedication = data => {
  return dispatch => dispatch({type: types.CURRENT_MEDICATION, payload: data});
};
