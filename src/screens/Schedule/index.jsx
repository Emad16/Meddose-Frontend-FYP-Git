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
import Selector from '../../components/Selector';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {showLog} from '../../utils/Methods';
import moment from 'moment';
import {storeCurrentMedication} from '../../core/redux/actions/snackbar';

const Schedule = () => {
  const navigation = useNavigation();
  const [medications, setMedications] = useState([]);
  const [name, setName] = useState('');
  const [editName, setEditName] = useState('');
  const [editIndex, setEditIndex] = useState('');

  const [currentMedication, setCurrentMedication] = useState(null);
  const [measurment, setMeasurment] = useState(null);
  const [currentSchedule, setCurrentSchedule] = useState([]);
  const [day, setDay] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const [timePicker, setTimePicker] = useState(false);
  const [tillTimePicker, setTillTimePicker] = useState(false);
  const [medicationTime, setMedicationTime] = useState('');
  const [showMedicationTime, setShowMedicationTime] = useState('');
  const [tillDate, setTillDate] = useState('');
  const [showTillDate, setShowTillDate] = useState('');
  const [description, setDescription] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const [loader, setLoader] = useState(false);

  const {userData, user} = useSelector(state => state.auth);
  const {medication} = useSelector(state => state.other);
  const {medicationFromList} = useSelector(state => state.snackbar);
  console.log(medicationFromList, 'medicationFromList');

  const dispatch = useDispatch();
  const deleteIcon = <AntDesign name="delete" size={22} color="#FF4242" />;
  useFocusEffect(
    useCallback(() => {
      //
      if (medication && medication?.length > 0) {
        setMedications(medication);
        setTimeout(() => {
          if (medicationFromList) setCurrentMedication(medicationFromList);
        }, 2000);
      } else {
        getMedications();
      }

      return () => {
        console.log('Empty current med');
        dispatch(storeCurrentMedication(null));
      };
    }, [medication, medicationFromList]),
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
        setTimeout(() => {
          if (medicationFromList) setCurrentMedication(medicationFromList);
        }, 2000);
      })
      .catch(error => console.log('error', error));
  };

  const getScheduleBymedicationId = id => {
    var requestOptions = {
      method: 'GET',
      redirect: 'follow',
    };

    fetch(`${testURL}schedule?medicationID=${id}`, requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.error) {
        } else {
          console.log(result.data.schedule);
          setCurrentSchedule(result.data.schedule);
        }
      })
      .catch(error => console.log('error', error));
  };
  const handleSubmit = () => {
    if (
      !day ||
      !medicationTime ||
      !quantity ||
      !tillDate ||
      medicationTime == '' ||
      quantity == 0 ||
      tillDate == ''
    )
      return dispatch(
        showSnackBar({visible: true, text: 'All fields are required'}),
      );
    let scheduleDetails = [];
    if (!user?.careTaker)
      return dispatch(
        showSnackBar({visible: true, text: 'no Care Taker linked'}),
      );
    if (medications.length == 0)
      return dispatch(
        showSnackBar({
          visible: true,
          text: 'Please enter at least 1 medication',
        }),
      );
    if (currentMedication == null)
      return dispatch(
        showSnackBar({
          visible: true,
          text: 'Please select medication',
        }),
      );
    if (measurment == null)
      return dispatch(
        showSnackBar({
          visible: true,
          text: 'Please select mesurment',
        }),
      );
    if (day == null)
      return dispatch(
        showSnackBar({
          visible: true,
          text: 'Please select day',
        }),
      );
    if (medicationTime == '')
      return dispatch(
        showSnackBar({
          visible: true,
          text: 'Please select medication time',
        }),
      );

    if (quantity == 0)
      return dispatch(
        showSnackBar({
          visible: true,
          text: 'Please enter quantity',
        }),
      );
    if (tillDate == '')
      return dispatch(
        showSnackBar({
          visible: true,
          text: 'Please select till date',
        }),
      );
    if (currentSchedule.length == 0) {
      scheduleDetails = [
        {
          day: day.name,
          time: medicationTime,
          quantity,
          till: tillDate,
          measurment: measurment.name,
        },
      ];
    } else {
      currentSchedule.push({
        day: day.name,
        time: medicationTime,
        quantity,
        till: tillDate,
        measurment: measurment?.name,
      });
      scheduleDetails = currentSchedule;
    }

    setLoader(true);

    try {
      const Data = {
        schedule: JSON.stringify(scheduleDetails),
        medicationID: currentMedication._id,
        user: JSON.stringify({
          external_id: user._id,
          title: `${currentMedication?.name} at ${showMedicationTime}`,
          message: `${quantity} ${measurment?.name}`,
        }),
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

      fetch(`${testURL}schedule`, requestOptions)
        .then(response => response.json())
        .then(result => {
          console.log(result);
          dispatch(showSnackBar({visible: true, text: result.message}));
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
  // console.log(currentMedication);
  const weekDaysArray = [
    {name: 'Monday'},
    {name: 'Tuesday'},
    {name: 'Wednesday'},
    {name: 'Thursday'},
    {name: 'Friday'},
    {name: 'Saturday'},
    {name: 'Sunday'},
  ];

  const handleConfirm = date => {
    console.warn('A date has been picked: ', date);
    setMedicationTime(date);
    setShowMedicationTime(moment(date).format('hh:mm A'));
    hideDatePicker();
  };

  const hideDatePicker = () => {
    setTimePicker(false);
  };

  const handleTillDateConfirm = date => {
    console.warn('A date has been picked: ', date);
    setTillDate(date);
    setShowTillDate(moment(date).format('dddd, DD MMMM YYYY'));
    hideTillDatePicker();
  };

  const hideTillDatePicker = () => {
    setTillTimePicker(false);
  };

  const measurmentsArray = [
    {name: 'IU'},
    {name: 'ampoule(s)'},
    {name: 'application(s)'},
    {name: 'capsule(s)'},
    {name: 'drop(s)'},
    {name: 'gram(s)'},
    {name: 'injection(s)'},
    {name: 'milligram(s)'},
    {name: 'millilitter(s)'},
    {name: 'mm'},
    {name: 'patch(es)'},
    {name: 'pessary(ies)'},
    {name: 'piece(s)'},
    {name: 'pill(s)'},
    {name: 'portion(s)'},
    {name: 'puff(s)'},
    {name: 'sachet(s)'},
    {name: 'spray(s)'},
    {name: 'suppository(ies)'},
    {name: 'tablespoon(s)'},
    {name: 'teaspoon(s)'},
    {name: 'unit(s)'},
  ];
  return (
    <View style={styles.sectionContainer}>
      <Header title="Schedule" />

      <Container>
        <View style={styles.form}>
          <Selector
            value={currentMedication}
            holder="Select Medication"
            data={medication}
            handleValueChange={val => {
              setCurrentMedication(val);
              getScheduleBymedicationId(val._id);
            }}
          />
          <Selector
            value={measurment}
            holder="Select Measurment"
            data={measurmentsArray}
            handleValueChange={val => {
              setMeasurment(val);
            }}
          />
          <Selector
            value={day}
            holder="Select Day"
            data={weekDaysArray}
            handleValueChange={val => setDay(val)}
          />

          <Pressable
            onPress={() => setTimePicker(true)}
            style={{marginTop: 15}}>
            <Input
              holder={'Medication Time'}
              type="text"
              value={showMedicationTime}
              disabled
              style={{
                marginTop: 0,
                borderBottomWidth: 1,
                borderBottomColor: '#dfdfdf',
              }}
            />
          </Pressable>
          <DateTimePickerModal
            isVisible={timePicker}
            mode="time"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
          />
          <Input
            holder={'Quantity'}
            handleTextChange={val => setQuantity(val)}
            type="text"
            keyboardType={'numeric'}
            value={quantity}
          />
          <Pressable
            onPress={() => setTillTimePicker(true)}
            style={{marginTop: 15}}>
            <Input
              holder={'Medication Till?'}
              style={{
                marginTop: 0,
                borderBottomWidth: 1,
                borderBottomColor: '#dfdfdf',
              }}
              type="text"
              value={showTillDate}
              disabled
            />
          </Pressable>
          <DateTimePickerModal
            isVisible={tillTimePicker}
            mode="date"
            onConfirm={handleTillDateConfirm}
            onCancel={hideTillDatePicker}
            minimumDate={new Date()}
          />
        </View>
        <NormalButton
          loader={loader}
          onPress={handleSubmit}
          title={'Submit'}
          style={{marginTop: 30}}
        />
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

export default NetworkError(Schedule);
