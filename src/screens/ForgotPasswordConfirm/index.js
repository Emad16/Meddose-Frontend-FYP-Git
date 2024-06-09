import React from 'react';
import {useEffect, useState} from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import CheckBox from '../../components/CheckBox';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  Platform,
  TouchableOpacity,
  ScrollView,
  Appearance,
  TextBase,
} from 'react-native';
// import {Button} from 'react-native-paper';
import ImageButton from '../../components/ImageButton';
import AccountLink from '../../components/AccountLink/Index';
import NormalButton from '../../components/Button';
import Input from '../../components/Input';
import {
  setUser,
  addError,
  getPasswordCode,
} from '../../core/redux/actions/auth';
import {useDispatch, useSelector} from 'react-redux';
import {Snackbar} from 'react-native-paper';
import Container from '../../components/Container';
import LoginSignupTop from '../../components/LoginSignup';
import {showLog} from '../../utils/Methods';
import {showSnackBar} from '../../core/redux/actions';
import {apiBaseURLV1} from '../../ApiBaseURL';
import axios from 'axios';
import Loader from '../../components/PageLoader/Loader';
import NetworkError from '../NetworkError';
import {useNavigation, useRoute} from '@react-navigation/native';
import {fonts} from '../../utils/theme/fonts';
import {colors} from '../../utils/theme/colors';

