import React, {useCallback} from 'react';
import {useEffect, useState} from 'react';
import Octicons from 'react-native-vector-icons/Octicons';
import {StyleSheet, View, Text, Pressable} from 'react-native';
import Header from '../../components/Header';
import Input from '../../components/Input';
import NormalButton from '../../components/Button';
import {useDispatch, useSelector} from 'react-redux';
import Container from '../../components/Container';
import {showSnackBar} from '../../core/redux/actions';
import AntDesign from 'react-native-vector-icons/AntDesign';
import NetworkError from '../NetworkError';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {colors} from '../../utils/theme/colors';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Modal, Portal} from 'react-native-paper';
import {fonts} from '../../utils/theme/fonts';
import {testURL} from '../../ApiBaseURL';
import types from '../../core/redux/types';
import {storeCurrentMedication} from '../../core/redux/actions/snackbar';

const AddMedication = () => {
  const navigation = useNavigation();
  const [medications, setMedications] = useState([]);
  const [name, setName] = useState('');
  const [editName, setEditName] = useState('');
  const [editIndex, setEditIndex] = useState('');

  const [description, setDescription] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const [loader, setLoader] = useState(false);

  const {userData, user} = useSelector(state => state.auth);
  const {medication} = useSelector(state => state.other);
  console.log(medication, 'medication');
  console.log(medications, 'local state medication');
  const dispatch = useDispatch();
  const deleteIcon = <AntDesign name="delete" size={22} color="#FF4242" />;

  useFocusEffect(
    useCallback(() => {
      getMedications();
    }, []),
  );
  const getMedications = async () => {
    var requestOptions = {
      method: 'GET',
      redirect: 'follow',
    };

    fetch(
      `${testURL}medication?id=${user && user.careTaker}&patient=${
        user && user._id
      }`,
      requestOptions,
    )
      .then(response => response.json())
      .then(result => {
        setMedications(result.data.details);
        dispatch({
          type: types.MEDICATIONS,
          payload: result.data.details,
        });
      })
      .catch(error => console.log('error', error));
  };
  const handleSubmit = () => {
    if (!user?.careTaker)
      return dispatch(
        showSnackBar({visible: true, text: 'no Care Taker linked'}),
      );
    setLoader(true);
    if (medications.length == 0)
      return dispatch(
        showSnackBar({
          visible: true,
          text: 'Please enter at least 1 medication',
        }),
      );
    try {
      const Data = {
        details: JSON.stringify(medications),
        patient: user && user._id,
        caretaker: user && user.careTaker,
      };
      console.log(Data, 'Data');
      var requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify(Data),
        redirect: 'follow',
      };

      fetch(`${testURL}medication`, requestOptions)
        .then(response => response.json())
        .then(result => {
          console.log(result);
          dispatch(showSnackBar({visible: true, text: result.message}));
          dispatch({
            type: types.MEDICATIONS,
            payload: result.data.details,
          });
          setLoader(false);
          navigation.goBack();
        })
        .catch(error => {
          console.log('error', error);
          setLoader(false);
        });
      //   dispatch(
      //     updateDishesData(
      //       {
      //         dishes,
      //         vendorid: user._id,
      //       },
      //       data => {
      //         setLoader(false);
      //         if (data.status == 'success') {
      //           return dispatch({
      //             type: types.SIGN_IN,
      //             payload: data.res.user,
      //           });
      //         }
      //         dispatch(showSnackBar({visible: true, text: data.message}));
      //       },
      //     ),
      //   );
    } catch (error) {
      setLoader(false);
      dispatch(showSnackBar({visible: true, text: error.message}));
    }
  };

  const addMedication = () => {
    if (name && description) {
      if (medications.some(d => d.name == name)) {
        return dispatch(
          showSnackBar({visible: true, text: 'Medications already present'}),
        );
      }
      setMedications([...medications, {name, description}]);
      setName('');
      setDescription('');
    }
  };
  const handleNameChange = data => setName(data);
  const delFromList = index => {
    medications.splice(index, 1);
    setMedications([...medications]);
  };
  const editFromList = index => {
    setIsEdit(true);
    setEditIndex(index);
    setEditName(medications[index].name);
    setEditDescription(medications[index].description);
  };

  const hideModal = () => {
    setIsEdit(false);
  };
  const editMedication = () => {
    medications[editIndex].name = editName;
    medications[editIndex].description = editDescription;
    setMedications([...medications]);
    setEditName('');
    setEditDescription('');
    setEditIndex('');
    hideModal();
  };
  return (
    <View style={styles.sectionContainer}>
      <Header title="Medication" />

      <Container>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'flex-start',
            marginVertical: 20,
          }}>
          <MaterialCommunityIcons
            name="information"
            size={30}
            color={'#dedede'}
          />
          <Text>Make sure to submit the list while leaving the screen</Text>
        </View>
        <View style={styles.form}>
          {medications.map((d, i) => {
            return (
              <View
                style={{
                  padding: 15,
                  paddingHorizontal: 20,
                  borderRadius: 30,
                  justifyContent: 'space-between',
                  // alignItems: 'center',
                  borderColor: colors.border,
                  borderWidth: 1,
                  marginVertical: 10,
                  gap: 10,
                }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: fonts.Montserrat_SemiBold,
                    color: colors.primary,
                  }}>{`s.no ${i + 1}`}</Text>
                <Text
                  style={{
                    fontSize: 20,
                    fontFamily: fonts.Montserrat_SemiBold,
                    color: colors.primary,
                  }}>
                  {d.name}
                </Text>
                <Text
                  style={{
                    fontSize: 20,
                    fontFamily: fonts.Montserrat_Medium,
                    color: colors.primary,
                    marginBottom: 10,
                  }}>
                  {d.description}
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: '100%',
                  }}>
                  <NormalButton
                    // loader={loader}
                    disabled={loader}
                    onPress={() => editFromList(i)}
                    title={'Edit'}
                    style={{width: '45%'}}
                  />
                  <NormalButton
                    // loader={loader}
                    disabled={loader}
                    onPress={() => delFromList(i)}
                    title={'Remove'}
                    style={{width: '45%'}}
                  />
                </View>
                {medication && medication.some(med => med._id == d._id) ? (
                  <NormalButton
                    onPress={() => {
                      dispatch(storeCurrentMedication(d));
                      navigation.navigate('Schedule');
                    }}
                    title={'Add Schedule'}
                    style={{width: '100%'}}
                  />
                ) : (
                  <Text
                    style={{textAlign: 'center', fontSize: 18, color: '#000'}}>
                    Submit the list to add schedule for this medication
                  </Text>
                )}
              </View>
              // <View
              //   key={i}
              //   style={{
              //     flexDirection: 'row',
              //     alignItems: 'center',
              //     justifyContent: 'space-between',
              //     backgroundColor: colors.secondry,
              //     padding: 10,
              //     marginTop: 10,
              //     borderRadius: 10,
              //   }}>
              //   <Text style={[styles.numberText, styles.font]}>{i + 1})</Text>
              //   <View style={{flex: 1}}>
              //     <Text style={[styles.nameText, styles.font]}>
              //       Name: {d.name}
              //     </Text>
              //     <Text style={[styles.nameText, styles.font]}>
              //       {d.description}
              //     </Text>
              //   </View>
              //   <Pressable onPress={() => editFromList(i)}>
              //     <MaterialCommunityIcons name="eye" size={30} color={'#fff'} />
              //   </Pressable>
              //   <Pressable onPress={() => delFromList(i)}>
              //     <MaterialCommunityIcons
              //       name="delete"
              //       size={30}
              //       color={'red'}
              //     />
              //   </Pressable>
              // </View>
            );
          })}
          <Text style={[styles.font, styles.formFieldText]}>
            Medication Name
          </Text>
          <Input
            holder={'Medication name here'}
            handleTextChange={handleNameChange}
            type="text"
            value={name}
          />

          <Text style={[styles.font, styles.formFieldText]}>Description</Text>
          <Input
            holder={'Description'}
            handleTextChange={val => setDescription(val)}
            type="text"
            value={description}
            multiline
            numberOfLines={3}
          />
        </View>
        <View style={styles.buttonSection}>
          <NormalButton
            // loader={loader}
            disabled={loader}
            onPress={() => addMedication()}
            title={'Add to List'}
          />
          <View style={{marginTop: 20}} />
          <NormalButton
            loader={loader}
            onPress={handleSubmit}
            title={'Submit'}
            style={{marginTop: 10}}
          />
        </View>
      </Container>
      <Portal>
        <Modal
          visible={isEdit}
          onDismiss={hideModal}
          contentContainerStyle={styles.containerStyle}>
          <Text
            style={{
              fontSize: 30,
              fontFamily: fonts.Montserrat_SemiBold,
              textAlign: 'center',
              color: '#000',
              marginBottom: 20,
            }}>
            Edit
          </Text>
          <View>
            <Text style={[styles.font, styles.formFieldText]}>
              Medication Name
            </Text>
            <Input
              holder={'Medication name here'}
              handleTextChange={val => setEditName(val)}
              type="text"
              value={editName}
            />

            <Text style={[styles.font, styles.formFieldText]}>Description</Text>
            <Input
              holder={'Description'}
              handleTextChange={val => setEditDescription(val)}
              type="text"
              value={editDescription}
              multiline
              numberOfLines={3}
            />
            <NormalButton
              // loader={loader}
              disabled={loader}
              onPress={() => editMedication()}
              title={'Edit to List'}
              style={{width: '100%', marginTop: 20}}
            />
          </View>
        </Modal>
      </Portal>
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
    backgroundColor: '#FFFFFF',
  },
  topSection: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 10,
  },

  nameText: {
    flex: 1,
    fontSize: 20,
    color: '#fff',
    fontWeight: '600',
  },
  numberText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '600',
    marginRight: 5,
    alignSelf: 'flex-start',
  },
  locationTxt: {
    fontSize: 14,
    marginLeft: 5,
    color: '#7A8185',
  },
  form: {
    width: '100%',
    alignSelf: 'flex-start',
    justifyContent: 'space-around',
  },
  locationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  formFieldText: {
    fontSize: 15,
    fontWeight: 500,
    marginBottom: 0,
    marginTop: 10,
    color: '#2A3D49',
  },
  buttonSection: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 10,
  },
  font: {
    fontFamily: 'Montserrat',
  },
  containerStyle: {
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 20,
    margin: 20,
    color: colors.black,
  },
});

export default NetworkError(AddMedication);
