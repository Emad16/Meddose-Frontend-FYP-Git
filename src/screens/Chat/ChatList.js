import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {Text, View, Image, TouchableOpacity, ScrollView} from 'react-native';
import {useSelector} from 'react-redux';
import {testURL} from '../../ApiBaseURL';
import Container from '../../components/Container';
import EmptyList from '../../components/EmptyList';
import Header from '../../components/Header';
import PageLoader from '../../components/PageLoader';
import {colors} from '../../utils/theme/colors';

const ChatList = () => {
  const {user} = useSelector(state => state.auth);
  const [patients, setPatients] = useState([]);
  const [loader, setLoader] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    getPatients();

    return () => {};
  }, []);

  const getPatients = async () => {
    setLoader(true);
    var requestOptions = {
      method: 'GET',
      redirect: 'follow',
    };

    fetch(`${testURL}user/patients-by-caretaker?id=${user._id}`, requestOptions)
      .then(response => response.json())
      .then(result => {
        setPatients(result);
        setLoader(false);
        setIsEmpty(false);
      })
      .catch(error => {
        console.log('error', error);
        setIsEmpty(true);
        setLoader(false);
      });
  };

  return (
    <>
      <Header title={'Chat List'} />
      <Container>
        {loader ? (
          <PageLoader />
        ) : isEmpty ? (
          <EmptyList action={getPatients} />
        ) : (
          patients &&
          patients?.map(patient => (
            <TouchableOpacity
              onPress={() => navigation.navigate('chat', {patient})}
              style={{
                borderColor: colors.border,
                borderWidth: 1,
                borderRadius: 20,
                padding: 10,
                flexDirection: 'row',
                marginTop: 10,
                alignItems: 'center',
              }}>
              <Image
                style={{
                  width: 70,
                  height: 70,
                  borderRadius: 50,
                }}
                source={
                  user && user.userType == 'patient'
                    ? require('../../assets/images/doctor.png')
                    : require('../../assets/images/patient.jpg')
                }
              />
              <View style={{marginLeft: 10}}>
                <Text
                  style={{
                    fontWeight: 'bold',
                    fontSize: 16,
                    color: colors.primary,
                  }}>
                  {patient?.name}
                </Text>
                <Text
                  style={{
                    fontWeight: 'bold',
                    fontSize: 16,
                    color: colors.primary,
                  }}>
                  {patient?.email}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </Container>
    </>
  );
};

export default ChatList;