const ForgotPassConfirm = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {passwordCode, Error} = useSelector(state => state.auth);
  const [email, setEmail] = useState(null);
  const [pass, setPass] = useState(null);
  const [code, setCode] = useState(null);
  const [loader, setloader] = useState(false);
  const [minutes, setMinutes] = useState(1);
  const [seconds, setSeconds] = useState(59);

  useEffect(() => {
    if (Error) {
      if (Error.response?.data?.message == 'Email address not registered') {
        dispatch(
          showSnackBar({
            visible: true,
            text: 'Email address is not registered',
          }),
        );
      }
      dispatch(addError(null));
    } else if (passwordCode && passwordCode.data.sent) {
      showLog(route?.params?.email, 'email in parameter');
      dispatch(addError(null));
      setTimeout(() => {
        dispatch(showSnackBar({visible: true, text: passwordCode.message}));
        setMinutes(1);
        setSeconds(59);
      }, 1000);
      setEmail(email ? email : route?.params?.email);
      dispatch(showSnackBar({visible: false, text: ''}));
      dispatch(getPasswordCode(null));
    }
  }, [passwordCode, Error]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }

      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(interval);
        } else {
          setSeconds(59);
          setMinutes(minutes - 1);
        }
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [seconds]);

  const resendOTP = () => {
    dispatch(getPasswordCode({email: email}));
  };
  const colorScheme = Appearance.getColorScheme();
  const dispatch = useDispatch();

  const handleSubmit = async () => {
    if (email && pass && code && email != '' && pass != '' && code != '') {
      if (pass.length < 8) {
        dispatch(
          showSnackBar({
            visible: true,
            text: 'Password length must be greater than 8',
          }),
        );
      } else {
        setloader(true);
        const formData = new FormData();
        formData.append('email', email);
        formData.append('code', code);
        formData.append('password', pass);
        try {
          const response = await axios.post(
            `${apiBaseURLV1}/reset_confirm`,
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            },
          );
          showLog(response.data.data);
          if (response.data.data.updated == true) {
            setloader(false);
            dispatch(
              showSnackBar({visible: true, text: response.data.message}),
            );
            navigation.navigate('Login');
          } else {
            dispatch(
              showSnackBar({
                visible: true,
                text: 'Something went wrong try again later.',
              }),
            );
            setloader(false);
          }
        } catch (error) {
          setloader(false);
          showLog('error', error.response.data.code);
          if ((error.response.data.code = 'rest_invalid_user')) {
            dispatch(
              showSnackBar({visible: true, text: error.response.data.message}),
            );
            setPass(null);
            setCode(null);
          } else if ((error.response.data.code = 'rest_invalid_code')) {
            dispatch(
              showSnackBar({visible: true, text: error.response.data.message}),
            );
            setPass(null);
            setCode(null);
          } else {
            dispatch(
              showSnackBar({
                visible: true,
                text: 'Something went wrong, please try again later',
              }),
            );
            setPass(null);
            setCode(null);
          }
        }
      }
    } else {
      dispatch(showSnackBar({visible: true, text: 'Alll fields are required'}));
    }
  };

  useEffect(() => {
    const cleanUp = navigation.addListener('blur', () => {
      dispatch(addError(null));
      setEmail(null);
      setPass(null);
      setCode(null);
    });

    return cleanUp;
  }, [navigation]);

  return (
    <Container>
      {loader && <Loader />}
      <View style={styles.sectionContainer}>
        <LoginSignupTop
          margin={22}
          description="Check your email - enter the provided verification code below"
          title="Forgot Password"
        />
        <View style={styles.form}>
          <Text style={[styles.font, styles.formFieldText]}>Email*</Text>
          <Input
            value={email}
            disabled={email ? true : false}
            holder={'info@example.com'}
            handleTextChange={txt => setEmail(txt)}
            type="text"
          />
          <Text style={[styles.font, styles.formFieldText]}>Code*</Text>
          <Input
            value={code}
            keyboardType="number-pad"
            holder={'XXXXXXXXXXXX'}
            handleTextChange={txt => setCode(txt)}
            type="text"
          />
          <Text style={[styles.font, styles.formFieldText]}>Password*</Text>
          <Input
            value={pass}
            holder={'XXXXXXXXXXXX'}
            handleTextChange={txt => setPass(txt)}
            type="pass"
          />
          <View style={styles.rememberSection}>
            {seconds > 0 || minutes > 0 ? (
              <Text style={styles.title}>
                Time Remaining: {minutes < 10 ? `0${minutes}` : minutes}:
                {seconds < 10 ? `0${seconds}` : seconds}
              </Text>
            ) : (
              <Text>Didn't recieve code?</Text>
            )}
            <TouchableOpacity
              disabled={seconds > 0 || minutes > 0}
              onPress={() => resendOTP()}>
              <Text
                style={{
                  ...styles.font,
                  ...styles.forgetLink,
                  color:
                    seconds > 0 || minutes > 0
                      ? colors.greyTextLogin
                      : colors.secondry,
                }}>
                Resend Code
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.buttonSection}>
          <NormalButton onPress={() => handleSubmit()} title={'Submit'} />
          <View style={{marginTop: 30}}>
            <AccountLink
              text="Don't have an account? "
              link="Sign Up"
              onPress={() => navigation.navigate('Signup')}
              textColor={{color: colors.greyTextLogin}}
              linkColor={{color: colors.secondry}}
            />
          </View>
        </View>
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: colors.white,
    marginTop: Platform.OS == 'ios' ? 0 : 20,
  },
  title: {
    fontFamily: fonts.Montserrat_Medium,
    fontSize: 15,
    letterSpacing: -0.7,
    color: colors.greyTextLogin,
    marginLeft: 5,
  },
  loginSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
  },
  form: {
    width: '100%',
    alignSelf: 'flex-start',
    justifyContent: 'center',
  },
  formFieldText: {
    fontSize: 15,
    fontWeight: 500,
    marginBottom: 15,
    marginTop: 15,
    color: colors.text,
  },
  rememberSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 5,
  },
  forgetLink: {
    fontSize: 15,
    fontWeight: 500,
    textDecorationLine: 'underline',
    letterSpacing: -0.5,
  },
  buttonSection: {
    marginTop: 35,
    marginBottom: 20,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  font: {
    fontFamily: fonts.Montserrat_Medium,
  },
});

export default NetworkError(ForgotPassConfirm);
