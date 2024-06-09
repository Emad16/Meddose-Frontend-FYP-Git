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
import LoginSignupTop from '../../components/LoginSignup';
import Container from '../../components/Container';
import {SCREEN_WIDTH, showLog} from '../../utils/Methods';
import {apiBaseURLV1} from '../../ApiBaseURL';
import Loader from '../../components/PageLoader/Loader';
import axios from 'axios';
import {showSnackBar} from '../../core/redux/actions';
import NetworkError from '../NetworkError';
import {useNavigation} from '@react-navigation/native';
import {colors} from '../../utils/theme/colors';
import {fonts} from '../../utils/theme/fonts';

const Forgot = () => {
  const navigation = useNavigation();

  const myIcon = <MaterialIcons name="login" size={22} color="#47ABD8" />;
  const [email, setEmail] = useState(null);
  const dispatch = useDispatch();
  const {user, Error, passwordCode} = useSelector(state => state.auth);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    showLog(passwordCode);
    if (Error) {
      if (Error.response?.data?.message == 'Email address not registered') {
        dispatch(
          showSnackBar({
            visible: true,
            text: 'Email address is not registered',
          }),
        );
        setLoader(false);
      }
    } else if (passwordCode && passwordCode.data.sent) {
      showLog('hello');
      setLoader(false);
      navigation.navigate('ForgotPassConfirm', {email: email});
      dispatch(addError(null));
    }
    dispatch(addError(null));
  }, [Error, passwordCode]);

  const handleSubmit = async () => {
    var emailRegex =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (email) {
      if (!emailRegex.test(email))
        return dispatch(
          showSnackBar({
            visible: true,
            text: 'Please enter a valid email address',
          }),
        );
      setLoader(true);
      dispatch(getPasswordCode({email: email}));
    } else {
      dispatch(showSnackBar({visible: true, text: 'Email Field is required'}));
    }
  };
  useEffect(() => {
    const cleanUp = navigation.addListener('blur', () => {
      dispatch(addError(null));
      setEmail(null);
    });

    return cleanUp;
  }, [navigation]);

  return (
    <Container enableKeyboard={true}>
      {loader && <Loader />}
      <View style={styles.sectionContainer}>
        <LoginSignupTop
          margin={20}
          description="Forgot your password? Enter email to get verification code"
          title="Forgot Password"
        />
        <View style={styles.form}>
          <Text style={[styles.font, styles.formFieldText]}>Email*</Text>
          <Input
            value={email}
            holder={'info@example.com'}
            handleTextChange={txt => setEmail(txt)}
            type="text"
          />
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

  buttonSection: {
    marginTop: 30,
    marginBottom: 20,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  font: {
    fontFamily: fonts.Montserrat_Medium,
  },
});

export default NetworkError(Forgot);
