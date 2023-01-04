import React from 'react';
import {
  View,
  Image,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {Dimensions} from 'react-native';
import {connect} from 'react-redux';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

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

class LeaveApply extends React.Component {
  scrollRef = null;
  currentMonth = 0;

  form = {
    search_name: '',
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

  Batches = [];

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
      date1: new Date(),
      mode1: 'date',
      show1: false,
      timeShow: false,
      maininfo: this.maininfo,
      selectCentreName: null,
      selectCentreId: null,
      isLoading: true,
      Centres: [],
      comment: '',
      centreid: [],
      centreListing: null,
    };
    this.apply = this.apply.bind(this);
    this.comment = this.comment.bind(this);
    this.getalertshow = this.getalertshow.bind(this);
  }
  comment(comment) {
    this.setState({comment: comment});
  }
  getalertshow = async () => {
    try {
      if (this.state.selectCentreId == null) {
        Alert.alert('Apply Leave Alert', 'Please select centre..!!');
        return;
      }
      if (this.state.comment == '') {
        Alert.alert('Apply Leave Alert', 'Please add remarks..!!');
        return;
      }
      let applicationdate = moment(this.state.date).format('YYYY-MM-DD');
      let enddate = moment(this.state.date1).format('YYYY-MM-DD');
      if (enddate < applicationdate) {
        Alert.alert(
          'Apply Leave Alert',
          'End Date cannot be prior to Start date..!!',
        );
        return;
      }
      let data = await POST(SERVER + 'manage/PostLeaveVerify.json', {
        permission: 'faculty',
        applicationdate: applicationdate,
        enddate: enddate,
        leavetype: 0,
        _centre_id: this.state.selectCentreId,
      });
      console.log(data);
      if (data.count > 0) {
        console.log('okkj' + data.count);
        let msg = 'You have ' + data.count + ' conflicting schedule';
        Alert.alert('Apply Leave Alert', msg, [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {
            text: 'OK',
            onPress: () => {
              console.log('okkju');
              this.apply();
            },
          },
        ]);
      } else {
        this.apply();
      }
    } catch (error) {}
  };
  apply() {
    let applicationdate = moment(this.state.date).format('YYYY-MM-DD');
    let enddate = moment(this.state.date1).format('YYYY-MM-DD');
    this.setState(state => ({
      isLoading: true,
    }));

    let leavetype = 0,
      forrole = 5;
    POST(SERVER + 'manage/LeaveRequest.json', {
      applicationdate: applicationdate,
      enddate: enddate,
      message: this.state.comment,
      leavetype: leavetype,
      forrole: 'Teacher',
      _centre_id: this.state.selectCentreId,
    }).then(res => {
      this.setState(state => ({
        isLoading: true,
      }));
      if (res == null || res == undefined) {
        this.setState(state => ({
          isLoading: false,
        }));
      } else if (res.success == true) {
        this.setState(state => ({
          isLoading: false,
        }));
        Alert.alert('', 'Leave Applied Sucessfully!', [
          {
            text: 'OK',
            onPress: () => {
              this.props.navigation.reset({
                index: 0,
                routes: [{name: 'Leave'}],
              });
            },
          },
        ]);
      }
    });
  }
  componentDidMount() {
    POST(SERVER + 'api/centre.json', {}).then(response => {
      if (response == null || response == undefined) {
      } else {
        if (response.centre == undefined) {
        }
        this.setState({
          centreListing: response.centre,
        });
        this.state.Centres.push('All');
        this.state.centreid.push(-1);
        Object.keys(this.state.centreListing).map(key => {
          this.setState({
            donotdisplay: this.state.centreListing[key].donotdisplay,
          });

          this.state.Centres.push(this.state.centreListing[key]['name']);
          this.state.centreid.push(this.state.centreListing[key]['id']);
        });
      }
      this.setState(state => ({
        isLoading: false,
      }));
    });
  }

  getCentreFilter = value => {
    this.setState({selectCentreName: value});
    Object.keys(this.state.centreListing).map(key => {
      this.setState({
        donotdisplay: this.state.centreListing[key].donotdisplay,
      });
      if (this.state.centreListing[key]['name'] == value && value != 'All') {
        this.setState({selectCentreId: this.state.centreListing[key]['id']});
      }
      if (value == 'All') {
        this.setState({selectCentreId: 0});
      }
    });
  };

  getBatchFilter = value => {
    this.setState({selectCentre_id: value.id, selectCentreName: value.name});
  };

  setDate = (event, date) => {
    date = date || this.state.date;

    this.setState({
      show: Platform.OS === 'ios' ? true : false,
      date,
      timeShow: true,
    });

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

  setDate1 = (event, date1) => {
    date1 = date1 || this.state.date1;

    this.setState({
      show1: Platform.OS === 'ios' ? true : false,
      date1,
      timeShow: true,
    });

    if (this.state.mode1 == 'date') {
    }
  };

  show1 = mode1 => {
    this.setState({
      show1: true,
      mode1,
    });
  };

  datepicker1 = () => {
    this.show1('date');
  };

  /**
   * called to display page
   * @returns
   */
  render() {
    const {show, date, mode} = this.state;
    const {show1, date1, mode1} = this.state;

    return (
      <KeyboardAwareScrollView
        style={{backgroundColor: '#4c69a5'}}
        resetScrollToCoords={{x: 0, y: 0}}
        contentContainerStyle={{height: height}}
        scrollEnabled={false}>
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
                    routes: [{name: 'Leave'}],
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
                  Leave Apply
                </Text>
              </View>
            </View>
          </Animatable.View>
          <Animatable.View
            animation="fadeInUpBig"
            style={{width: width, marginTop: 5}}>
            <View style={{backgroundColor: PROPERTY.innerColorBackground}}>
              <View style={{flexDirection: 'row', marginBottom: 0}}>
                <View
                  style={{
                    flex: 45,
                    alignItems: 'center',
                    marginBottom: 2,
                    paddingBottom: 10,
                    paddingLeft: 8,
                    paddingTop: 10,
                    marginLeft: 22,
                    borderRadius: 10,
                    backgroundColor: PROPERTY.calendarHeaderBackground,
                  }}>
                  <Text style={{fontSize: 18, color: PROPERTY.selectedColor}}>
                    Start Date
                  </Text>
                  <TouchableOpacity onPress={this.datepicker}>
                    <View style={{flexDirection: 'row'}}>
                      <Text
                        style={{
                          fontSize: 19,
                          color: PROPERTY.selectedColor,
                          textDecorationLine: 'underline',
                        }}>
                        {moment(this.state.date).format('DD-MM-YYYY')}{' '}
                        <Icon name={'calendar'} size={20} />
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={{flex: 10}}></View>
                <View
                  style={{
                    flex: 45,
                    alignItems: 'center',
                    marginBottom: 2,
                    paddingBottom: 10,
                    paddingLeft: 8,
                    paddingTop: 10,
                    marginRight: 22,
                    borderRadius: 10,
                    backgroundColor: PROPERTY.calendarHeaderBackground,
                  }}>
                  <Text style={{fontSize: 18, color: PROPERTY.selectedColor}}>
                    End Date
                  </Text>
                  <TouchableOpacity onPress={this.datepicker1}>
                    <View style={{flexDirection: 'row'}}>
                      <Text
                        style={{
                          fontSize: 19,
                          color: PROPERTY.selectedColor,
                          textDecorationLine: 'underline',
                        }}>
                        {moment(this.state.date1).format('DD-MM-YYYY')}{' '}
                        <Icon name={'calendar'} size={20} />
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
                {show && (
                  <DateTimePicker
                    value={date}
                    mode={mode}
                    is24Hour={true}
                    display="default"
                    onChange={this.setDate}
                  />
                )}
                {show1 && (
                  <DateTimePicker
                    value={date1}
                    mode={mode}
                    is24Hour={true}
                    display="default"
                    onChange={this.setDate1}
                  />
                )}
              </View>
              <View style={{marginTop: 0, marginBottom: 8}}>
                <Text
                  style={{
                    fontSize: 18,
                    color: PROPERTY.selectedColor,
                    paddingStart: 23,
                  }}>
                  Select Centre :
                </Text>
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  alwaysBounceVertical={false}
                  contentContainerStyle={{...STYLES.scrollViewContainer}}>
                  <SelectDropdown
                    data={this.state.Centres}
                    //defaultValueByIndex={0}
                    // defaultValue={this.state.Centres}
                    onSelect={(selectedItem, index) => {
                      this.getCentreFilter(selectedItem);
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
              <View>
                <TextInput
                  style={{
                    marginRight: 20,
                    marginLeft: 20,
                    // marginBottom: 2,
                    paddingTop: 5,
                    paddingLeft: 5,
                    paddingRight: 5,
                    paddingBottom: 2,
                  }}
                  numberOfLines={1}
                  onChangeText={this.comment}
                  placeholder="Comments"
                  multiline
                />
                {/* <ScrollView
                  style={{marginTop: 20}}
                  showsVerticalScrollIndicator={false}
                  alwaysBounceVertical={false}
                  contentContainerStyle={{...STYLES.scrollViewContainer}}>
                  <SelectDropdown
                    data={this.Batches}
                    //defaultValueByIndex={0}
                    // defaultValue={'All'}
                    onSelect={(selectedItem, index) => {
                      this.getBatchFilter(selectedItem);
                    }}
                    defaultButtonText={'Select Batch...'}
                    buttonTextAfterSelection={(selectedItem, index) => {
                      return selectedItem.name;
                    }}
                    rowTextForSelection={(item, index) => {
                      return item.name;
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
                </ScrollView> */}
              </View>

              <View style={{flexDirection: 'row'}}>
                <View style={{flex: 30}}></View>
                <View style={{flex: 40}}>
                  <Button
                    color={PROPERTY.buttonColor}
                    mode="contained"
                    style={{...STYLES.button}}
                    onPress={this.getalertshow}>
                    Apply Leave
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
      </KeyboardAwareScrollView>
    );
  }
}

const mapstate = state => {
  return {
    login: LoginReducer,
  };
};

export default connect(mapstate)(LeaveApply);
