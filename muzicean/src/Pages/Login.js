import React from 'react';
import {
  TouchableOpacity,
  View,
  Image,
  Text,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  ActivityIndicator,
} from 'react-native';
import {connect} from 'react-redux';
import {
  Button,
  Modal,
  TextInput,
  Divider,
  RadioButton,
} from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import LoginReducer from '../Redux/Reducer/Login';
import {PROPERTY, POST, SERVER} from '../Common/Settings';
import {height, width, STYLES} from '../Common/Style';
import AsyncStorage from '@react-native-async-storage/async-storage';
import base64 from 'react-native-base64';

const styles = StyleSheet.create({
  brandViewLogo: {
    width: 50,
    height: 50,
    resizeMode: 'cover',
    marginTop: '10%',
  },
  brandViewText: {
    color: '#3A405A',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    fontSize: 24,
    marginTop: '2%',
    marginLeft: '-1%',
  },
  input: {
    borderColor: 'gray',
    width: '100%',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },
});

class LoginScreen extends React.Component {
  form = {
    username: '',
    password: '',
  };

  pageContent = [
    {
      type: 'image',
      content:
        'https://i0.wp.com/muziclub.com/wp-content/uploads/2020/06/Muziclub-Feature.jpeg?fit=1280%2C640&ssl=1',
    },
    {type: 'header', content: 'Online Music Classes with Qualified Teachers'},
    {
      type: 'text',
      content:
        'We provide online music classes from a team of qualified and experienced faculty artists through one-on-one web sessions using Skype and other video conference solutions. These classes are available across the globe at a time of your convenience. We coordinate online classes in Crodyon, London and rest of UK through our local presence in Croydon.',
    },
    {
      type: 'list',
      content: [
        {
          image:
            'https://i1.wp.com/muziclub.com/wp-content/uploads/2017/06/Guitar-3.jpg?resize=300%2C300&ssl=1',
          text: 'Guitar',
        },
        {
          image:
            'https://i1.wp.com/muziclub.com/wp-content/uploads/2017/06/Drums.jpg?resize=300%2C300&ssl=1',
          text: 'Drums',
        },
        {
          image:
            'https://i1.wp.com/muziclub.com/wp-content/uploads/2017/06/Keyboards.jpg?resize=300%2C300&ssl=1',
          text: 'Keyboard',
        },
      ],
    },
  ];

  constructor(props) {
    super(props);
    this.state = {
      message: 'Verifying your phone...',
      clicked: false,
      error: {
        username: false,
        password: false,
        server: false,
      },
      login: false,
      loading: false,
      formData: {
        username: '',
        password: '',
        type: 'faculty',
      },
    };

    this.loginPressed = this.loginPressed.bind(this);
    this.hideLogin = this.hideLogin.bind(this);
    this.setType = this.setType.bind(this);
    this.login = this.login.bind(this);
  }

  componentDidMount() {
    this.TokenExpiryCheck();
  }

  TokenExpiryCheck = async () => {
    try {
      // corect token
      var stoken = await AsyncStorage.getItem('serverToken');

      POST(SERVER + 'users/CorrectToken.json', {}).then(response => {
        if (
          response == undefined ||
          response == null ||
          response.token == null
        ) {
          console.log('No token' + response);
        } else {
          if (stoken != response.token) {
            console.log('false token');
            AsyncStorage.setItem('userinfo', '');
            AsyncStorage.setItem('serverToken', '');
          }
        }
      });

      //end
      stoken = await AsyncStorage.getItem('serverToken');
      if (stoken != '') {
        let tokenexpire = base64.decode(base64.decode(stoken));
        tokenexpire = tokenexpire.split('-');
        let millisecondsToSubtract = 1440 * 60 * 1000;

        let checktime = new Date().getTime() - millisecondsToSubtract;
        checktime = checktime / 1000;
        if (tokenexpire[1] < checktime) {
          console.log('if block');
          console.log('false' + tokenexpire[1]);
          AsyncStorage.setItem('userinfo', '');
          AsyncStorage.setItem('serverToken', '');
        } else {
          console.log('trueeee' + tokenexpire[1]);
          this.Loggedinuser();
        }
      }
    } catch (err) {
      //console.log(err);
    }
  };
  Loggedinuser = async () => {
    try {
      let getuser = await AsyncStorage.getItem('userinfo');
      let uinfo = JSON.parse(getuser);
      let stoken = await AsyncStorage.getItem('serverToken');

      if (stoken != '' && uinfo != '') {
        global.userinfo = uinfo;
        global.serverToken = stoken;

        if (uinfo.photo != '') {
          global.userinfo.photo = SERVER + 'upload/' + uinfo.photo;
        }
        // LoggedIn user
        this.props.navigation.reset({
          index: 0,
          routes: [{name: 'Faculty'}],
        });
      }
    } catch (error) {}
  };

