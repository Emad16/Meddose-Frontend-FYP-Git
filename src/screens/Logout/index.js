import {useNavigation} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {Alert, View} from 'react-native';
import {Text} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import {Logout, setUserData} from '../../core/redux/actions/auth';
import {showLog} from '../../utils/Methods';

const LogoutScreen = () => {
  const navigation = useNavigation();

  const dispatch = useDispatch();
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('tabPress', e => {
      // Prevent default behavior
      showLog('pressed?');
      e.preventDefault();
      Alert.alert('Confirm', 'Are you sure you want to logout?', [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'yes',
          onPress: () => {
            dispatch(Logout());
            navigation.navigate('Login');
            // dispatch(setUserData());
          },
        },
      ]);
    });

    return unsubscribe;
  }, [navigation]);
};

export default LogoutScreen;
