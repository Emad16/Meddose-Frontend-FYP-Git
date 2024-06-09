import React, {useEffect, useState, useRef} from 'react';
import {StyleSheet, Platform, Linking, LogBox, AppState} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Welcome from '../screens/Welcome';
import Login from '../screens/Login';
import Signup from '../screens/Signup';
import {
  NavigationContainer,
  createNavigationContainerRef,
} from '@react-navigation/native';
import Home from '../screens/Home';
import RequestList from '../screens/Request';
import {useDispatch, useSelector} from 'react-redux';
import {addLink, setUserData} from '../core/redux/actions/auth';
import Forgot from '../screens/ForgotPassword';
import ForgotPassConfirm from '../screens/ForgotPasswordConfirm';
import {fonts} from '../utils/theme/fonts';
import OneSignal from 'react-native-onesignal';
import {ONESIGNAL_APP_ID} from '@env';
import {showLog} from '../utils/Methods';
import {colors} from '../utils/theme/colors';
import MyCaretaker from '../screens/Details';
import Details from '../screens/Details';
import MyPatients from '../screens/MyPatients';
import Blogs from '../screens/Blogs';
import BlogDetails from '../screens/BlogDetails';
import AddMedication from '../screens/AddMedication';
import Schedule from '../screens/Schedule';
import ViewSchedule from '../screens/ViewSchedule';
import FindPatientOrCaretaker from '../screens/FindPatientOrCaretaker';
import Tharapist from '../screens/Tharapist';
import EachTharapist from '../screens/EachTharapist';
import AddMood from '../screens/AddMood';
import MoodHistory from '../screens/MoodHistory';
import YourPatientsMoods from '../screens/YourPatientsMoods';
import PatientsRequests from '../screens/PatientsRequests';
import ChatList from '../screens/Chat/ChatList';
import Chat from '../screens/Chat/Chat';
import ShowPatientsMedication from '../screens/ShowPatientsMedication';
import MedicationHistory from '../screens/MedicationHistory';
const Stack = createNativeStackNavigator();
const patientStack = status => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={'Home'}>
      <Stack.Screen
        name="Home"
        options={{
          headerShown: false,
          presentation: Platform.OS == 'ios' ? '' : 'modal',
          animationTypeForReplace: 'push',
          animation: 'slide_from_right',
        }}
        component={Home}
      />
      <Stack.Screen
        name="find"
        options={{
          headerShown: false,
          presentation: Platform.OS == 'ios' ? '' : 'modal',
          animationTypeForReplace: 'push',
          animation: 'slide_from_right',
        }}
        component={FindPatientOrCaretaker}
      />
      <Stack.Screen
        name="RequestList"
        options={{
          headerShown: false,
          presentation: Platform.OS == 'ios' ? '' : 'modal',
          animationTypeForReplace: 'push',
          animation: 'slide_from_right',
        }}
        component={PatientsRequests}
      />
      <Stack.Screen
        name="Details"
        options={{
          headerShown: false,
          presentation: Platform.OS == 'ios' ? '' : 'modal',
          animationTypeForReplace: 'push',
          animation: 'slide_from_right',
        }}
        component={Details}
      />
      <Stack.Screen
        name="Blogs"
        options={{
          headerShown: false,
          presentation: Platform.OS == 'ios' ? '' : 'modal',
          animationTypeForReplace: 'push',
          animation: 'slide_from_right',
        }}
        component={Blogs}
      />
      <Stack.Screen
        name="BlogDetails"
        options={{
          headerShown: false,
          presentation: Platform.OS == 'ios' ? '' : 'modal',
          animationTypeForReplace: 'push',
          animation: 'slide_from_right',
        }}
        component={BlogDetails}
      />
      <Stack.Screen
        name="AddMedication"
        options={{
          headerShown: false,
          presentation: Platform.OS == 'ios' ? '' : 'modal',
          animationTypeForReplace: 'push',
          animation: 'slide_from_right',
        }}
        component={AddMedication}
      />
      <Stack.Screen
        name="AddMood"
        options={{
          headerShown: false,
          presentation: Platform.OS == 'ios' ? '' : 'modal',
          animationTypeForReplace: 'push',
          animation: 'slide_from_right',
        }}
        component={AddMood}
      />
      <Stack.Screen
        name="MoodHistory"
        options={{
          headerShown: false,
          presentation: Platform.OS == 'ios' ? '' : 'modal',
          animationTypeForReplace: 'push',
          animation: 'slide_from_right',
        }}
        component={MoodHistory}
      />
      <Stack.Screen
        name="MedicationHistory"
        options={{
          headerShown: false,
          presentation: Platform.OS == 'ios' ? '' : 'modal',
          animationTypeForReplace: 'push',
          animation: 'slide_from_right',
        }}
        component={MedicationHistory}
      />
      <Stack.Screen
        name="Schedule"
        options={{
          headerShown: false,
          presentation: Platform.OS == 'ios' ? '' : 'modal',
          animationTypeForReplace: 'push',
          animation: 'slide_from_right',
        }}
        component={Schedule}
      />
      <Stack.Screen
        name="ViewSchedule"
        options={{
          headerShown: false,
          presentation: Platform.OS == 'ios' ? '' : 'modal',
          animationTypeForReplace: 'push',
          animation: 'slide_from_right',
        }}
        component={ViewSchedule}
      />
      <Stack.Screen
        name="tharapist"
        options={{
          headerShown: false,
          presentation: Platform.OS == 'ios' ? '' : 'modal',
          animationTypeForReplace: 'push',
          animation: 'slide_from_right',
        }}
        component={Tharapist}
      />
      <Stack.Screen
        name="eachtharapist"
        options={{
          headerShown: false,
          presentation: Platform.OS == 'ios' ? '' : 'modal',
          animationTypeForReplace: 'push',
          animation: 'slide_from_right',
        }}
        component={EachTharapist}
      />
      <Stack.Screen
        name="chatlist"
        options={{
          headerShown: false,
          presentation: Platform.OS == 'ios' ? '' : 'modal',
          animationTypeForReplace: 'push',
          animation: 'slide_from_right',
        }}
        component={ChatList}
      />
      <Stack.Screen
        name="chat"
        options={{
          headerShown: false,
          presentation: Platform.OS == 'ios' ? '' : 'modal',
          animationTypeForReplace: 'push',
          animation: 'slide_from_right',
        }}
        component={Chat}
      />
    </Stack.Navigator>
  );
};

