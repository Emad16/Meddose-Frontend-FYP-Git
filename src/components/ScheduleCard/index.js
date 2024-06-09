import React, {useState} from 'react';
import {Text, View, Image, StyleSheet, Pressable} from 'react-native';
import {Card, Modal, Portal, Surface} from 'react-native-paper';
import {fonts} from '../../utils/theme/fonts';
import {colors} from '../../utils/theme/colors';
import DeviceInfo from 'react-native-device-info';
import moment from 'moment';
import NormalButton from '../Button';
import Selector from '../Selector';
import Input from '../Input';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {useDispatch, useSelector} from 'react-redux';
import {showSnackBar} from '../../core/redux/actions';
import {testURL} from '../../ApiBaseURL';
import {measurmentsArray} from '../../utils/Methods';

const ScheduleCard = ({
  schedule,
  currentMedication,
  submitResults,
  orignal,
  noEdit,
}) => {
  const dispatch = useDispatch();
  let isTablet = DeviceInfo.isTablet();
  const {user} = useSelector(state => state.auth);
  const [isEdit, setIsEdit] = useState(false);
  const [day, setDay] = useState(null);
  const [timePicker, setTimePicker] = useState(false);
  const [showMedicationTime, setShowMedicationTime] = useState('');
  const [medicationTime, setMedicationTime] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [tillTimePicker, setTillTimePicker] = useState(false);
  const [tillDate, setTillDate] = useState('');
  const [showTillDate, setShowTillDate] = useState('');
  const [loader, setLoader] = useState(false);
  const [measurment, setMeasurment] = useState(null);

  const hideModal = () => {
    setIsEdit(false);
  };
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
  console.log(schedule, 'schedule');
  const handleSubmit = () => {
    let scheduleDetails = [];
    const currentSchedule = schedule;
    const index = orignal.findIndex(
      replaceFrom => replaceFrom._id == currentSchedule._id,
    );
    const Temp = [...orignal];
    Temp[index].day = day.name;
    Temp[index].quantity = quantity;
    Temp[index].till = tillDate;
    Temp[index].time = medicationTime;
    if (Temp[index].hasOwnProperty('measurment')) {
      Temp[index].measurment = measurment.name;
    } else {
      Object.defineProperty(Temp[index], 'measurment', {
        //using Object.defineProperty() method of JavaScript object class
        value: measurment.name,
      });
    }
    console.log(Temp);
    // hideModal();
    // return submitResults(Temp);
    // if (currentSchedule.length == 0) {
    //   scheduleDetails = [
    //     {
    //       day: day.name,
    //       time: medicationTime,
    //       quantity,
    //       till: tillDate,
    //     },
    //   ];
    // } else {
    //   currentSchedule.push({
    //     day: day.name,
    //     time: medicationTime,
    //     quantity,
    //     till: tillDate,
    //   });
    //   scheduleDetails = currentSchedule;
    // }
    if (!user?.careTaker)
      return dispatch(
        showSnackBar({visible: true, text: 'no Care Taker linked'}),
      );
    setLoader(true);
    try {
      const Data = {
        schedule: JSON.stringify(Temp),
        medicationID: currentMedication._id,
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

          setLoader(false);
          hideModal();
          submitResults(result.message);
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

  return (
    <View
      style={{
        borderRadius: 10,
        backgroundColor: colors.white,
        padding: 10,
        paddingVertical: isTablet ? 30 : 15,
        marginVertical: 15,
        shadowColor: colors.black,
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,

        elevation: 8,
      }}>
      <Image
        style={{
          width: '100%',
          height: 172,
          borderRadius: 10,
          // resizeMode: 'contain',
        }}
        source={
          schedule?.titleImage
            ? schedule?.titleImage
            : require('../../assets/images/medicine.jpg')
        }
      />
      <View
        style={{
          // flexDirection: 'row',
          justifyContent: 'space-between',
          paddingVertical: 10,
        }}>
        <View style={{flexDirection: 'row'}}>
          <Text
            style={{
              color: colors.black,
              fontFamily: fonts.Montserrat_Medium,
              fontSize: 18,
              marginTop: 5,
            }}>
            Day:{' '}
          </Text>
          <Text
            style={{
              color: colors.activeReviewStar,
              fontFamily: fonts.Montserrat_Medium,
              fontSize: 18,
              marginTop: 5,
              fontWeight: 'bold',
            }}>
            {schedule?.day}
          </Text>
        </View>

        <View style={{flexDirection: 'row'}}>
          <Text
            style={{
              color: colors.black,
              fontFamily: fonts.Montserrat_Medium,
              fontSize: 18,
              marginTop: 5,
            }}>
            Quantity:{' '}
          </Text>
          <Text
            style={{
              color: colors.activeReviewStar,
              fontFamily: fonts.Montserrat_Medium,
              fontSize: 18,
              marginTop: 5,
              fontWeight: 'bold',
            }}>
            {`${schedule?.quantity} ${
              schedule?.measurment ? schedule?.measurment : ''
            }`}
          </Text>
        </View>

        <View style={{flexDirection: 'row'}}>
          <Text
            style={{
              color: colors.black,
              fontFamily: fonts.Montserrat_Medium,
              fontSize: 18,
              marginTop: 5,
            }}>
            Time:{' '}
          </Text>
          <Text
            style={{
              color: colors.activeReviewStar,
              fontFamily: fonts.Montserrat_Medium,
              fontSize: 18,
              marginTop: 5,
              fontWeight: 'bold',
            }}>
            {moment(schedule?.time).format('hh:mm A')}
          </Text>
        </View>

        <View style={{flexDirection: 'row'}}>
          <Text
            style={{
              color: colors.black,
              fontFamily: fonts.Montserrat_Medium,
              fontSize: 18,
              marginTop: 5,
            }}>
            Last Day:{' '}
          </Text>
          <Text
            style={{
              color: colors.activeReviewStar,
              fontFamily: fonts.Montserrat_Medium,
              fontSize: 18,
              marginTop: 5,
              flex: 1,
              fontWeight: 'bold',
            }}>
            {moment(schedule?.till).format('dddd, DD MMMM YYYY')}
          </Text>
        </View>

        {schedule?.medication && (
          <>
            <Text
              style={{
                color: colors.black,
                fontFamily: fonts.Montserrat_SemiBold,
                fontSize: 24,
                marginTop: 10,
                marginBottom: 10,
              }}>
              Medication{' '}
            </Text>
            <View style={{flexDirection: 'row'}}>
              <Text
                style={{
                  color: colors.black,
                  fontFamily: fonts.Montserrat_Medium,
                  fontSize: 18,
                  marginTop: 5,
                }}>
                Name:{' '}
              </Text>
              <Text
                style={{
                  color: colors.activeReviewStar,
                  fontFamily: fonts.Montserrat_Medium,
                  fontSize: 18,
                  marginTop: 5,
                  fontWeight: 'bold',
                }}>
                {schedule?.medication?.name}
              </Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <Text
                style={{
                  color: colors.black,
                  fontFamily: fonts.Montserrat_Medium,
                  fontSize: 18,
                  marginTop: 5,
                }}>
                Description:{' '}
              </Text>
              <Text
                style={{
                  color: colors.activeReviewStar,
                  fontFamily: fonts.Montserrat_Medium,
                  fontSize: 18,
                  marginTop: 5,
                  fontWeight: 'bold',
                }}>
                {schedule?.medication?.description}
              </Text>
            </View>
          </>
        )}
        {!noEdit ? (
          moment(schedule.till).isAfter(moment()) ? (
            <NormalButton
              // loader={loader}
              onPress={() => {
                // const test = moment(schedule.till).isAfter(moment());
                // console.log({
                //   till: schedule.till,
                //   current: moment(),
                //   vaidation: test,
                // });
                console.log(schedule);
                setQuantity(schedule.quantity.toString());
                setMedicationTime(schedule.time);
                setShowMedicationTime(moment(schedule.time).format('hh:mm A'));
                setTillDate(schedule.till);
                setMeasurment(
                  schedule?.measurment ? {name: schedule.measurment} : null,
                );
                setShowTillDate(
                  moment(schedule.till).format('dddd, DD MMMM YYYY'),
                );
                setDay({name: schedule.day});
                setIsEdit(true);
              }}
              title={'Edit'}
              style={{marginTop: 20, width: '100%'}}
            />
          ) : (
            <Text
              style={{
                textAlign: 'justify',
                fontSize: 18,
                color: '#000',
                marginTop: 20,
                backgroundColor: '#dfdfdf',
                padding: 10,
              }}>
              This medication schedule has been ended add a new schedule if your
              doctor still prescribe this medication
            </Text>
          )
        ) : (
          <></>
        )}
      </View>
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
          <View style={styles.form}>
            <Selector
              value={day}
              holder="Select Day"
              data={weekDaysArray}
              handleValueChange={val => setDay(val)}
              dropDownStyle={{width: '100%'}}
            />

            <Selector
              value={measurment}
              holder="Select Measurment"
              data={measurmentsArray}
              handleValueChange={val => {
                setMeasurment(val);
              }}
              dropDownStyle={{width: '100%'}}
            />
            <Pressable onPress={() => setTimePicker(true)}>
              <Input
                holder={'Click to select medication time'}
                type="text"
                value={showMedicationTime}
                disabled
              />
            </Pressable>
            <DateTimePickerModal
              isVisible={timePicker}
              mode="time"
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
            />

            <Input
              holder={'Mention quantity here'}
              handleTextChange={val => setQuantity(val)}
              type="text"
              keyboardType={'numeric'}
              value={quantity}
            />

            <Pressable onPress={() => setTillTimePicker(true)}>
              <Input
                holder={'Click to select medication time'}
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
            style={{marginTop: 30, width: '100%'}}
          />
        </Modal>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 20,
    margin: 20,
    color: colors.black,
  },
});
export default ScheduleCard;
