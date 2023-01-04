import React from 'react';
import {
  SafeAreaView,
  ImageBackground,
  View,
  Image,
  ActivityIndicator,
  ScrollView,
  Text,
  PermissionsAndroid,
  Appearance,
} from 'react-native';
import {Dimensions} from 'react-native';
import {connect} from 'react-redux';
import * as RNFS from 'react-native-fs';
import {Dirs, FileSystem} from 'react-native-file-access';

import {TextInput, Button} from 'react-native-paper';

import NetInfo from '@react-native-community/netinfo';
import LoginReducer from '../Redux/Reducer/Login';

import {PROPERTY, POST, SERVER, documentPath} from '../Common/Settings';
import {STYLES, height} from '../Common/Style';
import SQLite from '../Common/SQLite';

class SplashScreen extends React.Component {
  options = {};
  width = Dimensions.get('window').width;
  backgroundImage = PROPERTY.backgroundImage;
  _sql = null;

  constructor(props) {
    super(props);
    this.state = {
      message: 'Verifying your phone...',
      clicked: false,
      error: '',
      backgroundImage: PROPERTY.backgroundImage,
    };
    // this._sql = new SQLite()
    this.loginForm = this.loginForm.bind(this);
  }

  // Navigate to login form
  loginForm() {
    this.setState({message: 'Configuration done.'});
    setTimeout(() => {
      this.props.navigation.reset({
        index: 0,
        routes: [{name: 'Login'}],
      });

      // this.props.navigation.navigate('Login');
    }, 3000);
  }

  async checkPermission() {
    granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
    );
    granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    );

    let avaliable = await RNFS.exists(
      documentPath + Appearance.getColorScheme() + '.jpg',
    );

    if (avaliable) {
      this.backgroundImage = {
        uri: 'file://' + documentPath + Appearance.getColorScheme() + '.jpg',
      };
    }

    global.cacheData = {};
    if (await RNFS.exists(documentPath + 'download.json')) {
      try {
        let contain = await RNFS.readFile(documentPath + 'download.json');
        global.cacheData = JSON.parse(contain);
      } catch (err) {}
    }
    this.setState({
      message: 'Verifying cache folder ..',
      backgroundImage: this.backgroundImage,
    });
  }

  componentDidMount() {
    console.log(global.userinfo);
    this.checkPermission();

    //let _sql = new sql.SQLite();
    POST(SERVER + 'background.json', {}).then(response => {
      if (
        typeof response != 'undefined' &&
        global != undefined &&
        global.cacheData != undefined &&
        global.cacheData.id !== response.id
      ) {
        this.setState({message: 'Importing setting from server...'});
        RNFS.unlink(documentPath + 'dark.jpg')
          .then(() => {})
          .catch(err => {
            console.log(err);
          });
        RNFS.unlink(documentPath + 'light.jpg')
          .then(() => {})
          .catch(err => {
            console.log(err);
          });

        setTimeout(() => {
          RNFS.downloadFile({
            fromUrl: response.light,
            toFile: documentPath + 'light.jpg',
          }).promise.then(r => {
            setTimeout(() => {
              RNFS.downloadFile({
                fromUrl: response.dark,
                toFile: documentPath + 'dark.jpg',
              }).promise.then(r => {
                this.checkPermission();
              });
            }, 50);
          });
        }, 50);

        RNFS.writeFile(
          documentPath + 'download.json',
          JSON.stringify(response),
          'utf8',
        )
          .then(success => {
            this.setState({message: 'Cache download done...'});
            this.loginForm();
          })
          .catch(err => {
            console.log(err.message);
          });
      } else {
        this.loginForm();
      }
    });
  }

  /**
   * called to display page
   * @returns
   */
  render() {
    return (
      <ImageBackground source={this.state.backgroundImage} resizeMode="cover">
        <SafeAreaView style={{height: '100%'}}>
          <ScrollView>
            <View
              contentInsetAdjustmentBehavior="automatic"
              style={{height: '100%'}}>
              {PROPERTY.splashLogo == 1 && (
                <Image
                  source={require('../Assets/logo.png')}
                  style={{
                    width: this.width * 0.25,
                    height: this.width * 0.25,
                    resizeMode: 'cover',
                  }}
                />
              )}
              <ActivityIndicator
                size="large"
                color="#ffffff"
                style={{paddingTop: height * 0.75}}
              />
              <Text
                style={{
                  ...STYLES.fontNormal,
                  padding: 20,
                  width: '100%',
                  textAlign: 'center',
                  color: PROPERTY.fontColor,
                }}>
                {this.state.message}
              </Text>
            </View>
          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
    );
  }
}

const mapstate = state => {
  return {
    login: LoginReducer,
  };
};

export default connect(mapstate)(SplashScreen);
