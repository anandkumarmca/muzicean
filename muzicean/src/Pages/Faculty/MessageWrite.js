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
  SafeAreaView
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

class MessageWrite extends React.Component {
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

  items = [
    {
      name: 'Staff',
      id: 0,
      children: [],
    }
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
      tolisting: '',
      stafflisting: '',
      students: null,
      selectedItems: [],
      flag: false,
    };
  }

  componentDidMount() {
    POST(SERVER + 'api/messagesTo.json').then(response => {
      this.setState({loading: false});
      if (response.error) {
        console.log(response.error);
      } else {
        this.setState({tolisting: response});

        Object.keys(this.state.tolisting.staff).map(item => {
          if (this.state.tolisting.staff[item].users_id != '') {
            this.state.tolisting.staff[item] = {
              ...this.state.tolisting.staff[item],
              id: this.state.tolisting.staff[item].messageuid,
            };
          }
          this.items[0].children.push(this.state.tolisting.staff[item]);
        });

      }
    });
  }

  getStudentFilter = value => {
    this.setState({students: value.users_id});
  };

  sendMessage = () => {
    if (this.state.selectedItems == '' && this.form.msg.state.value != null) {
      Alert.alert('Message Alert', 'Please select at least one recipients..');
    }

    if (this.state.selectedItems != '' && this.form.msg.state.value == null) {
      Alert.alert('Message Alert', 'Message field should not be empty..');
    }

    if (this.form.msg.state.value == null && this.state.selectedItems == '') {
      Alert.alert(
        'Message Alert',
        'Recipients and message fields should not be empty!!!',
      );
    }

    if (this.form.msg.state.value != null && this.state.selectedItems != '') {
      this.stdarr = new Array();
      Object.keys(this.state.selectedItems).map(item => {
        this.stdarr.push(this.state.selectedItems[item]);
      });

      POST(SERVER + 'messages/allWrite.json', {
        subject: this.form.subject.state.value,
        message: this.form.msg.state.value,
        sendto: this.stdarr,
        sendtype: '',
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

  onSelectedItemsChange = selectedItems => {
    if (Object.keys(selectedItems).length == 1) {
      this.setState({flag: true});
    } else {
      this.setState({flag: false});
    }
    this.setState({selectedItems});
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
        contentContainerStyle={{height: height}} scrollEnabled={true}>
       {/* <View style={{height:height - 90}}> */}
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
                  this.props.navigation.navigate('FacultyMessage');
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
                  Create New Message
                </Text>
              </View>
            </View>
          </Animatable.View>
          <Animatable.View
            animation="fadeInUpBig"
            style={{width: width, marginTop: 5}}>
            <View style={{marginTop: 5, marginLeft: 4, marginRight: 4}}>
              {this.state.flag && (
                <View style={{flexDirection: 'row', marginTop: 10}}>
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
                  <View style={{flex: 80}}></View>
                </View>
              )}
              <SectionedMultiSelect
                items={this.items}
                IconRenderer={Icons}
                uniqueKey="id"
                subKey="children"
                selectText="Select Recipients :"
                searchPlaceholderText="Search staffs"
                showDropDowns={true}
                readOnlyHeadings={true}
                colors={{
                  chipColor: PROPERTY.overdueColor,
                }}
                onSelectedItemsChange={this.onSelectedItemsChange}
                selectedItems={this.state.selectedItems}
              />
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
                    ref={ref => (this.form.subject = ref)}
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
       {/* </View> */}
       </KeyboardAwareScrollView>
    );
  }
}

const mapstate = state => {
  return {
    login: LoginReducer,
  };
};

export default connect(mapstate)(MessageWrite);
