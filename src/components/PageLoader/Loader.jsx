import {ActivityIndicator, Platform, StyleSheet, View} from 'react-native';
import {colors} from '../../utils/theme/colors';

export default () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.secondry} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
    // opacity: 0.4,
    zIndex: 1000,
    // boxShadow:
    //   Platform.OS == 'ios'
    //     ? 'rgba(0, 0, 0, 0.6) 0px 3px 8px'
    //     : 'rgba(0, 0, 0, 0.6) 0px 3px 8px',
  },
});
