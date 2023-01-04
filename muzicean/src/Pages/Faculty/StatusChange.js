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
  Alert,
  ActivityIndicator,
} from 'react-native';
import {Dimensions} from 'react-native';
import {connect} from 'react-redux';

import {TextInput, Button} from 'react-native-paper';
import LoginReducer from '../../Redux/Reducer/Login';

import {Card} from 'react-native-paper';

import {PROPERTY, POST, SERVER} from '../../Common/Settings';
import {height, width, STYLES} from '../../Common/Style';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/FontAwesome';
import Users from '../Component/User';
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';
import SelectDropdown from 'react-native-select-dropdown';
import BottomDrawer from '../Component/Drawer';

class StatusChange extends React.Component {
  scrollRef = null;
  currentMonth = 0;
  alertshow = 0;
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
      selectedClass: 0,
      date: new Date(),
      mode: 'date',
      show: false,
      timeShow: false,
      maininfo: this.maininfo,
      isLoading: true,
      dateListing: null,
      datesall: [],
      resumedate: null,
    };
    this.getresumedateFilter = this.getresumedateFilter.bind(this);
    this.unfreeze_unhold = this.unfreeze_unhold.bind(this);
  }

  componentDidMount() {
    POST(SERVER + 'users/ScheduleMoreUnfreeze.json', {
      smid: this.props.route.params.data.schedule_master_id,
      id: this.props.route.params.data.schedule_id,
    }).then(response => {
      console.log(response.list);
      if (response.list.success == 0) {
        this.setState(state => ({
          isLoading: false,
        }));
        this.alertshow = 1;
        Alert.alert('', 'Please Extend Schedule!', [
          {
            text: 'OK',
            onPress: () => {
              this.props.navigation.reset({
                index: 0,
                routes: [{name: 'StudentsList'}],
              });
            },
          },
        ]);
      } else {
        this.setState({
          dateListing: response.list,
        });

        Object.keys(this.state.dateListing).map(key => {
          this.setState({
            donotdisplay: this.state.dateListing[key].donotdisplay,
          });

          this.state.datesall.push(this.state.dateListing[key]['starttime']);
        });
      }

      this.setState(state => ({
        isLoading: false,
      }));
    });
  }

  setDate = (event, date) => {
    date = date || this.state.date;

    this.setState({
      show: Platform.OS === 'ios' ? true : false,
      date,
      timeShow: true,
    });

    console.log('Date:' + date);

    if (this.state.mode == 'date') {
    }
  };

  show = mode => {
    this.setState({
      show: true,
      mode,
    });
  };

  datepicker = () => {
    this.show('date');
  };
  getresumedateFilter = value => {
    this.setState({resumedate: value});
  };
  unfreeze_unhold() {
    if (this.props.route.params.status == 'Unfreeze') {
      let alertname = this.props.route.params.status + 'Alert';
      if (this.state.resumedate == null) {
        Alert.alert(alertname, 'Please select resumedate..!!');
        return;
      } else {
        Alert.alert('', 'Resume date is ' + this.state.resumedate + ' ', [
          {
            text: 'CONFIRM',
            onPress: () => {
              this.setState(state => ({
                isLoading: true,
              }));

              POST(SERVER + 'users/ScheduleMoreUnfreeze.json', {
                smid: this.props.route.params.data.schedule_master_id,
                id: this.props.route.params.data.schedule_id,
                users_id: this.props.route.params.data.users_id,
                resumedate: this.state.resumedate,
                _centre_id: this.props.route.params.data.id,
                permission: 'faculty',
                unfreeze: 1,
              }).then(res => {
                if (res == null || res == undefined) {
                } else if (res.resunfreeze == true && res.apires == 'success') {
                  this.setState(state => ({
                    isLoading: false,
                  }));
                  Alert.alert('', 'Unfreeze done Sucessfully!', [
                    {
                      text: 'OK',
                      onPress: () => {
                        this.props.navigation.reset({
                          index: 0,
                          routes: [{name: 'StudentsList'}],
                        });
                      },
                    },
                  ]);
                } else if (res.resunfreeze == true && res.apires != 'success') {
                  this.setState(state => ({
                    isLoading: false,
                  }));
                  Alert.alert('', res.apires, [
                    {
                      text: 'OK',
                      onPress: () => {
                        this.props.navigation.reset({
                          index: 0,
                          routes: [{name: 'StudentsList'}],
                        });
                      },
                    },
                  ]);
                } else {
                  this.setState(state => ({
                    isLoading: false,
                  }));
                  Alert.alert('', res.apires, [
                    {
                      text: 'OK',
                      onPress: () => {},
                    },
                  ]);
                }
              });
            },
          },
          {
            text: 'CANCEL',
            onPress: () => {
              console.log('Cancel pressed..');
            },
          },
        ]);
      }
    }

    if (this.props.route.params.status == 'Unhold') {
      let alertname = this.props.route.params.status + 'Alert';
      if (this.state.resumedate == null) {
        Alert.alert(alertname, 'Please select resumedate..!!');
        return;
      } else {
        Alert.alert('', 'Resume date is ' + this.state.resumedate + ' ', [
          {
            text: 'CONFIRM',
            onPress: () => {
              this.setState(state => ({
                isLoading: true,
              }));
              POST(SERVER + 'users/ScheduleMoreUnhold.json', {
                smid: this.props.route.params.data.schedule_master_id,
                id: this.props.route.params.data.schedule_id,
                users_id: this.props.route.params.data.users_id,
                resumedate: this.state.resumedate,
                _centre_id: this.props.route.params.data.id,
                permission: 'faculty',
              }).then(res => {
                if (res == null || res == undefined) {
                } else if (res.resunhold == true && res.apires == 'success') {
                  this.setState(state => ({
                    isLoading: false,
                  }));
                  Alert.alert('', 'Unhold done Sucessfully!', [
                    {
                      text: 'OK',
                      onPress: () => {
                        this.props.navigation.reset({
                          index: 0,
                          routes: [{name: 'StudentsList'}],
                        });
                      },
                    },
                  ]);
                } else if (res.resunhold == true && res.apires != 'success') {
                  this.setState(state => ({
                    isLoading: false,
                  }));
                  Alert.alert('', res.apires, [
                    {
                      text: 'OK',
                      onPress: () => {
                        this.props.navigation.reset({
                          index: 0,
                          routes: [{name: 'StudentsList'}],
                        });
                      },
                    },
                  ]);
                } else {
                  this.setState(state => ({
                    isLoading: false,
                  }));
                  Alert.alert('', res.apires, [
                    {
                      text: 'OK',
                      onPress: () => {},
                    },
                  ]);
                }
              });
            },
          },
          {
            text: 'CANCEL',
            onPress: () => {
              console.log('Cancel pressed..');
            },
          },
        ]);
      }
    }
  }

  /**
   * called to display page
   * @returns
   */
  render() {
    const {show, date, mode} = this.state;
    const {show1, date1, mode1} = this.state;

    return (
      <KeyboardAvoidingView
        behavior="position"
        contentContainerStyle={{height: height}}>
        <View
          style={{flex: 1, backgroundColor: PROPERTY.headerColorBackground}}
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
                  this.props.navigation.reset({
                    index: 0,
                    routes: [{name: 'StudentsList'}],
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
                  Status change - {this.props.route.params.status}
                </Text>
              </View>
            </View>
          </Animatable.View>
          <Animatable.View
            animation="fadeInUpBig"
            style={{width: width, marginTop: 10}}>
            <View
              style={{
                height: height - 695,
                margin: 20,
                paddingStart: 10,
                padding: 5,
                borderWidth: 2,
                borderRadius: 5,
                borderColor: PROPERTY.selectedColor,
                backgroundColor: PROPERTY.innerColorBackground,
              }}>
              <Text style={{fontSize: 18, color: PROPERTY.selectedColor}}>
                Name : {this.props.route.params.data.firstname}{' '}
                {this.props.route.params.data.lastname}
              </Text>
              <Text style={{fontSize: 18, color: PROPERTY.selectedColor}}>
                Phone : {this.props.route.params.data.mobile}
              </Text>
              <Text style={{fontSize: 18, color: PROPERTY.selectedColor}}>
                Batch : {this.props.route.params.data.batch}
              </Text>
              <Text style={{fontSize: 18, color: PROPERTY.selectedColor}}>
                Revised Date :
                {moment(this.props.route.params.data.reviseddate).format(
                  'DD-MM-YYYY',
                )}
              </Text>
            </View>
            <View style={{backgroundColor: PROPERTY.innerColorBackground}}>
              <View style={{flexDirection: 'row', marginTop: 20}}>
                <View style={{marginTop: 10}}>
                  <Text
                    style={{
                      fontSize: 18,
                      color: PROPERTY.selectedColor,
                      paddingStart: 23,
                    }}>
                    Select Resume Date :
                  </Text>
                  <ScrollView
                    showsVerticalScrollIndicator={false}
                    alwaysBounceVertical={false}
                    contentContainerStyle={{...STYLES.scrollViewContainer}}>
                    <SelectDropdown
                      data={this.state.datesall}
                      defaultValueByIndex={this.defaultvalue}
                      // defaultValue={
                      //   this.props.route.params.selecteditem.centre_name
                      // }
                      onSelect={(selectedItem, index) => {
                        this.getresumedateFilter(selectedItem);
                      }}
                      //defaultButtonText={'Select Classroom...'}
                      buttonTextAfterSelection={(selectedItem, index) => {
                        return selectedItem;
                      }}
                      rowTextForSelection={(item, index) => {
                        return item;
                      }}
                      buttonStyle={{...STYLES.dropdownBtnStyle}}
                      buttonTextStyle={{...STYLES.dropdownBtnTxtStyle}}
                      renderDropdownIcon={isOpened => {
                        return (
                          <Icon
                            name={isOpened ? 'chevron-up' : 'chevron-down'}
                            color={'#444'}
                            size={18}
                          />
                        );
                      }}
                      dropdownIconPosition={'right'}
                      dropdownStyle={{
                        ...STYLES.dropdownDropdownStyle,
                        marginTop: 0,
                      }}
                      rowStyle={{...STYLES.dropdownRowStyle}}
                      rowTextStyle={{...STYLES.dropdownRowTxtStyle}}
                    />
                  </ScrollView>
                </View>
              </View>
              <View style={{flexDirection: 'row', marginTop: 20}}>
                <View style={{flex: 30}}></View>
                <View style={{flex: 40, paddingTop: 5}}>
                  <Button
                    color={PROPERTY.buttonColor}
                    mode="contained"
                    style={{...STYLES.button}}
                    onPress={this.unfreeze_unhold}>
                    {this.props.route.params.status}
                  </Button>
                </View>
                <View style={{flex: 30}}></View>
              </View>
              {this.state.isLoading && (
                <ActivityIndicator
                  size="large"
                  color={PROPERTY.selectedColor}
                  style={{marginTop: 80}}
                />
              )}
            </View>
          </Animatable.View>
          <BottomDrawer {...this.props}></BottomDrawer>
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

export default connect(mapstate)(StatusChange);
