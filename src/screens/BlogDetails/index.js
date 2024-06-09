import React from 'react';
import {SliderBox} from 'react-native-image-slider-box';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import Container from '../../components/Container';
import Entypo from 'react-native-vector-icons/Entypo';

import {SCREEN_HEIGHT, SCREEN_WIDTH} from '../../utils/Methods';
import {fonts} from '../../utils/theme/fonts';
import NetworkError from '../NetworkError';
import {useNavigation, useRoute} from '@react-navigation/native';
import {colors} from '../../utils/theme/colors';
import {Appbar} from 'react-native-paper';
import {StarRatingDisplay} from 'react-native-star-rating-widget';
import Header from '../../components/Header';

const BlogDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {blog} = route.params;

  return (
    <>
      <Header title={'Blog'} />
      <ScrollView>
        <Image
          style={{
            width: '100%',
            height: 200,
            borderRadius: 10,
            marginTop: 10,
          }}
          source={blog?.titleImage}
        />

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 20,
            paddingTop: 5,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
            }}>
            <Text
              style={{
                color: colors.activeReviewStar,
                fontFamily: fonts.Montserrat_Medium,
                fontSize: 15,
                marginTop: 5,
              }}>
              {parseFloat(blog?.stars).toFixed(1)}
            </Text>
            <StarRatingDisplay
              style={{marginTop: 5, marginLeft: 8}}
              starStyle={{marginLeft: -3}}
              color={colors.activeReviewStar}
              starSize={15}
              rating={blog?.stars}
            />
          </View>
          <Image source={require('../../assets/images/Review.png')} />
        </View>
        <View style={{marginBottom: 10, padding: 20}}>
          <Text style={[styles.carName, styles.font]}>{blog?.title}</Text>
          <View style={[styles.locationContent, styles.font]}>
            <Text style={[styles.locationTxt, styles.font]}>{blog?.blog}</Text>
          </View>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  form: {
    width: '100%',
    alignSelf: 'flex-start',
    justifyContent: 'flex-start',
  },
  locationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  inputStyles: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: SCREEN_HEIGHT / 14,
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    paddingLeft: 10,
    paddingRight: 10,
    margin: 10,
    marginLeft: 0,
  },
  carName: {color: colors.text, fontSize: 20},
  formFieldText: {
    fontSize: 14,
  },
  buttonSection: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    backgroundColor: colors.white,
    width: '100%',
    marginTop: 10,
    marginBottom: 10,
  },
  buttonStyle: {
    height: 60,
    // width: '30%',
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationTxt: {
    fontSize: 14,
    marginLeft: 5,
    color: colors.greyText,
  },
  font: {
    fontFamily: fonts.Montserrat_Medium,
  },
  viewImageSection: {
    flex: 1,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  banner: {
    backgroundColor: colors.primary,
    marginTop: 8,
    borderRadius: 10,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'flex-start',
    alignSelf: 'baseline',
  },

  header: {
    backgroundColor: colors.secondry,
    height: 100,
    justifyContent: 'center',
    zIndex: 1001,
  },
});
export default NetworkError(BlogDetails);
