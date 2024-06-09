import {Dimensions, Platform} from 'react-native';
import moment from 'moment';
import {
  PERMISSIONS,
  checkMultiple,
  requestMultiple,
} from 'react-native-permissions';

export const SCREEN_WIDTH = Dimensions.get('window').width;
export const SCREEN_HEIGHT = Dimensions.get('window').height;

export const showLog = (indication, message) => {
  if (__DEV__) {
    console.log(indication, message);
  }
};
export const measurmentsArray = [
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
export const priceFormatter = price => {
  var formatter = new Intl.NumberFormat('en-IN');
  if (price && price != '') {
    let val = price.split(',').join('');
    return formatter.format(val);
  } else {
    return formatter.format(0);
  }
};
export const updatedDate = date => {
  return moment(date).format('DD MMM, YYYY');
};

export const updatedDateNewFormat = date => {
  return moment(date).format('DD MMM, YYYY HH:mm A');
};

export const permission = () => {
  if (Platform.OS == 'android') {
    const askPermission = [
      PERMISSIONS.ANDROID.CAMERA,
      // PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
      // PERMISSIONS.ANDROID.POST_NOTIFICATIONS,
    ];
    // if (Platform.constants['Release'] != 13) {
    //   askPermission.push(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
    // }
    requestMultiple(askPermission).then(statuses => {
      showLog(statuses, 'statuses');
    });
  } else {
    requestMultiple([
      PERMISSIONS.IOS.CAMERA,
      PERMISSIONS.IOS.PHOTO_LIBRARY,
    ]).then(statuses => {
      // console.log('Camera', statuses[PERMISSIONS.IOS.CAMERA]);
      // console.log('PHOTO_LIBRARY', statuses[PERMISSIONS.IOS.PHOTO_LIBRARY]);
    });
  }
};
export const formatter = num => {
  return Math.abs(num) >= 10000000
    ? Math.sign(num) * (Math.abs(num) / 10000000).toFixed(1) + 'crore'
    : Math.abs(num) >= 100000
    ? Math.sign(num) * (Math.abs(num) / 100000).toFixed(1) + 'Lac'
    : priceFormatter(num);
};

export const checkPermissions = callback => {
  if (Platform.OS == 'ios') {
    checkMultiple([PERMISSIONS.IOS.CAMERA, PERMISSIONS.IOS.PHOTO_LIBRARY]).then(
      statuses => {
        if (
          statuses[PERMISSIONS.IOS.CAMERA] != 'granted' ||
          statuses[PERMISSIONS.IOS.PHOTO_LIBRARY] != 'granted'
        ) {
          return callback(false);
        }
        return callback(true);
      },
    );
  } else {
    checkMultiple([
      PERMISSIONS.ANDROID.CAMERA,
      PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
      PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
    ]).then(statuses => {
      if (statuses[PERMISSIONS.ANDROID.READ_MEDIA_IMAGES] == 'unavailable') {
        if (
          statuses[PERMISSIONS.ANDROID.CAMERA] != 'granted' ||
          statuses[PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE] != 'granted'
        ) {
          return callback(false);
        }
        return callback(true);
      } else {
        if (
          statuses[PERMISSIONS.ANDROID.CAMERA] != 'granted' ||
          statuses[PERMISSIONS.ANDROID.READ_MEDIA_IMAGES] != 'granted'
        ) {
          return callback(false);
        }
        return callback(true);
      }
    });
  }
};

export const Specialities = [
  {name: 'Select Speciality', short_code: 'none'},
  {name: 'Nursing Care', short_code: 'NC'},
  {name: 'Elderly Care', short_code: 'EC'},
  {name: 'Pediatric Care', short_code: 'PC'},
  {name: 'Postoperative Care', short_code: 'POC'},
  {name: 'Palliative Care', short_code: 'PLC'},
  {name: 'Home Health Aid', short_code: 'HHA'},
  {name: 'Physical Therapy', short_code: 'PT'},
  {name: 'Occupational Therapy', short_code: 'OT'},
  {name: 'Speech Therapy', short_code: 'ST'},
  {name: 'Mental Health Care', short_code: 'MHC'},
  {name: 'Respiratory Therapy', short_code: 'RTC'},
  {name: 'Diabetic Care', short_code: 'DC'},
  {name: 'Cardiac Care', short_code: 'CC'},
  {name: 'Wound Care', short_code: 'WC'},
  {name: 'Chronic Disease Management', short_code: 'CDM'},
  {name: 'Rehabilitation Services', short_code: 'RS'},
  {name: "Alzheimer's/Dementia Care", short_code: 'ADC'},
  {name: 'Cancer Care', short_code: 'CCa'},
  {name: 'Orthopedic Care', short_code: 'OC'},
  {name: 'Neurological Care', short_code: 'NCa'},
  {name: 'Nutritional Counseling', short_code: 'NCou'},
  {name: 'In-Home Hospice Care', short_code: 'IHHC'},
  {name: 'Pain Management', short_code: 'PM'},
  {name: 'Stroke Rehabilitation', short_code: 'SR'},
  {name: 'Fall Prevention', short_code: 'FP'},
  {name: 'Medication Management', short_code: 'MM'},
  {name: 'Dietary Planning', short_code: 'DP'},
  {name: 'Mobility Assistance', short_code: 'MA'},
  {name: 'Personal Hygiene Assistance', short_code: 'PHA'},
  {name: 'Other', short_code: 'other'},
];

export const Diseases = [
  {name: 'Select Disease', short_code: 'none'},
  {name: 'Diabetes', short_code: 'DM'},
  {name: 'Heart Disease', short_code: 'HD'},
  {name: 'Cancer', short_code: 'CA'},
  {name: "Alzheimer's Disease", short_code: 'AD'},
  {name: 'Stroke', short_code: 'ST'},
  {name: 'Arthritis', short_code: 'AR'},
  {name: 'Asthma', short_code: 'AS'},
  {name: 'Depression', short_code: 'DP'},
  {name: 'Obesity', short_code: 'OB'},
  {name: "Parkinson's Disease", short_code: 'PD'},
  {name: 'Hypertension (High Blood Pressure)', short_code: 'HT'},
  {name: 'Chronic Obstructive Pulmonary Disease (COPD)', short_code: 'COPD'},
  {name: 'Osteoporosis', short_code: 'OP'},
  {name: 'Chronic Kidney Disease', short_code: 'CKD'},
  {name: 'HIV/AIDS', short_code: 'HIV'},
  {name: 'Epilepsy', short_code: 'EP'},
  {name: 'Multiple Sclerosis', short_code: 'MS'},
  {name: 'Rheumatoid Arthritis', short_code: 'RA'},
  {name: 'Eating Disorders', short_code: 'ED'},
  {name: 'Sleep Apnea', short_code: 'SA'},
  {name: 'Other', short_code: 'other'},
];
