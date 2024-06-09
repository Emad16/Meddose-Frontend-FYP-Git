import React, {useState} from 'react';
import Octicons from 'react-native-vector-icons/Octicons';
import {StyleSheet, Text, View, Image} from 'react-native';
import {
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  showLog,
  updatedDate,
} from '../../utils/Methods';
import Loader from '../PageLoader/Loader';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {colors} from '../../utils/theme/colors';
import {fonts} from '../../utils/theme/fonts';

const ProfileSection = ({data, padding}) => {
  const [loading, setLoading] = useState(true);
  return (
    <View>
      <Image
        style={styles.PictureSection}
        source={
          data?.logo && data?.logo != ''
            ? {uri: data?.logo}
            : require('../../assets/images/no-image-found-360x250.jpg')
        }
        onLoadEnd={() => setLoading(false)}
      />
      {loading && <Loader />}

      <View
        style={{
          ...styles.descriptionSection,
          paddingHorizontal: padding ? padding : 0,
        }}>
        <View>
          <Text style={[styles.nameText, styles.font]}>
            {data?.display_name}
          </Text>
          <View style={styles.locationContent}>
            <Octicons name="location" size={15} color={colors.greyText} />
            <Text style={[styles.locationTxt, styles.font]}>
              {data?.city}, Pakistan
            </Text>
          </View>
          <View style={styles.locationContent}>
            <Octicons name="calendar" size={15} color={colors.greyText} />
            <Text style={[styles.locationTxt, styles.font]}>
              Since {updatedDate(data?.joined_on)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
    marginTop: 30,
  },
  font: {
    fontFamily: fonts.Montserrat_Medium,
  },
  nameText: {
    fontSize: 20,
    marginBottom: 6,
    color: colors.text,
  },
  locationTxt: {
    fontSize: 14,
    marginLeft: 5,
    color: colors.greyText,
  },
  locationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
});
export default ProfileSection;
