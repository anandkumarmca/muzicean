import React from 'react';
import {
  View,
  Image,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from 'react-native';
import {Dimensions, Linking} from 'react-native';
import {connect} from 'react-redux';

import {TextInput, Button, Modal} from 'react-native-paper';
import LoginReducer from '../../Redux/Reducer/Login';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Card} from 'react-native-paper';

import {PROPERTY, POST, SERVER} from '../../Common/Settings';
import {height, width, STYLES} from '../../Common/Style';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icons from 'react-native-vector-icons/MaterialIcons';
import Users from '../Component/User';
import moment from 'moment';
import SelectDropdown from 'react-native-select-dropdown';
import BottomDrawer from '../Component/Drawer';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';

class MessageReply extends React.Component {
  scrollRef = null;
  currentMonth = 0;

  form = {
    subject: '',
    msg: '',
  };

  month = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  selectDated = new Date().getDate();

  maininfo = {
    month: this.month[new Date().getMonth()],
    year: new Date().getYear() + 1900,
    date: this.selectDated,
  };

  constructor(props) {
    super(props);
    this.maininfo.total = new Date(
      this.maininfo.year,
      new Date().getMonth(),
      0,
    ).getDate();
    this.state = {
      maininfo: this.maininfo,
    };
  }

  componentDidMount() {
    let id = this.props.route.params.data.messages_id;
    let uid = this.props.route.params.data.users_id;
    let stype = this.props.route.params.data.sendtype;

    POST(
      SERVER +
        'messages/getAllWrite.json?id=' +
        id +
        '&users_id=' +
        uid +
        '&sendtype=' +
        stype,
      {
        permission: 'faculty',
      },
    ).then(response => {
      if (response.error) {
        console.log(response.error);
      } else {
        console.log(response.form);
        this.setState({readlist: response.form});

        this.setState({
          isLoading: false,
          fname:
            this.state.readlist.firstname + ' ' + this.state.readlist.lastname,
          subject: 'Re: ' + this.state.readlist.subject,
          mdate : this.state.readlist.createdate,
          to : "users-"+this.state.readlist.users_id,
        });
      }
    });
  }

  sendMessage = () => {

    if (this.form.msg.state.value == null) {
      Alert.alert('Message Alert', 'Message field should not be empty..');
    }

    if (this.form.msg.state.value != null) {
      this.stdarr = new Array();
      this.stdarr.push(this.state.to);

      let sub = "";

      if (this.form.subject.state.value == undefined) {
        sub = this.state.subject;
      }else{
        sub = this.form.subject.state.value;
      }

      POST(SERVER + 'messages/allWrite.json', {
        subject: sub,
        message: this.form.msg.state.value,
        sendto: this.stdarr,
        sendtype: this.props.route.params.data.sendtype,
        permission: 'faculty',
      }).then(response => {
        if (response.error) {
          console.log(response.error);
        } else {
          Alert.alert('Message Alert', 'Message send successfully!!!');
          this.props.navigation.reset({
            index: 0,
            routes: [{name: 'FacultyMessage'}],
          });
        }
      });
    }
  };

