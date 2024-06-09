import React, {useCallback, useEffect, useRef} from 'react';
import {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
  Alert,
  Platform,
} from 'react-native';
import {SliderBox} from 'react-native-image-slider-box';
import NormalButton from '../../components/Button';
import Header from '../../components/Header';
import Input from '../../components/Input';
import Selector from '../../components/Selector';
import ImagePicker from 'react-native-image-crop-picker';
import {useDispatch, useSelector} from 'react-redux';
import {
  addFilters,
  addFiltersParams,
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
  uploadCarAdd,
} from '../../core/redux/actions/carlisting';
import Container from '../../components/Container';
import {SCREEN_WIDTH, checkPermissions, showLog} from '../../utils/Methods';
import {showSnackBar} from '../../core/redux/actions';
import {fonts} from '../../utils/theme/fonts';
import {
  CommonActions,
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import {PERMISSIONS, checkMultiple} from 'react-native-permissions';
import moment from 'moment';
import NetworkError from '../NetworkError';
import {colors} from '../../utils/theme/colors';

const SellNow = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [makes, setMakes] = useState(null);
  // const [model, setModel] = useState(null);
  // const [version, setVersion] = useState(null);
  const [image, setImage] = useState([]);
  const [versionsData, setVersionsData] = useState(null);
  const [loader, setLoader] = useState(false);
  const [city, setCity] = useState(null);
  const [registrationYear, setRegistrationYear] = useState(null);
  const [modalYear, setModalYear] = useState(null);
  const [transmission, setTransmission] = useState(null);
  const [engineCC, setEngineCC] = useState(null);
  const [regStatus, setRegStatus] = useState(null);
  const [regPlace, setRegPlace] = useState(null);
  const [manufacturing, setManufacturing] = useState(null);
  const [model, setModel] = useState(null);
  const [version, setVersion] = useState(null);
  const [engine, setEngine] = useState(null);
  const [body, setBody] = useState(null);
  const [color, setColor] = useState(null);
  const [modelData, setModelData] = useState(null);
  const [permissionCheck, setPermissionCheck] = useState(null);
  const [price, setPrice] = useState(null);
  const {user} = useSelector(state => state.auth);
  const {
    RegPlaces,
    Cities,
    Error,
    carDetails,
    YourAds,
    Colors,
    make,
    models,
    engineType,
    bodyType,
    versions,
  } = useSelector(state => state.lisitng);
  const scrollRef = useRef();

  const dispatch = useDispatch();
  const takePhotoFromGallery = () => {
    if (permissionCheck) {
      ImagePicker.openPicker({
        multiple: true,
        width: 300,
        height: 400,
        mediaType: 'photo',
        // cropping: false,
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
        console.log(imagedata, 'imagedata');
        console.log(image, 'image array');
        if (image && image.length > 0)
          return setImage([...image, ...imagedata]);
        setImage(imagedata);
      });
    } else {
      Alert.alert(
        'Permissions were denied',
        'Allow App to Access Photos from settings',
      );
    }
  };

  useEffect(() => {
    checkPermissions(status => {
      setPermissionCheck(status);
    });
  }, []);
  useFocusEffect(
    useCallback(() => {
      if (!carDetails || carDetails?.length == 0) dispatch(getDetails('get'));
      if (!Cities || Cities?.length == 0) dispatch(getCities('get'));
      dispatch(getMakes('get', () => {}));
      if (!RegPlaces || RegPlaces?.length == 0)
        dispatch(getRegisteredPlaces('get'));
      dispatch(getEngineType('get'));
      dispatch(getBodyType('get'));
      return () => {
        dispatch(getMakes());
        dispatch(getBodyType());
        dispatch(getEngineType());
        dispatch(getCities());
        dispatch(getRegisteredPlaces());
        dispatch(getDetails());
        dispatch(getColors());
        dispatch(getVersions());
        dispatch(getModels());
      };
    }, []),
  );

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
  }, [models, versions, Colors]);

  const callback = val => {
    showLog('val', val);
    dispatch(showSnackBar({visible: true, text: val}));
  };
  const handleSubmit = () => {
    showLog('being hittt');
    if (
      makes &&
      model &&
      city &&
      regPlace &&
      image &&
      image.length > 0 &&
      price &&
      color &&
      engine &&
      body &&
      transmission &&
      engineCC &&
      regStatus
    ) {
      if (regStatus === 'Registered') {
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
        uploadCarAdd(
          {
            make: makes,
            version: version ? version : '',
            model: model,
            engine_type: engine,
            body_tupe: body,
            city: city,
            reg_place: regPlace,
            modal_year: modalYear ? modalYear : '',
            registration_year: registrationYear ? registrationYear : '',
            price: price,
            token: user?.token,
            image: image,
            color: color,
            engine_cc: engineCC,
            transmission: transmission,
            registration: regStatus,
            manufacturing: manufacturing,
          },
          response => {
            if (response.status == 'success') {
              dispatch(
                showSnackBar({visible: true, text: 'Ad Added Successfully'}),
              );
              dispatch(uploadCarAdd());
              dispatch(addListingError(null));
              setTimeout(() => {
                setLoader(false);

                navigation.dispatch(
                  CommonActions.reset({
                    routes: [{name: 'Home'}],
                  }),
                );
                navigation.navigate('YourAds', {filter: 'Pending Ads'});
              }, 1000);
            } else {
              showLog(Error, 'error');
              dispatch(showSnackBar({visible: true, text: Error}));
              setLoader(false);
              dispatch(addListingError(null));
            }
          },
        ),
      );
    } else {
      dispatch(
        showSnackBar({
          visible: true,
          text:
            image?.length == 0
              ? 'Image is required'
              : !makes &&
                !model &&
                !city &&
                !color &&
                !engine &&
                !body &&
                !regStatus &&
                !regPlace &&
                !price
              ? 'Please fill all required fields all'
              : !makes &&
                !model &&
                !city &&
                !color &&
                !engine &&
                !body &&
                !regPlace
              ? 'Please fill all required fields with image'
              : !model && !city && !color && !engine && !body
              ? 'Please fill all required fields '
              : !city && !color && !engine
              ? 'Please fill all required fields '
              : !color
              ? 'Please fill all required fields '
              : !engine
              ? 'Please fill all required fields '
              : !price
              ? 'Please fill all required fields'
              : !regPlace
              ? 'Please fill all required fields'
              : !regStatus
              ? 'Please fill all required fields'
              : !city
              ? 'Please fill all required fields'
              : !make
              ? 'Please fill all required fields'
              : !model
              ? 'Please fill all required fields'
              : !body && 'Please fill all required fields',
        }),
      );
      setLoader(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      showLog('here in sell now unfocus');
      setImage([]);
      setCity(null);
      setModel(null);
      setMakes(null);
      setVersion(null);
      setColor(null);
      setEngine(null);
      setBody(null);
      setRegPlace(null);
      setPrice(null);
      setVersionsData(null);
      setRegStatus(null);
      setRegistrationYear(null);
      setModalYear(null);
      setManufacturing(null);
      setEngineCC(null);
      setTransmission(null);
      dispatch(getColors());
      setModelData(null);
      dispatch(addFilters());
      dispatch(addFiltersParams(null));
      dispatch(addListingError(null));
      dispatch(uploadCarAdd());
      dispatch(editAd());
      scrollRef.current?.scrollTo({
        y: 0,
      });
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.sectionContainer}>
      <Header navigation={navigation} title="Sell Your Car" />
      <Container ref={scrollRef} enableKeyboard={true}>
        <View
          style={
            image && image.length > 0
              ? {...styles.viewImageSection}
              : {...styles.imageSection, alignSelf: 'center', marginTop: 20}
          }>
          <SliderBox
            ImageComponent={Image}
            dotColor={colors.primary}
            ImageComponentStyle={
              image && image.length > 0
                ? styles.imageSection
                : {alignSelf: 'center', width: '30%', height: '100%'}
            }
            inactiveDotColor={colors.inactiveTabs}
            images={
              image?.length > 0
                ? image
                : [require('../../assets/images/uploadImage.png')]
            }
            onCurrentImagePressed={takePhotoFromGallery}
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
            holder="Select Car's Make"
            data={make}
            handleValueChange={value => {
              const val = value?.replace(' ', '-');
              setMakes(val);
              dispatch(getVersions());
              dispatch(getColors());
              dispatch(getModels());
              setModel(null);
              setColor(null);
              setVersion(null);
              dispatch(getModels(val, callback, () => {}));
            }}
          />
          <Text style={[styles.font, styles.formFieldText]}>Model*</Text>
          <Selector
            value={model?.replace('-', ' ')}
            holder="Select Car's Model"
            data={modelData ? modelData : null}
            handleValueChange={value => {
              const val = value?.replace(' ', '-');
              setModel(val);
              dispatch(getVersions());
              dispatch(getColors());
              setVersion(null);
              setColor(null);
              dispatch(getVersions(makes, val, callback, () => {}));
              dispatch(getColors(makes, val, callback, () => {}));
            }}
          />
          <Text style={[styles.font, styles.formFieldText]}>Version</Text>
          <Selector
            value={version?.replace('-', ' ')}
            holder="Select Car's Version"
            data={versionsData ? versionsData : null}
            handleValueChange={value => {
              const val = value?.replace(' ', '-');
              setVersion(val);
            }}
          />
          <Text style={[styles.font, styles.formFieldText]}>Color*</Text>
          <Selector
            value={color}
            holder="Select Color"
            data={Colors}
            handleValueChange={val => setColor(val)}
          />
          <Text style={[styles.font, styles.formFieldText]}>Engine Type*</Text>
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
            dropHeight={100}
            value={regStatus}
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
            handleValueChange={val => setRegPlace(val)}
            value={regPlace}
          />
          {regStatus === 'Registered' && (
            <>
              <Text style={[styles.font, styles.formFieldText]}>
                Manufacturing*
              </Text>
              <Selector
                dropHeight={100}
                value={manufacturing}
                holder="Select Car's Manufacturing "
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
            holder={'Price'}
            handleTextChange={val => setPrice(val)}
            type="text"
            keyboardType="number-pad"
            value={price}
          />
        </View>
        <View style={styles.buttonSection}>
          <NormalButton
            onPress={() => {
              setLoader(true);
              handleSubmit();
            }}
            loader={loader}
            title={'Done'}
          />
        </View>
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
    marginTop: 18,
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
export default NetworkError(SellNow);
