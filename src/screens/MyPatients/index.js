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
import Header from '../../components/Header';

const MyPatients = () => {
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
        if (user.pateintList.length > 0) {
          getPatients();
        } else {
          dispatch(
            showSnackBar({
              visible: true,
              text: `Please link with a patient first`,
            }),
          );
        }
      }
    }, []),
  );

  const getPatients = async () => {
    setLoader(true);
    var requestOptions = {
      method: 'GET',
      redirect: 'follow',
    };

    fetch(
      `${testURL}user/get-patient-by-list?pateintList=${JSON.stringify(
        user.pateintList,
      )}`,
      requestOptions,
    )
      .then(response => response.json())
      .then(result => {
        setLoader(false);
        if (result && result.length > 0) {
          setPatients(result);
          setIsEmpty(false);
        } else {
          setPatients([]);
          setIsEmpty(true);
        }
      })
      .catch(error => {
        console.log('error', error);
        setLoader(false);
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

  return (
    <>
      <Header title={'Your Patient List'} />
      <View style={styles.sectionContainer}>
        <>
          {isEmpty ? (
            <EmptyList action={getPatients} />
          ) : (
            <FlatList
              contentContainerStyle={styles.scrollviewstyles}
              data={patients}
              renderItem={({item, index}) => {
                return (
                  <Pressable
                    onPress={() =>
                      navigation.navigate('Details', {
                        id: item?._id,
                      })
                    }>
                    <Card
                      key={index}
                      data={item}
                      index={index}
                      orignal={patients}
                      noRequest
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
      </View>
      {loader ? <PageLoader /> : ''}
    </>
  );
};

const styles = StyleSheet.create({
  scrollviewstyles: {
    justifyContent: 'flex-start',
    margin: 20,
    flexGrow: 1,
    paddingBottom: 20,
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
export default NetworkError(MyPatients);
