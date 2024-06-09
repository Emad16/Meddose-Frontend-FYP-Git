import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Header from '../../components/Header';
import Container from '../../components/Container';
import {SCREEN_HEIGHT, SCREEN_WIDTH, showLog} from '../../utils/Methods';
import {useSelector} from 'react-redux';
import ProfileSection from '../../components/ProfileSection';
import NormalButton from '../../components/Button';
import NetworkError from '../NetworkError';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {Modal, Portal} from 'react-native-paper';
import {StarRatingDisplay} from 'react-native-star-rating-widget';
import moment from 'moment';
import {updatedDate} from '../../utils/Methods';
import {fonts} from '../../utils/theme/fonts';
import ReviewFlatlist from '../../components/ReviewFlatlist';
import {colors} from '../../utils/theme/colors';

const ShowroomProfile = () => {
  const navigation = useNavigation();
  const {otherUserProfile} = useSelector(state => state.auth);
  const scrollRef = useRef();

  useEffect(() => {
    showLog(otherUserProfile.id, 'was hit');
  }, [otherUserProfile]);
  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      showLog('working?');
      scrollRef.current?.scrollTo({
        y: 0,
      });
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <>
      <Header navigation={navigation} title="Showroom" />
      <View style={styles.sectionContainer}>
        <ScrollView>
          <ProfileSection padding={22} data={otherUserProfile} />
          <View
            style={{
              marginTop: 15,
              marginBottom: 30,
              paddingHorizontal: 22,
            }}>
            <Text style={{...styles.paraText, ...styles.font}}>
              {otherUserProfile?.description}
            </Text>
          </View>
          <View
            style={{
              justifyContent: 'space-between',
            }}>
            {otherUserProfile?.rating_array.length > 0 && (
              <>
                <Text style={{...styles.nameText, ...styles.font}}>
                  Reviews
                </Text>
                <ReviewFlatlist authorId={otherUserProfile.id} />
              </>
            )}
          </View>
          <View style={{...styles.SubmitButton}}>
            <NormalButton
              onPress={() =>
                navigation.navigate('SubmitReview', {
                  id: otherUserProfile?.id,
                })
              }
              title={'Submit Review'}
            />
          </View>
        </ScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: colors.white,
  },
  PictureSection: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    height: SCREEN_HEIGHT - 530,
    borderRadius: 10,
    borderColor: colors.border,
    borderWidth: 1,
    width: SCREEN_WIDTH - 40,
  },

  SubmitButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 20,
    marginTop: 10,
  },
  font: {
    fontFamily: fonts.Montserrat_Medium,
  },
  nameText: {
    fontSize: 20,
    color: colors.text,
    paddingHorizontal: 22,
    marginBottom: 22,
  },

  btnText: {
    fontSize: 20,
    color: colors.white,
    fontWeight: '600',
  },
  paraText: {
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 21,
    color: colors.greyText,
  },

  locationTxt: {
    fontSize: 14,
    marginLeft: 5,
    color: colors.greyText,
  },
  locationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
});

export default NetworkError(ShowroomProfile);
