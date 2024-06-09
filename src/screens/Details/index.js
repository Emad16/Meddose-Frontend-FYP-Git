import React, {useCallback, useRef} from 'react';
import {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  StyleSheet,
  SafeAreaView,
  View,
  ScrollView,
  TextInput,
  FlatList,
  LogBox,
  Linking,
  Platform,
  Appearance,
  TouchableOpacity,
} from 'react-native';
import {apiBaseURLV1, testURL} from '../../ApiBaseURL';
import Card from '../../components/Card';
import EmptyList from '../../components/EmptyList';
import Octicons from 'react-native-vector-icons/Octicons';
import WhatsAppIcon from '../../assets/images/Whatsapp.svg';
import {
  Appbar,
  Badge,
  Button,
  Divider,
  IconButton,
  List,
  Modal,
  Portal,
  Snackbar,
  Text,
} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import {
  addError,
  addLink,
  Logout,
  setUserData,
  updateUserData,
} from '../../core/redux/actions/auth';
import {
  getRegisteredPlaces,
  addListingError,
  getCities,
  getColors,
  addFilters,
  addFiltersParams,
  editAd,
  getDetails,
} from '../../core/redux/actions/carlisting';
import FilterIcon from '../../assets/images/filterIcon.svg';

import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';

import {SCREEN_HEIGHT, showLog, updatedDate} from '../../utils/Methods';
import axios from 'axios';
import {SCREEN_WIDTH} from '../../utils/Methods';
import PageLoader from '../../components/PageLoader';
import {fonts} from '../../utils/theme/fonts';
import {showSnackBar} from '../../core/redux/actions';
import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import _ from 'lodash';
import NetworkError from '../NetworkError';
import SearchFlatlist from '../../components/SearchFlatlist';
import FilterFlatlist from '../../components/FilterFlatlist';
import HomeFlatlist from '../../components/HomeFlatlist';
import {colors} from '../../utils/theme/colors';
import OneSignal from 'react-native-onesignal';
import types from '../../core/redux/types';
import Loader from '../../components/PageLoader/Loader';
import ImageView from 'react-native-image-viewing';
import Container from '../../components/Container';
import {SliderBox} from 'react-native-image-slider-box';
import Header from '../../components/Header';
import NormalButton from '../../components/Button';

