import React from 'react';
import {useEffect} from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  StyleSheet,
  View,
  Image,
  Dimensions,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import AccountLink from '../../components/AccountLink/Index';
import {Avatar} from 'react-native-paper';
import {fonts} from '../../utils/theme/fonts';
import {permission, showLog} from '../../utils/Methods';
import NetworkError from '../NetworkError';
import {useNavigation} from '@react-navigation/native';
import {colors} from '../../utils/theme/colors';
import DeviceInfo from 'react-native-device-info';

const screenWidth = Dimensions.get('window').width;

const Welcome = props => {
  const navigation = useNavigation();
  let isTablet = DeviceInfo.isTablet();
  useEffect(() => {
    permission();
  }, []);
  return (
    <View style={styles.sectionContainer}>
      {/* <ScrollView contentContainerStyle={{}}>
       <Text
//         style={{
//           color: '#000',
//           fontSize: 50,
//           fontFamily: fonts.test2,
//         }}>{`ﱁ ﱂ ﱃ ﱄ ﱅ
// ﱆ ﱇ ﱈ ﱉ ﱊ
// ﱋ ﱌ ﱍ ﱎ ﱏ ﱐ ﱑ
// ﱒ ﱓ ﱔ ﱕ ﱖ ﱗ
// ﱘ ﱙ ﱚﱛ ﱜ ﱝ
// ﱞ ﱟ ﱠ ﱡ
// ﱢ ﱣ
// `}</Text> */}
      <Image
        style={styles.sectionImage}
        source={require('../../assets/images/img.jpg')}
      />
      <View style={styles.overlay} />
      <SafeAreaView style={{flex: 1}}>
        <ScrollView contentContainerStyle={styles.scrollviewstyles}>
          <View>
            <Avatar.Image
              size={85}
              source={require('../../assets/images/logo.png')}
              style={styles.logo}
            />

            <View style={styles.sectionTitle}>
              <Text style={[styles.title, styles.font]}>
                Experience The Ideal Med Platform For You
              </Text>
            </View>
          </View>
          <View style={styles.SignupSection}>
            <View style={styles.bottomTextSection}>
              <Text style={[styles.getcartext, styles.font]}>
                Take Care of your{' '}
              </Text>
              <Text style={[styles.getcarlink, styles.font]}>Loved Ones</Text>
            </View>
            <View>
              <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('Signup')}>
                <Text style={[styles.btnTitle, styles.font] }>Get Started</Text>
                <View style={styles.buttonEllipse}>
                  <Image
                    source={require('../../assets/images/rightarrow.png')}
                  />
                </View>
              </TouchableOpacity>
            </View>
            <AccountLink
              text="Already have an account? "
              link="Sign in"
              onPress={() => navigation.navigate('Login')}
              textColor={{color: colors.white}}
              linkColor={{color: colors.secondry}}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  scrollviewstyles: {
    flex: 1,
    justifyContent: 'space-between',
  },
  sectionContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: colors.primary,
  },
  logo: {
    marginTop: 30,
    marginLeft: 30,
    borderRadius: 50,
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  logotextStyle: {
    fontSize: 44,
    fontFamily: fonts.jm_poster_inline,
    textAlign: 'center',
    color: colors.logo,
  },

  sectionImage: {
    height: '100%',
    width: screenWidth,
    position: 'absolute',
    bottom: 0,
  },
  sectionTitle: {
    marginTop: 15,
  },
  title: {
    fontSize: 40,
    marginLeft: 30,
    color: colors.white,
  },
  SignupSection: {
    alignSelf: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
    resizeMode: 'cover',
  },
  bottomTextSection: {
    alignSelf: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginBottom: 10,
    resizeMode: 'cover',
  },
  getcartext: {
    fontSize: 20,
    color: colors.white,
    letterSpacing: -1,
  },
  getcarlink: {
    fontSize: 20,
    textDecorationLine: 'underline',
    color: colors.white,
    letterSpacing: -1,
    fontWeight: 'bold',
  },
  button: {
    height: 75,
    width: 320,
    borderRadius: 100,
    padding: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 15,
    marginTop: 15,
    backgroundColor: colors.primary,
  },
  btnTitle: {
    fontSize: 20,
    color: colors.white,
    marginLeft: 15,
  },
  buttonEllipse: {
    width: 55,
    height: 55,
    borderRadius: 100,
    backgroundColor: colors?.buttonEllipse,
    alignItems: 'center',
    justifyContent: 'center',
  },
  font: {
    fontFamily: 'Montserrat-SemiBold',
  },
});

export default NetworkError(Welcome);
// AA2B1D
// BB3939
