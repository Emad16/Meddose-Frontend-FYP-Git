import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import {StyleSheet, Text, View} from 'react-native';
import {SCREEN_WIDTH} from '../../utils/Methods';
import {fonts} from '../../utils/theme/fonts';
import {colors} from '../../utils/theme/colors';

const LoginSignupTop = ({description, title, margin}) => {
  const login = (
    <MaterialIcons name="login" size={22} color={colors.secondry} />
  );
  const signup = (
    <Feather name="user-check" size={22} color={colors.secondry} />
  );

  return (
    <View style={margin ? {marginTop: margin} : ''}>
      <View style={styles.loginSection}>
        <View style={styles.loginIcon}>
          <Text>{title == 'Login' ? login : signup}</Text>
        </View>
        <View>
          <Text style={styles.logintext}>{title}</Text>
        </View>
      </View>
      <View style={{width: SCREEN_WIDTH - 40, marginTop: 20}}>
        <Text
          style={
            title == 'Login'
              ? {...styles.loginpara, fontSize: 15}
              : {...styles.loginpara, fontSize: 14.5}
          }>
          {description}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  loginSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 0,
  },
  loginIcon: {
    width: 40,
    height: 40,
    borderRadius: 100,
    backgroundColor: colors.loginIconBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logintext: {
    fontFamily: fonts.Montserrat_SemiBold,
    fontSize: 20,
    color: colors.text,
    marginLeft: 10,
    fontWeight: '600',
  },
  loginpara: {
    fontFamily: fonts.Montserrat_Medium,
    color: colors.greyTextLogin,
    letterSpacing: -1,
    lineHeight: 25,
    // marginLeft: 5,
    textAlign: 'left',
  },
});
export default LoginSignupTop;
