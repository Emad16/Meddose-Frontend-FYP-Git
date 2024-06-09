import React from 'react';
import {useEffect, useState} from 'react';
import CheckBox from '../../components/CheckBox';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Platform,
  Image,
} from 'react-native';
import {
  AppleButton,
  appleAuth,
  appleAuthAndroid,
} from '@invertase/react-native-apple-authentication';
import uuid from 'react-native-uuid';
import jwt_decode from 'jwt-decode';
import Test from '../../assets/images/test.svg';

// import {Button} from 'react-native-paper';
import ImageButton from '../../components/ImageButton';
import AccountLink from '../../components/AccountLink/Index';
import NormalButton from '../../components/Button';
import Input from '../../components/Input';
import {ANDROID_CLIENT_ID, WEB_CLIENT_ID, IOS_CLIENT_ID} from '@env';
import {
  setUser,
  addError,
  setUserData,
  setGoogleUser,
} from '../../core/redux/actions/auth';
import RNPasswordStrengthMeter, {
  BoxPasswordStrengthDisplay,
} from 'react-native-password-strength-meter';
import {useDispatch, useSelector} from 'react-redux';
import Container from '../../components/Container';
import LoginSignupTop from '../../components/LoginSignup';
import {showSnackBar} from '../../core/redux/actions';
import {
  LoginButton,
  AccessToken,
  GraphRequest,
  GraphRequestManager,
} from 'react-native-fbsdk';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {SCREEN_HEIGHT, SCREEN_WIDTH, showLog} from '../../utils/Methods';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {authURL} from '../../ApiBaseURL';
import axios from 'axios';
import Loader from '../../components/PageLoader/Loader';
import {fonts} from '../../utils/theme/fonts';
import NetworkError from '../NetworkError';
import {useNavigation} from '@react-navigation/native';
import appleLogoBlack from '../../assets/images/apple_logo_black.png';
import {colors} from '../../utils/theme/colors';

const Login = props => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const [loader, setLoader] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const dispatch = useDispatch();
  const {user, Error} = useSelector(state => state.auth);
  // Function to retrieve login credentials from AsyncStorage

  const handleEmailChange = value => {
    setEmail(value);
    setToggleCheckBox(false);
  };
  const handlePassChange = value => {
    setPass(value);
    setToggleCheckBox(false);
  };
  const handleSubmit = () => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (reg.test(email) === false)
      return dispatch(
        showSnackBar({visible: true, text: 'Please enter valid email address'}),
      );
    setLoader(true);
    if (email && pass && email != '' && pass != '') {
      dispatch(
        setUser({email, pass}, data => {
          setLoader(false);
          if (data.status === 'success') {
            // navigation.navigate('Home');
            return dispatch(showSnackBar({visible: true, text: data.message}));
          }
          dispatch(showSnackBar({visible: true, text: data.message}));
        }),
      );
    } else {
      dispatch(showSnackBar({visible: true, text: 'All fields are required'}));
      setLoader(false);
    }
  };

  return (
    <Container enableKeyboard={true}>
      {/* {loader && <Loader />} */}
      <View style={styles.sectionContainer}>
        <LoginSignupTop
          // margin={5}
          description="Login to your account - enjoy exclusive features and many more"
          title="Login"
        />
        <View style={styles.form}>
          <Input
            holder={'Email'}
            handleTextChange={handleEmailChange}
            type="text"
            value={email}
          />
          <Input
            holder={'password'}
            handleTextChange={handlePassChange}
            type="pass"
            value={pass}
          />

          {/* <View style={styles.rememberSection}>
            <TouchableOpacity onPress={() => navigation.navigate('Forgot')}>
              <Text style={[styles.font, styles.forgetLink]}>
                Forgot Password?
              </Text>
            </TouchableOpacity>
          </View> */}

          <View style={styles.buttonSection}>
            <NormalButton
              onPress={() => handleSubmit()}
              title={'Login'}
              loader={loader}
            />
          </View>

          <AccountLink
            text="Don't have an account? "
            link="Sign Up"
            onPress={() => navigation.navigate('Signup')}
            textColor={{color: colors.greyTextLogin}}
            linkColor={{color: colors.secondry}}
          />
        </View>
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    flex: 1,
    justifyContent: 'center',
    marginTop: 30,
  },
  form: {
    width: '100%',
    alignSelf: 'flex-start',
    justifyContent: 'center',
    marginTop: 20,
  },
  input: {
    backgroundColor: colors.transparent,
  },
  inputText: {
    // fontWeight: '500',
    color: colors.text,
  },
  formFieldText: {
    fontSize: 15,
    fontWeight: 500,
    marginBottom: 5,
    marginTop: 20,
    color: colors.text,
  },
  rememberSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 10,
    marginLeft: -6,
  },
  forgetLink: {
    fontSize: 15,
    fontWeight: 500,
    textDecorationLine: 'underline',
    color: colors.forgotLink,
    letterSpacing: -0.5,
    marginTop: 20,
  },
  buttonSection: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 50,
  },
  orText: {
    color: colors.orText,
    marginTop: 20,
    fontFamily: fonts.Montserrat_Regular,
    fontSize: 15,
    // fontWeight: 500,
  },
  font: {
    fontFamily: fonts.Montserrat_Medium,
  },
});

export default NetworkError(Login);
