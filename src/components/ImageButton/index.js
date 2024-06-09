import React from 'react';
import {StyleSheet, Text, TouchableOpacity, Image} from 'react-native';
import {SCREEN_WIDTH} from '../../utils/Methods';
import GoogleImage from '../../assets/images/google.svg';
import {fonts} from '../../utils/theme/fonts';
import {colors} from '../../utils/theme/colors';
const ImageButton = props => {
  const {title, onPress, containerStyle, btnStyle, image} = props;
  return (
    <TouchableOpacity
      style={[styles.container, containerStyle]}
      onPress={onPress}>
      {title ? (
        <Text style={[styles.title, btnStyle]}>{title}</Text>
      ) : (
        <GoogleImage />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    height: 60,
    width: Platform.OS == 'ios' ? SCREEN_WIDTH - 40 : SCREEN_WIDTH - 40,
    marginTop: 15,
  },
  title: {
    color: colors.white,
    fontFamily: fonts.Montserrat_Medium,
    fontSize: 20,
  },
});
export default ImageButton;
