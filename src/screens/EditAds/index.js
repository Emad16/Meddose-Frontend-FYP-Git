import React, {useCallback, useEffect} from 'react';
import {useState} from 'react';
import {StyleSheet, Text, View, Pressable, Image} from 'react-native';
import {SliderBox} from 'react-native-image-slider-box';
import NormalButton from '../../components/Button';
import Header from '../../components/Header';
import Input from '../../components/Input';
import Selector from '../../components/Selector';
import ImagePicker from 'react-native-image-crop-picker';
import {useDispatch, useSelector} from 'react-redux';
import {
  addListingError,
  editAd,
  getBodyType,
  getCities,
  getColors,
  getDetails,
  getEngineType,
  getMakes,
  getModels,
  getRegisteredPlaces,
  getVersions,
} from '../../core/redux/actions/carlisting';
import Container from '../../components/Container';
import {SCREEN_WIDTH, showLog} from '../../utils/Methods';
import {showSnackBar} from '../../core/redux/actions';
import axios from 'axios';
import {apiBaseURLV1} from '../../ApiBaseURL';
import Loader from '../../components/PageLoader/Loader';
import NetworkError from '../NetworkError';
import {
  CommonActions,
  useFocusEffect,
  useIsFocused,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {colors} from '../../utils/theme/colors';
import {fonts} from '../../utils/theme/fonts';
import moment from 'moment';

const EditAds = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {itemID} = route.params;
  const [image, setImage] = useState([]);
  const [registrationYear, setRegistrationYear] = useState(null);
  const [modalYear, setModalYear] = useState(null);
  const [transmission, setTransmission] = useState(null);
  const [engineCC, setEngineCC] = useState(null);
  const [regStatus, setRegStatus] = useState(null);
  const [manufacturing, setManufacturing] = useState(null);
  const [loader, setLoader] = useState(false);
  const [city, setCity] = useState(null);
  const [color, setColor] = useState(null);
  const [regPlace, setRegPlace] = useState(null);
  const [model, setModel] = useState(null);
  const [modelData, setModelData] = useState(null);
  const [versionsData, setVersionsData] = useState(null);
  const [version, setVersion] = useState(null);
  const [makes, setMakes] = useState(null);
  const [engine, setEngine] = useState(null);
  const [currentCar, setCurrentCar] = useState(null);
  const [body, setBody] = useState(null);
  const [price, setPrice] = useState(null);
  const {user} = useSelector(state => state.auth);
  const {
    RegPlaces,
    Cities,
    Error,
    YourAds,
    Colors,
    make,
    models,
    engineType,
    carDetails,
    bodyType,
    versions,
  } = useSelector(state => state.lisitng);
  useFocusEffect(
    useCallback(() => {
      if (!Cities || Cities?.length == 0) dispatch(getCities('get'));
      if (!carDetails || carDetails?.length == 0) dispatch(getDetails('get'));

      if (!RegPlaces || RegPlaces?.length == 0)
        dispatch(getRegisteredPlaces('get'));
      dispatch(getEngineType('get'));
      dispatch(getBodyType('get'));
      return () => {
        dispatch(getMakes());
        dispatch(getBodyType());
        dispatch(getEngineType());
        dispatch(getCities());
        dispatch(getDetails());
        dispatch(getRegisteredPlaces());
        dispatch(getColors());
        dispatch(getVersions());
        dispatch(getModels());
      };
    }, []),
  );

  const dispatch = useDispatch();
  const takePhotoFromGallery = () => {
    ImagePicker.openPicker({
      multiple: true,
      cropping: false,
    }).then(img => {
      showLog(img, 'images');

      let imagedata = img.map(val => {
        let pathParts = val.path.split('/');
        return {
          uri: val.path,
          type: val.mime,
          name: pathParts[pathParts.length - 1],
        };
      });
      if (image && image.length > 0) return setImage([...image, ...imagedata]);
      setImage(imagedata);
    });
  };
  const getCurrentListing = async () => {
    setLoader(true);
    try {
      const result = await axios.get(
        `${apiBaseURLV1}/get/listing/${itemID}?id=23`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        },
      );
      showLog(result?.data?.data, 'current car');
      setCurrentCar(result.data.data);

      setLoader(false);
    } catch (error) {
      showLog(error.message);
      dispatch(showSnackBar({visible: true, text: error.message}));
      setLoader(false);
    }
  };
  useEffect(() => {
    if (models) {
      setModelData(models);
    } else {
      setModelData(null);
    }
    if (versions) {
      setVersionsData(versions);
    } else {
      setVersionsData(null);
    }
    if (versions && models) {
      setModelData(models);
      setVersionsData(versions);
    }
    showLog('models', models);
    showLog('versions', versions);
  }, [models, versions, Colors]);
  useEffect(() => {
    setImage(
      currentCar && currentCar?.slider_images.length > 0
        ? currentCar?.slider_images
        : null,
    );
    setManufacturing(
      currentCar && currentCar?.manufacturing
        ? currentCar?.manufacturing
        : null,
    );
    setRegStatus(
      currentCar && currentCar?.registration ? currentCar?.registration : null,
    );
    setEngineCC(
      currentCar && currentCar?.engine_cc ? currentCar?.engine_cc : null,
    );
    setTransmission(
      currentCar && currentCar?.transmission ? currentCar?.transmission : null,
    );
    setModalYear(
      currentCar && currentCar?.modal_year ? currentCar?.modal_year : null,
    );
    setRegistrationYear(
      currentCar && currentCar?.registration_year
        ? currentCar?.registration_year
        : null,
    );
    setMakes(
      currentCar && currentCar?.make
        ? currentCar?.make?.replace('-', ' ')
        : null,
    );
    setVersion(
      currentCar && currentCar?.version
        ? currentCar?.version?.replace('-', ' ')
        : null,
    );
    setModel(
      currentCar && currentCar?.model
        ? currentCar?.model?.replace('-', ' ')
        : null,
    );
    setRegPlace(
      currentCar && currentCar?.reg_place ? currentCar?.reg_place : null,
    );
    setBody(currentCar && currentCar?.body_type ? currentCar?.body_type : null);
    setEngine(
      currentCar && currentCar?.engine_type ? currentCar?.engine_type : null,
    );
    setCity(currentCar && currentCar?.city ? currentCar?.city : null);
    setPrice(currentCar && currentCar?.price ? currentCar?.price : null);
    // setColor(currentCar && currentCar?.color ? currentCar?.color : null);
    dispatch(
      getMakes('get', response => {
        const makeInfilter = currentCar?.make?.replace('-', ' ');
        const modelInfilter = currentCar?.model?.replace('-', ' ');
        const versionInfilter = currentCar?.version?.replace('-', ' ');
        const colorInfilter = currentCar?.color;
        console.log(response, 'RESPONSE OF GET MAKES', makeInfilter);
        if (response && response?.status == 'success' && makeInfilter) {
          dispatch(
            getModels(makeInfilter, callback, modelResponse => {
              if (modelResponse && modelResponse?.status == 'success') {
                if (!modelInfilter) return;
                setModel(modelInfilter);
                dispatch(
                  getColors(
                    makeInfilter,
                    modelInfilter,
                    callback,
                    colorResponse => {
                      if (colorResponse && colorResponse?.status == 'success') {
                        if (!colorInfilter) return;
                        setColor(colorInfilter);
                      }
                    },
                  ),
                );
                dispatch(
                  getVersions(
                    makeInfilter,
                    modelInfilter,
                    callback,
                    versionResponse => {
                      if (
                        versionResponse &&
                        versionResponse?.status == 'success'
                      ) {
                        if (!versionInfilter) return;
                        setVersion(versionInfilter);
                      }
                    },
                  ),
                );
              }
            }),
          );
        }
      }),
    );
  }, [currentCar]);
  useEffect(() => {
    getCurrentListing();
  }, []);

  const handleSubmit = () => {
    if (
      makes &&
      model &&
      city &&
      regPlace &&
      price &&
      body &&
      color &&
      engine &&
      engineCC &&
      transmission &&
      regStatus
    ) {
      if (regStatus === 'Registered') {
        console.log('hereeeeeeeeeeeeeeeeeeee');
        if (manufacturing === null) {
          dispatch(
            showSnackBar({
              visible: true,
              text: 'Please fill all required fields',
            }),
          );
          setLoader(false);
          return null;
        }
        if (manufacturing === 'Japanese') {
          if (!registrationYear) {
            dispatch(
              showSnackBar({
                visible: true,
                text: 'Please fill all required fields',
              }),
            );
            setLoader(false);
            return null;
          }
          if (registrationYear > moment().year()) {
            dispatch(
              showSnackBar({
                visible: true,
                text: 'Registration Year cannot be greater than current year',
              }),
            );
            setLoader(false);
            return null;
          }
          if (!modalYear) {
            dispatch(
              showSnackBar({
                visible: true,
                text: 'Please fill all required fields',
              }),
            );
            setLoader(false);
            return null;
          }
          if (modalYear > moment().year()) {
            dispatch(
              showSnackBar({
                visible: true,
                text: 'Modal Year cannot be greater than current year',
              }),
            );
            setLoader(false);
            return null;
          }
        }
        if (manufacturing === 'Pakistani') {
          if (!registrationYear) {
            dispatch(
              showSnackBar({
                visible: true,
                text: 'Please fill all required fields',
              }),
            );
            setLoader(false);
            return null;
          }
          if (registrationYear > moment().year()) {
            dispatch(
              showSnackBar({
                visible: true,
                text: 'Registration Year cannot be greater than current year',
              }),
            );
            setLoader(false);
            return null;
          }
        }
      }
      if (price <= '0') {
        dispatch(
          showSnackBar({visible: true, text: 'Price should be greater than 0'}),
        );
        setLoader(false);
        return null;
      }
      setLoader(true);
      dispatch(
        editAd(
          {
            id: itemID,
            make: makes,
            version: version ? version : '',
            model: model,
            engine_type: engine,
            body_type: body,
            city: city,
            reg_place: regPlace,
            price: price,
            color: color,
            token: user?.token,
            image: image,
            registration: regStatus,
            manufacturing: manufacturing,
            transmission: transmission,
            engine_cc: engineCC,
            modal_year: modalYear,
            registration_year: registrationYear,
          },
          (status, message) => {
            if (status == 'complete') {
              dispatch(editAd(null));
              dispatch(
                showSnackBar({visible: true, text: 'Ad Updated Successfully'}),
              );
              setTimeout(() => {
                setLoader(false);
                dispatch(showSnackBar({visible: false, text: ''}));
                navigation.dispatch(
                  CommonActions.reset({
                    routes: [{name: 'Home'}],
                  }),
                );
                navigation.navigate('Home');
              }, 1000);
            } else {
              setLoader(false);
              dispatch(showSnackBar({visible: true, text: message}));
            }
          },
        ),
      );
    } else {
      dispatch(
        showSnackBar({
          visible: true,
          text:
            image.length == 0
              ? 'Image is required'
              : !makes &&
                !model &&
                !city &&
                !color &&
                !engine &&
                !body &&
                !regPlace &&
                !price &&
                !engineCC &&
                !transmission &&
                !regStatus
              ? 'Please fill all required fields'
              : !makes &&
                !model &&
                !city &&
                !color &&
                !engine &&
                !body &&
                !regPlace &&
                !engineCC &&
                !transmission &&
                !regStatus &&
                !price
              ? 'Please fill all required fields'
              : !model &&
                !city &&
                !color &&
                !engine &&
                !body &&
                !regPlace &&
                !engineCC &&
                !transmission &&
                !regStatus
              ? 'Please fill all required fields'
              : !city &&
                !color &&
                !engine &&
                !body &&
                !regPlace &&
                !engineCC &&
                !transmission
              ? 'Please fill all required fields'
              : !color && !engine && !body && !regPlace && !engineCC
              ? 'Please fill all required fields'
              : !color && !engine && !body && !regPlace
              ? 'Please fill all required fields'
              : !color && !engine && !body
              ? 'Please fill all required fields'
              : !color && !engine
              ? 'Please fill all required fields'
              : !transmission
              ? 'Please fill all required fields'
              : !regStatus
              ? 'Please fill all required fields'
              : !engineCC
              ? 'Please fill all required fields'
              : !engine
              ? 'Please fill all required fields'
              : !price
              ? 'Please fill all required fields'
              : !regPlace
              ? 'Please fill all required fields'
              : !city
              ? 'Please fill all required fields'
              : !make
              ? 'Please fill all required fields'
              : !model
              ? 'Please fill all required fields'
              : !color
              ? 'Please fill all required fields'
              : !year
              ? 'Please fill all required fields'
              : !body && 'Please fill all required fields',
        }),
      );
    }
  };
  const callback = val => {
    showLog('val', val);
    dispatch(showSnackBar({visible: true, text: val}));
  };
  useEffect(() => {
    const cleanUp = navigation.addListener('blur', () => {
      dispatch(addListingError(null));
      dispatch(editAd(null));
    });
    return cleanUp;
  }, [navigation]);
  useEffect(() => {
    const cleanUp = navigation.addListener('focus', () => {
      dispatch(editAd(null));
    });
    return cleanUp;
  }, [navigation]);
  return (
    <>
      <View style={styles.sectionContainer}>
        <Header navigation={navigation} title="Edit Your Ad" />
        <Container enableKeyboard={true}>
          <View
            style={
              image && image.length > 0
                ? {...styles.viewImageSection}
                : {
                    ...styles.imageSection,
                    alignSelf: 'center',
                    marginTop: 20,
                  }
            }>
            <SliderBox
              ImageComponent={Image}
              ImageComponentStyle={
                image && image.length > 0
                  ? styles.imageSection
                  : {alignSelf: 'center', width: '30%', height: '100%'}
              }
              images={
                image?.length > 0
                  ? image
                  : [require('../../assets/images/uploadImage.png')]
              }
              onCurrentImagePressed={() => takePhotoFromGallery()}
            />
          </View>
          <View style={styles.form}>
            <Text style={[styles.font, styles.formFieldText]}>City*</Text>
            <Selector
              holder="Select City"
              data={Cities}
              value={city}
              handleValueChange={val => setCity(val)}
            />
            <Text style={[styles.font, styles.formFieldText]}>Make*</Text>
            <Selector
              value={makes?.replace('-', ' ')}
              holder="Select Car Make"
              data={make}
              handleValueChange={val => {
                setMakes(val);
                setModel(null);
                setVersion(null);
                setColor(null);
                dispatch(getVersions());
                dispatch(getModels());
                dispatch(getColors());
                dispatch(getModels(val, callback, () => {}));
              }}
            />
            <Text style={[styles.font, styles.formFieldText]}>Model*</Text>
            <Selector
              value={model?.replace('-', ' ')}
              holder="Select Car Model"
              data={modelData ? modelData : null}
              handleValueChange={value => {
                const val = value?.replace(' ', '-');
                setModel(val);
                setVersion(null);
                setColor(null);
                setVersionsData(null);
                dispatch(getVersions());
                dispatch(getColors());
                dispatch(getVersions(makes, val, callback, () => {}));
                dispatch(getColors(makes, val, callback, () => {}));
              }}
            />
            <Text style={[styles.font, styles.formFieldText]}>Version</Text>
            <Selector
              value={version?.replace('-', ' ')}
              holder="Select Car Version"
              data={versionsData ? versionsData : null}
              handleValueChange={value => {
                const val = value?.replace(' ', '-');
                setVersion(val);
              }}
            />
            <Text style={[styles.font, styles.formFieldText]}>Color*</Text>
            <Selector
              holder="Select Color"
              data={Colors}
              value={color}
              handleValueChange={val => setColor(val)}
            />
            <Text style={[styles.font, styles.formFieldText]}>
              Engine Type*
            </Text>
            <Selector
              value={engine}
              holder="Select Engine Type"
              data={carDetails?.engine_type}
              handleValueChange={val => setEngine(val)}
            />
            <Text style={[styles.font, styles.formFieldText]}>Body Type*</Text>
            <Selector
              value={body}
              holder="Select Body Type"
              data={bodyType}
              handleValueChange={val => setBody(val)}
            />
            <Text style={[styles.font, styles.formFieldText]}>
              Transmission *
            </Text>
            <Selector
              dropHeight={100}
              value={transmission}
              holder="Select Car's Transmission "
              data={carDetails?.transmission}
              handleValueChange={val => setTransmission(val)}
            />
            <Text style={[styles.font, styles.formFieldText]}>Engine CC *</Text>
            <Selector
              value={engineCC}
              holder="Select Car's Engine CC "
              data={carDetails?.engine_cc}
              handleValueChange={val => setEngineCC(val)}
            />
            <Text style={[styles.font, styles.formFieldText]}>
              Registration Status *
            </Text>
            <Selector
              value={regStatus}
              dropHeight={100}
              holder="Select Car's Registration Status "
              data={carDetails?.registration}
              handleValueChange={val => setRegStatus(val)}
            />
            <Text style={[styles.font, styles.formFieldText]}>
              Registered In*
            </Text>
            <Selector
              holder="Select Location"
              data={RegPlaces}
              value={regPlace}
              handleValueChange={val => setRegPlace(val)}
            />
            {regStatus === 'Registered' && (
              <>
                <Text style={[styles.font, styles.formFieldText]}>
                  Manufacturing*
                </Text>
                <Selector
                  value={manufacturing}
                  dropHeight={100}
                  holder="Select Car's Manufacturing Status "
                  data={carDetails?.manufacturing}
                  handleValueChange={val => setManufacturing(val)}
                />
              </>
            )}
            {(regStatus === 'Registered' && manufacturing === 'Pakistani') ||
            manufacturing === 'Japanese' ? (
              <>
                <Text style={[styles.font, styles.formFieldText]}>
                  Registration Year
                </Text>
                <Input
                  holder={'Registration Year'}
                  handleTextChange={val => setRegistrationYear(val)}
                  type="text"
                  keyboardType="number-pad"
                  value={registrationYear}
                />
              </>
            ) : (
              <></>
            )}
            {manufacturing === 'Japanese' && (
              <>
                <Text style={[styles.font, styles.formFieldText]}>
                  Modal Year
                </Text>
                <Input
                  holder={'Modal Year'}
                  handleTextChange={val => setModalYear(val)}
                  type="text"
                  keyboardType="number-pad"
                  value={modalYear}
                />
              </>
            )}
            <Text style={[styles.font, styles.formFieldText]}>Price*</Text>
            <Input
              value={price}
              holder={'Price'}
              handleTextChange={val => setPrice(val)}
              type="text"
              keyboardType="number-pad"
            />
          </View>
          <View style={styles.buttonSection}>
            <NormalButton
              loader={loader}
              onPress={() => handleSubmit()}
              title={'Done'}
            />
          </View>
        </Container>
      </View>
    </>
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
    backgroundColor: colors.white,
  },
  PictureSection: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  imageSection: {
    height: 120,
    borderRadius: 10,
    borderColor: colors.border,
    borderWidth: 1,
    width: SCREEN_WIDTH - 40,
    justifyContent: 'center',
    alignItems: 'center',
  },

  form: {
    width: '100%',
    alignSelf: 'flex-start',
    justifyContent: 'center',
  },

  formFieldText: {
    fontSize: 15,
    fontWeight: 500,
    marginBottom: 0,
    marginTop: 10,
    color: colors.text,
  },
  buttonSection: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 10,
  },
  font: {
    fontFamily: fonts.Montserrat_Medium,
  },
  viewImageSection: {
    height: 120,
    borderRadius: 10,
    width: SCREEN_WIDTH - 40,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 20,
  },
});
export default NetworkError(EditAds);
