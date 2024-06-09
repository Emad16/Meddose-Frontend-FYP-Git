import {showLog} from '../../../utils/Methods';
import types from '../types';

const initialState = {
  YourAds: null,
  RegPlaces: null,
  Colors: null,
  Cities: null,
  models: null,
  versions: null,
  make: null,
  bodyType: null,
  engineType: null,
  Error: null,
  appliedFilters: null,
  filterParam: null,
  carDetails: null,
};
export const listingReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.SUCCES_FAIL:
      return {...state, Error: action.payload};
    case types.REG_PLACES:
      return {...state, RegPlaces: action.payload};
    case types.GET_COLORS:
      return {...state, Colors: action.payload};
    case types.GET_CITIES:
      return {...state, Cities: action.payload};
    case types.CAR_DETAILS:
      return {...state, carDetails: action.payload};
    case types.GET_BODY_TYPE:
      return {...state, bodyType: action.payload};
    case types.GET_ENGINE_TYPE:
      return {...state, engineType: action.payload};
    case types.GET_MAKE:
      return {...state, make: action.payload};
    case types.GET_VERSION:
      return {...state, versions: action.payload};
    case types.GET_MODELS:
      return {...state, models: action.payload};
    case types.UPLOAD_AD:
      return {...state, YourAds: action.payload};
    case types.ADD_FILTERS:
      return {...state, appliedFilters: action.payload};
    case types.FILTER_PARAM:
      // showLog(action.payload, 'filters');
      return {...state, filterParam: action.payload};
    default:
      return state;
  }
};
