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
const ViewSchedule = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [currentSchedule, setCurrentSchedule] = useState([]);
  const [loader, setLoader] = useState(false);
  const [medications, setMedications] = useState([]);
  const [currentMedication, setCurrentMedication] = useState(null);

  const {user} = useSelector(state => state.auth);
  const {medication} = useSelector(state => state.other);
  useFocusEffect(
    useCallback(() => {
      if (medication?.length == 0) {
        getMedications();
      } else {
        setMedications(medication);
      }
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

  const getScheduleBymedicationId = id => {
    var requestOptions = {
      method: 'GET',
      redirect: 'follow',
    };
    setLoader(true);

    fetch(`${testURL}schedule?medicationID=${id}`, requestOptions)
      .then(response => response.json())
      .then(result => {
        setLoader(false);
        if (result.error) {
          setCurrentSchedule([]);
        } else {
          console.log(result.data.schedule);
          setCurrentSchedule(result.data.schedule);
        }
      })
      .catch(error => {
        console.log('error', error);
        setLoader(false);
        setCurrentSchedule([]);
      });
  };

  const submitResults = data => {
    console.log(data, 'here');
    setTimeout(() => {
      dispatch(showSnackBar({visible: true, text: data}));
    }, 1000);
  };
  console.log(currentMedication, 'currentMedication');
  return (
    <>
      <Header title={'Your Schedule'} />
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
          <Text>Select medication to view its schedule</Text>
        </View>

        <View style={{marginBottom: 20}}>
          <Text style={[styles.font, styles.formFieldText]}>Medications</Text>
          <Selector
            value={currentMedication}
            holder="Select Medication"
            data={medication}
            handleValueChange={val => {
              setCurrentSchedule([]);
              setCurrentMedication(val);
              getScheduleBymedicationId(val._id);
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
          ) : currentSchedule && currentSchedule.length > 0 ? (
            currentSchedule.map((schedule, index, orignal) => (
              // <Pressable
              //   onPress={() => navigation.navigate('BlogDetails', {blog})}>
              <ScheduleCard
                schedule={schedule}
                key={index}
                currentMedication={currentMedication}
                submitResults={submitResults}
                orignal={orignal}
              />
              // </Pressable>
            ))
          ) : currentMedication ? (
            <Image
              style={{
                width: '100%',
                // height: 172,
                borderRadius: 10,
                // resizeMode: 'contain',
              }}
              source={require('../../assets/images/error.png')}
            />
          ) : (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 20,
              }}>
              <Text
                style={{fontSize: 20, fontWeight: 'bold', textAlign: 'center'}}>
                Select Medication From Dropdown
              </Text>
              <Drop />
            </View>
          )}
        </ScrollView>
      </Container>
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
export default ViewSchedule;
