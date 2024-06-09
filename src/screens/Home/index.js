import React, {useCallback, useRef} from 'react';
import {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Pressable,
  TextInput,
  FlatList,
  LogBox,
  Linking,
  Platform,
  Appearance,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import {apiBaseURLV1, testURL} from '../../ApiBaseURL';
import Card from '../../components/Card';
import EmptyList from '../../components/EmptyList';
import Octicons from 'react-native-vector-icons/Octicons';
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
import PatientList from '../../assets/images/patientList.svg';
import Medi from '../../assets/images/medi.svg';
import Schedule from '../../assets/images/schedule.svg';
import Viewschedule from '../../assets/images/viewschedule.svg';
import LogoutIcon from '../../assets/images/logout.svg';
import RequestList from '../../assets/images/list.svg';
import Blogpost from '../../assets/images/blog.svg';
import Find from '../../assets/images/find.svg';
import Doc from '../../assets/images/doc.svg';
import MoodSVG from '../../assets/images/mood.svg';
import ClockSVG from '../../assets/images/clock.svg';
import ChatSVG from '../../assets/images/chat.svg';

import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';

import {showLog} from '../../utils/Methods';
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
import LottieView from 'lottie-react-native';

const Home = () => {
  const {user, linkData, logoutsuccess, userData} = useSelector(
    state => state.auth,
  );
  const {Cities, filterParam, appliedFilters, Colors, RegPlaces, carDetails} =
    useSelector(state => state.lisitng);

  const [searchText, setSearchText] = useState('');
  const [city, setCity] = useState('');
  const [loader, setLoader] = useState(false);
  const [visible, setVisible] = React.useState(false);
  const [patients, setPatients] = useState([]);
  const [isEmpty, setIsEmpty] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  // M start
  const searchRef = useRef();
  const filterRef = useRef();
  const homeRef = useRef();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const route = useRoute();

  const onLogout = async () => {
    setShowLogout(true);
    OneSignal.removeExternalUserId(async results => {
      // The results will contain push and email success statuses
      console.log('Results of removing external user id');
      console.log(results);
      // Push can be expected in almost every situation with a success status, but
      // as a pre-caution its good to verify it exists
      if (results.push && results.push.success) {
        setShowLogout(false);
        dispatch(Logout());
        dispatch({
          type: types.SIGN_IN,
          payload: null,
        });
        navigation.navigate('Login');
      }
    });
  };

  useFocusEffect(
    useCallback(() => {
      if (user) {
        if (user.userType == 'patient') {
          getCaretakers();
        } else {
          getPatients();
        }
      }
    }, []),
  );

  const getPatients = async () => {
    var requestOptions = {
      method: 'GET',
      redirect: 'follow',
    };

    fetch(`${testURL}user/patients`, requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result && result.length > 0) {
          setPatients(result);
          setIsEmpty(false);
        } else {
          setPatients([]);
          setIsEmpty(true);
        }
      })
      .catch(error => console.log('error', error));
  };

  const getCaretakers = async () => {
    var requestOptions = {
      method: 'GET',
      redirect: 'follow',
    };

    fetch(`${testURL}user/caretakers`, requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result && result.length > 0) {
          setPatients(result);
          setIsEmpty(false);
        } else {
          setPatients([]);
          setIsEmpty(true);
        }
      })
      .catch(error => console.log('error', error));
  };

  const snack = useSelector(state => state.snackbar.visible);
  const onDismissSnackBar = () => {
    showLog(snack, 'snack');
    dispatch(showSnackBar({visible: false, text: 'test'}));
  };

  const colorScheme = Appearance.getColorScheme();

  const hideModal = () => {
    setVisible(false);
  };

  showModal = () => {
    setVisible(true);
  };

  const caretakerArray = [
    {
      title: 'My Patients',
      onPress: () => navigation.navigate('MyPatient'),
      description: 'Here is the list of all your patients',
      icon: <PatientList />,
    },
    {
      title: 'Find Patients',
      onPress: () => navigation.navigate('find'),
      description:
        'This is the market place where you can find more patients to take care of',
      icon: <Find />,
    },
    {
      title: 'Request List',
      onPress: () => navigation.navigate('RequestList'),
      description: 'Here you can view your all patient requests',
      icon: <RequestList />,
    },
    {
      title: 'Your Patients Moods',
      onPress: () => navigation.navigate('PatientsMood'),
      description: 'You can see your patients all moods from here',
      icon: <ClockSVG />,
    },
    {
      title: 'Your Patients Medication',
      onPress: () => navigation.navigate('PatientsMedication'),
      description: 'You can see your patients all medications from here',
      icon: <Medi />,
    },
    {
      title: 'Chat',
      onPress: () => navigation.navigate('chatlist'),
      description: 'Have a nice interaction with your patients from here',
      icon: <ChatSVG />,
    },
    {
      title: 'Physiotherapy Excercise',
      onPress: () => navigation.navigate('tharapist'),
      description:
        'Here are few basic physiotherapy excercises from diffrent physician',
      icon: <Doc />,
    },
    {
      title: 'Health Blog',
      onPress: () => navigation.navigate('Blogs'),
      description: 'Check out Health Blogs and increase your knowledge',
      icon: <Blogpost />,
    },

    {
      title: 'Logout',
      onPress: () => onLogout(),
      icon: <LogoutIcon />,
      description: 'Press here if you want to leave : (',
    },
  ];

  const patientArray = [
    {
      title: 'My Care Taker',
      onPress: () => navigation.navigate('Details'),
      description: 'Here you can view your care taker details',
      icon: <PatientList />,
    },
    {
      title: 'Find Caretaker',
      onPress: () => navigation.navigate('find'),
      description:
        'This is the marketplace where you can find caretakers to take care of you',
      icon: <Find />,
    },
    {
      title: 'Add Your Mood',
      onPress: () => navigation.navigate('AddMood'),
      description:
        'You can define your mood from here and your caretaker will be notified regarding this. Your mood will be tracked',
      icon: <MoodSVG />,
    },
    {
      title: 'Mood History',
      onPress: () => navigation.navigate('MoodHistory'),
      description: 'You can see your mood history from here',
      icon: <ClockSVG />,
    },
    {
      title: 'Chat',
      onPress: () => navigation.navigate('chat'),
      description: 'Have a nice interaction with your patients from here',
      icon: <ChatSVG />,
    },
    {
      title: 'Medication',
      onPress: () => navigation.navigate('AddMedication'),
      description: 'You can add your medications from this tab',
      icon: <Medi />,
    },
    {
      title: 'Medication History',
      onPress: () => navigation.navigate('MedicationHistory'),
      description: 'You can view your past medications from this tab',
      icon: <ClockSVG />,
    },
    {
      title: 'Add Schedule',
      onPress: () => navigation.navigate('Schedule'),
      description: 'You can add your schedule for medications from here',
      icon: <Schedule />,
    },
    {
      title: 'View Schedule',
      onPress: () => navigation.navigate('ViewSchedule'),
      description: 'View all your schedules from here',
      icon: <Viewschedule />,
    },
    {
      title: 'Request List',
      onPress: () => navigation.navigate('RequestList'),
      description: 'Here you can view your all patient requests',
      icon: <RequestList />,
    },
    {
      title: 'Physiotherapy Excercise',
      onPress: () => navigation.navigate('tharapist'),
      description:
        'Here are few basic physiotherapy excercises from diffrent physician',
      icon: <Doc />,
    },
    {
      title: 'Health Blog',
      onPress: () => navigation.navigate('Blogs'),
      description: 'Check out Health Blogs and increase your knowledge',
      icon: <Blogpost />,
    },
    {
      title: 'Logout',
      onPress: () => onLogout(),
      icon: <LogoutIcon />,
      description: 'Press here if you want to leave : (',
    },
  ];
  return (
    <>
      <Appbar.Header style={{...styles.topHead}}>
        <Text
          style={{
            color: colors.white,
            fontFamily: fonts.Montserrat_SemiBold,
            fontSize: 30,
            letterSpacing: -0.5,
            padding: 7,
          }}>
          {/* {user && user?.userType == 'patient'
            ? 'All Caretaker List'
            : 'All Patients List'} */}
          Menu
        </Text>
      </Appbar.Header>

      <ScrollView
        contentContainerStyle={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
        }}>
        {user && user.userType == 'patient'
          ? patientArray.map(eachItem => (
              <TouchableOpacity
                onPress={() => eachItem.onPress()}
                style={{
                  padding: 20,
                  borderRadius: 30,
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderColor: colors.border,
                  borderWidth: 1,
                  marginVertical: 10,
                  marginHorizontal: 5,
                  width: '90%',
                  // flexDirection: 'row',
                }}>
                {eachItem?.icon ? (
                  eachItem?.icon
                ) : (
                  <Entypo
                    name="menu"
                    size={30}
                    color={colors.secondry}
                    style={{flex: 0.2}}
                  />
                )}
                {/* <View style={{flex: 0.7}}> */}
                <Text
                  style={{
                    fontSize: 30,
                    fontWeight: 'bold',
                    fontFamily: fonts.Montserrat_SemiBold,
                    color: colors.primary,
                    textAlign: 'center',
                  }}>
                  {eachItem.title}
                </Text>
                <Text
                  style={{
                    fontSize: 20,
                    fontFamily: fonts.Montserrat_Light,
                    color: colors.primary,
                    textAlign: 'center',
                  }}>
                  {eachItem.description}
                </Text>
                {/* </View> */}
              </TouchableOpacity>
            ))
          : caretakerArray.map(eachItem => (
              <TouchableOpacity
                onPress={() => eachItem.onPress()}
                style={{
                  padding: 20,
                  borderRadius: 30,
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderColor: colors.border,
                  borderWidth: 1,
                  marginVertical: 10,
                  marginHorizontal: 5,
                  width: '90%',
                  // flexDirection: 'row',
                }}>
                {eachItem?.icon ? (
                  eachItem?.icon
                ) : (
                  <Entypo
                    name="menu"
                    size={30}
                    color={colors.secondry}
                    style={{flex: 0.2}}
                  />
                )}
                {/* <View style={{flex: 0.7}}> */}
                <Text
                  style={{
                    fontSize: 30,
                    fontWeight: 'bold',
                    fontFamily: fonts.Montserrat_SemiBold,
                    color: colors.primary,
                    textAlign: 'center',
                  }}>
                  {eachItem.title}
                </Text>
                <Text
                  style={{
                    fontSize: 20,
                    fontFamily: fonts.Montserrat_Light,
                    color: colors.primary,
                    textAlign: 'center',
                  }}>
                  {eachItem.description}
                </Text>
                {/* </View> */}
              </TouchableOpacity>
            ))}
      </ScrollView>
      <View style={styles.sectionContainer}>
        <>
          {isEmpty ? (
            <EmptyList />
          ) : (
            <FlatList
              contentContainerStyle={styles.scrollviewstyles}
              data={patients}
              renderItem={({item, index}) => {
                return (
                  <Pressable
                  // onPress={() =>
                  //   navigation.navigate('DetailPage', {
                  //     id: item?.id,
                  //     author: item?.author,
                  //   })
                  // }
                  >
                    <Card
                      key={index}
                      data={item}
                      index={index}
                      orignal={patients}
                    />
                  </Pressable>
                );
              }}
              ListFooterComponentStyle={{
                flex: 1,
                justifyContent: 'flex-end',
                // marginTop: -50,
                paddingBottom: 60,
                alignItems: 'center',
              }}
            />
          )}
        </>
        <Portal>
          <Modal
            visible={showLogout}
            onDismiss={() => setShowLogout(false)}
            contentContainerStyle={styles.containerStyle}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={{textAlign: 'center'}}>Logging out ...</Text>
              <ActivityIndicator
                size="large"
                color={colors.secondry}
                style={{marginBottom: 10}}
              />
            </View>
          </Modal>
        </Portal>
        <Portal>
          <Modal
            visible={visible}
            onDismiss={hideModal}
            contentContainerStyle={styles.containerStyle}>
            <View style={styles.modalStyles}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text
                  style={{
                    fontFamily: fonts.Montserrat_Medium,
                    color: colors.black,
                  }}
                  variant="headlineMedium">
                  Menu{' '}
                </Text>
                <IconButton
                  icon="close"
                  size={30}
                  iconColor={colors.black}
                  style={{top: -10}}
                  onPress={() => {
                    setVisible(false);
                  }}
                />
              </View>
              <ScrollView showsVerticalScrollIndicator={false}>
                <List.Item
                  onPress={() => {
                    hideModal();
                    if (user?.userType == 'patient') {
                      return navigation.navigate('Details');
                    }
                    navigation.navigate('MyPatient');
                  }}
                  titleStyle={{
                    fontFamily: fonts.Montserrat_Medium,
                    color: colors.secondry,
                    padding: 10,
                    paddingLeft: 0,
                    fontSize: 18,
                    fontFamily: fonts.Montserrat_SemiBold,
                  }}
                  title={
                    user && user.userType == 'patient'
                      ? `My Care Taker`
                      : `My Patients`
                  }
                />

                <View
                  style={{
                    borderWidth: 1,
                    borderColor: colors.secondry,
                  }}
                />
                <List.Item
                  onPress={() => {
                    hideModal();
                    navigation.navigate('RequestList');
                  }}
                  titleStyle={{
                    fontFamily: fonts.Montserrat_Medium,
                    color: colors.secondry,
                    padding: 10,
                    paddingLeft: 0,
                    fontSize: 18,
                    fontFamily: fonts.Montserrat_SemiBold,
                  }}
                  title="Request List"
                />

                <View
                  style={{
                    borderWidth: 1,
                    borderColor: colors.secondry,
                  }}
                />
                <List.Item
                  onPress={() => {
                    hideModal();
                    navigation.navigate('Blogs');
                  }}
                  titleStyle={{
                    fontFamily: fonts.Montserrat_Medium,
                    color: colors.secondry,
                    padding: 10,
                    paddingLeft: 0,
                    fontSize: 18,
                    fontFamily: fonts.Montserrat_SemiBold,
                  }}
                  title="Health Blog"
                />

                <View
                  style={{
                    borderWidth: 1,
                    borderColor: colors.secondry,
                  }}
                />
                {user && user.userType == 'patient' && (
                  <>
                    <List.Item
                      onPress={() => {
                        hideModal();
                        navigation.navigate('AddMedication');
                      }}
                      titleStyle={{
                        fontFamily: fonts.Montserrat_Medium,
                        color: colors.secondry,
                        padding: 10,
                        paddingLeft: 0,
                        fontSize: 18,
                        fontFamily: fonts.Montserrat_SemiBold,
                      }}
                      title="Medication"
                    />

                    <View
                      style={{
                        borderWidth: 1,
                        borderColor: colors.secondry,
                      }}
                    />
                  </>
                )}

                {user && user.userType == 'patient' && (
                  <>
                    <List.Item
                      onPress={() => {
                        hideModal();
                        navigation.navigate('Schedule');
                      }}
                      titleStyle={{
                        fontFamily: fonts.Montserrat_Medium,
                        color: colors.secondry,
                        padding: 10,
                        paddingLeft: 0,
                        fontSize: 18,
                        fontFamily: fonts.Montserrat_SemiBold,
                      }}
                      title="Add Schedule"
                    />
                    <View
                      style={{
                        borderWidth: 1,
                        borderColor: colors.secondry,
                      }}
                    />

                    <List.Item
                      onPress={() => {
                        hideModal();
                        navigation.navigate('ViewSchedule');
                      }}
                      titleStyle={{
                        fontFamily: fonts.Montserrat_Medium,
                        color: colors.secondry,
                        padding: 10,
                        paddingLeft: 0,
                        fontSize: 18,
                        fontFamily: fonts.Montserrat_SemiBold,
                      }}
                      title="View Schedule"
                    />
                    <View
                      style={{
                        borderWidth: 1,
                        borderColor: colors.secondry,
                      }}
                    />
                  </>
                )}

                {/* <List.Item
                  onPress={() => {}}
                  titleStyle={{
                    fontFamily: fonts.Montserrat_Medium,
                    color: colors.secondry,
                    padding: 10,
                    paddingLeft: 0,
                    fontSize: 18,
                    fontFamily: fonts.Montserrat_SemiBold,
                  }}
                  title="Profile"
                />

                <View
                  style={{
                    borderWidth: 1,
                    borderColor: colors.secondry,
                  }}
                /> */}

                <List.Item
                  onPress={() => onLogout()}
                  titleStyle={{
                    fontFamily: fonts.Montserrat_Medium,
                    color: colors.secondry,
                    padding: 10,
                    paddingLeft: 0,
                    fontSize: 18,
                    fontFamily: fonts.Montserrat_SemiBold,
                  }}
                  title="Log out"
                />
              </ScrollView>
            </View>
          </Modal>
        </Portal>
      </View>
      {loader ? <PageLoader /> : ''}
      {user && user.userType == 'patient' && (
        <Pressable
          style={styles.emergency}
          onPress={() => {
            console.log(user?.caretaker_details?.phone);
            Linking.openURL(
              `tel:${
                user?.caretaker_details?.phone
                  ? user?.caretaker_details?.phone
                  : '1020'
              }`,
            );
          }}>
          <LottieView
            source={require('../../assets/images/emergency.json')}
            autoPlay
            loop
            style={{width: 150, height: 150}}
          />
        </Pressable>
      )}

      {/* <View style={styles.emergency}>
        <Text style={styles.emergencyText}>EOE</Text>
      </View> */}
    </>
  );
};

const styles = StyleSheet.create({
  emergency: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    marginBottom: -20,
    marginRight: -20,
  },
  emergencyText: {
    color: 'white',
    textAlign: 'center',
    fontFamily: fonts.Montserrat_SemiBold,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
  topHead: {
    width: '100%',
    height: 100,
    borderRadius: 100 / 2,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    backgroundColor: colors.secondry,
    justifyContent: 'center',
  },
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
  buttonSection: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 10,
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
    fontSize: 16,
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
});
export default NetworkError(Home);
