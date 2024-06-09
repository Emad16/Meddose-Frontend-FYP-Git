import {GoogleSignin} from '@react-native-google-signin/google-signin';
import axios from 'axios';
import {apiBaseURL, apiBaseURLV1, authURL, testURL} from '../../../ApiBaseURL';
import {showLog} from '../../../utils/Methods';
import types from '../types';
import {ANDROID_CLIENT_ID, WEB_CLIENT_ID, IOS_CLIENT_ID} from '@env';
import OneSignal from 'react-native-onesignal';
import {showSnackBar} from './snackbar';
import {useDispatch} from 'react-redux';

export const setUserData = (id, token) => {
  if (id && token) {
    return dispatch => {
      axios
        .get(`${apiBaseURLV1}/profile/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(res => {
          showLog(res.data.data.status, 'PROFILE OF USER');
          dispatch({
            type: types.USER_DATA,
            payload: res.data.data,
          });
        })
        .catch(err => {
          showLog(err, 'error');
          dispatch({
            type: types.SUCCES_FAIL,
            payload: err.response.data.message,
          });
        });
    };
  } else {
    return dispatch => {
      dispatch({type: types.USER_DATA, payload: 'logoutTrue'});
    };
  }
};

export const setOtherProfile = (id, token) => {
  return dispatch => {
    axios
      .get(`${apiBaseURLV1}/profile/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => {
        // showLog('other profile', res.data.data);
        dispatch({
          type: types.OTHER_DATA,
          payload: res.data.data,
        });
      })
      .catch(err => {
        showLog(err, 'error');
        dispatch({
          type: types.SUCCES_FAIL,
          payload: err.response.data.message,
        });
      });
  };
};

export const updateUserData = data => {
  if (data) {
    const formData = new FormData();
    formData.append('name', data?.name);
    formData.append('city', data?.city);
    if (data.logo && data.logo != '') {
      formData.append('logo', data.logo);
    }
    formData.append('whatsapp', data.whatsapp);
    formData.append('phone', data?.phone);
    formData.append('description', data?.description);
    showLog('data to update', data);

    return dispatch => {
      axios
        .post(`${apiBaseURLV1}/profile?own=1`, formData, {
          headers: {
            Authorization: `Bearer ${data?.token}`,
            'Content-Type': 'multipart/form-data',
          },
        })
        .then(res => {
          // showLog('usserupdated data', res.data.data);
          dispatch({
            type: types.USER_DATA,
            payload: res.data.data,
          });
          if (data.profile) {
            dispatch(
              showSnackBar({
                visible: true,
                text: 'Profile updated successfully',
              }),
            );
          }
        })
        .catch(err => {
          showLog(err.message, 'error');
          dispatch({
            type: types.SUCCES_FAIL,
            payload: err,
          });
        });
    };
  } else {
    return dispatch => {
      dispatch({type: types.UPDATED_USER_DATA, payload: null});
    };
  }
};

export const addError = res => {
  return dispatch => {
    dispatch({
      type: types.SUCCES_FAIL,
      payload: res,
    });
  };
};
export const setSignupData = (data, callback) => {
  return dispatch => {
    try {
      const finalData = {
        ...data,
        userType: data.toggleCheckBox ? 'caretaker' : 'patient',
        password2: data.password,
        profile: '',
      };
      console.log(finalData, 'finalData');
      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${testURL}auth/register`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: JSON.stringify(finalData),
      };

      console.log(config, 'Stringifydata');
      axios
        .request(config)
        .then(res => {
          console.log(res, 'res of sign up');
          dispatch({
            type: types.SIGN_UP,
            payload: res.data,
          });
          callback({
            status: 'success',
            message: `You've signed up successfully.`,
            data: res.data,
          });
        })
        .catch(error => {
          console.log(error, 'error of sign up');

          callback({status: 'error', message: error.message});
        });
    } catch (error) {
      console.log(error, 'TRY CATCH');
    }
  };
};

export const setUser = (data, callback) => {
  return dispatch => {
    let StringyfiedData = JSON.stringify({
      email: data.email,
      password: data.pass,
    });

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${testURL}auth/login`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: StringyfiedData,
    };

    axios
      .request(config)
      .then(async res => {
        console.log(res.data, 'Response of login');
        if (res.data.error) {
          return callback({
            status: 'fail',
            message: res.data.message,
            data: res.data.data,
          });
        }

        const externalUserId = res.data.data._id.toString();

        await OneSignal.setExternalUserId(externalUserId, results => {
          // The results will contain push and email success statuses
          console.log('Results of setting external user id');
          console.log(results);

          // Push can be expected in almost every situation with a success status, but
          // as a pre-caution its good to verify it exists
          if (results.push && results.push.success) {
            console.log('Results of setting external user id push status:');
            console.log(results.push.success);
            dispatch({
              type: types.SIGN_IN,
              payload: res.data.data,
            });
            callback({
              status: 'success',
              message: res.data.message,
              data: res.data.data,
            });
          }
        });
      })
      .catch(error => {
        callback({status: 'error', message: error.message});
      });
  };
};

export const Logout = res => {
  // GoogleSignin.configure({
  //   androidClientId: ANDROID_CLIENT_ID,
  //   offlineAccess: true,
  //   webClientId: WEB_CLIENT_ID,
  //   iosClientId: IOS_CLIENT_ID,
  // });
  // Remove External User Id with Callback Available in SDK Version 3.7.0+

  // GoogleSignin.signOut();
  return dispatch => {
    dispatch({type: types.SIGN_OUT, payload: null});
  };
};

export const sumbitReview = data => {
  if (data) {
    const formData = new FormData();
    formData.append('user_id', data?.id);
    formData.append('comment', data?.comment);
    formData.append('stars', data?.rating);
    showLog('data provided', data);
    return dispatch => {
      axios
        .post(`${apiBaseURLV1}/submit/review?od=3`, formData, {
          headers: {
            Authorization: `Bearer ${data?.token}`,
            'Content-Type': 'multipart/form-data',
          },
        })
        .then(res => {
          showLog('reviews response', res.data.data);
          dispatch({
            type: types.REVIEW,
            payload: res.data.data,
          });
        })
        .catch(err => {
          showLog(err, 'error');
          dispatch({
            type: types.SUCCES_FAIL,
            payload: err,
          });
        });
    };
  } else {
    return dispatch => {
      dispatch({type: types.REVIEW, payload: null});
    };
  }
};

export const addLink = res => {
  // showLog(res, 'linkres');
  if (res) {
    return dispatch => {
      dispatch({
        type: types.CARLINK,
        payload: res,
      });
    };
  } else {
    return dispatch => {
      dispatch({
        type: types.CARLINK,
        payload: null,
      });
    };
  }
};

export const getPasswordCode = data => {
  if (data) {
    showLog(data, 'data in forgot');
    const formData = new FormData();
    formData.append('email', data.email);
    return dispatch => {
      axios
        .post(`${apiBaseURLV1}/reset_password`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then(res => {
          // showLog(res);
          dispatch({
            type: types.FORGOT_PASSWORD_CODE,
            payload: res.data,
          });
        })
        .catch(err => {
          showLog(err, 'error');
          dispatch({
            type: types.SUCCES_FAIL,
            payload: err,
          });
        });
    };
  } else {
    return dispatch => {
      dispatch({type: types.FORGOT_PASSWORD_CODE, payload: null});
    };
  }
};
