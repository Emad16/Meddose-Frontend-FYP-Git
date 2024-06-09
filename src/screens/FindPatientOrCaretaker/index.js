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
import Input from '../../components/Input';

const FindPatientOrCaretaker = () => {
  const {user, linkData, logoutsuccess, userData} = useSelector(
    state => state.auth,
  );
  const {Cities, filterParam, appliedFilters, Colors, RegPlaces, carDetails} =
    useSelector(state => state.lisitng);

  const [search, setSearch] = useState('');
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [city, setCity] = useState('');
  const [loader, setLoader] = useState(false);
  const [visible, setVisible] = React.useState(false);
  const [patients, setPatients] = useState([]);
  const [isEmpty, setIsEmpty] = useState(false);
  // M start
  const searchRef = useRef();
  const filterRef = useRef();
  const homeRef = useRef();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const route = useRoute();

  const onLogout = async () => {
    dispatch(Logout());
    dispatch({
      type: types.SIGN_IN,
      payload: null,
    });
    navigation.navigate('Login');
    // OneSignal.removeExternalUserId(async results => {
    //   // The results will contain push and email success statuses
    //   console.log('Results of removing external user id');
    //   console.log(results);
    //   // Push can be expected in almost every situation with a success status, but
    //   // as a pre-caution its good to verify it exists
    //   if (results.push && results.push.success) {
    //   }
    // });
  };

  useFocusEffect(
    useCallback(() => {
      if (user) {
        setLoader(true);
        if (user.userType == 'patient') {
          getCaretakers();
        } else {
          getPatients();
        }
      }
    }, []),
  );

  const getPatients = async () => {
    console.log('HERE');
    var requestOptions = {
      method: 'GET',
      redirect: 'follow',
    };

    fetch(`${testURL}user/patients`, requestOptions)
      .then(response => response.json())
      .then(result => {
        setLoader(false);
        if (result && result.length > 0) {
          setPatients(result);
          setFilteredDataSource(result);
          setIsEmpty(false);
        } else {
          setPatients([]);
          setIsEmpty(true);
        }
      })
      .catch(error => {
        console.log('error', error);
        setLoader(false);
        setPatients([]);
        setIsEmpty(true);
      });
  };

  const getCaretakers = async () => {
    var requestOptions = {
      method: 'GET',
      redirect: 'follow',
    };

    fetch(`${testURL}user/caretakers`, requestOptions)
      .then(response => response.json())
      .then(result => {
        setLoader(false);
        if (result && result.length > 0) {
          setPatients(result);
          setFilteredDataSource(result);
          setIsEmpty(false);
        } else {
          setPatients([]);
          setIsEmpty(true);
        }
      })
      .catch(error => {
        console.log('error', error);
        setLoader(false);
        setPatients([]);
        setIsEmpty(true);
      });
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
  console.log(patients[patients.length - 1]);

  const searchFilterFunction = text => {
    // Check if searched text is not blank
    if (text) {
      // const newData = patients.filter(function (item) {
      //   const itemData = item.speciality
      //     ? item.speciality.toUpperCase()
      //     : ''.toUpperCase();
      //   const textData = text.toUpperCase();
      //   return itemData.indexOf(textData) > -1;
      // });
      const newData = patients.filter(function (item) {
        const itemSearch =
          user && user?.userType == 'patient'
            ? item.speciality
              ? item.speciality.toUpperCase()
              : ''
            : item.disease
            ? item.disease.toUpperCase()
            : '';
        const itemEmail = item.email ? item.email.toUpperCase() : '';
        const itemName = item.name ? item.name.toUpperCase() : '';
        const itemPhone = item.phone ? item.phone.toUpperCase() : '';
        const searchText = text.toUpperCase();
        return (
          itemSearch.includes(searchText) ||
          itemEmail.includes(searchText) ||
          itemName.includes(searchText) ||
          itemPhone.includes(searchText)
        );
      });
      setFilteredDataSource(newData);
      setSearch(text);
    } else {
      // Inserted text is blank
      // Update FilteredDataSource with masterDataSource
      setFilteredDataSource(patients);
      setSearch(text);
    }
  };
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
          {user && user?.userType == 'patient'
            ? 'All Caretaker List'
            : 'All Patients List'}
        </Text>
      </Appbar.Header>

      <View style={styles.sectionContainer}>
        <>
          {isEmpty ? (
            <EmptyList />
          ) : (
            <>
              <View style={{marginHorizontal: 20}}>
                <Input
                  holder={`Search for ${
                    user && user?.userType == 'patient'
                      ? 'caretaker'
                      : 'Patients'
                  }`}
                  handleTextChange={searchFilterFunction}
                  type="text"
                  value={search}
                />
              </View>
              <FlatList
                contentContainerStyle={styles.scrollviewstyles}
                data={filteredDataSource}
                renderItem={({item, index}) => {
                  return (
                    <Pressable
                      onPress={() =>
                        navigation.navigate('Details', {
                          id: item?._id,
                          justDetails: true,
                        })
                      }>
                      <Card
                        key={index}
                        data={item}
                        index={index}
                        orignal={filteredDataSource}
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
            </>
          )}
        </>
      </View>
      {loader ? <PageLoader /> : ''}
    </>
  );
};

const styles = StyleSheet.create({
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
export default NetworkError(FindPatientOrCaretaker);
