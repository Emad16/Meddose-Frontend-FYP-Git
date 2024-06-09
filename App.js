import React, {useEffect, useState} from 'react';

import {Provider, useDispatch, useSelector} from 'react-redux';
import {persistor, store} from './src/core/store';
import RootNavigator from './src/navigation/index';
import {PersistGate} from 'redux-persist/lib/integration/react';
import {Snackbar} from 'react-native-paper';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import {Provider as PaperProvider} from 'react-native-paper';
import {WithSplashScreen} from './src/components/SplashScreen';

const App = () => {
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsAppReady(true);
    }, 1000);
  }, []);
  return (
    <WithSplashScreen isAppReady={isAppReady}>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <SafeAreaProvider>
            <PaperProvider>
              <RootNavigator />
            </PaperProvider>
          </SafeAreaProvider>
        </PersistGate>
      </Provider>
    </WithSplashScreen>
  );
};

export default App;
