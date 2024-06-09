import React, {useEffect} from 'react';
import {useState} from 'react';
import {Easing, Platform, StyleSheet, Text, View} from 'react-native';

import Header from '../../components/Header';
import Container from '../../components/Container';
import {SCREEN_HEIGHT, SCREEN_WIDTH, showLog} from '../../utils/Methods';
import {useDispatch, useSelector} from 'react-redux';
import {TextInput} from 'react-native-paper';
import NormalButton from '../../components/Button';
import ProfileSection from '../../components/ProfileSection';
import {showSnackBar} from '../../core/redux/actions';
import {
  addError,
  setOtherProfile,
  sumbitReview,
} from '../../core/redux/actions/auth';
import {fonts} from '../../utils/theme/fonts';
import StarRating from 'react-native-star-rating-widget';
import NetworkError from '../NetworkError';
import {useNavigation, useRoute} from '@react-navigation/native';
import {colors} from '../../utils/theme/colors';

const SubmitReview = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {id} = route.params;
  const [loader, setLoader] = useState(false);
  const [comment, setComment] = useState(null);
  const [stars, setStars] = useState(0);
  const {otherUserProfile, userData, user, Error, review} = useSelector(
    state => state.auth,
  );
  const dispatch = useDispatch();
  const ratingCompleted = rating => {
    showLog(rating);
    setStars(rating);
  };
  const submitHandler = () => {
    setLoader(true);
    if (comment && stars && userData) {
      dispatch(
        sumbitReview({
          id: id,
          rating: stars,
          comment: comment,
          token: user?.token,
        }),
      );
    } else {
      dispatch(showSnackBar({visible: true, text: 'All fields are required'}));
      setLoader(false);
    }
  };
  useEffect(() => {
    showLog(otherUserProfile, 'other profile');
    if (review) {
      dispatch(sumbitReview());
      dispatch(setOtherProfile(otherUserProfile?.id, user?.token));
      navigation.goBack();
      setLoader(false);
    } else if (Error) {
      dispatch(showSnackBar({visible: true, text: Error.message}));
      setLoader(false);
    }
  }, [Error, review]);
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      dispatch(addError(null));
      setComment(null);
      setStars(0);
    });

    return unsubscribe;
  }, [navigation]);
  return (
    <View style={styles.sectionContainer}>
      <Header navigation={navigation} title="Submit Review" />
      <Container>
        <ProfileSection data={otherUserProfile} />
        <View style={{...styles.ratingSection}}>
          <Text style={{...styles.nameText, ...styles.font, marginTop: 15}}>
            Rate Showroom
          </Text>

          <StarRating
            starSize={45}
            maxStars={5}
            style={{marginTop: 20}}
            emptyColor={colors.inactveReviewStar}
            color={colors.activeReviewStar}
            animationConfig={{
              easing: Easing.elastic(2),
              duration: 300,
              scale: 1,
              delay: 300,
            }}
            rating={stars}
            onChange={e => ratingCompleted(e)}
          />
        </View>
        <View style={styles.ratingSection}>
          <Text style={{...styles.nameText, ...styles.font, marginTop: 5}}>
            Comment
          </Text>
          <TextInput
            textColor="black"
            mode="outlined"
            placeholder="Your Comment..."
            multiline={true}
            placeholderTextColor={colors.placeholder}
            selectionColor={colors.black}
            numberOfLines={5}
            style={{
              flex: 1,
              width: '100%',
              backgroundColor: colors.transparent,
              color: colors.black,
              fontSize: 16,
              fontWeight: '600',
              fontFamily: fonts.Montserrat_Medium,
              minHeight: Platform.OS == 'ios' ? 140 : null,
            }}
            outlineStyle={{borderRadius: 10, borderColor: colors.border}}
            value={comment}
            onChangeText={txt => setComment(txt)}
          />
        </View>
        <View style={{marginTop: 30, marginBottom: 20}}>
          <NormalButton
            onPress={() => submitHandler()}
            title={'Submit'}
            loader={loader}
          />
        </View>
      </Container>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollviewstyles: {
    flexGrow: 1,
    // margin: 10,
    justifyContent: 'space-around',
  },
  sectionContainer: {
    flex: 1,
    flexDirection: 'column',
    marginBottom: 5,
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
  descriptionSection: {
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  ratingSection: {
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  font: {
    fontFamily: fonts.Montserrat_Medium,
  },
  nameText: {
    fontSize: 15,
    color: colors.text,
  },
  paraText: {
    fontFamily: fonts.Montserrat_Medium,
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
export default NetworkError(SubmitReview);