const caretakerStack = status => {
  console.log(status, 'status');
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={'Home'}>
      <Stack.Screen
        name="Home"
        options={{
          headerShown: false,
          presentation: Platform.OS == 'ios' ? '' : 'modal',
          animationTypeForReplace: 'push',
          animation: 'slide_from_right',
        }}
        component={Home}
      />
      <Stack.Screen
        name="find"
        options={{
          headerShown: false,
          presentation: Platform.OS == 'ios' ? '' : 'modal',
          animationTypeForReplace: 'push',
          animation: 'slide_from_right',
        }}
        component={FindPatientOrCaretaker}
      />
      <Stack.Screen
        name="RequestList"
        options={{
          headerShown: false,
          presentation: Platform.OS == 'ios' ? '' : 'modal',
          animationTypeForReplace: 'push',
          animation: 'slide_from_right',
        }}
        component={RequestList}
      />
      <Stack.Screen
        name="MyPatient"
        options={{
          headerShown: false,
          presentation: Platform.OS == 'ios' ? '' : 'modal',
          animationTypeForReplace: 'push',
          animation: 'slide_from_right',
        }}
        component={MyPatients}
      />
      <Stack.Screen
        name="Details"
        options={{
          headerShown: false,
          presentation: Platform.OS == 'ios' ? '' : 'modal',
          animationTypeForReplace: 'push',
          animation: 'slide_from_right',
        }}
        component={Details}
      />
      <Stack.Screen
        name="Blogs"
        options={{
          headerShown: false,
          presentation: Platform.OS == 'ios' ? '' : 'modal',
          animationTypeForReplace: 'push',
          animation: 'slide_from_right',
        }}
        component={Blogs}
      />
      <Stack.Screen
        name="BlogDetails"
        options={{
          headerShown: false,
          presentation: Platform.OS == 'ios' ? '' : 'modal',
          animationTypeForReplace: 'push',
          animation: 'slide_from_right',
        }}
        component={BlogDetails}
      />
      <Stack.Screen
        name="PatientsMedication"
        options={{
          headerShown: false,
          presentation: Platform.OS == 'ios' ? '' : 'modal',
          animationTypeForReplace: 'push',
          animation: 'slide_from_right',
        }}
        component={ShowPatientsMedication}
      />
      <Stack.Screen
        name="Schedule"
        options={{
          headerShown: false,
          presentation: Platform.OS == 'ios' ? '' : 'modal',
          animationTypeForReplace: 'push',
          animation: 'slide_from_right',
        }}
        component={Schedule}
      />
      <Stack.Screen
        name="PatientsMood"
        options={{
          headerShown: false,
          presentation: Platform.OS == 'ios' ? '' : 'modal',
          animationTypeForReplace: 'push',
          animation: 'slide_from_right',
        }}
        component={YourPatientsMoods}
      />
      <Stack.Screen
        name="tharapist"
        options={{
          headerShown: false,
          presentation: Platform.OS == 'ios' ? '' : 'modal',
          animationTypeForReplace: 'push',
          animation: 'slide_from_right',
        }}
        component={Tharapist}
      />
      <Stack.Screen
        name="eachtharapist"
        options={{
          headerShown: false,
          presentation: Platform.OS == 'ios' ? '' : 'modal',
          animationTypeForReplace: 'push',
          animation: 'slide_from_right',
        }}
        component={EachTharapist}
      />
      <Stack.Screen
        name="chatlist"
        options={{
          headerShown: false,
          presentation: Platform.OS == 'ios' ? '' : 'modal',
          animationTypeForReplace: 'push',
          animation: 'slide_from_right',
        }}
        component={ChatList}
      />
      <Stack.Screen
        name="chat"
        options={{
          headerShown: false,
          presentation: Platform.OS == 'ios' ? '' : 'modal',
          animationTypeForReplace: 'push',
          animation: 'slide_from_right',
        }}
        component={Chat}
      />
    </Stack.Navigator>
  );
};

