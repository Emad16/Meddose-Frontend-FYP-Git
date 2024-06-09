import React, {useEffect, useState} from 'react';
import {Text, View, Image, ActivityIndicator} from 'react-native';
import Octicons from 'react-native-vector-icons/Octicons';
import {updatedDate, formatter} from '../../utils/Methods';
import {fonts} from '../../utils/theme/fonts';
import {colors} from '../../utils/theme/colors';
import SpecificationTag from '../SpecificationTag';
import DeviceInfo from 'react-native-device-info';
import {useDispatch, useSelector} from 'react-redux';
import {showSnackBar} from '../../core/redux/actions';
import axios from 'axios';
import {testURL} from '../../ApiBaseURL';
import {useNavigation} from '@react-navigation/native';
import types from '../../core/redux/types';

const Card = ({data, index, orignal, request, status, noRequest}) => {
  const {user} = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [loader, setLoader] = useState(false);
  const [requestLoader, setRequestLoader] = useState(false);
  const [acceptLoader, setAcceptLoader] = useState(false);
  const [rejectLoader, setRejectLoader] = useState(false);
  let isTablet = DeviceInfo.isTablet();

  const sendRequest = () => {
    setRequestLoader(true);
    let StringyfiedData = JSON.stringify({
      patient: user && user.userType == 'patient' ? user._id : data._id,
      caretaker: user && user.userType == 'caretaker' ? user._id : data._id,
      status: 'pending',
      requestBy: user?.userType,
    });

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${testURL}request`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: StringyfiedData,
    };

    axios
      .request(config)
      .then(async res => {
        console.log(res.data, 'Response of login');
        setRequestLoader(false);
        dispatch(showSnackBar({visible: true, text: res.data.message}));
      })
      .catch(error => {
        setRequestLoader(false);
        dispatch(showSnackBar({visible: true, text: error.message}));
      });
  };

  const requestResponse = status => {
    if (status == 'accept') {
      setAcceptLoader(true);
    } else {
      setRejectLoader(true);
    }
    setRequestLoader(true);
    let StringyfiedData = JSON.stringify({
      patient: user && user.userType == 'patient' ? user._id : data._id,
      caretaker: user && user.userType == 'caretaker' ? user._id : data._id,
      status,
    });

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${testURL}request/update-request`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: StringyfiedData,
    };

    axios
      .request(config)
      .then(async res => {
        console.log(res.data.data, 'Response of login');
        setAcceptLoader(false);
        setRejectLoader(false);
        if (res.data.error)
          return dispatch(
            showSnackBar({visible: true, text: res.data.message}),
          );
        setRequestLoader(false);
        if (status == 'accept')
          dispatch({
            type: types.SIGN_IN,
            payload: res.data.data,
          });
        dispatch(
          showSnackBar({visible: true, text: `${status}ed succesfully`}),
        );
        navigation.goBack();
      })
      .catch(error => {
        setAcceptLoader(false);
        setRejectLoader(false);
        setRequestLoader(false);
        dispatch(showSnackBar({visible: true, text: error.message}));
      });
  };
  return (
    <View
      key={index}
      style={{
        flex: 1,
        width: '100%',
        borderColor: colors.border,
        borderRadius: 10,
        borderWidth: 1,
        padding: 10,
        marginBottom: index === orignal.length - 1 ? 0 : 25,
      }}>
      <View>
        <Image
          style={{
            width: '100%',
            height: isTablet ? 280 : 172,
            borderRadius: 10,
          }}
          onLoadStart={() => setLoader(true)}
          onLoadEnd={() => setLoader(false)}
          source={
            data && data?.profile
              ? data.profile
              : user && user.userType == 'patient'
              ? require('../../assets/images/doctor.png')
              : require('../../assets/images/patient.jpg')
          }
        />
        {loader && (
          <View
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              // opacity: 0.7,
              backgroundColor: colors.transparent,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <ActivityIndicator
              size="large"
              color={colors.secondry}
              style={{marginBottom: 10}}
            />
          </View>
        )}
      </View>
      <View
        style={{
          flexDirection: 'column',
          paddingTop: 10,
          paddingBottom: 10,
          paddingRight: 5,
          paddingLeft: 5,
          flex: 1,
          alignItems: 'flex-start',
        }}>
        <Text
          numberOfLines={1}
          style={{
            color: colors.text,
            // width: '58%',
            fontFamily: fonts.Montserrat_SemiBold,
            letterSpacing: -0.5,
            fontSize: 18,
          }}>
          {data && data?.name}
        </Text>
        <Text
          style={{
            flex: 0,
            color: colors.primary,
            fontFamily: fonts.Montserrat_SemiBold,
            fontSize: 13,
          }}>
          {data && data?.email}
        </Text>
        <Text
          style={{
            flex: 0,
            color: colors.primary,
            fontFamily: fonts.Montserrat_SemiBold,
            fontSize: 13,
          }}>
          {data && data?.description}
        </Text>
      </View>
      {data?.phone && (
        <SpecificationTag
          data={`Phone Number: ${data?.phone}`}
          style={{padding: 10, paddingHorizontal: 20}}
        />
      )}
      {data?.speciality && (
        <SpecificationTag
          data={`Speciality: ${data?.speciality}`}
          style={{padding: 10, paddingHorizontal: 20}}
        />
      )}
      {data?.disease && (
        <SpecificationTag
          data={`Disease: ${data?.disease}`}
          style={{padding: 10, paddingHorizontal: 20}}
        />
      )}
      <Text
        style={{
          color: colors.greyText,
          fontFamily: fonts.Montserrat_Medium,
          fontSize: 15,
          letterSpacing: -0.5,
          padding: 7,
        }}>
        <Octicons name="location" size={12} color={colors.greyText} />{' '}
        {data?.address}
      </Text>

      {request ? (
        user && user?.userType == 'patient' ? (
          <View style={{flexDirection: 'row'}}>
            <SpecificationTag
              data={'Accept'}
              backgroundColor={colors.strong}
              color={colors.white}
              onPress={() => requestResponse('accept')}
              style={{padding: 10, paddingHorizontal: 20}}
              loading={acceptLoader}
            />
            <SpecificationTag
              data={'Decline'}
              backgroundColor={'red'}
              color={colors.white}
              onPress={() => requestResponse('decline')}
              style={{padding: 10, paddingHorizontal: 20}}
              loading={rejectLoader}
            />
          </View>
        ) : (
          <SpecificationTag
            data={status != 'pending' ? `${status}ed` : status}
            backgroundColor={colors.secondry}
            color={colors.white}
          />
        )
      ) : (
        <>
          <Text
            style={{
              color: colors.greyText,
              fontFamily: fonts.Montserrat_Medium,
              fontSize: 15,
              letterSpacing: -0.5,
              padding: 7,
            }}>
            Created on {updatedDate(data?.createdAt)}
          </Text>
          {!noRequest && (
            <SpecificationTag
              data={`Request this ${
                user.userType == 'patient' ? 'Care Taker' : 'patient'
              }`}
              backgroundColor={colors.primary}
              color={colors.white}
              onPress={sendRequest}
              loading={requestLoader}
            />
          )}
        </>
      )}
    </View>
  );
};
export default Card;
