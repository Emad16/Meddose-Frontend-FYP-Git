import {
  Alert,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback} from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {fonts} from '../../utils/theme/fonts';
import {showLog} from '../../utils/Methods';
import {colors} from '../../utils/theme/colors';

const CheckBox = props => {
  const iconName = props.isChecked
    ? 'checkbox-marked'
    : 'checkbox-blank-outline';
  const handleClick = () => {
    Linking.canOpenURL('https://meddose.pk/index.php/privacy-policy/').then(
      supported => {
        if (supported) {
          Linking.openURL('https://meddose.pk/index.php/privacy-policy/');
        } else {
          Alert.alert(
            'Choose',
            `Don't know how to open this URL: ${'https://meddose.pk/index.php/privacy-policy/'}`,
            [
              {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              },
            ],
            {
              cancelable: true,
            },
          );
        }
      },
    );
  };
  return (
    <View style={[styles.container, props.width]}>
      <Pressable onPress={props.onPress}>
        <MaterialCommunityIcons
          name={iconName}
          size={25}
          color={props?.isChecked ? colors.secondry : colors.checkbox}
        />
      </Pressable>
      <Text style={styles.title}>{props.title}</Text>
      <Text style={styles.link}>{props.terms}</Text>
    </View>
  );
};

export default CheckBox;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 5,
    marginHorizontal: 5,
  },
  title: {
    fontFamily: fonts.Montserrat_Medium,
    fontSize: 15,
    letterSpacing: -0.7,
    color: colors.greyTextLogin,
    marginLeft: 5,
  },
  link: {
    fontFamily: fonts.Montserrat_Medium,
    fontSize: 15,
    letterSpacing: -0.7,
    color: colors.forgotLink,
    marginLeft: 5,
    fontWeight: 'bold',
  },
});