const MyStack = status => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={'Welcome'}>
      <Stack.Screen
        name="Welcome"
        options={{
          headerShown: false,
          presentation: Platform.OS == 'ios' ? '' : 'modal',
          animationTypeForReplace: 'push',
          animation: 'slide_from_right',
        }}
        component={Welcome}
      />

      <Stack.Screen
        name="Forgot"
        options={{
          headerShown: false,
          presentation: Platform.OS == 'ios' ? '' : 'modal',
          animationTypeForReplace: 'push',
          animation: 'slide_from_right',
        }}
        component={Forgot}
      />
      <Stack.Screen
        name="ForgotPassConfirm"
        options={{
          headerShown: false,
          presentation: Platform.OS == 'ios' ? '' : 'modal',
          animationTypeForReplace: 'push',
          animation: 'slide_from_right',
        }}
        component={ForgotPassConfirm}
      />
      <Stack.Screen
        name="Signup"
        options={{
          headerShown: false,
          presentation: Platform.OS == 'ios' ? '' : 'modal',
          animationTypeForReplace: 'push',
          animation: 'slide_from_right',
        }}
        component={Signup}
      />
      <Stack.Screen
        name="Login"
        options={{
          headerShown: false,
          presentation: Platform.OS == 'ios' ? '' : 'modal',
          animationTypeForReplace: 'push',
          animation: 'slide_from_right',
        }}
        component={Login}
      />
    </Stack.Navigator>
  );
};