  login() {
    let error = {
      username: false,
      password: false,
      server: false,
    };
    let errorData = false;
    // Verify user details
    if (this.form.username.state.value.length < 5) {
      errorData = true;
      error.username = true;
    }
    if (this.form.password.state.value.length < 3) {
      errorData = true;
      error.password = true;
    }

    if (errorData === false) {
      // Making conntection to PI serer
      this.setState({error: error, loading: true});
      POST(SERVER + 'login.json', {
        username: this.form.username.state.value,
        password: this.form.password.state.value,
      }).then(response => {
        this.setState({loading: false});
        if (response.error) {
          error.server = true;
          this.setState({error: error});
        } else {
          global.userinfo = response.user;
          console.log(response.user);
          AsyncStorage.setItem('userinfo', JSON.stringify(global.userinfo));
          global.serverToken = response.token;
          AsyncStorage.setItem('serverToken', response.token);
          if (response.user.photo != '') {
            global.userinfo.photo = SERVER + 'upload/' + response.user.photo;
          }
          // Login was successfully and we can move forwars
          this.props.navigation.reset({
            index: 0,
            routes: [{name: 'Faculty'}],
          });
        }
      });
    } else {
      this.setState({error: error});
    }
  }

  loginPressed = () => {
    this.setState({login: true});
  };

  hideLogin() {
    this.setState({login: false});
  }

  setType(value) {
    let formdata = this.state.formData;
    formdata.type = value;
    this.setState({formData: formdata});
  }

