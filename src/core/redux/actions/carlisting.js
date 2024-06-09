import axios from 'axios';
import {apiBaseURL, apiBaseURLV1} from '../../../ApiBaseURL';
import {showLog} from '../../../utils/Methods';
import types from '../types';

export const getRegisteredPlaces = res => {
  if (res) {
    return dispatch => {
      axios
        .get(`${apiBaseURLV1}/get/reg_places`)
        .then(res => {
          dispatch({
            type: types.REG_PLACES,
            payload: res.data.data,
          });
        })
        .catch(err => {
          dispatch({
            type: types.SUCCES_FAIL,
            payload: err.message,
          });
        });
    };
  } else {
    return dispatch => {
      dispatch({
        type: types.REG_PLACES,
        payload: null,
      });
    };
  }
};

export const getColors = (make, model, callback, successCallback) => {
  if (make && model) {
    showLog('heeeereeee');
    return dispatch => {
      axios
        .get(`${apiBaseURLV1}/get/colors/${make}/${model}`)
        .then(res => {
          showLog('colors data here', res.data.data);
          if (res.data.data?.length == 0) callback('No Colors Availabe');
          dispatch({
            type: types.GET_COLORS,
            payload: res.data.data,
          });
          successCallback({status: 'success', data: res.data.data});
        })
        .catch(err => {
          dispatch({
            type: types.SUCCES_FAIL,
            payload: err.message,
          });
        });
    };
  } else {
    return dispatch => {
      dispatch({
        type: types.GET_COLORS,
        payload: null,
      });
    };
  }
};

export const getBodyType = res => {
  if (res) {
    return dispatch => {
      axios
        .get(`${apiBaseURLV1}/get/body_types`)
        .then(res => {
          dispatch({
            type: types.GET_BODY_TYPE,
            payload: res.data.data,
          });
        })
        .catch(err => {
          dispatch({
            type: types.SUCCES_FAIL,
            payload: err.message,
          });
        });
    };
  } else {
    return dispatch => {
      dispatch({
        type: types.GET_BODY_TYPE,
        payload: null,
      });
    };
  }
};
export const getEngineType = res => {
  if (res) {
    return dispatch => {
      axios
        .get(`${apiBaseURLV1}/get/engine_types`)
        .then(res => {
          dispatch({
            type: types.GET_ENGINE_TYPE,
            payload: res.data.data,
          });
        })
        .catch(err => {
          dispatch({
            type: types.SUCCES_FAIL,
            payload: err.message,
          });
        });
    };
  } else {
    return dispatch => {
      dispatch({
        type: types.GET_ENGINE_TYPE,
        payload: null,
      });
    };
  }
};
export const getMakes = (res, callback) => {
  if (res) {
    return dispatch => {
      axios
        .get(`${apiBaseURLV1}/get/makes?abc`)
        .then(res => {
          dispatch({
            type: types.GET_MAKE,
            payload: res.data.data,
          });
          console.log('HERERERRE');
          callback({status: 'success', data: res.data.data});
        })
        .catch(err => {
          showLog(err, 'ere in makes');
          dispatch({
            type: types.SUCCES_FAIL,
            payload: err.message,
          });
        });
    };
  } else {
    return dispatch => {
      dispatch({
        type: types.GET_MAKE,
        payload: null,
      });
    };
  }
};

export const getModels = (make, callback, successCallback) => {
  if (make) {
    let val = make.replace(/\s+/g, '');
    showLog(val, 'val');
    return dispatch => {
      axios
        .get(`${apiBaseURLV1}/get/models/${val}?abcc`)
        .then(res => {
          if (res.data.data?.length == 0) callback('No Models Availabe');
          dispatch({
            type: types.GET_MODELS,
            payload: res.data.data,
          });
          successCallback({status: 'success', data: res.data.data});
        })
        .catch(err => {
          dispatch({
            type: types.SUCCES_FAIL,
            payload: err.message,
          });
        });
    };
  } else {
    return dispatch => {
      dispatch({
        type: types.GET_MODELS,
        payload: null,
      });
    };
  }
};

export const getVersions = (make, model, callback, successCallback) => {
  if ((make, model)) {
    return dispatch => {
      showLog(
        'get version url',
        `${apiBaseURLV1}/get/versions/${make}/${model}`,
      );
      axios
        .get(`${apiBaseURLV1}/get/versions/${make}/${model}?abc`)
        .then(res => {
          showLog('response of get version =====> ', res.data.data);

          if (res.data.data?.length == 0) callback('No Versions Availabe');
          dispatch({
            type: types.GET_VERSION,
            payload: res.data.data,
          });
          successCallback({status: 'success', data: res.data.data});
        })
        .catch(err => {
          dispatch({
            type: types.SUCCES_FAIL,
            payload: err.message,
          });
        });
    };
  } else {
    return dispatch => {
      dispatch({
        type: types.GET_VERSION,
        payload: null,
      });
    };
  }
};