const Details = () => {
  const {user} = useSelector(state => state.auth);
  const route = useRoute();
  const id = route.params?.id;
  const justDetails = route.params?.justDetails;
  const [loader, setLoader] = useState(false);
  const [visible, setVisible] = React.useState(false);
  const [patients, setPatients] = useState([]);
  const [myPerson, setMyPerson] = useState(null);
  const [requestList, setRequestList] = useState([]);
  const [isEmpty, setIsEmpty] = useState(false);
  const [noCaretaker, setNoCaretaker] = useState(false);

  const navigation = useNavigation();
  const dispatch = useDispatch();

  useFocusEffect(
    useCallback(() => {
      if (user) {
        InitialCalls();
      }
    }, []),
  );
  const InitialCalls = () => {
    if (id) {
      getCaretakerById(id);
    } else if (!user?.careTaker) {
      setNoCaretaker(true);
      dispatch(
        showSnackBar({
          visible: true,
          text: `Please link with a ${
            user?.userType == 'patient' ? 'care taker' : 'patient'
          } first`,
        }),
      );
    } else {
      getCaretakerById();
    }
  };

  const getCaretakerById = async id => {
    console.log(id);
    setLoader(true);
    var requestOptions = {
      method: 'GET',
      redirect: 'follow',
    };

    fetch(
      `${testURL}user/caretaker-by-id?id=${id ? id : user.careTaker}`,
      requestOptions,
    )
      .then(response => response.json())
      .then(result => {
        console.log(result, 'result?.data');
        setMyPerson({...result});
        setLoader(false);
      })
      .catch(error => {
        console.log('error', error);
        setLoader(false);
        setMyPerson(null);
      });
  };
  const buttonArray = [
    {
      width: '30%',
      title: 'Call',
      icon: <Feather name="phone-call" size={20} color={colors.white} />,
      ButtonColor: colors.secondry,
      textColor: colors.white,
      borderColor: colors.transparent,
    },
    {
      width: '65%',
      title: 'Whatsapp',
      ButtonColor: colors.secondry,
      icon: 'whatsapp-square',
      borderColor: colors.whatsappBorder,
    },
  ];

  const OpenWhatsapp = () => {
    if (myPerson?.phone) {
      let url = `https://wa.me/${myPerson?.phone}`;
      Linking.openURL(url)
        .then(data => {
          showLog('WhatsApp Opened successfully ' + data); //<---Success
        })
        .catch(err => {
          showLog('Make sure WhatsApp installed on your device', err); //<---Error
        });
    } else {
      dispatch(
        showSnackBar({visible: true, text: 'No WhatsApp number available'}),
      );
    }
  };

  const openDialer = () => {
    let url = `tel:${myPerson?.phone}}`;
    Linking.openURL(url)
      .then(data => {
        showLog('Dialer Opened successfully ' + data); //<---Success
      })
      .catch(err => {
        showLog('Something went wrong', err); //<---Error
      });
  };

  return (
    <>
      <Header
        title={
          justDetails
            ? user.userType == 'patient'
              ? 'Caretaker Details'
              : 'Patient Details'
            : user.userType == 'patient'
            ? 'Your Caretaker'
            : 'Your Patient'
        }
      />
      <Container>
        {noCaretaker ? (
          <Text
            style={[
              styles.carName,
              styles.font,
              {textAlign: 'center', marginTop: 30},
            ]}>
            {`Please link with a ${
              user?.userType == 'patient' ? 'care taker' : 'patient'
            } first`}
          </Text>
        ) : loader ? (
          <Loader />
        ) : !myPerson ? (
          <View>
            <Text
              style={[
                styles.carName,
                styles.font,
                {textAlign: 'center', marginTop: 30},
              ]}>
              Something went wrong! please try again later.
            </Text>
            <NormalButton title="Try Again" onPress={() => InitialCalls()} />
          </View>
        ) : (
          <>
            <View style={styles.viewImageSection}>
              <SliderBox
                pagingEnabled={Platform.OS === 'android' && true}
                images={
                  myPerson && myPerson?.profile
                    ? [myPerson?.profile]
                    : user && user.userType == 'patient'
                    ? [require('../../assets/images/doctor.png')]
                    : [require('../../assets/images/patient.jpg')]
                }
                dotStyle={{
                  width: 10,
                  height: 10,
                  borderRadius: 10,
                  marginHorizontal: -6,
                  padding: 0,
                  margin: 0,
                }}
                dotColor={colors.secondry}
                // onCurrentImagePressed={index => {
                //   if (currentCar?.slider_images.length > 0) {
                //     setIsVisible(true);
                //     setIndex(index);
                //   }
                // }}
                inactiveDotColor={colors.inactiveTabs}
                ImageComponentStyle={{
                  width: '100%',
                  height: undefined,
                  aspectRatio: 1,
                }}
                resizeMode="contain"
              />
            </View>

            <View style={{marginTop: 30, marginBottom: 10}}>
              <Text style={[styles.carName, styles.font]}>
                {myPerson && myPerson?.name}
              </Text>
              <View style={[styles.locationContent, styles.font]}>
                <Text style={[styles.locationTxt, styles.font]}>
                  {myPerson && myPerson?.address}, Joined on{' '}
                  {updatedDate(myPerson?.createdAt)}
                </Text>
              </View>
              <View style={styles.banner}>
                <Text
                  style={{
                    ...styles.font,
                    color: colors.black,
                    fontSize: 20,
                  }}>
                  {myPerson?.phone}
                </Text>
              </View>
              <View style={styles.banner}>
                <Text
                  style={{
                    ...styles.font,
                    color: colors.black,
                    fontSize: 20,
                  }}>
                  {myPerson?.email}
                </Text>
              </View>
            </View>

            <View style={styles.buttonSection}>
              {buttonArray &&
                buttonArray?.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() =>
                      item.title === 'Whatsapp'
                        ? OpenWhatsapp()
                        : item.title === 'Call'
                        ? openDialer()
                        : () => {}
                    }
                    style={{
                      ...styles.buttonStyle,
                      width: item.width,
                      backgroundColor: `${item.ButtonColor}`,
                      borderColor: `${item.borderColor}`,
                    }}>
                    {item?.title === 'Whatsapp' ? (
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}>
                        <WhatsAppIcon height={40} width={40} />
                        <Text
                          style={{
                            ...styles.font,
                            fontSize: 20,
                            color: colors.white,
                            paddingLeft: 10,
                          }}>
                          {item.title}
                        </Text>
                      </View>
                    ) : (
                      <Text
                        style={
                          item.title == 'Call'
                            ? {
                                ...styles.font,
                                fontSize: 20,
                                color: `${item.textColor}`,
                              }
                            : {
                                ...styles.font,
                                fontSize: 16,
                                color: `${item.textColor}`,
                              }
                        }>
                        {item.icon}
                        {'  '}
                        {item.title}
                      </Text>
                    )}
                  </TouchableOpacity>
                ))}
            </View>
          </>
        )}
      </Container>
    </>
  );
};

const styles = StyleSheet.create({
  scrollviewstyles: {
    justifyContent: 'flex-start',
    margin: 20,
    lexGrow: 1,
  },
  sectionContainer: {
    flex: 1,
    backgroundColor: colors.white,
    paddingBottom: 20,
  },
  buttonStyle: {
    height: 45,
    width: 100,
    borderRadius: 100,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 3,
    marginRight: 3,
    borderColor: colors.transparent,
  },

  font: {
    fontFamily: fonts.Montserrat_Medium,
    fontSize: 20,
  },
  //header

  header: {
    backgroundColor: colors.secondry,
    height: 100,
    justifyContent: 'center',
    zIndex: 1001,
  },
  content: {
    marginLeft: 0,
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: -1,
  },
  title: {
    alignSelf: 'center',
    color: colors.white,
    fontFamily: fonts.Montserrat_Medium,
  },
  modalStyles: {
    height: '100%',
    color: colors.black,
  },
  containerStyle: {
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 20,
    margin: 20,
    color: colors.black,
  },
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
    justifyContent: 'space-between',
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
  viewImageSection: {
    flex: 1,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  banner: {
    backgroundColor: colors.secondry,
    marginTop: 8,
    borderRadius: 10,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'flex-start',
    alignSelf: 'baseline',
  },
});
export default NetworkError(Details);