  /**
   * called to display page
   * @returns
   */
  render() {
    return (
      // container start
      <KeyboardAvoidingView
        behavior="position"
        contentContainerStyle={{height: height}}>
        <View
          style={{flex: 1, backgroundColor: PROPERTY.screenBackground}}
          showsVerticalScrollIndicator={false}>
          <Animatable.View
            animation="fadeInUpBig"
            style={{...STYLES.curvedPage, width: width, flex: 88}}>
            <View style={{flexDirection: 'row', padding: 15}}>
              <View style={{flex: 2, alignItems: 'flex-end'}}>
                <Image
                  source={require('../Assets/logo.png')}
                  style={styles.brandViewLogo}
                />
              </View>
              <View
                style={{
                  flex: 8,
                  alignItems: 'flex-start',
                  paddingLeft: 15,
                  paddingTop: 10,
                }}>
                <Text style={styles.brandViewText}>MuziClub</Text>
              </View>
            </View>

            <ScrollView
              style={{width: width, marginBottom: 30}}
              showsVerticalScrollIndicator={false}>
              <View
                style={{
                  width: width * 0.95,
                  padding: 15,
                  alignItems: 'center',
                }}>
                {this.pageContent.map((value, index) => {
                  switch (value['type']) {
                    case 'list':
                      let i,
                        j,
                        chunk = 3;
                      let temp = [];
                      for (i = 0, j = value.content.length; i < j; i += chunk) {
                        temp[temp.length] = value.content.slice(i, i + chunk);
                        // do whatever
                      }
                      let listData = temp.map((val, ind) => {
                        return (
                          <View
                            key={'text' + index + '_' + ind}
                            style={{flex: 1, flexDirection: 'row'}}>
                            {val.map((v, i) => {
                              return (
                                <View
                                  key={'text' + index + '_' + ind + '_' + i}
                                  style={{
                                    flex: 1,
                                    padding: 10,
                                    alignItems: 'center',
                                  }}>
                                  <Image
                                    source={{uri: v['image']}}
                                    style={{
                                      width: width * 0.25,
                                      height: 100,
                                      resizeMode: 'cover',
                                      marginBottom: 10,
                                    }}
                                  />
                                  <Text
                                    style={{
                                      ...STYLES.fontSmall,
                                      color: PROPERTY.darkFontColor,
                                    }}>
                                    {v.text}
                                  </Text>
                                </View>
                              );
                            })}
                          </View>
                        );
                      });
                      return listData;
                    case 'image':
                      return (
                        <Image
                          key={'text' + index}
                          source={{uri: value['content']}}
                          style={{
                            width: width,
                            height: 200,
                            resizeMode: 'cover',
                            marginBottom: 20,
                          }}
                        />
                      );
                      break;
                    case 'header':
                      return (
                        <Text
                          key={'text' + index}
                          style={{
                            ...STYLES.fontNormal,
                            color: PROPERTY.darkFontColor,
                            fontWeight: 'bold',
                            paddingBottom: 10,
                          }}>
                          {value.content}
                        </Text>
                      );

                    case 'text':
                      return (
                        <Text
                          key={'text' + index}
                          style={{
                            ...STYLES.fontSmall,
                            color: PROPERTY.darkFontColor,
                            paddingBottom: 10,
                          }}>
                          {value.content}
                        </Text>
                      );
                  }
                })}
              </View>
            </ScrollView>
          </Animatable.View>

          <View style={{flex: 12, flexDirection: 'row', padding: 15}}>
            <View style={{flex: 3}}></View>
            <View style={{flex: 6, padding: 5}}>
              <Button
                color={PROPERTY.darkButtonBackground}
                mode="contained"
                onPress={this.loginPressed}
                style={{...STYLES.button, height: 50, paddingTop: 5}}>
                Click To Login
              </Button>
            </View>
            <View style={{flex: 3}}></View>
            {/* <View style={{ flex: 1, padding: 5 }}>
              <Button color={PROPERTY.lightButtonBackground} mode="contained" onPress={() => this.props.navigation.navigate('Guest')}
                style={{ ...STYLES.button, height: 50, paddingTop: 5 }}>
                Guets User
              </Button>
            </View> */}
          </View>

          {/** Login Modal Dialog */}
          <Modal
            visible={this.state.login}
            onDismiss={this.hideLogin}
            dismissable={false}
            contentContainerStyle={{
              ...STYLES.modalDialog,
              backgroundColor: PROPERTY.background,
            }}>
            <View style={{paddingTop: 20, paddingLeft: 20}}>
              <Text style={{...STYLES.fontLarge, fontWeight: 'bold'}}>
                Login Dialog
              </Text>
            </View>
            <Divider inset={true} />

            <View style={{paddingTop: 20, paddingLeft: 20}}>
              <Text style={{...STYLES.fontSmall}}>
                Please provide your username and password
              </Text>
            </View>

            <View style={{borderWidth: 0, paddingLeft: 10, paddingRight: 10}}>
              {this.state.loading === true && (
                <ActivityIndicator
                  size="large"
                  color={PROPERTY.darkFontColor}
                  style={{padding: 50, width: width - 150}}
                />
              )}

              {this.state.loading === false && (
                <View>
                  <TextInput
                    label="Email"
                    mode="flat"
                    ref={ref => (this.form.username = ref)}
                    mode="flat"
                    defaultValue={''}
                    style={{
                      ...STYLES.fontSmall,
                      width: width - 80,
                      borderWidth: 0,
                      marginBottom: 10,
                    }}
                    theme={STYLES.inputTheme}
                  />
                  {this.state.error.username === true && (
                    <View style={{paddingLeft: 5}}>
                      <Text style={{...STYLES.fontSmall, color: PROPERTY.red}}>
                        Please provide correct username
                      </Text>
                    </View>
                  )}
                  <TextInput
                    label="Password"
                    secureTextEntry={true}
                    ref={ref => (this.form.password = ref)}
                    mode="flat"
                    defaultValue={''}
                    style={{
                      ...STYLES.fontSmall,
                      width: width - 80,
                      borderWidth: 0,
                      marginBottom: 10,
                    }}
                    theme={STYLES.inputTheme}
                  />
                  {this.state.error.password === true && (
                    <View style={{paddingLeft: 5}}>
                      <Text style={{...STYLES.fontSmall, color: PROPERTY.red}}>
                        Please provide correct password
                      </Text>
                    </View>
                  )}
                </View>
              )}
            </View>
            {this.state.loading === false && (
              <View style={{flexDirection: 'row', padding: 15}}>
                <View style={{flex: 1, padding: 5}}>
                  <Button
                    color={PROPERTY.lightButtonBackground}
                    mode="contained"
                    onPress={() => {
                      this.setState({login: false});
                    }}
                    style={{...STYLES.button, height: 50, paddingTop: 5}}>
                    Cancel
                  </Button>
                </View>
                <View style={{flex: 1, padding: 5}}>
                  <Button
                    color={PROPERTY.darkButtonBackground}
                    mode="contained"
                    onPress={this.login}
                    style={{...STYLES.button, height: 50, paddingTop: 5}}>
                    Login
                  </Button>
                </View>
              </View>
            )}

            {this.state.error.server === true && (
              <View style={{paddingLeft: 20}}>
                <Text style={{...STYLES.fontSmall, color: PROPERTY.red}}>
                  Please provide correct usernamd and password
                </Text>
              </View>
            )}

            {/* <View style={{ paddingTop: 20, paddingLeft: 20 }}>
              <Text style={{ ...STYLES.fontSmall }}>New user to system, click to register</Text>
            </View> */}
          </Modal>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const mapstate = state => {
  return {
    login: LoginReducer,
  };
};

export default connect(mapstate)(LoginScreen);
