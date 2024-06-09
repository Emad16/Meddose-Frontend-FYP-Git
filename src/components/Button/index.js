import React from 'react';
import {StyleSheet, Text, TouchableOpacity, Platform} from 'react-native';
import {ActivityIndicator, Button} from 'react-native-paper';
import {SCREEN_WIDTH, showLog} from '../../utils/Methods';
import Loader from '../PageLoader/Loader';
import {fonts} from '../../utils/theme/fonts';
import {colors} from '../../utils/theme/colors';

const NormalButton = props => {
  const {title, onPress, loader, style} = props;
  return (
    <TouchableOpacity
      style={
        loader
          ? {...styles.container, backgroundColor: colors.disabled, ...style}
          : {...styles.container, backgroundColor: colors.primary, ...style}
      }
      onPress={onPress}
      disabled={loader}>
      {loader ? (
        <Loader color={colors.white} />
      ) : (
        <Text style={styles.title}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: Platform.OS == 'ios' ? SCREEN_WIDTH - 40 : SCREEN_WIDTH - 40,
    borderRadius: 8,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: fonts.Montserrat_Medium,
    fontSize: 20,
    color: colors.white,
  },
});
export default NormalButton;
