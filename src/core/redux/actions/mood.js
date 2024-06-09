import types from '../types';

export const MoodList = data => {
  return dispatch => dispatch({type: types.MOODS, payload: data});
};
