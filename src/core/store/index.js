import {createStore, applyMiddleware, compose} from 'redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {persistStore, persistReducer} from 'redux-persist';
import rootReducer from '../redux/reducers';
import {composeWithDevTools} from 'redux-devtools-extension';
import thunkMiddleware from 'redux-thunk';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  blacklist: ['lisitng'],
};
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(
  persistedReducer,
  composeWithDevTools(applyMiddleware(thunkMiddleware)),
);
const persistor = persistStore(store, {}, () => {});

const setConfig = () => {
  var data = store.getState();
};

export {store, persistor, setConfig};