  /**
   * called to display page
   * @returns
   */
  render() {
    return (
      // <KeyboardAvoidingView behavior="position" contentContainerStyle={{ height: height - 90 }} >
      <KeyboardAwareScrollView
        style={{backgroundColor: '#4c69a5'}}
        resetScrollToCoords={{x: 0, y: 0}}
        contentContainerStyle={{height: height}}
        scrollEnabled={true}>
        <View
          style={{
            flex: 1,
            backgroundColor: PROPERTY.headerColorBackground,
            marginBottom: -70,
          }}
          showsVerticalScrollIndicator={false}>
          <Animatable.View animation="fadeInUpBig" style={{width: width}}>
            <View
              style={{
                flexDirection: 'row',
                paddingTop: 5,
                paddingBottom: 25,
                paddingLeft: 10,
                backgroundColor: PROPERTY.bwColor,
              }}>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate('MessageRead', {
                    data: this.props.route.params.data,
                  });
                }}>
                <View style={{paddingLeft: 20, paddingTop: 25}}>
                  <Icon name={'chevron-left'} size={20} />
                </View>
              </TouchableOpacity>
              <View style={{flex: 9, alignItems: 'flex-start'}}></View>
              <View
                style={{
                  flex: 91,
                  alignItems: 'flex-start',
                  justifyContent: 'center',
                  paddingTop: 20,
                  paddingRight: 30,
                }}>
                <Text
                  style={{
                    ...STYLES.fontLarge,
                    color: PROPERTY.selectedColor,
                    fontWeight: 'bold',
                  }}>
                  Reply Message
                </Text>
              </View>
            </View>
          </Animatable.View>
          <Animatable.View
            animation="fadeInUpBig"
            style={{width: width, marginTop: 5}}>
            <View style={{marginTop: -10, marginLeft: 4, marginRight: 4}}>
              <View style={{flexDirection: 'row'}}>
                <View style={{flex: 61}}>
                </View>
                <View style={{flex: 39}}>
                  <Text
                    style={{
                      fontSize: 15,
                      color: PROPERTY.scrollDateColor,
                      paddingTop: 10,
                      paddingLeft: 12,
                    }}>
                    {this.state.mdate}
                  </Text>
                </View>
              </View>
            </View>
            <View style={{marginTop: 1, marginLeft: 4, marginRight: 4}}>
              <View style={{flexDirection: 'row'}}>
                <View style={{flex: 20}}>
                  <Text
                    style={{
                      fontSize: 15,
                      paddingLeft: 10,
                      paddingTop: 10,
                      color: PROPERTY.scrollDateColor,
                    }}>
                    To :
                  </Text>
                </View>
                <View style={{flex: 80}}>
                  <Text
                    style={{
                      fontSize: 15,
                      color: PROPERTY.scrollDateColor,
                      paddingTop: 10,
                      paddingLeft: 12,
                    }}>
                    {this.state.fname}
                  </Text>
                </View>
              </View>
            </View>
            <View style={{paddingLeft: 5, marginTop: 10}}>
              <View
                style={{
                  borderBottomColor: PROPERTY.bwColor,
                  marginLeft: 10,
                  marginRight: 10,
                  marginTop: 0,
                  borderBottomWidth: 1,
                }}></View>
              <View style={{flexDirection: 'row', marginTop: 10}}>
                <View style={{flex: 20}}>
                  <Text
                    style={{
                      fontSize: 15,
                      paddingLeft: 10,
                      paddingTop: 10,
                      color: PROPERTY.scrollDateColor,
                    }}>
                    Subject :
                  </Text>
                </View>
                <View style={{flex: 80}}>
                  <TextInput
                    style={{margin: 12}}
                    numberOfLines={2}
                    multiline
                    underlineColorAndroid="transparent"
                    defaultValue={this.state.subject}
                    ref={ref => this.form.subject = ref}
                  />
                </View>
              </View>
              <View
                style={{
                  borderBottomColor: PROPERTY.bwColor,
                  marginLeft: 10,
                  marginRight: 10,
                  marginTop: 20,
                  borderBottomWidth: 1,
                }}></View>
            </View>
            <View>
              <TextInput
                style={{margin: 12, marginTop: 20, paddingTop: 10}}
                numberOfLines={17}
                placeholder="Compose message..."
                multiline
                underlineColorAndroid="transparent"
                ref={ref => (this.form.msg = ref)}
              />
              <View style={{flexDirection: 'row', marginTop: 0}}>
                <View style={{flex: 35}}></View>
                <View style={{flex: 30, paddingTop: 5}}>
                  <Button
                    color={PROPERTY.buttonColor}
                    mode="contained"
                    style={{...STYLES.button}}
                    onPress={this.sendMessage}>
                    Send
                  </Button>
                </View>
                <View style={{flex: 35}}></View>
              </View>
            </View>
          </Animatable.View>
        </View>
        <BottomDrawer {...this.props}></BottomDrawer>
      </KeyboardAwareScrollView>
    );
  }
}

const mapstate = state => {
  return {
    login: LoginReducer,
  };
};

export default connect(mapstate)(MessageReply);
