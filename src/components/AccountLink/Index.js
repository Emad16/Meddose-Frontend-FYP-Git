import React from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import {fonts} from '../../utils/theme/fonts';
const AccountLink = props => {
  const {text, link, onPress, textColor, linkColor} = props;
  return (
    <View style={styles.bottomTextSection}>
      <Text style={[styles.signintext, styles.font, textColor]}>{text}</Text>
      <TouchableOpacity onPress={onPress}>
        <Text style={[styles.signintextlink, styles.font, linkColor]}>
          {link}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  bottomTextSection: {
    alignSelf: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    resizeMode: 'cover',
    marginTop: 15,
  },
  signintext: {
    fontSize: 16,
  },
  signintextlink: {
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  font: {
    fontFamily: fonts.Montserrat_SemiBold,
    letterSpacing: -0.7,
  },
});
export default AccountLink;