const RootNavigator = () => {
  const {user, userData} = useSelector(state => state.auth);
  const [check, setcheck] = useState(false);
  const dispatch = useDispatch();
  const navigationRef = createNavigationContainerRef();
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  LogBox.ignoreAllLogs(); //Ignore all log notifications

  useEffect(() => {}, [user, userData]);
  useEffect(() => {
    const linkingEvent = Linking.addEventListener('url', handleOpenURL);
    Linking.getInitialURL().then(url => {
      showLog(url, 'is it running');
      navigateHandler(url);
    });
    if (Platform.OS === 'ios') {
      Linking.addEventListener('url', handleOpenURL);
    }
    return () => {
      // dispatch(addLink(null));
      if (Platform.OS === 'ios') {
        Linking.removeEventListener('url', handleOpenURL);
        linkingEvent.remove();
      }
    };
  }, []);
  const handleOpenURL = event => {
    navigateHandler(event.url);
  };
  const navigateHandler = async url => {
    if (url) {
      const route = url.replace(/.*?:\/\//g, '');
      const detailArray = route
        .match(/[A-Za-z0-9]+=[0-9]+\/[A-Za-z0-9]+=[0-9]+/i)[0]
        .split('/');
      showLog(
        detailArray[0].slice(detailArray[0].indexOf('=') + 1),
        "detailArray[0].slice(detailArray[0].indexOf('=') + 1)",
      );
      dispatch(
        addLink({
          id: detailArray[0].slice(detailArray[0].indexOf('=') + 1),
          author: detailArray[1].slice(detailArray[1].indexOf('=') + 1),
        }),
      );
    }
    showLog('running share thing?');
    setcheck(true);
  };
  const MyTheme = {
    colors: {
      background: colors.white,
    },
  };

  // OneSignal Initialization
  OneSignal.setAppId(ONESIGNAL_APP_ID);

  const handleNotification = ({notification, isOpen}) => {
    if (notification?.notification?.title == 'Activated') {
      if (user) {
        showLog('HERE IN ACTIVE');
        dispatch(setUserData(user.id, user.token));
      }
    } else if (notification?.notification?.title == 'Deactivated') {
      if (user) {
        showLog('HERE IN DEACTIVE');
        dispatch(setUserData(user.id, user.token));
      }
    } else if (navigationRef.isReady() && isOpen) {
      navigationRef.navigate('DetailPage', {
        id: notification.notification.additionalData.post_id,
        author: notification.notification.additionalData.author_id,
      });
    }
  };
  useEffect(() => {
    //Method for handling notifications received while app in foreground
    OneSignal.setNotificationWillShowInForegroundHandler(
      notificationReceivedEvent => {
        console.log(
          'OneSignal: notification will show in foreground:',
          notificationReceivedEvent,
        );
        let notification = notificationReceivedEvent.getNotification();
        console.log('notification: ', notification);
        const data = notification.additionalData;
        console.log('additionalData: ', data);
        handleNotification(notification);
        // Complete with null means don't show a notification.
        notificationReceivedEvent.complete({notification, isOpen: false});
      },
    );

    //Method for handling notifications opened
    OneSignal.setNotificationOpenedHandler(notification => {
      console.log('OneSignal: notification opened:', notification);
      console.log(
        notification.notification.additionalData,
        'notification.notification.additionalData',
      );
      handleNotification({notification, isOpen: true});
    });

    return () => {};
  }, [navigationRef]);

  console.log(userData, 'userData');
  console.log(user, 'user');
  return (
    <NavigationContainer sref={navigationRef} theme={MyTheme}>
      {user
        ? user.userType == 'patient'
          ? patientStack('logoutTrue')
          : caretakerStack('logoutTrue')
        : MyStack()}
      {/* {userData && userData != 'logoutTrue'
        ? userData?.phone == ''
          ? check && IncompleteProfile()
          : check && NestedStack(userData)
        : check && MyStack()} */}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  BottomView: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  text: {
    fontFamily: fonts.Montserrat_Medium,
    fontSize: 11,
    lineHeight: 20,
    alignSelf: 'center',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginBottom: 15,
    marginTop: -15,
  },
  logout: {
    fontFamily: fonts.Montserrat_Medium,
    fontSize: 11,
    lineHeight: 20,
    alignSelf: 'center',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginBottom: 15,
    marginTop: -18,
  },
});

export default RootNavigator;
