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
import {MoodList} from '../../core/redux/actions/mood';
import PageLoader from '../../components/PageLoader';

const AddMood = () => {
  const navigation = useNavigation();
  const [moods, SetMoods] = useState([]);
  const [selectedMood, setSelectedMood] = useState(null);
  const [name, setName] = useState('');
  const [editName, setEditName] = useState('');
  const [editIndex, setEditIndex] = useState('');

  const [description, setDescription] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const [loader, setLoader] = useState(false);
  const [moodListLoader, setMoodListLoader] = useState(false);
  const [error, setError] = useState(false);

  const {userData, user} = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const deleteIcon = <AntDesign name="delete" size={22} color="#FF4242" />;

  useFocusEffect(
    useCallback(() => {
      getMoodList();
    }, []),
  );
  const getMoodList = async () => {
    setMoodListLoader(true);
    var requestOptions = {
      method: 'GET',
      redirect: 'follow',
    };

    fetch(`${testURL}mood`, requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result, 'result');
        SetMoods(result.moods);
        dispatch(MoodList(result.moods));
        setMoodListLoader(false);
        setError(false);
      })
      .catch(error => {
        console.log('error', error);
        setMoodListLoader(false);
        setError(true);
      });
  };
  const handleSubmit = () => {
    if (!user?.careTaker)
      return dispatch(
        showSnackBar({visible: true, text: 'no Care Taker linked'}),
      );
    if (selectedMood == null)
      return dispatch(
        showSnackBar({
          visible: true,
          text: 'Please select mood',
        }),
      );
    setLoader(true);

    try {
      const Data = {
        mood: selectedMood?._id,
        user: user && user._id,
        notes: description,
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

      fetch(`${testURL}mood/patient-mood`, requestOptions)
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

  const addMedication = () => {
    if (name && description) {
      if (moods.some(d => d.name == name)) {
        return dispatch(
          showSnackBar({visible: true, text: 'Medications already present'}),
        );
      }
      SetMoods([...moods, {name, description}]);
      setName('');
      setDescription('');
    }
  };
  const handleNameChange = data => setName(data);
  const delFromList = index => {
    moods.splice(index, 1);
    SetMoods([...moods]);
  };
  const editFromList = index => {
    setIsEdit(true);
    setEditIndex(index);
    setEditName(moods[index].name);
    setEditDescription(moods[index].description);
  };

  const hideModal = () => {
    setIsEdit(false);
  };
  const editMedication = () => {
    moods[editIndex].name = editName;
    moods[editIndex].description = editDescription;
    SetMoods([...moods]);
    setEditName('');
    setEditDescription('');
    setEditIndex('');
    hideModal();
  };
  const getColorBasedOnBackground = backgroundColor => {
    // Calculate luminance
    const r = parseInt(backgroundColor.slice(1, 3), 16);
    const g = parseInt(backgroundColor.slice(3, 5), 16);
    const b = parseInt(backgroundColor.slice(5, 7), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    // Determine text color based on luminance
    return luminance > 0.5 ? 'black' : 'white';
  };
  return (
    <View style={styles.sectionContainer}>
      <Header title="Mood" />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          marginVertical: 20,
        }}>
        <MaterialCommunityIcons
          name="information"
          size={30}
          color={'#dedede'}
        />
        <Text>Select your mood and add notes to submit</Text>
      </View>
      <Container>
        {moodListLoader ? (
          <PageLoader />
        ) : error ? (
          <View
            style={{justifyContent: 'center', alignItems: 'center', gap: 10}}>
            <Text
              style={{fontSize: 18, fontWeight: 'bold', marginVertical: 10}}>
              Something went wrong try again
            </Text>
            <NormalButton title="Try Again" onPress={() => getMoodList()} />
          </View>
        ) : (
          <View style={styles.form}>
            {moods.map((d, i) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    setSelectedMood(d);
                  }}
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
                    backgroundColor:
                      d._id == selectedMood?._id ? d.color : 'transparent',
                  }}>
                  <Text
                    style={{
                      fontSize: 20,
                      fontFamily: fonts.Montserrat_SemiBold,
                      color:
                        d._id == selectedMood?._id
                          ? getColorBasedOnBackground(d.color)
                          : colors.primary,
                    }}>
                    {d.mood}
                  </Text>
                  <Text
                    style={{
                      fontSize: 20,
                      fontFamily: fonts.Montserrat_Medium,
                      color:
                        d._id == selectedMood?._id
                          ? getColorBasedOnBackground(d.color)
                          : colors.primary,
                      marginBottom: 10,
                    }}>
                    {d.emotion}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </Container>
      <View style={{alignItems: 'center'}}>
        <Input
          holder={'Enter any Notes'}
          handleTextChange={val => setDescription(val)}
          type="text"
          value={description}
          multiline
          numberOfLines={3}
          style={{width: Dimensions.get('screen').width - 50}}
        />
        <View style={{marginTop: 20}} />
        <NormalButton
          loader={loader}
          onPress={handleSubmit}
          title={'Submit'}
          style={{marginTop: 10}}
        />
      </View>
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

export default NetworkError(AddMood);
