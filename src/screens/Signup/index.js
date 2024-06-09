import React from 'react';
import {useEffect, useState} from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import CheckBox from '../../components/CheckBox';
import {BoxPasswordStrengthDisplay} from 'react-native-password-strength-meter';
import {
  StyleSheet,
  View,
  Image,
  Dimensions,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import AccountLink from '../../components/AccountLink/Index';
import NormalButton from '../../components/Button';
import Input from '../../components/Input';
import axios from 'axios';
import {apiBaseURLV1} from '../../ApiBaseURL';
import LoginSignupTop from '../../components/LoginSignup';
import Container from '../../components/Container';
import {Specialities, showLog, Diseases} from '../../utils/Methods';
import {showSnackBar} from '../../core/redux/actions';
import {useDispatch, useSelector} from 'react-redux';
import {
  addError,
  setSignupData,
  updateUserData,
} from '../../core/redux/actions/auth';
import Loader from '../../components/PageLoader/Loader';
import {fonts} from '../../utils/theme/fonts';
import NetworkError from '../NetworkError';
import {useNavigation} from '@react-navigation/native';
import {colors} from '../../utils/theme/colors';
import Selector from '../../components/Selector';

const Signup = () => {
  const navigation = useNavigation();

  const dispatch = useDispatch();
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const [loader, setLoader] = useState(false);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [userType, setUserType] = useState('');
  const [description, setDescription] = useState('');
  const [speciality, setSpeciality] = useState(null);
  const [customSpeciality, setCustomSpeciality] = useState('');
  const {Error, signupData} = useSelector(state => state.auth);
  const [disease, setDisease] = useState(null);
  const [customDisease, setCustomDisease] = useState('');

  const handleEmailChange = value => {
    setEmail(value);
  };
  const handlePassChange = value => {
    setPassword(value);
  };
  const handleNameChange = value => {
    setName(value);
  };
  const handlePhoneChange = value => {
    setPhone(value);
  };
  const handleAddressChange = value => {
    setAddress(value);
  };
  const handleUserTypeChange = value => {
    setUserType(value);
  };
  const handleDescriptionChange = value => {
    setDescription(value);
  };
  useEffect(() => {
    const cleanUp = navigation.addListener('blur', () => {
      dispatch(addError(null));
      dispatch(setSignupData(null));
    });
    return cleanUp;
  }, [navigation]);
  const submitHandler = async () => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (reg.test(email) === false)
      return dispatch(
        showSnackBar({visible: true, text: 'Please enter valid email address'}),
      );
    if (!email || !name || !phone || !address || !description || !password)
      return dispatch(
        showSnackBar({visible: true, text: 'Please fill all fields'}),
      );

    if (toggleCheckBox) {
      if (!speciality) {
        return dispatch(
          showSnackBar({visible: true, text: 'Please select your speciality'}),
        );
      }
      if (speciality?.short_code == 'none') {
        return dispatch(
          showSnackBar({visible: true, text: 'Please select your speciality'}),
        );
      }
      if (speciality?.short_code == 'other' && !customSpeciality) {
        return dispatch(
          showSnackBar({visible: true, text: 'Please fill speciality field'}),
        );
      }
    } else {
      if (!disease) {
        return dispatch(
          showSnackBar({visible: true, text: 'Please select your disease'}),
        );
      }
      if (disease?.short_code == 'none') {
        return dispatch(
          showSnackBar({visible: true, text: 'Please select your disease'}),
        );
      }
      if (disease?.short_code == 'other' && !customDisease) {
        return dispatch(
          showSnackBar({visible: true, text: 'Please fill disease field'}),
        );
      }
    }
    if (password.length < 8)
      return dispatch(
        showSnackBar({
          visible: true,
          text: 'Password length must be at least 8 characters',
        }),
      );
    if (phone.length != 11)
      return dispatch(
        showSnackBar({
          visible: true,
          text: 'Phone number length must be 11 digits',
        }),
      );
    setLoader(true);
    dispatch(
      setSignupData(
        {
          email,
          name,
          phone,
          address,
          description,
          password,
          toggleCheckBox,
          speciality: toggleCheckBox
            ? speciality?.short_code == 'other'
              ? customSpeciality
              : speciality.name
            : '',
          disease: !toggleCheckBox
            ? disease?.short_code == 'other'
              ? customDisease
              : disease.name
            : '',
        },
        data => {
          setLoader(false);
          if (data.status === 'success') {
            dispatch(setSignupData(null, () => {}));
            setLoader(false);
            setPassword('');
            setName('');
            setEmail('');
            setPhone('');
            setDescription('');
            setAddress('');
            setToggleCheckBox(false);
            setTimeout(() => {
              navigation.navigate('Login');
              setLoader(false);
            }, 3000);
            return dispatch(showSnackBar({visible: true, text: data.message}));
          }
          setLoader(false);
          dispatch(showSnackBar({visible: true, text: data.message}));
        },
      ),
    );
  };

  const variations = {
    digits: /\d/,
    lower: /[a-z]/,
    upper: /[A-Z]/,
  };
  const levels = [
    {
      label: 'Level: Very weak Password',
      labelColor: colors.greyTextLogin,
      activeBarColor: colors.weak,
    },
    {
      label: 'Level: Weak Password',
      labelColor: colors.greyTextLogin,
      activeBarColor: colors.weak,
    },
    {
      label: 'Level: Average Password',
      labelColor: colors.greyTextLogin,
      activeBarColor: colors.average,
    },
    {
      label: 'Level: Strong Password',
      labelColor: colors.greyTextLogin,
      activeBarColor: colors.strong,
    },
    {
      label: 'Level: Very strong Password',
      labelColor: colors.greyTextLogin,
      activeBarColor: colors.strong,
    },
  ];

  return (
    <Container enableKeyboard={true}>
      {/* {loader && <Loader />} */}
      <View style={styles.sectionContainer}>
        <LoginSignupTop
          margin={5}
          title="Sign Up"
          description="Create account as patient or as a caretaker and feel for your loved once"
        />
        <View style={styles.form}>
          <Input
            value={name}
            holder={'Full Name'}
            handleTextChange={handleNameChange}
            type="text"
          />

          <Input
            value={email}
            holder={'Email'}
            handleTextChange={handleEmailChange}
            type="text"
          />

          <Input
            value={phone}
            holder={'Phone'}
            handleTextChange={handlePhoneChange}
            type="text"
            keyboardType="numeric"
          />

          <Input
            value={address}
            holder={'Address'}
            handleTextChange={handleAddressChange}
            type="text"
          />

          <Input
            value={description}
            holder={'Description'}
            handleTextChange={handleDescriptionChange}
            type="text"
          />

          <Input
            value={password}
            holder={'Password'}
            handleTextChange={handlePassChange}
            type="pass"
          />

          <Selector
            value={toggleCheckBox ? speciality : disease}
            holder={`Select ${toggleCheckBox ? 'speciality' : 'disease'}`}
            data={toggleCheckBox ? Specialities : Diseases}
            handleValueChange={val => {
              // setCurrentMood([]);
              toggleCheckBox ? setSpeciality(val) : setDisease(val);
            }}
          />
          {toggleCheckBox &&
            speciality &&
            speciality?.short_code == 'other' && (
              <Input
                value={customSpeciality}
                holder={'Other Speciality'}
                handleTextChange={val => setCustomSpeciality(val)}
                type="text"
              />
            )}

          {!toggleCheckBox && disease && disease?.short_code == 'other' && (
            <Input
              value={customDisease}
              holder={'Other Disease'}
              handleTextChange={val => setCustomDisease(val)}
              type="text"
            />
          )}

          <View style={styles.policySection}>
            <CheckBox
              onPress={() => setToggleCheckBox(!toggleCheckBox)}
              title="Sign Up As A"
              terms={'Care Taker'}
              isChecked={toggleCheckBox}
            />
          </View>
        </View>
        <View style={styles.buttonSection}>
          <NormalButton
            onPress={() => submitHandler()}
            title={'Sign Up'}
            loader={loader}
          />
        </View>
        <View>
          <AccountLink
            text="Already have an account? "
            link="Sign In"
            onPress={() => navigation.navigate('Login')}
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
    justifyContent: 'space-evenly',
    marginBottom: 10,
    marginTop: 10,
  },
  form: {
    width: '100%',
    alignSelf: 'flex-start',
    justifyContent: 'center',
    // marginTop: -30,
  },
  input: {
    flexDirection: 'row',
    width: 300,
    height: 60,
    borderRadius: 10,
    borderColor: colors.border,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    padding: 10,
  },
  inputText: {
    fontSize: 16,
    width: 250,
    height: 60,
    fontWeight: '500',
    color: colors.text,
  },
  formFieldText: {
    fontSize: 15,
    fontWeight: 500,
    marginBottom: 5,
    marginTop: 20,
    color: colors.text,
  },
  policySection: {
    flexDirection: 'row',
    marginLeft: -6,
    marginTop: 5,
    marginBottom: 15,
  },

  buttonSection: {
    marginTop: 5,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  font: {
    fontFamily: fonts.Montserrat_Medium,
  },
});

export default NetworkError(Signup);
