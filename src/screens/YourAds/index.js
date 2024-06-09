import React, {useCallback, useEffect} from 'react';
import {useState, useRef} from 'react';
import {StyleSheet, Text, View, Pressable} from 'react-native';
import Header from '../../components/Header';
import {fonts} from '../../utils/theme/fonts';
import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import NetworkError from '../NetworkError';
import ActiveFLatlist from '../../components/ActiveFlatlist';
import RemoveFLatlist from '../../components/RemoveFlatlist';
import PendingFLatlist from '../../components/PendingFlatlist';
import Selector from '../../components/Selector';
import {colors} from '../../utils/theme/colors';

const YourAds = () => {
  const navigation = useNavigation();
  const router = useRoute();
  const [filter, setFilter] = useState('Active Ads');
  const activeRef = useRef();
  const removeRef = useRef();
  const pendingRef = useRef();
  const isFocused = useIsFocused();

  const buttonArray = ['Active Ads', 'Pending Ads', 'Removed Ads'];

  useFocusEffect(
    useCallback(() => {
      switch (filter) {
        case 'Active Ads':
          activeRef?.current?.getActiveListing();
          break;
        case 'Removed Ads':
          removeRef?.current?.getRemoveListing();
          break;
        default:
          pendingRef?.current?.getPendingListing();
          break;
      }
    }, [filter]),
  );

  useEffect(() => {
    if (isFocused) {
      if (router?.params?.filter) {
        setFilter(router?.params?.filter);
      } else {
        setFilter('Active Ads');
      }
    }

    return () => {};
  }, [isFocused]);

  return (
    <>
      <Header navigation={navigation} title="Your Ad's" />
      <View
        style={{
          backgroundColor: colors.white,
          alignSelf: 'center',
          marginVertical: 20,
        }}>
        <Selector
          holder="Active Ads"
          data={buttonArray}
          comingFrom="YourAds"
          value={filter}
          handleValueChange={val => setFilter(val)}
        />
      </View>

      <View style={styles.sectionContainer}>
        {filter == 'Active Ads' ? (
          <ActiveFLatlist ref={activeRef} />
        ) : filter == 'Removed Ads' ? (
          <RemoveFLatlist ref={removeRef} filter={filter} />
        ) : (
          <PendingFLatlist ref={pendingRef} />
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  scrollviewstyles: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    margin: 5,
  },
  sectionContainer: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: 12,
  },
  buttonSection: {},
  buttonStyle: {
    height: 45,
    marginTop: 20,
    marginBottom: 20,
    paddingHorizontal: 15,
    borderRadius: 100,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 3,
    marginRight: 3,
    borderColor: colors.transparent,
  },

  font: {
    fontFamily: fonts.Montserrat_Medium,
    fontSize: 15,
  },
});
export default NetworkError(YourAds);
