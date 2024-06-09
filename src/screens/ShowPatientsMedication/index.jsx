import React, {useState, useCallback} from 'react';
import {Appbar, Modal, Portal} from 'react-native-paper';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import BlogCard from '../../components/BlogCard';
import {SCREEN_WIDTH} from '../../utils/Methods';
import {fonts} from '../../utils/theme/fonts';
import {colors} from '../../utils/theme/colors';
import Entypo from 'react-native-vector-icons/Entypo';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import Header from '../../components/Header';
import {testURL} from '../../ApiBaseURL';
import {useDispatch, useSelector} from 'react-redux';
import Container from '../../components/Container';
import Selector from '../../components/Selector';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ScheduleCard from '../../components/ScheduleCard';
import {showSnackBar} from '../../core/redux/actions';
import Drop from '../../assets/images/dropdown.svg';
import Loader from '../../components/PageLoader/Loader';
import PageLoader from '../../components/PageLoader';
import MoodCard from '../../components/MoodCard';
import NormalButton from '../../components/Button';
const ShowPatientsMedication = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [currentMood, setCurrentMood] = useState([]);
  const [loader, setLoader] = useState(false);
  const [patients, setPatients] = useState([]);
  const [currentPatient, setCurrentPatient] = useState(null);
  const [currentSchedule, setCurrentSchedule] = useState([]);
  const [scheduleLoader, setScheduleLoader] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const [currentMedication, setCurrentMedication] = useState(null);

  const {user} = useSelector(state => state.auth);
  const {medication} = useSelector(state => state.other);
  useFocusEffect(
    useCallback(() => {
      getPatients();
    }, []),
  );
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
      })
      .catch(error => {
        console.log('error', error);
        setLoader(false);
      });
  };

  const getMedications = async id => {
    var requestOptions = {
      method: 'GET',
      redirect: 'follow',
    };
    setLoader(true);
    fetch(
      `${testURL}medication?id=${user && user._id}&patient=${id}`,
      requestOptions,
    )
      .then(response => response.json())
      .then(result => {
        setLoader(false);
        setCurrentMood(result.data.details);
        // dispatch({
        //   type: types.MEDICATIONS,
        //   payload: result.data.details,
        // });
      })
      .catch(error => {
        console.log('error', error);
        setLoader(false);
        setCurrentMood([]);
      });
  };

  const getScheduleBymedicationId = id => {
    setShowSchedule(true);
    var requestOptions = {
      method: 'GET',
      redirect: 'follow',
    };
    setScheduleLoader(true);

    fetch(`${testURL}schedule?medicationID=${id}`, requestOptions)
      .then(response => response.json())
      .then(result => {
        setScheduleLoader(false);
        if (result.error) {
          setCurrentSchedule([]);
        } else {
          console.log(result.data.schedule, 'SCHEDULE');
          setCurrentSchedule(result.data.schedule);
        }
      })
      .catch(error => {
        console.log('error', error);
        setScheduleLoader(false);
        setCurrentSchedule([]);
      });
  };
  const hideModal = () => {
    setShowSchedule(false);
    setCurrentMedication(null);
    setCurrentSchedule([]);
    setScheduleLoader(false);
  };

  const submitResults = data => {
    console.log(data, 'here');
    setTimeout(() => {
      dispatch(showSnackBar({visible: true, text: data}));
    }, 1000);
  };
  console.log(currentPatient, 'currentPatient');
  return (
    <>
      <Header title={'Patients Medication'} />
      <Container>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 20,
          }}>
          <MaterialCommunityIcons
            name="information"
            size={30}
            color={'#dedede'}
          />
          <Text>Select patient to view their medication</Text>
        </View>

        <View style={{marginBottom: 20}}>
          <Text style={[styles.font, styles.formFieldText]}>Patients</Text>
          <Selector
            value={currentPatient}
            holder="Select Patient"
            data={patients}
            handleValueChange={val => {
              // setCurrentMood([]);
              setCurrentPatient(val);
              getMedications(val._id);
            }}
          />
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: 20, paddingHorizontal: 10}}>
          {loader ? (
            <View style={{margin: 30}}>
              <PageLoader />
            </View>
          ) : currentMood && currentMood.length > 0 ? (
            currentMood.map((d, i) => (
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
                <NormalButton
                  title="Show Schedule"
                  onPress={() => {
                    setCurrentMedication(d);
                    getScheduleBymedicationId(d._id);
                  }}
                  style={{width: '100%'}}
                />
              </View>
            ))
          ) : currentPatient ? (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 20,
              }}>
              <Text
                style={{fontSize: 20, fontWeight: 'bold', textAlign: 'center'}}>
                No medication found for this patient
              </Text>
              <Image
                style={{
                  width: '100%',
                  // height: 172,
                  borderRadius: 10,
                  // resizeMode: 'contain',
                }}
                source={require('../../assets/images/error.png')}
              />
            </View>
          ) : (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 20,
              }}>
              <Text
                style={{fontSize: 20, fontWeight: 'bold', textAlign: 'center'}}>
                Select Patient From Dropdown
              </Text>
              <Drop />
            </View>
          )}
        </ScrollView>
      </Container>

      <Portal>
        <Modal
          visible={showSchedule}
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
            {`${currentPatient?.name}'s Schedual`}
          </Text>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: 20, paddingHorizontal: 10}}>
            {loader ? (
              <View style={{margin: 30}}>
                <PageLoader />
              </View>
            ) : (
              currentSchedule &&
              currentSchedule.length > 0 &&
              currentSchedule.map((schedule, index, orignal) => (
                // <Pressable
                //   onPress={() => navigation.navigate('BlogDetails', {blog})}>
                <ScheduleCard
                  schedule={schedule}
                  key={index}
                  currentMedication={currentMedication}
                  submitResults={submitResults}
                  orignal={orignal}
                  noEdit={true}
                />
                // </Pressable>
              ))
            )}
          </ScrollView>
        </Modal>
      </Portal>
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
export default ShowPatientsMedication;
