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
import NormalButton from '../../components/Button';

const RequestList = () => {
  const {user} = useSelector(state => state.auth);

  const [loader, setLoader] = useState(false);
  const [visible, setVisible] = React.useState(false);
  const [patients, setPatients] = useState([]);
  const [requestList, setRequestList] = useState([]);
  const [isEmpty, setIsEmpty] = useState(false);

  const navigation = useNavigation();
  const dispatch = useDispatch();

  useFocusEffect(
    useCallback(() => {
      if (user) {
        if (user.userType == 'patient') {
          getRequestsForPatient();
        } else {
          getCaretakerRequests();
        }
      }
    }, []),
  );

  const getCaretakerRequests = async () => {
    var requestOptions = {
      method: 'GET',
      redirect: 'follow',
    };

    fetch(
      `${testURL}request/requests-by-creataker?id=${user._id}`,
      requestOptions,
    )
      .then(response => response.json())
      .then(result => {
        if (result.error)
          dispatch(showSnackBar({visible: true, text: result?.message}));
        if (result?.data?.length == 0) setIsEmpty(true);
        setRequestList(result.data);
      })
      .catch(error => {
        console.log('error', error);
        setIsEmpty(true);
        dispatch(showSnackBar({visible: true, text: error.message}));
      });
  };

  const getRequestsForPatient = async () => {
    var requestOptions = {
      method: 'GET',
      redirect: 'follow',
    };

    fetch(
      `${testURL}request/requests-for-patient?id=${user._id}`,
      requestOptions,
    )
      .then(response => response.json())
      .then(result => {
        console.log(result);
        if (result.error)
          dispatch(showSnackBar({visible: true, text: result?.message}));
        if (result?.data?.length == 0) setIsEmpty(true);
        setRequestList(result.data);
      })
      .catch(error => {
        console.log('error', error);
        setIsEmpty(true);
        dispatch(showSnackBar({visible: true, text: error.message}));
      });
  };
  const snack = useSelector(state => state.snackbar.visible);

  return (
    <>
      <Header title={'Your Request List'} />
      <View style={styles.sectionContainer}>
        <>
          {isEmpty ? (
            <>
              <EmptyList />
              <NormalButton
                title="Try Again"
                onPress={() => {
                  if (user.userType == 'patient') {
                    getRequestsForPatient();
                  } else {
                    getCaretakerRequests();
                  }
                }}
              />
            </>
          ) : (
            <FlatList
              contentContainerStyle={styles.scrollviewstyles}
              data={requestList}
              renderItem={({item, index}) => {
                console.log(requestList[0]);

                return (
                  <Card
                    key={index}
                    data={
                      user.userType == 'patient' ? item.caretaker : item.patient
                    }
                    index={index}
                    orignal={requestList}
                    request={true}
                    status={item.status}
                    item={item}
                  />
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
export default NetworkError(RequestList);
