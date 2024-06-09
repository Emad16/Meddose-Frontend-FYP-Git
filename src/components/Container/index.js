import {DarkTheme} from '@react-navigation/native';
import React, {useState, useEffect, forwardRef} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {colors} from '../../utils/theme/colors';

const Container = forwardRef((props, ref) => {
  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView
        keyboardShouldPersistTaps={
          props.keyboardShouldPersistTaps ? 'never' : 'always'
        }
        ref={ref}
        contentContainerStyle={styles.scrollviewstyles}>
        {props.children}
      </ScrollView>
    </SafeAreaView>
  );
});

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
export default Container;