export const getCities = res => {
  if (res) {
    return dispatch => {
      axios
        .get(`${apiBaseURLV1}/get/cities`)
        .then(res => {
          dispatch({
            type: types.GET_CITIES,
            payload: res.data.data,
          });
        })
        .catch(err => {
          dispatch({
            type: types.SUCCES_FAIL,
            payload: err.message,
          });
        });
    };
  } else {
    return dispatch => {
      dispatch({
        type: types.GET_CITIES,
        payload: null,
      });
    };
  }
};
export const getDetails = res => {
  if (res) {
    return dispatch => {
      axios
        .get(`${apiBaseURLV1}/get/vehicle_details?abc`)
        .then(res => {
          dispatch({
            type: types.CAR_DETAILS,
            payload: res.data.data,
          });
        })
        .catch(err => {
          dispatch({
            type: types.SUCCES_FAIL,
            payload: err.message,
          });
        });
    };
  } else {
    return dispatch => {
      dispatch({
        type: types.CAR_DETAILS,
        payload: null,
      });
    };
  }
};

export const uploadCarAdd = (data, callback) => {
  if (data) {
    const formData = new FormData();
    // formData.append('status', 'pending');
    formData.append('make', data?.make);
    formData.append('model', data?.model);
    formData.append('version', data.version);
    formData.append('engine_type', data.engine_type);
    formData.append('body_type', data.body_tupe);
    formData.append('reg_place', data?.reg_place);
    formData.append('city', data?.city);
    formData.append('price', data?.price);
    formData.append('color', data?.color);
    formData.append('registration', data?.registration);
    formData.append('manufacturing', data?.manufacturing);
    formData.append('engine_cc', data?.engine_cc);
    formData.append('modal_year', data?.modal_year);
    formData.append('transmission', data?.transmission);
    formData.append('registration_year', data?.registration_year);
    data.image.map((value, index) =>
      formData.append(`slider_image[${index}]`, value),
    );
    return dispatch => {
      axios
        .post(`${apiBaseURLV1}/submit/listing`, formData, {
          headers: {
            Authorization: `Bearer ${data.token}`,
            'Content-Type': 'multipart/form-data',
          },
        })
        .then(res => {
          showLog('res', res.data.data);
          dispatch({
            type: types.UPLOAD_AD,
            payload: res.data.data,
          });
          callback({
            status: 'success',
            data: res.data.data,
            message: 'Ad Added Successfully',
          });
        })
        .catch(err => {
          dispatch({
            type: types.SUCCES_FAIL,
            payload: err.message,
          });
          callback({status: 'error', data: false, message: err.message});
        });
    };
  } else {
    return dispatch => {
      dispatch({
        type: types.UPLOAD_AD,
        payload: null,
      });
    };
  }
};
export const editAd = (data, callback) => {
  console.log(data, 'data in edit ad');
  if (data) {
    showLog('data of edit', data);
    const formData = new FormData();
    formData.append('make', data?.make);
    formData.append('model', data?.model);
    formData.append('version', data.version);
    formData.append('engine_type', data.engine_type);
    formData.append('body_type', data.body_type);
    formData.append('reg_place', data?.reg_place);
    formData.append('city', data?.city);
    formData.append('price', data?.price);
    formData.append('color', data?.color);
    formData.append('registration', data?.registration);
    formData.append('manufacturing', data?.manufacturing);
    formData.append('transmission', data?.transmission);
    formData.append('engine_cc', data?.engine_cc);
    formData.append('modal_year', data?.modal_year);
    formData.append('registration_year', data?.registration_year);

    data.image.map((value, index) =>
      formData.append(`slider_image[${index}]`, value),
    );
    console.log(formData, 'formData');
    return dispatch => {
      axios
        .post(`${apiBaseURLV1}/submit/listing/${data.id}`, formData, {
          headers: {
            Authorization: `Bearer ${data.token}`,
            'Content-Type': 'multipart/form-data',
          },
        })
        .then(res => {
          showLog(res.data.data, 'response of edit listing');
          callback('complete');
          dispatch({
            type: types.UPLOAD_AD,
            payload: res.data.data,
          });
        })
        .catch(err => {
          showLog('err', err.response.data.message);
          callback('error', err.response.data.message);
          dispatch({
            type: types.SUCCES_FAIL,
            payload: err,
          });
        });
    };
  } else {
    return dispatch => {
      // showLog(data, 'daataa');
      dispatch({
        type: types.UPLOAD_AD,
        payload: null,
      });
    };
  }
};

export const addListingError = res => {
  return dispatch => {
    dispatch({
      type: types.SUCCES_FAIL,
      payload: res,
    });
  };
};
export const addFilters = res => {
  if (res) {
    return dispatch => {
      dispatch({
        type: types.ADD_FILTERS,
        payload: res,
      });
    };
  } else {
    return dispatch => {
      dispatch({
        type: types.ADD_FILTERS,
        payload: null,
      });
    };
  }
};
export const addFiltersParams = res => {
  if (res) {
    return dispatch => {
      dispatch({
        type: types.FILTER_PARAM,
        payload: res,
      });
    };
  } else {
    return dispatch => {
      dispatch({
        type: types.FILTER_PARAM,
        payload: null,
      });
    };
  }
};
