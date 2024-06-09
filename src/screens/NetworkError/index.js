import React, {useState, useEffect} from 'react';
import {View, Text, Image, StyleSheet, Appearance} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import NormalButton from '../../components/Button';
import {Snackbar} from 'react-native-paper';
import {SCREEN_WIDTH} from '../../utils/Methods';
import {useDispatch, useSelector} from 'react-redux';
import {showSnackBar} from '../../core/redux/actions';
import {colors} from '../../utils/theme/colors';
import {fonts} from '../../utils/theme/fonts';

const withNetworkStatus = WrappedComponent => {
  const NetworkStatus = () => {
    const [isConnected, setIsConnected] = useState(true);
    const colorScheme = Appearance.getColorScheme();
    const dispatch = useDispatch();
    const onDismissSnackBar = () =>
      dispatch(showSnackBar({visible: false, text: ''}));
    const snack = useSelector(state => state.snackbar.visible);
    useEffect(() => {
      const unsubscribe = NetInfo.addEventListener(state => {
        setIsConnected(state.isInternetReachable);
        // setIsConnected(state.isConnected);
      });

      return () => {
        unsubscribe();
      };
    }, []);
    return (
      <>
        {isConnected ? (
          <WrappedComponent />
        ) : (
          <View style={styles.container}>
            <Image
              style={styles.errorImage}
              source={require('../../assets/images/404.jpg')}
            />
            <Text style={styles.errorMessage}>
              You're not connected to a network. Please check your internet
              connection
            </Text>
            {/* <NormalButton title="Refresh" onPress={handleRefresh} /> */}
            {/* <NormalButton title={'Refresh'} /> */}
          </View>
        )}
        <Snackbar
          style={{
            alignSelf: 'center',
            width: SCREEN_WIDTH - 100,
          }}
          visible={snack?.visible}
          // wrapperStyle={props.screens == 'Filters' ? {top: 0} : ''}
          onDismiss={() => onDismissSnackBar()}
          onIconPress={() => onDismissSnackBar()}
          duration={2000}
          action={{}}>
          <Text
            style={{
              color: colorScheme == 'dark' ? colors.black : colors.white,
            }}>
            {snack?.text}
          </Text>
        </Snackbar>
      </>
    );
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.white,
      display: 'flex',
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    errorMessage: {
      color: colors.text,
      fontSize: 19,
      fontFamily: fonts.Montserrat_SemiBold,
      textAlign: 'center',
      width: '90%',
      paddingBottom: 10,
    },
    errorImage: {
      width: 250,
      height: 250,
    },
  });

  return NetworkStatus;
};

export default withNetworkStatus;
