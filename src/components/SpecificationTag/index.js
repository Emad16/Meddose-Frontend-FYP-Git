import React from 'react';
import {Text} from 'react-native-paper';
import {colors} from '../../utils/theme/colors';
import {fonts} from '../../utils/theme/fonts';
import {showLog} from '../../utils/Methods';
import {Platform, Pressable} from 'react-native';

const SpecificationTag = ({
  data,
  color,
  backgroundColor,
  onPress,
  loading,
  style,
}) => {
  return (
    <Pressable onPress={onPress} disabled={loading}>
      <Text
        style={{
          margin: 5,
          color: color ? color : colors.secondry,
          fontFamily: fonts.Montserrat_Medium,
          overflow: Platform.OS == 'ios' ? 'hidden' : 'visible',
          borderRadius: Platform.OS == 'ios' ? 15 : 50,
          fontSize: 14,
          fontWeight: 700,
          paddingVertical: 7,
          // paddingHorizontal: ,
          flex: 1,
          textAlign: 'center',
          backgroundColor: backgroundColor
            ? backgroundColor
            : colors.loginIconBackground,
          ...style,
        }}>
        {loading ? 'Loading ...' : data}
      </Text>
    </Pressable>
  );
};

export default SpecificationTag;
