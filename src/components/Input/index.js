import React from 'react';
import {useEffect, useState} from 'react';

import {TextInput} from 'react-native-paper';
import {Platform, StyleSheet, TouchableOpacity, View} from 'react-native';
import {showLog} from '../../utils/Methods';
import {fonts} from '../../utils/theme/fonts';
import {TextInput as InputText} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors} from '../../utils/theme/colors';
const Input = ({
  handleTextChange,
  type,
  holder,
  value,
  keyboardType,
  disabled,
  multiline,
  numberOfLines,
  style,
}) => {
  const [text, setText] = useState('');
  const [showPass, setShowpass] = useState(false);
  const [focus, setFocus] = useState(false);
  useEffect(() => {
    showLog(value, 'valueee');
    setText(value);
  }, [value]);
  if (type === 'text') {
    return (
      <TextInput
        autoCapitalize="none"
        keyboardType={keyboardType ? keyboardType : 'default'}
        mode={'flat'}
        selectionColor={colors.black}
        placeholder={holder}
        placeholderTextColor={colors.placeholder}
        outlineColor={colors.border}
        activeOutlineColor={colors.secondry}
        textColor={colors.text}
        disabled={disabled}
        style={
          // disabled
          //   ? {
          //       fontSize: 16,
          //       fontFamily: fonts.Montserrat_Medium,
          //       backgroundColor: colors.disabled,
          //     }
          // :
          {
            fontSize: 16,
            fontFamily: fonts.Montserrat_Medium,
            backgroundColor: colors.transparent,
          }
        }
        contentStyle={[styles.input, style]}
        theme={{
          colors: {
            primary: colors.border,
          },
          mode: 'exact',
          fonts: {regular: fonts.Montserrat_Medium},
        }}
        value={value ? value : text}
        onChangeText={txt => {
          setText(txt);
          handleTextChange(txt);
        }}
        multiline={multiline ? true : false}
        numberOfLines={numberOfLines ? numberOfLines : 1}
      />
    );
  } else {
    return (
      <View
        style={{
          ...styles.passwordInput,
          borderColor: focus ? colors.secondry : colors.border,
        }}>
        <InputText
          style={styles.passwordText}
          placeholder={holder}
          secureTextEntry={showPass ? false : true}
          placeholderTextColor={colors.placeholder}
          value={text}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          onChangeText={txt => {
            setText(txt);
            handleTextChange(txt);
          }}
        />
        <TouchableOpacity onPress={() => setShowpass(!showPass)}>
          <MaterialCommunityIcons
            name={showPass ? 'eye-off' : 'eye'}
            size={25}
            color={colors.Icon}
          />
        </TouchableOpacity>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  passwordText: {
    flex: 1,
    color: colors.text,
    fontSize: 16,
    fontFamily: fonts.Montserrat_Medium,
    backgroundColor: colors.transparent,
    alignSelf: 'center',
    marginBottom: -3,
  },
  passwordInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.transparent,
    width: Platform.OS == 'ios' ? '100%' : '100%',
    justifyContent: 'center',
    paddingRight: 15,
    marginTop: 15,
    paddingVertical: Platform.OS == 'ios' ? 12 : 0,
    fontFamily: fonts.Montserrat_Medium,
    borderWidth: 1,
    borderBottomColor: 'grey',
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderLeftWidth: 0,
    paddingBottom: 5,
  },
  input: {
    backgroundColor: colors.transparent,
    width: Platform.OS == 'ios' ? '100%' : '100%',
    justifyContent: 'center',
    marginTop: 15,
    paddingLeft: 0,
    fontFamily: fonts.Montserrat_Medium,
  },
});
export default Input;
