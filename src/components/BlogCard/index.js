import React from 'react';
import {Text, View, Image} from 'react-native';
import {Card, Surface} from 'react-native-paper';
import Octicons from 'react-native-vector-icons/Octicons';
import {SCREEN_HEIGHT, SCREEN_WIDTH, showLog} from '../../utils/Methods';
import {fonts} from '../../utils/theme/fonts';
import {StarRatingDisplay} from 'react-native-star-rating-widget';
import {colors} from '../../utils/theme/colors';
import DeviceInfo from 'react-native-device-info';

const BlogCard = ({blog}) => {
  let isTablet = DeviceInfo.isTablet();

  return (
    <View
      style={{
        borderRadius: 10,
        backgroundColor: colors.white,
        padding: 10,
        paddingVertical: isTablet ? 30 : 15,
        marginVertical: 15,
        shadowColor: colors.black,
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,

        elevation: 8,
      }}>
      <Image
        style={{
          width: '100%',
          height: 172,
          borderRadius: 10,
        }}
        source={blog?.titleImage}
      />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
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
      <Text
        style={{
          fontSize: 20,
          fontFamily: fonts.Montserrat_SemiBold,
          marginTop: 10,
          color: colors.black,
        }}>
        {blog?.title}
      </Text>
      <Text
        ellipsizeMode="tail"
        numberOfLines={5}
        style={{
          fontSize: 14,
          fontFamily: fonts.Montserrat_Medium,
          marginTop: 10,
          color: colors.greyText,
        }}>
        {blog?.blog}
      </Text>
    </View>
  );
};
export default BlogCard;
