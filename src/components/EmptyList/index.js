import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {colors} from '../../utils/theme/colors';
import NormalButton from '../Button';

const EmptyList = ({action}) => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text style={{fontSize: 20, color: colors.greyText}}>No data Found</Text>
      {action && <NormalButton title="Try Again" onPress={action} />}
    </View>
  );
};

const styles = StyleSheet.create({
  scrollviewstyles: {
    flexGrow: 1,
    paddingLeft: 22,
    paddingRight: 22,
    backgroundColor: colors.white,
  },
  safeAreaViewstyles: {
    flex: 1,
  },
});
export default EmptyList;
