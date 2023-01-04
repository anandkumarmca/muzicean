import DeviceInfo from 'react-native-device-info';
import {Appearance, PermissionsAndroid} from 'react-native';
import * as RNFS from 'react-native-fs';

export const SERVER = 'https://muziclub.com/training/music/';
export const DEVICE_ID = DeviceInfo.getUniqueId();

/**
 * List of API
 */
export const API = {
  login: SERVER + 'api/login.json',
};

//DocumentDirectoryPath
export const documentPath = RNFS.DocumentDirectoryPath + '/background/';

/**
 * Get the listing for
 */
RNFS.exists(documentPath).then(isDir => {
  if (!isDir) {
    RNFS.mkdir(documentPath);
  }
});

/**
 * Return token provided by server
 */
export const TOKEN = () => {
  //return 'dummy';
  //return global.store.getState().LoginReducer.userinfo.token;
  if (global.serverToken) {
    return global.serverToken;
  } else {
    return '';
  }
};

/**
 * Property
 */

export const PROPERTY = {
  splashLogo: 0,
  backgroundImage:
    Appearance.getColorScheme() === 'dark'
      ? require('../Assets/dark.jpg')
      : require('../Assets/light.jpg'),
  screenBackground:
    Appearance.getColorScheme() === 'dark' ? '#3A405A' : '#E60018',
  background: Appearance.getColorScheme() === 'dark' ? '#1F2533' : '#FFFFFF',

  fontColor: Appearance.getColorScheme() === 'dark' ? '#E8E8E9' : '#1F2533',
  darkFontColor: Appearance.getColorScheme() === 'dark' ? '#000000' : '#3A405A',

  innerColorBackground:
    Appearance.getColorScheme() === 'dark' ? '#1F2533' : '#FFFFFF',

  lightButtonBackground:
    Appearance.getColorScheme() === 'dark' ? '#AEC5EB' : '#F2F2F2',
  darkButtonBackground:
    Appearance.getColorScheme() === 'dark' ? '#E60018' : '#3A405A',

  lightBlueBackground: '#AEc5EB',
  darkBlueBackground: '#3A405A',

  lightGreen: '#C5E6A6',
  green: '#089000',

  red: '#E60018',
  lightRed: '#E9AFA3',

  // Code[Nikhil-Timade-02-03-22]
  headerColorBackground:
    Appearance.getColorScheme() === 'dark' ? '#1F2533' : '#FFFFFF',
  calendarHeaderBackground:
    Appearance.getColorScheme() === 'dark' ? '#333545' : '#E8E8E9',
  calendarHeaderBorderColor:
    Appearance.getColorScheme() === 'dark' ? '#333545' : '#E8E8E9',
  scrollDateColor:
    Appearance.getColorScheme() === 'dark' ? '#FFFFFF' : '#1F2533',
  buttonColor: Appearance.getColorScheme() === 'dark' ? '#003FFF' : '#003FFF',
  greenColor: Appearance.getColorScheme() === 'dark' ? '#336445' : '#CEF8D6',
  redColor: Appearance.getColorScheme() === 'dark' ? '#643545' : '#F7D9C8',
  bwColor: Appearance.getColorScheme() === 'dark' ? '#333545' : '#E8E8E9',
  selectedColor: Appearance.getColorScheme() === 'dark' ? '#E8E8E9' : '#1F2533',
  selectedColorText:
    Appearance.getColorScheme() === 'dark' ? '#333545' : '#FFFFFF',
  overdueColor: Appearance.getColorScheme() === 'dark' ? '#E08B8B' : '#D70706',
  noDataFound:
    Appearance.getColorScheme() === 'dark'
      ? require('../Assets/icons/notFound_w.png')
      : require('../Assets/icons/notFound_b.png'),
  fabImage:
    Appearance.getColorScheme() === 'dark'
      ? require('../Assets/icons/fabdark.png')
      : require('../Assets/icons/fablight.png'),

  // End

  menuTitle: {
    light: Appearance.getColorScheme() === 'dark' ? '#F2F2F2' : '#F2F2F2',
  },
};

export const REQUEST_HEADER = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

export const UPLOAD = (url, data) => {
  //data.append('deviceid', DEVICE_ID);
  // data.append('token', TOKEN());

  console.info(url, data);

  let $return = fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
    },
    body: data,
  })
    .then(response => {
      try {
        return response.json();
      } catch (err) {
        console.log(response.text());
        console.log(err);
        return {};
      }
    })
    .catch(error => {
      console.log(error);
    });
  return $return;
};

export const POST = (url, data) => {
  if (!data) {
    data = {};
  }

  data.deviceid = DEVICE_ID;
  data.token = TOKEN();
  console.log('Token : ' + data.token);
  console.info(url, data);

  let $return = fetch(url, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: REQUEST_HEADER,
  })
    .then(response => {
      try {
        return response.json();
      } catch (err) {
        return {};
      }
    })
    .catch(error => {
      console.log(error);
    });
  return $return;
};

export const GET = (url, data) => {
  if (!data) {
    data = {};
  }
  data.deviceid = DEVICE_ID;
  data.token = TOKEN();

  let $return = fetch(url, {
    method: 'GET',
    body: JSON.stringify(data),
    headers: REQUEST_HEADER,
  })
    .then(response => {
      return response.json();
    })
    .catch(error => {
      console.log(error);
    });

  return $return;
};

export const PUT = (url, data) => {
  data.deviceid = DEVICE_ID;
  data.token = TOKEN();
  let $return = fetch(url, {
    method: 'PUT',
    body: JSON.stringify(data),
    headers: REQUEST_HEADER,
  })
    .then(response => {
      return response.json();
    })
    .catch(error => {
      console.log(error);
    });
  return $return;
};

export const DELETE = (url, data) => {
  data.deviceid = DEVICE_ID;
  data.token = TOKEN();
  let $return = fetch(url, {
    method: 'DELETE',
    body: JSON.stringify(data),
    headers: REQUEST_HEADER,
  })
    .then(response => {
      return response.json();
    })
    .catch(error => {
      console.log(error);
    });
  return $return;
};
