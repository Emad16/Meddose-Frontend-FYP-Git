import React, {useCallback, useRef} from 'react';
import {useEffect, useState} from 'react';
import Octicons from 'react-native-vector-icons/Octicons';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import Header from '../../components/Header';
import Input from '../../components/Input';
import NormalButton from '../../components/Button';
import {Avatar, Snackbar, TextInput} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import moment from 'moment';
import {
  addError,
  setSignupData,
  setUser,
  setUserData,
  updateUserData,
} from '../../core/redux/actions/auth';
import Container from '../../components/Container';
import {showSnackBar} from '../../core/redux/actions';
import {checkPermissions, showLog} from '../../utils/Methods';
import {
  addFilters,
  addFiltersParams,
  addListingError,
  getCities,
} from '../../core/redux/actions/carlisting';
import Selector from '../../components/Selector';
import {fonts} from '../../utils/theme/fonts';
import {PERMISSIONS, checkMultiple} from 'react-native-permissions';
import NetworkError from '../NetworkError';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import axios from 'axios';
import {apiBaseURLV1} from '../../ApiBaseURL';
import {Logout} from '../../core/redux/actions/auth';
import {colors} from '../../utils/theme/colors';

const EditProfile = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [WhatsApp, setWhatsApp] = useState('');
  const [image, setImage] = useState('');
  const [photo, setphoto] = useState('');
  const [description, setDescription] = useState('');
  const {userData, user, Error, updatedProfile} = useSelector(
    state => state.auth,
  );
  console.log(user, 'user user');
  const dispatch = useDispatch();
  const {Cities} = useSelector(state => state.lisitng);
  const [loader, setLoader] = useState(false);
  const [accountloader, setAccountloader] = useState(false);

  const [errors, setErrors] = useState(null);
  const [permissionCheck, setPermissionCheck] = useState(null);
  const scrollRef = useRef();
  useEffect(() => {
    dispatch(addFiltersParams(null));
    dispatch(addFilters(null));
    checkPermissions(status => {
      setPermissionCheck(status);
    });
  }, []);

  useEffect(() => {
    if (Error) {
      setErrors(Error?.response?.data);
      setLoader(false);
      dispatch(showSnackBar({visible: true, text: Error.message}));
      dispatch(addError(null));
      dispatch(addListingError(null));
    } else if (route.params?.comingFrom == 'BottomTabs' && userData) {
      setLoader(false);
      dispatch(showSnackBar({visible: true, text: 'profile Updated'}));
      dispatch(showSnackBar({visible: false, text: ''}));
    }
  }, [Error, userData]);
  useFocusEffect(
    useCallback(() => {
      dispatch(getCities('get'));
    }, []),
  );
  const handlePhoneChange = value => {
    setPhone(value);
  };
  const handleNameChange = value => {
    setName(value);
  };
  const handelWhatsAppChange = value => {
    setWhatsApp(value);
  };
  const optionsAlert = () => {
    Alert.alert(
      'Choose',
      'Would you like to open Camera or select from Gallery?',
      [
        {
          text: 'Camera',
          onPress: () => takePhotoFromGallery('Camera'),
        },
        {
          text: 'Gallery',
          onPress: () => {
            takePhotoFromGallery('Gallery');
          },
        },
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
      ],
      {
        cancelable: true,
      },
    );
  };
  const takePhotoFromGallery = btn => {
    if (permissionCheck) {
      if (btn == 'Gallery') {
        ImagePicker.openPicker({
          width: 300,
          height: 400,
          cropping: false,
          mediaType: 'photo',
        }).then(img => {
          let pathParts = img.path.split('/');
          setImage({
            uri: img.path,
            type: img.mime,
            name: pathParts[pathParts.length - 1],
          });
          setphoto({
            uri: img.path,
            type: img.mime,
            name: pathParts[pathParts.length - 1],
          });
        });
      } else if (btn === 'Camera') {
        ImagePicker.openCamera({
          width: 300,
          height: 400,
          cropping: false,
          mediaType: 'photo',
        }).then(img => {
          let pathParts = img.path.split('/');
          setImage({
            uri: img.path,
            type: img.mime,
            name: pathParts[pathParts.length - 1],
          });
          setphoto({
            uri: img.path,
            type: img.mime,
            name: pathParts[pathParts.length - 1],
          });
        });
      } else {
        dispatch(Snackbar({visible: true, text: 'No option was selected'}));
      }
    } else {
      Alert.alert(
        'Permissions were denied',
        'Allow App to Access Photos from settings',
      );
    }
  };
  const deleteModal = () => {
    Alert.alert('Confirm', 'Are you sure you want to Delete Account?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'yes',
        onPress: () => {
          handledeleteAccount();

          // dispatch(setUserData());
        },
      },
    ]);
  };
  const handledeleteAccount = () => {
    setAccountloader(true);

    //https://meddose.pk/wp-json/showroom/v1//delete/user/69',
    const url = `${apiBaseURLV1}/delete/user/${user?.id}`;
    const options = {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${user?.token}`,
      },
      url,
    };
    axios(options)
      .then(res => {
        console.log('logout Api Success');
        setAccountloader(false);
        dispatch(Logout());
        // navigation.navigate('Login');
      })
      .catch(error => {
        setAccountloader(false);

        console.log(url, 'rest api');
      });
  };
  const handleSubmit = () => {
    setLoader(true);
    showLog('route.params?.BottomTabs', route.params?.comingFrom);
    if (route.params?.comingFrom == 'BottomTabs') {
      if (name && name != '' && phone && phone != '' && city) {
        if (phone.length != 11) {
          dispatch(
            showSnackBar({
              visible: true,
              text: 'The lenght of Phone number should be 11 digits',
            }),
          );
          setLoader(false);
        } else {
          showLog('ok');
          dispatch(
            updateUserData({
              name: name ? name : userData?.display_name,
              city: city ? city : userData?.city,
              logo: photo ? photo : '',
              whatsapp: WhatsApp ? WhatsApp : '',
              phone: phone ? phone : userData?.phone,
              description: description ? description : '',
              token: user && user?.token,
              profile: 'profile',
            }),
          );
        }
      } else {
        dispatch(
          showSnackBar({
            visible: true,
            text:
              name == ''
                ? 'Name is required'
                : city == ''
                ? 'City is required'
                : 'Phone is required',
            // name == '' && phone == '' && city == ''
            //   ? 'Name, City and Phone fields are required'
            //   : name == '' && city == ''
            //   ? 'Name and City are required'
            //   : name == '' && phone == ''
            //   ? 'Name and Phone fields are required'
            //   : name == ''
            //   ? 'Name field is required'
            //   : city == '' && phone == ''
            //   ? 'City and Phon fields are required'
            //   : city == ''
            //   ? 'City field is required'
            //   : phone == '' && 'Phone field is required',
          }),
        );
        setLoader(false);
      }
    } else {
      console.log(name, 'IN ELSE');
      if (name && name != '' && phone && phone != '' && city) {
        console.log('IN ELSE AFTER 1st COndition');
        if (phone.length != 11) {
          dispatch(
            showSnackBar({
              visible: true,
              text: 'The lenght of Phone number should be 11 digits',
            }),
          );
          setLoader(false);
        } else {
          dispatch(
            updateUserData({
              name: name ? name : userData?.display_name,
              city: city ? city : userData?.city,
              logo: photo ? photo : '',
              whatsapp: WhatsApp ? WhatsApp : '',
              phone: phone ? phone : userData?.phone,
              description: description ? description : '',
              token: user && user?.token,
            }),
          );
        }
      } else {
        dispatch(
          showSnackBar({
            visible: true,
            text:
              name == ''
                ? 'Name is required'
                : city == ''
                ? 'City is required'
                : 'Phone is required',
            // name == '' && phone == '' && city == ''
            //   ? 'Name, City and Phone fields are required'
            //   : name == '' && city == ''
            //   ? 'Name and City are required'
            //   : (name =
            //       '' && phone == ''
            //         ? 'Name and Phone fields are required'
            //         : name == ''
            //         ? 'Name field is required'
            //         : city == '' && phone == ''
            //         ? 'City and Phon fields are required'
            //         : city == ''
            //         ? 'City field is required'
            //         : phone == '' && 'Phone field is required'),
          }),
        );
        setLoader(false);
      }
    }
  };
  useEffect(() => {
    const cleanUp = navigation.addListener('blur', () => {
      dispatch(addError(null));
      dispatch(addListingError(null));
      dispatch(setUserData(user.id, user.token));
      setphoto('');
      setImage('');
      scrollRef.current?.scrollTo({
        y: 0,
      });
    });
    showLog('token', userData);
    return cleanUp;
  }, [navigation]);
  useEffect(() => {
    if (userData) {
      scrollRef.current?.scrollTo({
        y: 0,
      });
      showLog(userData.logo, 'userData');
      setImage(image ? image : userData.logo ? {uri: userData?.logo} : null);
      setName(userData?.display_name);
      setPhone(userData?.phone);
      setWhatsApp(userData?.whatsapp);
      setCity(userData?.city);
      setDescription(userData?.description);
    } else if (user) {
      showLog('User', user);
      setName(user?.name);
    }
  }, [userData, user]);

  useEffect(() => {
    console.log(image, 'image');

    return () => {};
  }, [image]);

  return (
    <View style={styles.sectionContainer}>
      <Header
        navigation={navigation}
        route={route?.params?.comingFrom}
        title="Profile"
      />
      <Container ref={scrollRef}>
        <View style={styles.topSection}>
          <TouchableOpacity onPress={() => optionsAlert()}>
            <Avatar.Image
              size={120}
              style={{backgroundColor: 'white'}}
              source={
                image && image != ''
                  ? {uri: image.uri}
                  : userData
                  ? userData.logo && userData.logo != ''
                    ? {uri: userData.logo}
                    : require('../../assets/images/avatar.png')
                  : require('../../assets/images/avatar.png')
              }
            />
          </TouchableOpacity>
          <View
            style={{
              marginLeft: 5,
            }}>
            <Text style={[styles.nameText, styles.font]}>
              {userData ? userData?.display_name : user?.display_name}
            </Text>

            <View style={styles.locationContent}>
              <Octicons name="location" size={14} color={colors.greyText} />
              <Text style={[styles.locationTxt, styles.font]}>
                {userData?.city ? `${userData?.city},` : ''} Pakistan
              </Text>
            </View>
            <View style={styles.locationContent}>
              <Octicons name="calendar" size={14} color={colors.greyText} />
              <Text style={[styles.locationTxt, styles.font]}>
                Member Since {moment(user?.joined_on).format('MMM DD, YYYY')}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.form}>
          <Text style={[styles.font, styles.formFieldText]}>Name</Text>
          <Input
            holder={'Name Here'}
            handleTextChange={handleNameChange}
            type="text"
            value={name}
          />

          <Text style={[styles.font, styles.formFieldText]}>City</Text>
          <Selector
            value={city}
            holder="Select City"
            data={Cities}
            handleValueChange={val => setCity(val)}
          />

          <Text style={[styles.font, styles.formFieldText]}>Phone Number</Text>
          <Input
            holder={'Phone Number Here'}
            handleTextChange={handlePhoneChange}
            type="text"
            keyboardType="number-pad"
            value={phone}
          />
          <Text style={[styles.font, styles.formFieldText]}>WhatsApp</Text>
          <Input
            holder={'WhatsApp Number Here'}
            handleTextChange={handelWhatsAppChange}
            type="text"
            keyboardType="number-pad"
            value={WhatsApp}
          />
          <Text style={[styles.font, styles.formFieldText]}>Description</Text>

          <Input
            holder={'Your Description Here...'}
            handleTextChange={txt => setDescription(txt)}
            type="text"
            value={description}
            multiline
            numberOfLines={5}
            style={{height: 150}}
          />
        </View>

        <View style={styles.buttonSection}>
          <NormalButton loader={loader} onPress={handleSubmit} title={'Save'} />
        </View>
        {route.params?.comingFrom != 'Login' && (
          <View style={styles.buttonSection}>
            <NormalButton
              loader={accountloader}
              onPress={deleteModal}
              title={'Delete Account'}
            />
          </View>
        )}
      </Container>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollviewstyles: {
    flexGrow: 1,
    justifyContent: 'space-evenly',
  },
  sectionContainer: {
    flex: 1,
    flexDirection: 'column',
    marginBottom: 5,
    backgroundColor: colors.white,
  },
  topSection: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 25,
  },

  nameText: {
    fontSize: 18,
    color: colors.text,
    marginLeft: 10,
  },
  locationTxt: {
    fontSize: 14,
    marginLeft: 5,
    letterSpacing: -1,
    color: colors.greyText,
  },
  form: {
    width: '100%',
    alignSelf: 'flex-start',
    justifyContent: 'space-around',
    flex: 1,
  },
  locationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    marginTop: 8,
  },
  formFieldText: {
    fontSize: 15,
    marginBottom: 0,
    marginTop: 18,
    color: colors.text,
  },
  buttonSection: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 10,
  },
  font: {
    fontFamily: fonts.Montserrat_Medium,
  },
  textAreaStyles: {
    flex: 1,
    width: '100%',
    backgroundColor: 'transparent',
    fontSize: 16,
    fontFamily: fonts.Montserrat_Medium,
  },
});

export default NetworkError(EditProfile);
