import React, {useCallback} from 'react';
import {useEffect, useState} from 'react';
import Octicons from 'react-native-vector-icons/Octicons';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
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
import {ArchiveList} from '../../core/redux/actions/mood';
import PageLoader from '../../components/PageLoader';
import {updatedDate, updatedDateNewFormat} from '../../utils/Methods';
import ScheduleCard from '../../components/ScheduleCard';

const MedicationHistory = () => {
  const navigation = useNavigation();
  const [archivedMedications, SetArchivedMedications] = useState([]);
  const [selectedMood, setSelectedMood] = useState(null);
  const [name, setName] = useState('');
  const [editName, setEditName] = useState('');
  const [editIndex, setEditIndex] = useState('');

  const [description, setDescription] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const [loader, setLoader] = useState(false);
  const [archiveListLoader, setArchiveListLoader] = useState(false);
  const [error, setError] = useState(false);

  const {userData, user} = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const deleteIcon = <AntDesign name="delete" size={22} color="#FF4242" />;

  useFocusEffect(
    useCallback(() => {
      getMedicationHistory();
    }, []),
  );
  const getMedicationHistory = async () => {
    setArchiveListLoader(true);
    var requestOptions = {
      method: 'GET',
      redirect: 'follow',
    };

    fetch(`${testURL}medication/archive?patient=${user?._id}`, requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result, 'result');
        SetArchivedMedications(result.data);
        setArchiveListLoader(false);
        setError(false);
      })
      .catch(error => {
        console.log('error', error);
        setArchiveListLoader(false);
        setError(true);
      });
  };

  return (
    <View style={styles.sectionContainer}>
      <Header title="Medication History" />
      <Container>
        {archiveListLoader ? (
          <PageLoader />
        ) : error ? (
          <View
            style={{justifyContent: 'center', alignItems: 'center', gap: 10}}>
            <Text
              style={{fontSize: 18, fontWeight: 'bold', marginVertical: 10}}>
              Something went wrong try again
            </Text>
            <NormalButton
              title="Try Again"
              onPress={() => getMedicationHistory()}
            />
          </View>
        ) : (
          <View style={styles.form}>
            {archivedMedications.map((schedule, index, orignal) => {
              return (
                <ScheduleCard
                  schedule={schedule}
                  key={index}
                  orignal={orignal}
                  noEdit={true}
                />
              );
            })}
          </View>
        )}
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

export default NetworkError(MedicationHistory);
