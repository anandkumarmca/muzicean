import React from 'react';
import {
  View,
  Image,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {Dimensions} from 'react-native';
import {connect} from 'react-redux';

import {TextInput, Button} from 'react-native-paper';
import LoginReducer from '../../Redux/Reducer/Login';
import Month from '../Component/Month';
// Swipe data
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';

import {Card} from 'react-native-paper';

import {PROPERTY, POST, SERVER} from '../../Common/Settings';
import {height, width, STYLES} from '../../Common/Style';
import * as Animatable from 'react-native-animatable';
import Users from '../Component/User';
import BottomDrawer from '../Component/Drawer';
import moment from 'moment';
class FacultyScreen extends React.Component {
  currentbatchcolor = 0;
  info = {
    user: {
      name: 'Lachhekumar Nadar',
      email: 'lachhekumar@gmail.com',
      photo:
        'https://i2.wp.com/muziclub.com/wp-content/uploads/2021/06/anirban.jpg?resize=390%2C205&ssl=1',
    },
    dashboard: [
      {
        icon: require('../../Assets/icons/next-batch.png'),
        title: 'Next Batch',
        subtitle: 'minutes left',
        info: '0',
        centre: '',
        batch: '',
        time: '',
        tooltip: ['Banner', '3rd/5 today'],
        moveto: 'FacultyScheduleDetails',
        data: [],
      },
      {
        icon: require('../../Assets/icons/current-batch.png'),
        title: 'Current Batch',
        subtitle: 'minutes over',
        info: '0',
        centre: '',
        batch: '',
        time: '',
        tooltip: ['Banner', '3rd/5 today'],
        moveto: 'FacultyScheduleDetails',
        data: [],
      },
      {
        icon: require('../../Assets/icons/pending.png'),
        title: 'Pending Attendance',
        info: '0',
        moveto: 'PendingList',
        data: [],
      },
      {
        icon: require('../../Assets/icons/overdue.png'),
        title: 'Overdue Attendance',
        info: '0',
        moveto: 'OverdueList',
        data: [],
      },
      {
        icon: require('../../Assets/icons/task.png'),
        title: 'Tasks',
        subtitle: 'Unresolved',
        info: '0',
        tooltip: [],
        moveto: 'Message',
        data: [],
      },
      {
        icon: require('../../Assets/icons/messages.png'),
        title: 'Messages',
        subtitle: '',
        info: '0',
        tooltip: ['Total 200 mail'],
        moveto: 'FacultyMessage',
        data: [],
      },
    ],
  };

  dashboardTitle = ['Faculty', 'Admin', 'Student'];
  selectDated = new Date().getDate();

  dateinfo = {
    month: month[new Date().getMonth()],
    year: new Date().getYear() + 1900,
    date: this.selectDated,
  };

  constructor(props) {
    super(props);
    let defaultImage = require('../../Assets/icons/dp.png');
    let users = {
      name: global.userinfo.firstname + ' ' + global.userinfo.lastname,
      email: global.userinfo.email,
      photo:
        global.userinfo.photo === ''
          ? defaultImage
          : {uri: global.userinfo.photo},
    };
    this.info.user = users;
    this.dateinfo.total = new Date(
      this.dateinfo.year,
      new Date().getMonth() + 1,
      0,
    ).getDate();
    this.state = {
      selectedClass: [0, 1, 2, 3, 4, 5],
      dateinfo: this.dateinfo,
      dashboardInfo: [],
      isLoading: true,
      studentListing: '',
      dataChecked: null,
      student: [],
      starttimecurrent: '',
      _totalcurrent: 0,
      indexcountcurrent: 0,
      starttimenext: '',
      _totalnext: 0,
      indexcountnext: 0,
      psdate: null,
      osdate: null,
    };
    this.moveScreen = this.moveScreen.bind(this);
  }

  componentDidMount() {
    this.info.dashboard.forEach(value => {
      this.state.dashboardInfo.push(value);
    });
    this.m = month.indexOf(this.state.dateinfo.month) + 1;
    this.sdate =
      this.state.dateinfo.year + '-' + this.m + '-' + this.state.dateinfo.date;
    POST(SERVER + 'dashboard.json', {}).then(response => {
      this.setState({loading: false});
      if (response == null) {
      } else {
        Object.keys(this.state.dashboardInfo).map(key => {
          console.log(response.currentschedule);
          if (this.state.dashboardInfo[key].title == 'Current Batch') {
            this.state.dashboardInfo[key].data = response.currentschedule;
            if (response.currentschedule._total == 0) {
              this.state.dashboardInfo[key].subtitle = 'No Batch';
              this.state.dashboardInfo[key].info = '';
              this.state.dashboardInfo[key].centre = '';
              this.state.dashboardInfo[key].batch = '';
              this.state.dashboardInfo[key].time = '';
            } else {
              let diff, statusremark;
              for (let i = 0; i < response.currentschedule._total; i++) {
                let stdate = response.currentschedule[i].starttime;
                statusremark = response.currentschedule[i].statusremark;
                this.currentbatchcolor =
                  response.currentschedule[i].overduecolor;
                let starttimed = moment(
                  response.currentschedule[i].starttime,
                ).format('YYYY-MM-DD');
                let dt1 = moment();
                diff = dt1.diff(stdate, 'minutes');
                if (diff > 0 && diff < 60) {
                  this.state.dashboardInfo[key].centre =
                    response.currentschedule[i].centrename;
                  this.state.dashboardInfo[key].batch =
                    response.currentschedule[i].batchname;
                  this.state.dashboardInfo[key].time =
                    response.currentschedule[i].starttime;
                  this.state.dashboardInfo[key].time = moment(
                    this.state.dashboardInfo[key].time,
                  ).format('h:mmA');
                  this.setState({
                    starttimecurrent: starttimed,
                    _totalcurrent: response.currentschedule._total,
                    _totalcurrentrec: response.currentschedule._total,
                    indexcountcurrent: i,
                  });
                  break;
                }
              }
              if (diff < 0 || diff > 59) {
                this.state.dashboardInfo[key].subtitle = 'No Batch';
                this.state.dashboardInfo[key].info = '';
                this.state.dashboardInfo[key].centre = '';
                this.state.dashboardInfo[key].batch = '';
                this.state.dashboardInfo[key].time = '';
              } else {
                if (statusremark == 1) {
                  this.state.dashboardInfo[key].subtitle = 'Attendance Marked';
                  this.state.dashboardInfo[key].info = '';
                } else if (statusremark == 0) {
                  this.state.dashboardInfo[key].subtitle = 'Attendance Pending';
                  this.state.dashboardInfo[key].info = '';
                } else if (statusremark == -1) {
                  this.state.dashboardInfo[key].subtitle = 'Empty Batch';
                  this.state.dashboardInfo[key].info = '';
                }
              }
            }
          }
          if (this.state.dashboardInfo[key].title == 'Next Batch') {
            this.state.dashboardInfo[key].data = response.schedule;
            if (response.schedule._totalrec == 0) {
              this.state.dashboardInfo[key].subtitle = 'No Batch';
              this.state.dashboardInfo[key].info = '';
            } else {
              let stdate = response.schedule[0].starttime;
              stdate = moment(stdate).format('DD-MM-YYYY h:mmA');
              // this.state.dashboardInfo[key].time = moment(
              //   response.schedule[0].starttime,
              // ).format('h:mmA');
              this.state.dashboardInfo[key].centre =
                response.schedule[0].centrename;
              this.state.dashboardInfo[key].batch =
                response.schedule[0].batchname;

              this.state.dashboardInfo[key].subtitle = stdate;
              this.state.dashboardInfo[key].info = '';
              let vdate = moment(response.schedule[0].starttime).format(
                'DD-MM-YYYY',
              );

              let starttimed = moment(response.schedule[0].starttime).format(
                'YYYY-MM-DD',
              );
              let starttimet = moment(response.schedule[0].starttime).format(
                'h:mmA',
              );

              let cdate = moment().format('DD-MM-YYYY');
              this.setState({
                starttimenext: starttimed,
                _totalnext: response.schedule._total,
                _totalnextrec: response.schedule._totalrec,
                indexcountnext: response.schedule._indexcount,
              });
            }
          }
          if (this.state.dashboardInfo[key].title == 'Pending Attendance') {
            if (response.pschedule > 0) {
              this.state.dashboardInfo[key].info = response.pschedule;
              let psdate = moment(response.psdata[0].starttime).format(
                'DD-MM-YYYY',
              );
              this.state.dashboardInfo[key].data = response.psdata[0];
              this.setState({psdate: psdate});
            }
          }
          if (this.state.dashboardInfo[key].title == 'Overdue Attendance') {
            if (response.oschedule > 0) {
              this.state.dashboardInfo[key].info = response.oschedule;
              let osdate = moment(response.osdata[0].starttime).format(
                'DD-MM-YYYY',
              );
              this.state.dashboardInfo[key].data = response.osdata[0];
              this.setState({osdate: osdate});
            }
          }
          if (this.state.dashboardInfo[key].title == 'Messages') {
            console.log(response.appmessages);
            if (response.appmessages > 0) {
              this.state.dashboardInfo[key].info = response.appmessages;
              // this.state.dashboardInfo[key].data = response.osdata[0];
            }
          }
        });

        this.setState({studentListing: response.currentschedule});
      }
    });
  }

  // move to next screen
  moveScreen(data) {
    if (data.moveto.indexOf('/') > 1) {
      let $route = data.moveto.split('/');
      this.props.navigation.navigate($route[0], {
        screen: $route[1],
        params: data,
      });
    } else {
      this.props.navigation.navigate(data.moveto, {
        params: data,
        screen: 'Index',
      });
    }
  }

  /**
   * called to display page
   * @returns
   */
  render() {
    let i,
      j,
      chunk = 1;
    let displayData = [];
    for (i = 0, j = this.info.dashboard.length; i < j; i += chunk) {
      //   displayData[displayData.length] = this.info.dashboard.slice(i, i + chunk);
      displayData[displayData.length] = this.state.dashboardInfo.slice(
        i,
        i + chunk,
      );
      // do whatever
    }

    let config = {
      velocityThreshold: 0.3,
      directionalOffsetThreshold: 80,
    };

    return (
      <KeyboardAvoidingView
        behavior="position"
        contentContainerStyle={{height: height - 90}}>
        <View
          style={{flex: 1, backgroundColor: PROPERTY.innerColorBackground}}
          showsVerticalScrollIndicator={false}>
          <Animatable.View animation="fadeInUpBig" style={{width: width}}>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 20,
              }}>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate('Profile');
                }}>
                <Image
                  source={this.info.user.photo}
                  style={{
                    width: 85,
                    height: 85,
                    resizeMode: 'cover',
                    borderRadius: 50,
                    borderWidth: 1,
                    borderColor: PROPERTY.selectedColor,
                  }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate('Profile');
                }}>
                <Text style={{fontSize: 26, color: PROPERTY.fontColor}}>
                  {this.info.user.name}
                </Text>
              </TouchableOpacity>
              <Text
                style={{
                  fontSize: 18,
                  color: PROPERTY.fontColor,
                  marginTop: -2,
                }}>
                Teacher
              </Text>
              <Text
                style={{
                  ...STYLES.fontSmall,
                  color: PROPERTY.fontColor,
                  paddingTop: 2,
                }}>
                Change Role
              </Text>
            </View>
          </Animatable.View>
          <Animatable.View
            animation="fadeInUpBig"
            style={{...STYLES.topCurvedPage, width: width}}>
            <View style={{marginTop: 8, marginLeft: 5, marginRight: 5}}>
              <FlatList
                data={this.state.dashboardInfo}
                numColumns={2}
                renderItem={({item, index}) => (
                  <View
                    style={
                      item.title == 'Next Batch'
                        ? {
                            ...STYLES.box,
                            marginTop: 10,
                            // marginLeft: 10,
                            marginRight: 10,
                            backgroundColor: PROPERTY.selectedColor,
                          }
                        : item.title == 'Pending Attendance'
                        ? {
                            ...STYLES.box,
                            marginTop: 10,
                            marginLeft: 10,
                            marginRight: 10,
                            backgroundColor: PROPERTY.greenColor,
                          }
                        : item.title == 'Current Batch' &&
                          this.currentbatchcolor == 0
                        ? {
                            ...STYLES.box,
                            marginTop: 10,
                            marginLeft: 10,
                            marginRight: 10,
                            backgroundColor: PROPERTY.greenColor,
                          }
                        : {
                            ...STYLES.box,
                            marginTop: 10,
                            marginLeft: 10,
                            marginRight: 10,
                          }
                    }>
                    <TouchableOpacity
                      onPress={() => {
                        if (item.title == 'Current Batch') {
                          this.props.navigation.navigate(
                            'FacultyScheduleDetails',
                            {
                              title: 'batch',
                              _total: this.state._totalcurrent,
                              _totalrec: this.state._totalcurrent,
                              indexcount: this.state.indexcountcurrent,
                              starttime: this.state.starttimecurrent,
                            },
                          );
                        } else if (item.title == 'Next Batch') {
                          this.props.navigation.navigate(
                            'FacultyScheduleDetails',
                            {
                              title: 'batch',
                              _total: this.state._totalnext,
                              _totalrec: this.state._totalnextrec,
                              indexcount: this.state.indexcountnext,
                              starttime: this.state.starttimenext,
                            },
                          );
                        } else if (item.title == 'Pending Attendance') {
                          this.props.navigation.navigate('PendingList');
                        } else if (item.title == 'Overdue Attendance') {
                          this.props.navigation.navigate('OverdueList');
                        } else {
                          this.moveScreen(item);
                        }
                      }}>
                      <Text
                        style={
                          item.title == 'Next Batch'
                            ? {
                                ...STYLES.heading,
                                paddingLeft: 7,
                                fontSize: 15,
                                paddingTop: 2,
                                color: PROPERTY.bwColor,
                              }
                            : item.title == 'Overdue Attendance'
                            ? {
                                ...STYLES.heading,
                                paddingLeft: 7,
                                fontSize: 15,
                                paddingTop: 2,
                                color: PROPERTY.overdueColor,
                              }
                            : {
                                ...STYLES.heading,
                                paddingLeft: 7,
                                fontSize: 15,
                                paddingTop: 2,
                                color: PROPERTY.selectedColor,
                              }
                        }>
                        {item.title}
                      </Text>
                      <View style={{alignItems: 'center', marginTop: 0}}>
                        <Image source={item.icon} style={{...STYLES.icon}} />
                      </View>
                      <View style={{flexDirection: 'row'}}>
                        <View>
                          <Text
                            style={
                              item.title == 'Next Batch'
                                ? {
                                    paddingLeft: 10,

                                    fontSize: 15,
                                    color: PROPERTY.bwColor,
                                  }
                                : item.title == 'Current Batch'
                                ? {
                                    paddingLeft: 10,
                                    fontSize: 15,
                                    paddingBottom: 0,

                                    color: this.currentbatchcolor
                                      ? PROPERTY.overdueColor
                                      : PROPERTY.selectedColor,
                                  }
                                : {
                                    paddingLeft: 7,
                                    paddingTop: 27,
                                    fontSize: 15,
                                    color: PROPERTY.selectedColor,
                                  }
                            }>
                            {item.subtitle}
                          </Text>
                          <Text
                            style={
                              item.title == 'Next Batch'
                                ? {
                                    paddingLeft: 15,

                                    fontSize: 12,
                                    color: PROPERTY.bwColor,
                                  }
                                : item.title == 'Current Batch'
                                ? {
                                    paddingLeft: 15,
                                    fontSize: 12,

                                    color: this.currentbatchcolor
                                      ? PROPERTY.overdueColor
                                      : PROPERTY.selectedColor,
                                  }
                                : {
                                    paddingLeft: 7,
                                    paddingTop: 27,
                                    fontSize: 15,
                                    color: PROPERTY.selectedColor,
                                  }
                            }>
                            {item.centre}
                          </Text>
                          <Text
                            style={
                              item.title == 'Next Batch'
                                ? {
                                    paddingLeft: 15,
                                    // paddingTop: 27,
                                    fontSize: 12,
                                    color: PROPERTY.bwColor,
                                  }
                                : item.title == 'Current Batch'
                                ? {
                                    ...STYLES.heading,
                                    paddingLeft: 15,
                                    fontSize: 12,

                                    color: this.currentbatchcolor
                                      ? PROPERTY.overdueColor
                                      : PROPERTY.selectedColor,
                                  }
                                : {
                                    paddingLeft: 7,
                                    paddingTop: 27,
                                    fontSize: 15,
                                    color: PROPERTY.selectedColor,
                                  }
                            }>
                            {item.batch} {item.time}
                          </Text>
                        </View>
                        {item.title != 'Next Batch' &&
                          item.title != 'Current Batch' && (
                            <View style={{flex: 40}}>
                              <Text
                                style={
                                  item.title == 'Overdue Attendance'
                                    ? {
                                        textAlign: 'right',
                                        paddingRight: 5,
                                        paddingTop: 8,
                                        fontSize: 35,
                                        color: PROPERTY.overdueColor,
                                      }
                                    : {
                                        textAlign: 'right',
                                        paddingRight: 5,
                                        paddingTop: 8,
                                        fontSize: 35,
                                        color: PROPERTY.selectedColor,
                                      }
                                }>
                                {item.info}
                              </Text>
                            </View>
                          )}
                      </View>
                    </TouchableOpacity>
                  </View>
                )}
              />
            </View>
          </Animatable.View>
        </View>
        <BottomDrawer {...this.props}></BottomDrawer>
      </KeyboardAvoidingView>
    );
  }
}

const mapstate = state => {
  return {
    login: LoginReducer,
  };
};

export default connect(mapstate)(FacultyScreen);
