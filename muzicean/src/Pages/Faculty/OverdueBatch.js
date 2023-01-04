import React from 'react';
import {
  View,
  Image,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  SectionList,
  Alert,
} from 'react-native';
import {Dimensions} from 'react-native';
import {connect} from 'react-redux';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';

import {TextInput, Button, Modal} from 'react-native-paper';
import LoginReducer from '../../Redux/Reducer/Login';
import {Card} from 'react-native-paper';

import {PROPERTY, POST, SERVER} from '../../Common/Settings';
import {height, width, STYLES} from '../../Common/Style';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/FontAwesome';
import {PrivateValueStore} from '@react-navigation/native';
import moment from 'moment';
import BottomDrawer from '../Component/Drawer';
//import Users from '../Component/User';

class OverdueBatch extends React.Component {
  scrollRef = null;
  currentMonth = 0;
  selected = null;
  info = {};
  alertshow = 0;

  batchInfo = {
    location: 'Shivaji Nagar',
    name: 'Vocal Training',
    startTime: '11:00 AM',
    endTime: '12:00PM',
    status: 'future',
    id: 3,
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

  selectDated = moment(this.props.route.params.date).format('D');

  maininfo = {
    month: this.month[new Date().getMonth()],
    year: new Date().getYear() + 1900,
    date: this.selectDated,
  };
  constructor(props) {
    super(props);
    let defaultImage = require('../../Assets/icons/dp.png');
    let users = {
      name: global.userinfo.firstname + ' ' + global.userinfo.lastname,
      email: global.userinfo.email,
      role: 'Teacher',
      photo:
        global.userinfo.photo === ''
          ? defaultImage
          : {uri: global.userinfo.photo},
    };
    this.info.user = users;

    this.maininfo.total = new Date(
      this.maininfo.year,
      new Date().getMonth() + 1,
      0,
    ).getDate();
    this.state = {
      maininfo: this.maininfo,
      selectedClass: [],
      selectedCheck: false,
      open: false,
      isLoading: true,
      studentListing: '',
      student: [],
      successModal: false,
      userRemark: {},
      indexCount: 0,
      _total: 0,
      faerr: false,
      cancelerr: false,
      setHoliday: 0,
      batchtemp: [],
      holidayModal: false,
      batchDate: null,
      centre_name: null,
      confirmModal: false,
      checkCount: null,
      faShow: false,
    };

    this.goBack = this.goBack.bind(this);
    this.select = this.select.bind(this);
    this.checkAll = this.checkAll.bind(this);
    this.checkPresent = this.checkPresent.bind(this);
    this.checkAbsent = this.checkAbsent.bind(this);
    this.studentInfo = this.studentInfo.bind(this);
    this.submitOverdue = this.submitOverdue.bind(this);
    this.markFA = this.markFA.bind(this);
    // this.markCancel = this.markCancel.bind(this);
    this.onSwipeLeft = this.onSwipeLeft.bind(this);
    this.onSwipeRight = this.onSwipeRight.bind(this);
    this.reschedule = this.reschedule.bind(this);
    this.markHoliday = this.markHoliday.bind(this);
    this.submitHoliday = this.submitHoliday.bind(this);
  }
  componentDidMount() {
    this.setState({isLoading: true, student: []});
    // console.log(this.props.route.params);
    let startdate = moment(this.props.route.params.date).format('D');
    let startmonth = moment(this.props.route.params.date).format('M');
    let startyear = moment(this.props.route.params.date).format('Y');

    let maininfoo = {
      month: this.month[startmonth - 1],
      year: startyear,
      date: this.selectDated,
    };
    maininfoo.total = new Date(startyear, startmonth, 0).getDate();

    // this.tempdate = {
    //     month: this.month[moment(this.props.route.params.date).format('M')],
    //     year: moment(this.props.route.params.date).format('Y'),
    //     date: moment(this.props.route.params.date).format('D'),
    // };

    this.setState({maininfo: maininfoo});

    POST(SERVER + 'users/pschedule.json', {
      selectedate: this.props.route.params.date,
    }).then(response => {
      this.setState({loading: false});
      if (response.error) {
        console.log(response.error);
      } else {
        this.setState({batchtemp: response.pending});
        if (this.props.route.params.data != '') {
          this.state.indexCount = this.props.route.params.data;
          this.setState({_total: this.props.route.params.total});
          this.props.route.params.data = '';
        } else {
          this.state.indexCount = this.state.indexCount;
          this.setState({_total: response.totalatt});
        }
        // console.log(response.pending);
        // console.log("Count : " + this.state.indexCount);
        // if (response.pending[this.state.indexCount].holiday == 1) {
        //   let bdate = moment(response.pending[this.state.indexCount].starttime).format('DD-MM-YYYY');
        //   this.setState({ setHoliday: 1, batchDate: bdate });
        // } else {
        //   this.setState({ setHoliday: 0, batchDate: null });
        // }

        this.setState({
          batchname: response.pending[this.state.indexCount].batchname,
          course: response.pending[this.state.indexCount].course,
          stime: response.pending[this.state.indexCount].stime,
          etime: response.pending[this.state.indexCount].etime,
          _total: this.state._total,
        });

        POST(SERVER + 'users/checkHoliday.json', {
          selectedate: this.props.route.params.date,
          centre_id: response.pending[this.state.indexCount].centre_id,
        }).then(response => {
          // console.log(response);

          if (response == null || response == undefined) {
            this.setState(state => ({
              isLoading: false,
            }));
          } else {
            // console.log(response.holiday);
            if (response.holiday == 1) {
              this.setState({setHoliday: 1, batchDate: response.batchdate});
            } else {
              this.setState({setHoliday: 0, batchDate: null});
            }
          }
          //  console.log(sdate);
        });

        POST(SERVER + 'api/showCentre.json', {
          centre_id: response.pending[this.state.indexCount].centre_id,
        }).then(response => {
          if (response.error) {
            console.log(response.error);
          } else {
            if (response.centre_id != null) {
              this.setState({centre_name: response.name});
            }
          }
        });
        this.getalertshow(
          response.pending[this.state.indexCount].schedule_id,
          response.pending[this.state.indexCount].schedule_date_id,
        );
        POST(SERVER + 'users/scheduleMore.json', {
          id: response.pending[this.state.indexCount].schedule_id,
          dateid: response.pending[this.state.indexCount].schedule_date_id,
        }).then(response => {
          this.setState({loading: false});
          if (response == null) {
          } else {
            if (response.displayFA == 'display:block') {
              this.setState({faShow: true});
            } else {
              this.setState({faShow: false});
            }

            this.setState({studentListing: response.schedule.classUsers});
            let i = 0;
            Object.keys(this.state.studentListing).map(key => {
              if (this.state.studentListing[key].sstatus == '') {
                this.state.studentListing[key] = {
                  ...this.state.studentListing[key],
                  statusSet: 0,
                };
                i++;
              } else {
                this.state.studentListing[key] = {
                  ...this.state.studentListing[key],
                  statusSet: 1,
                };
              }
              this.state.student.push(this.state.studentListing[key]);
            });

            this.setState({
              isLoading: false,
              checkCount: i,
            });
          }
        });
      }
    });
  }

  studentInfo(index) {
    this.selected = index;
    this.setState({open: true});
  }

  checkPresent() {
    let selected = this.state.selectedClass;

    if (selected == '') {
      Alert.alert(
        'Mark Present Alert',
        'Please select at least one student..!!',
      );
    } else {
      selected.forEach(value => {
        if (
          this.state.student[value].sstatus != 'freeze' &&
          this.state.student[value].sstatus != 'hold' &&
          this.state.student[value].statusSet == 0
        ) {
          if (this.state.student[value].sstatus != 'present') {
            this.state.student[value].sstatus = 'present';
          } else {
            this.state.student[value].sstatus = '';
          }
        }
      });
      this.setState({
        student: this.state.student,
        selectedClass: [],
        selectedCheck: false,
      });
    }
  }

  checkAbsent() {
    let selected = this.state.selectedClass;

    if (selected == '') {
      Alert.alert(
        'Mark Absent Alert',
        'Please select at least one student..!!',
      );
    } else {
      selected.forEach(value => {
        if (
          this.state.student[value].sstatus != 'freeze' &&
          this.state.student[value].sstatus != 'hold' &&
          this.state.student[value].statusSet == 0
        ) {
          if (this.state.student[value].sstatus != 'absent') {
            this.state.student[value].sstatus = 'absent';
          } else {
            this.state.student[value].sstatus = '';
          }
        }
      });
      this.setState({
        student: this.state.student,
        selectedClass: [],
        selectedCheck: false,
      });
    }
  }

  insertRemark() {
    var at = this.state.attendeeid;
    var r = this.state.remark;
    this.state.userRemark[at] = r;
    this.setState({remarkModal: false});
  }

  modalRemark(aid) {
    this.aid = aid;
    this.setState({remarkModal: true, attendeeid: aid});
  }
  getalertshow = async (id, dateid) => {
    try {
      let data = await POST(
        SERVER + 'users/scheduleFAPL.json?id=' + id + '&dateid=' + dateid,
        {
          permission: 'faculty',
          operation: 'fetch',
        },
      );
      this.alertshow = data.markedc;
    } catch (error) {}
  };
  markFA() {
    //code by shreedul START
    console.log(this.state.batchtemp[this.state.indexCount]);
    this.setState({faremarkModal: false, faerr: false});
    this.props.navigation.navigate('ScheduleCancel', {
      id: this.state.batchtemp[this.state.indexCount].schedule_id,
      dateid: this.state.batchtemp[this.state.indexCount].schedule_date_id,
      index: this.state.indexCount,
      date: this.props.route.params.date,
      total: this.state._total,
      time: this.state.stime + ' - ' + this.state.etime,
      batchname: this.state.batchname,
      _centrename: this.state.centre_name,
      _centre_id: this.state.batchtemp[this.state.indexCount].centre_id,
      alertshow: this.alertshow,
      navigate: 'overdue',
    }); //code by shreedul END
  }

  ShowAttendance = item => {
    this.props.navigation.navigate('ModuleAttendance', {
      index: this.state.indexCount,
      date: this.props.route.params.date,
      total: this.state._total,
      time: this.state.stime + ' - ' + this.state.etime,
      data: item,
      _centrename: this.state.centre_name,
      navigate: 'overdue',
    });
  };

  // markFA() {
  //   if (this.state.faremark != null) {
  //     this.setState({ faerr: false });
  //     POST(SERVER + 'api/requestfa.json', {
  //       id: this.state.batchtemp[this.state.indexCount].schedule_id,
  //       dateid: this.state.batchtemp[this.state.indexCount].schedule_date_id,
  //       coursename: this.state.batchtemp[this.state.indexCount].course,
  //       batchname: this.state.batchtemp[this.state.indexCount].batchname,
  //       remark: this.state.faremark,
  //       req: 'FA',
  //     }).then(res => {
  //       this.setState({
  //         faremarkModal: false,
  //         faremark: null,
  //       });
  //       Alert.alert(
  //         "FA Overdue Request Alert",
  //         "FA request has been sent to staff."
  //       );
  //       this.props.navigation.reset({ index: 0, routes: [{ name: 'OverdueList' }] });
  //     });
  //   } else {
  //     this.setState({ faerr: true });
  //   }
  // }

  // markCancel() {
  //   if (this.state.cancelremark != null) {
  //     this.setState({ cancelerr: false });
  //     POST(SERVER + 'api/requestfa.json', {
  //       id: this.state.batchtemp[this.state.indexCount].schedule_id,
  //       dateid: this.state.batchtemp[this.state.indexCount].schedule_date_id,
  //       coursename: this.state.batchtemp[this.state.indexCount].course,
  //       batchname: this.state.batchtemp[this.state.indexCount].batchname,
  //       remark: this.state.cancelremark,
  //       req: 'CANCEL',
  //     }).then(res => {
  //       this.setState({
  //         cancelremarkModal: false,
  //         cancelremark: null,
  //       });
  //       Alert.alert(
  //         "Cancel Overdue Request Alert",
  //         "Cancel request has been sent to staff."
  //       );
  //       this.props.navigation.reset({ index: 0, routes: [{ name: 'OverdueList' }] });
  //     });
  //   } else {
  //     this.setState({ cancelerr: true });
  //   }
  // }

  reschedule() {
    let selected = this.state.selectedClass;

    if (selected == '') {
      Alert.alert('Reschedule Alert', 'Please select one student..!!');
    } else {
      if (selected.length == 1) {
        selected.forEach(value => {
          if (
            this.state.student[value].sstatus == 'present' ||
            this.state.student[value].studenttype == 'switch' ||
            this.state.student[value].displayResch == 'none'
          ) {
            Alert.alert('Reschedule Alert', 'Reschedule not allowed!!');
            return;
          }
          if (
            (this.state.student[value].sstatus == '' ||
              this.state.student[value].sstatus == 'absent') &&
            this.state.student[value].studenttype != 'switch'
          ) {
            this.props.navigation.navigate('RescheduleBatch', {
              data: this.state.student[value],
              index: this.state.indexCount,
              date: this.props.route.params.date,
              total: this.state._total,
              time: this.state.stime + ' - ' + this.state.etime,
              batchname: this.state.batchname,
              _centrename: this.state.centre_name,
            });
          }
        });
      } else {
        Alert.alert(
          'Reschedule Alert',
          'Only one student selection allowed..!!',
        );
      }
    }
  }

  checkAll() {
    let selected = this.state.selectedClass;

    if (selected.length != []) {
      if (this.state.checkCount > selected.length) {
        Object.keys(this.state.student).map(key => {
          if (this.state.student[key].statusSet == 0) {
            selected[key] = Number(key);
            console.log(Number(key));
          }
        });
        this.setState({
          selectedClass: selected,
          selectedCheck: true,
        });
      } else {
        this.setState({
          selectedClass: [],
          selectedCheck: false,
        });
        return;
      }
    } else {
      Object.keys(this.state.student).map(key => {
        if (this.state.student[key].statusSet == 0) {
          selected[key] = Number(key);
          console.log(Number(key));
        }
      });
      this.setState({
        selectedClass: selected,
        selectedCheck: true,
      });
      return;
    }
  }

  select(index) {
    // console.log(index);
    let selected = this.state.selectedClass;
    if (!selected.includes(index)) {
      selected[selected.length] = index;
    } else {
      selected = selected.filter(function (ele) {
        return ele != index;
      });
    }

    this.setState({
      selectedClass: selected,
    });
  }

  goBack() {
    this.props.navigation.reset({index: 0, routes: [{name: 'OverdueList'}]});
  }

  // changeMonth(month) {
  //     this.currentMonth = month;
  //     const _d = new Date();
  //     _d.setMonth(new Date().getMonth() + this.currentMonth);
  //     this.maininfo = {
  //         month: this.month[_d.getMonth()],
  //         year: _d.getYear() + 1900,
  //         date: 1,
  //     };
  //     this.maininfo.total = new Date(
  //         this.maininfo.year,
  //         new Date().getMonth() + 1 + this.currentMonth,
  //         0,
  //     ).getDate();
  //     this.setState({ maininfo: this.maininfo });
  // }

  // changeDate(index) {
  //     this.maininfo.date = index;
  //     this.setState({ maininfo: this.maininfo });
  // }

  confirmBox = () => {
    this.flag = 0;
    Object.keys(this.state.student).map(key => {
      if (this.state.student[key].sstatus == '') {
        this.flag = 1;
      }
    });

    if (this.flag != 1) {
      this.setState({confirmModal: true});
    } else {
      this.setState({confirmModal: false});
      Alert.alert(
        'Overdue Attendance Alert',
        'Please mark all students attendance..!!',
      );
    }
  };

  submitOverdue() {
    this.flag = 0;
    Object.keys(this.state.student).map(key => {
      if (this.state.student[key].sstatus == '') {
        this.flag = 1;
      }
    });

    if (this.flag != 1) {
      this.selectedUser = {};
      Object.keys(this.state.student).map(key => {
        var at = this.state.student[key].schedule_attendee_id;
        var st = this.state.student[key].sstatus;
        this.selectedUser[at] = st;
      });

      POST(SERVER + 'users/overdueDetails.json', {
        sid: this.state.batchtemp[this.state.indexCount].schedule_id,
        did: this.state.batchtemp[this.state.indexCount].schedule_date_id,
        coursename: this.state.batchtemp[this.state.indexCount].course,
        batchname: this.state.batchtemp[this.state.indexCount].batchname,
        attendee_id: this.selectedUser,
        remark: this.state.userRemark,
      }).then(res => {
        this.setState({userRemark: []});
        Alert.alert(
          'Overdue Attendance Alert',
          'Mark attendance request has been sent to staff.',
        );
        this.props.navigation.reset({
          index: 0,
          routes: [{name: 'OverdueList'}],
        });
      });
    } else {
      Alert.alert(
        'Overdue Attendance Alert',
        'Please mark all students attendance..!!',
      );
    }
  }

  markHoliday() {
    this.setState({holidayModal: true});
  }

  submitHoliday() {
    this.setState({holidayModal: false});

    POST(SERVER + 'users/markHoliday.json', {
      id: this.state.batchtemp[this.state.indexCount].schedule_id,
      dateid: this.state.batchtemp[this.state.indexCount].schedule_date_id,
      centre_id: this.state.batchtemp[this.state.indexCount].centre_id,
    }).then(response => {
      if (response.error) {
        console.log(response.error);
      } else {
        this.props.navigation.reset({
          index: 0,
          routes: [{name: 'OverdueList'}],
        });
        Alert.alert('Holiday Alert', 'Mark holiday successfull!');
      }
    });
  }

  onSwipeLeft(gestureState) {
    if (this.state.indexCount != this.state._total - 1) {
      this.setState(state => ({
        indexCount: state.indexCount + 1,
      }));
      this.setState({student: []});
      //console.log("Left : index-" + this.state.indexCount);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.indexCount !== prevState.indexCount) {
      this.componentDidMount();
    }
    if (this.props.route.params.date !== prevProps.route.params.date) {
      this.componentDidMount();
    }
  }

  onSwipeRight(gestureState) {
    if (this.state.indexCount != 0) {
      this.setState(state => ({
        indexCount: state.indexCount - 1,
      }));
      this.setState({student: []});
      //console.log("Right : index-" + this.state.indexCount);
    }
  }

  /**
   * called to display page
   * @returns
   */
  render() {
    let config = {
      velocityThreshold: 0.3,
      directionalOffsetThreshold: 80,
    };
    setTimeout(() => {
      let position = (this.state.maininfo.date - 1.3) * 50;
      if (position < 1) {
        position = 0;
      }
      this.scrollRef.scrollTo({x: position, y: 0, animated: true});
    }, 50);
    return (
      <KeyboardAvoidingView
        behavior="position"
        contentContainerStyle={{height: height - 90}}>
        <View
          style={{flex: 1, backgroundColor: PROPERTY.headerColorBackground}}
          showsVerticalScrollIndicator={false}>
          <Animatable.View
            animation="fadeInUpBig"
            style={{width: width, flex: 20}}>
            <View
              style={{flexDirection: 'row', paddingTop: 20, paddingLeft: 10}}>
              <TouchableOpacity
                onPress={() => {
                  this.goBack();
                }}>
                <View style={{paddingLeft: 20, paddingTop: 25}}>
                  <Icon name={'chevron-left'} size={20} />
                </View>
              </TouchableOpacity>
              <View style={{flex: 30, alignItems: 'flex-start'}}>
                <Image
                  source={this.info.user.photo}
                  style={{...STYLES.topPhoto}}
                />
              </View>
              <View
                style={{
                  flex: 70,
                  alignItems: 'flex-start',
                  justifyContent: 'center',
                  paddingTop: 12,
                  paddingRight: 30,
                }}>
                <Text style={{...STYLES.fontLarge, color: PROPERTY.fontColor}}>
                  {this.info.user.name}
                </Text>
                <Text style={{...STYLES.fontSmall, color: PROPERTY.fontColor}}>
                  {this.info.user.role}
                </Text>
              </View>
            </View>
          </Animatable.View>
          {/* <Users /> */}
          <Animatable.View
            animation="fadeInUpBig"
            style={{
              ...STYLES.topCurvedPage,
              width: width,
              flex: 80,
              marginTop: -50,
            }}>
            <View style={{backgroundColor: PROPERTY.innerColorBackground}}>
              <View
                style={{
                  flexDirection: 'row',
                  paddingTop: 5,
                  paddingLeft: 15,
                  paddingRight: 15,
                }}>
                <View style={{flex: 1, alignItems: 'flex-start'}}></View>
                <View style={{...STYLES.calendarHeader, flex: 98}}>
                  <View style={{flexDirection: 'row'}}>
                    {/* <TouchableOpacity
                      style={{ alignItems: 'flex-start' }}
                      onPress={() => { }}>
                      <Icon
                        style={{ paddingRight: 70, paddingTop: 4 }}
                        name={'chevron-left'}
                        size={20}
                      />
                    </TouchableOpacity> */}
                    <Text style={{...STYLES.fontLarge, fontWeight: 'bold'}}>
                      {this.state.maininfo.month +
                        ' ' +
                        this.state.maininfo.year}
                    </Text>
                    {/* <TouchableOpacity
                      style={{ alignSelf: 'flex-end' }}
                      onPress={() => { }}>
                      <Icon
                        style={{ paddingLeft: 70, paddingBottom: 3 }}
                        name={'chevron-right'}
                        size={20}
                      />
                    </TouchableOpacity> */}
                  </View>
                </View>
                <View style={{flex: 1, alignItems: 'flex-end'}}></View>
              </View>

              <View style={{height: 70}}>
                <ScrollView
                  ref={ref => {
                    this.scrollRef = ref;
                  }}
                  style={{width: width, height: 50, marginTop: 10}}
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  showsVerticalScrollIndicator={false}>
                  <View
                    style={{
                      width: 58.8 * this.state.maininfo.total,
                      flexDirection: 'row',
                    }}>
                    {[...Array(this.state.maininfo.total)].map((val, ind) => {
                      ind = parseInt(ind) + 1;
                      let css = {};
                      let css1 = {};
                      if (ind === 2) {
                        css = {
                          backgroundColor: PROPERTY.greenColor,
                          borderWidth: 1,
                          fontColor: 'white',
                          borderColor: PROPERTY.calendarHeaderBorderColor,
                          borderRadius: 5,
                          margin: 4.4,
                        };
                      } else if (ind == 3) {
                        css = {
                          backgroundColor: PROPERTY.bwColor,
                          borderWidth: 1,
                          borderColor: PROPERTY.calendarHeaderBorderColor,
                          borderRadius: 5,
                          margin: 4.4,
                        };
                        css1 = {color: PROPERTY.overdueColor};
                      } else if (ind == this.state.maininfo.date) {
                        css = {
                          backgroundColor: PROPERTY.selectedColor,
                          borderWidth: 1,
                          fontColor: 'white',
                          borderColor: PROPERTY.calendarHeaderBorderColor,
                          borderRadius: 5,
                          margin: 4.4,
                        };
                        css1 = {color: PROPERTY.selectedColorText};
                      } else {
                        css = {
                          backgroundColor: PROPERTY.bwColor,
                          borderWidth: 1,
                          borderColor: PROPERTY.calendarHeaderBorderColor,
                          borderRadius: 5,
                          margin: 4.4,
                        };
                      }
                      return (
                        <View
                          key={'calendar' + ind}
                          style={{
                            width: 50,
                            paddingTop: 10,
                            alignItems: 'center',
                            ...css,
                          }}>
                          {/* <TouchableOpacity onPress={() => { }}> */}
                          <View>
                            <Text
                              style={{
                                ...STYLES.fontNormal,
                                color: PROPERTY.scrollDateColor,
                                ...css1,
                              }}>
                              {ind}
                            </Text>
                          </View>
                          {/* </TouchableOpacity> */}
                        </View>
                      );
                    })}
                  </View>
                </ScrollView>
              </View>
            </View>
            {/** Display class list if non of the class is selected */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 10,
              }}>
              {[...Array(this.state._total)].map((val, i) => {
                i = parseInt(i);
                let css = {};
                if (this.state.indexCount == i) {
                  css = {
                    width: 15,
                    height: 15,
                    backgroundColor: PROPERTY.selectedColor,
                    borderRadius: 20,
                    marginRight: 10,
                    overflow: 'hidden',
                  };
                } else {
                  css = {
                    width: 15,
                    height: 15,
                    backgroundColor: PROPERTY.bwColor,
                    borderRadius: 20,
                    marginRight: 10,
                    overflow: 'hidden',
                  };
                }
                return <View style={{...css}} key={i} />;
              })}
            </View>
            <GestureRecognizer
              onSwipeLeft={state => this.onSwipeLeft(this.state)}
              onSwipeRight={state => this.onSwipeRight(this.state)}
              config={config}
              style={{
                flex: 1,
                backgroundColor: this.state.backgroundColor,
              }}>
              <View
                style={{
                  height: height * 0.56,
                  margin: 22,
                  marginTop: 15,
                  borderWidth: 2,
                  borderRadius: 5,
                  borderColor: PROPERTY.selectedColor,
                  backgroundColor: PROPERTY.innerColorBackground,
                }}>
                {this.state.isLoading && (
                  <ActivityIndicator
                    size="large"
                    color={PROPERTY.selectedColor}
                    style={{marginTop: 210}}
                  />
                )}
                {!this.state.isLoading && (
                  <View>
                    <Text
                      style={{
                        textAlign: 'center',
                        fontSize: 22,
                        color: PROPERTY.overdueColor,
                        paddingTop: 2,
                      }}>
                      {this.state.stime} - {this.state.etime}
                    </Text>
                    <Text
                      style={{
                        textAlign: 'center',
                        fontSize: 18,
                        color: PROPERTY.overdueColor,
                        paddingTop: 2,
                      }}>
                      {this.state.centre_name} - {this.state.batchname}
                    </Text>
                    <View style={{flexDirection: 'row', marginTop: 25}}>
                      <View
                        style={
                          this.state.setHoliday == 0 ? {flex: 51} : {flex: 39}
                        }>
                        {!this.state.selectedCheck && (
                          <TouchableOpacity
                            onPress={() => {
                              this.checkAll();
                            }}>
                            <View style={{paddingLeft: 8, marginTop: -3}}>
                              <Icon
                                name={'square-o'}
                                size={45}
                                color={PROPERTY.buttonColor}
                              />
                            </View>
                          </TouchableOpacity>
                        )}
                        {this.state.selectedCheck && (
                          <TouchableOpacity
                            onPress={() => {
                              this.checkAll();
                            }}>
                            <View style={{paddingLeft: 8, marginTop: -3}}>
                              <Icon
                                name={'check-square-o'}
                                size={45}
                                color={PROPERTY.buttonColor}
                              />
                            </View>
                          </TouchableOpacity>
                        )}
                      </View>
                      <View
                        style={
                          this.state.setHoliday == 0 ? {flex: 49} : {flex: 61}
                        }>
                        <View style={{flexDirection: 'row'}}>
                          {/* <TouchableOpacity

                            onPress={() => {
                              this.setState({ cancelremarkModal: true });
                            }}>
                            <View style={{ ...STYLES.scheduleBtn }}>
                              <Text style={{ ...STYLES.scheduleBtnText }}>C</Text>
                            </View>
                          </TouchableOpacity> */}
                          {this.state.faShow == true && (
                            <TouchableOpacity
                              onPress={() => {
                                this.setState({faremarkModal: true});
                              }}>
                              <View
                                style={{
                                  ...STYLES.scheduleBtn,
                                  paddingLeft: 7,
                                  paddingRight: 7,
                                }}>
                                <Text style={{...STYLES.scheduleBtnText}}>
                                  FA
                                </Text>
                              </View>
                            </TouchableOpacity>
                          )}

                          <TouchableOpacity
                            onPress={() => {
                              this.checkPresent();
                            }}>
                            <View style={{...STYLES.scheduleBtn}}>
                              <Text style={{...STYLES.scheduleBtnText}}>P</Text>
                            </View>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => {
                              this.checkAbsent();
                            }}>
                            <View style={{...STYLES.scheduleBtn}}>
                              <Text style={{...STYLES.scheduleBtnText}}>A</Text>
                            </View>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => {
                              this.reschedule();
                            }}>
                            <View
                              style={{
                                borderRadius: 5,
                                margin: 3,
                                marginTop: 0,
                                paddingLeft: 9,
                                paddingRight: 9,
                                paddingTop: 9,
                                paddingBottom: 9,
                                backgroundColor: PROPERTY.buttonColor,
                              }}>
                              <Icon
                                name={'exchange'}
                                size={18}
                                color={'#E8E8E9'}
                              />
                            </View>
                          </TouchableOpacity>
                          {this.state.setHoliday == 1 && (
                            <TouchableOpacity onPress={this.markHoliday}>
                              <View
                                style={{
                                  ...STYLES.scheduleBtn2,
                                }}>
                                <Text style={{...STYLES.scheduleBtnText}}>
                                  MH
                                </Text>
                              </View>
                            </TouchableOpacity>
                          )}
                        </View>
                      </View>
                    </View>
                    <View
                      style={{
                        height: height - 590,
                        marginTop: 15,
                        marginLeft: 5,
                        marginRight: 10,
                      }}>
                      <FlatList
                        style={{height: height}}
                        data={this.state.student}
                        renderItem={({item, index}) => (
                          <View style={{flexDirection: 'row'}}>
                            {!this.state.selectedClass.includes(index) && (
                              <TouchableOpacity
                                style={{flex: 10, marginLeft: 5}}
                                onPress={() => {
                                  if (
                                    item.sstatus != 'freeze' &&
                                    item.sstatus != 'hold' &&
                                    item.statusSet == 0
                                  ) {
                                    this.select(index);
                                  }
                                }}>
                                {item.sstatus != 'freeze' &&
                                  item.sstatus != 'hold' &&
                                  item.statusSet == 0 && (
                                    <View style={{marginTop: 5}}>
                                      <Icon name={'square-o'} size={32} />
                                    </View>
                                  )}
                              </TouchableOpacity>
                            )}
                            {this.state.selectedClass.includes(index) && (
                              <TouchableOpacity
                                style={{flex: 10, marginLeft: 5}}
                                onPress={() => {
                                  this.select(index);
                                }}>
                                {item.sstatus != 'freeze' &&
                                  item.sstatus != 'hold' && (
                                    <View style={{marginTop: 5}}>
                                      <Icon name={'check-square-o'} size={32} />
                                    </View>
                                  )}
                              </TouchableOpacity>
                            )}
                            <TouchableOpacity
                              style={{flex: 60}}
                              onPress={() => {
                                this.ShowAttendance(item);
                              }}>
                              <View
                                style={
                                  item.sstatus != 'freeze' &&
                                  item.sstatus != 'hold' &&
                                  item.studenttype != 'switch'
                                    ? {
                                        marginBottom: 10,
                                        padding: 10,
                                        borderRadius: 10,
                                        marginHorizontal: 10,
                                        backgroundColor:
                                          PROPERTY.calendarHeaderBackground,
                                      }
                                    : item.studenttype == 'switch'
                                    ? {
                                        marginBottom: 10,
                                        padding: 10,
                                        borderRadius: 10,
                                        marginHorizontal: 10,
                                        backgroundColor: PROPERTY.redColor,
                                      }
                                    : {
                                        marginBottom: 10,
                                        padding: 10,
                                        borderRadius: 10,
                                        marginHorizontal: 10,
                                        backgroundColor: PROPERTY.redColor,
                                      }
                                }>
                                {item.sstatus != 'freeze' &&
                                  item.sstatus != 'hold' && (
                                    <View>
                                      <Text style={{...STYLES.fontSmall}}>
                                        {item.firstname} {item.lastname}
                                      </Text>
                                    </View>
                                  )}
                                {item.sstatus === 'freeze' && (
                                  <View>
                                    <Text style={{...STYLES.fontSmall}}>
                                      {item.firstname} {item.lastname}
                                    </Text>
                                  </View>
                                )}

                                {item.sstatus === 'hold' && (
                                  <View>
                                    <Text style={{...STYLES.fontSmall}}>
                                      {item.firstname} {item.lastname}
                                    </Text>
                                  </View>
                                )}
                              </View>
                            </TouchableOpacity>
                            <View style={{flex: 18}}>
                              <View
                                style={
                                  item.sstatus != 'freeze' &&
                                  item.sstatus != 'hold'
                                    ? {
                                        borderWidth: 2,
                                        borderRadius: 5,
                                        borderColor: PROPERTY.selectedColor,
                                        margin: 7,
                                        paddingTop: 4,
                                        paddingBottom: 6,
                                        marginTop: 0,
                                      }
                                    : {
                                        borderWidth: 2,
                                        borderRadius: 5,
                                        borderColor: PROPERTY.selectedColor,
                                        margin: 7,
                                        paddingTop: 4,
                                        paddingBottom: 6,
                                        marginTop: 0,
                                        backgroundColor: PROPERTY.redColor,
                                      }
                                }>
                                {item.sstatus === 'reschedule' && (
                                  <Icon
                                    name={'refresh'}
                                    color={color}
                                    size={25}
                                  />
                                )}
                                {item.sstatus === 'present' && (
                                  <Text
                                    style={{
                                      textAlign: 'center',
                                      fontWeight: 'bold',
                                      fontSize: 18,
                                    }}>
                                    P
                                  </Text>
                                )}
                                {item.sstatus === 'absent' &&
                                  item.deleted != 1 && (
                                    <Text
                                      style={{
                                        textAlign: 'center',
                                        fontWeight: 'bold',
                                        fontSize: 18,
                                      }}>
                                      A
                                    </Text>
                                  )}
                                {item.deleted == 1 && (
                                  <Text
                                    style={{
                                      textAlign: 'center',
                                      fontWeight: 'bold',
                                      fontSize: 18,
                                    }}>
                                    D
                                  </Text>
                                )}
                                {item.sstatus === 'hold' && (
                                  <Text
                                    style={{
                                      textAlign: 'center',
                                      fontWeight: 'bold',
                                      fontSize: 18,
                                    }}>
                                    OH
                                  </Text>
                                )}
                                {item.sstatus === 'freeze' && (
                                  <Text
                                    style={{
                                      textAlign: 'center',
                                      fontWeight: 'bold',
                                      fontSize: 18,
                                    }}>
                                    OF
                                  </Text>
                                )}
                                {item.sstatus === '' && (
                                  <Text
                                    style={{
                                      textAlign: 'center',
                                      fontWeight: 'bold',
                                      fontSize: 18,
                                    }}></Text>
                                )}
                              </View>
                            </View>
                            <View style={{flex: 12}}>
                              <TouchableOpacity
                                style={{
                                  borderRadius: 5,
                                  paddingTop: 7,
                                  paddingBottom: 7,
                                  marginTop: 1,
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  backgroundColor: PROPERTY.buttonColor,
                                }}
                                onPress={() => {
                                  this.modalRemark(item.schedule_attendee_id);
                                }}>
                                <Icon
                                  name={'comment'}
                                  size={22}
                                  color={'#E8E8E9'}
                                />
                              </TouchableOpacity>
                            </View>
                          </View>
                        )}
                        keyExtractor={(item, index) => index}
                      />
                    </View>
                    <View
                      style={{flexDirection: 'row', marginTop: height - 800}}>
                      <View
                        style={{
                          flex: 1,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <Text style={{color: PROPERTY.overdueColor}}>
                          Send request for this batch?
                        </Text>
                      </View>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                      <View style={{flex: 2}}></View>
                      <View style={{flex: 4, marginEnd: 5}}>
                        <Button
                          onPress={this.goBack}
                          color={PROPERTY.bwColor}
                          mode="contained"
                          style={{
                            ...STYLES.button,
                            paddingTop: 0,
                          }}>
                          Cancel
                        </Button>
                      </View>
                      <View style={{flex: 4, marginStart: 5}}>
                        <Button
                          onPress={this.confirmBox}
                          //onPress={() => { this.submitOverdue() }}
                          color={PROPERTY.buttonColor}
                          mode="contained"
                          style={{
                            ...STYLES.button,
                            paddingTop: 0,
                          }}>
                          Submit
                        </Button>
                      </View>
                      <View style={{flex: 2}}></View>
                    </View>
                  </View>
                )}
              </View>
            </GestureRecognizer>
          </Animatable.View>

          {/** Remark Modal Dialog */}
          <Modal
            visible={this.state.remarkModal}
            dismissable={false}
            contentContainerStyle={{
              ...STYLES.modalDialog,
              backgroundColor: PROPERTY.background,
            }}>
            <TouchableOpacity
              onPress={() => {
                this.setState({remarkModal: false});
              }}>
              <Image
                source={require('../../Assets/icons/close.png')}
                style={{
                  resizeMode: 'contain',
                  width: 40,
                  height: 40,
                  marginLeft: width - 84,
                  marginTop: 5,
                }}
              />
            </TouchableOpacity>

            <View style={{paddingTop: 0, paddingLeft: 20}}>
              <Text style={{...STYLES.fontNormal, fontWeight: 'bold'}}></Text>
            </View>

            <View
              style={{
                width: width - 80,
                height: 150,
                backgroundColor: PROPERTY.bwColor,
                paddingTop: 20,
                padding: 15,
                borderRadius: 20,
                marginStart: 20,
              }}>
              <TextInput
                multiline={true}
                numberOfLines={5}
                placeholder="Enter student remark.."
                style={{fontSize: 18, backgroundColor: PROPERTY.bwColor}}
                ref={el => {
                  this.remark = el;
                }}
                onChangeText={remark => this.setState({remark})}
                defaultValue={this.state.userRemark[this.aid]}
              />
            </View>
            <View style={{flexDirection: 'row', paddingTop: 10}}>
              <View style={{flex: 1, padding: 5}}></View>
              <View style={{flex: 1, paddingTop: 5}}>
                <Button
                  color={PROPERTY.buttonColor}
                  mode="contained"
                  style={{...STYLES.button, height: 40, paddingTop: 0}}
                  onPress={this.insertRemark.bind(this)}>
                  Submit
                </Button>
              </View>
              <View style={{flex: 1, padding: 5}}></View>
            </View>
          </Modal>

          {/** faRemark Modal Dialog */}
          <Modal
            visible={this.state.faremarkModal}
            dismissable={false}
            contentContainerStyle={{
              ...STYLES.modalDialog,
              backgroundColor: PROPERTY.background,
            }}>
            <TouchableOpacity
              onPress={() => {
                this.setState({faremarkModal: false, faerr: false});
              }}>
              <Image
                source={require('../../Assets/icons/close.png')}
                style={{
                  resizeMode: 'contain',
                  width: 40,
                  height: 40,
                  marginLeft: width - 84,
                  marginTop: 5,
                }}
              />
            </TouchableOpacity>

            <View style={{paddingTop: 0, paddingLeft: 20, marginTop: 10}}>
              <Text style={{fontSize: 18, fontWeight: '500'}}>
                Do you want to Proceed to Mark FA for all students in this batch
              </Text>
            </View>
            <View style={{flexDirection: 'row', paddingTop: 10}}>
              <View style={{flex: 9, padding: 5}}></View>
              <View style={{flex: 40, paddingTop: 5}}>
                <Button
                  color={PROPERTY.overdueColor}
                  mode="contained"
                  style={{...STYLES.button, height: 40, paddingTop: 0}}
                  onPress={() => {
                    this.setState({faremarkModal: false, faerr: false});
                  }}>
                  Cancel
                </Button>
              </View>
              <View style={{flex: 2, padding: 5}}></View>
              <View style={{flex: 40, paddingTop: 5}}>
                <Button
                  color={PROPERTY.buttonColor}
                  mode="contained"
                  style={{...STYLES.button, height: 40, paddingTop: 0}}
                  onPress={this.markFA.bind(this)}>
                  Proceed
                </Button>
              </View>
              <View style={{flex: 9, padding: 5}}></View>
            </View>
          </Modal>

          {/** cancelRemark Modal Dialog */}
          {/* <Modal
            visible={this.state.cancelremarkModal}
            dismissable={false}
            contentContainerStyle={{
              ...STYLES.modalDialog,
              backgroundColor: PROPERTY.background,
            }}>
            <TouchableOpacity
              onPress={() => {
                this.setState({ cancelremarkModal: false, cancelerr: false });
              }}>
              <Image
                source={require('../../Assets/icons/close.png')}
                style={{
                  resizeMode: 'contain',
                  width: 40,
                  height: 40,
                  marginLeft: width - 84,
                  marginTop: 5,
                }}
              />
            </TouchableOpacity>

            <View style={{ paddingTop: 0, paddingLeft: 20 }}>
              <Text style={{ ...STYLES.fontNormal, fontWeight: 'bold' }}></Text>
            </View>

            <View
              style={{
                width: width - 80,
                height: 150,
                backgroundColor: PROPERTY.bwColor,
                paddingTop: 20,
                padding: 15,
                borderRadius: 20,
                marginStart: 20,
              }}>
              <TextInput
                multiline={true}
                numberOfLines={5}
                placeholder="Enter cancel remark.."
                style={{ fontSize: 18, backgroundColor: PROPERTY.bwColor }}
                ref={el => {
                  this.cancelremark = el;
                }}
                onChangeText={cancelremark => this.setState({ cancelremark })}
              />
            </View>
            {this.state.cancelerr && (
              <View
                style={{
                  marginStart: width - 325,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text style={{ color: PROPERTY.overdueColor }}>
                  Cancel remark field should not be empty..
                </Text>
              </View>
            )}
            <View style={{ flexDirection: 'row', paddingTop: 10 }}>
              <View style={{ flex: 1, padding: 5 }}></View>
              <View style={{ flex: 1, paddingTop: 5 }}>
                <Button
                  color={PROPERTY.buttonColor}
                  mode="contained"
                  style={{ ...STYLES.button, height: 40, paddingTop: 0 }}
                  onPress={this.markCancel.bind(this)}>
                  Submit
                </Button>
              </View>
              <View style={{ flex: 1, padding: 5 }}></View>
            </View>
          </Modal> */}

          {/** Success Modal Dialog */}
          <Modal
            visible={this.state.successModal}
            dismissable={false}
            contentContainerStyle={{
              ...STYLES.modalDialog,
              backgroundColor: PROPERTY.background,
              marginBottom: 40,
            }}>
            <View style={{flexDirection: 'row', paddingTop: 20}}>
              <View style={{flex: 12, padding: 5}}>
                <View
                  style={{
                    width: width - 100,
                    height: 70,
                    backgroundColor: PROPERTY.bwColor,
                    paddingTop: 20,
                    borderRadius: 20,
                  }}>
                  <Text
                    style={{
                      fontSize: 18,
                      color: PROPERTY.green,
                      paddingStart: 10,
                    }}>
                    Request sent successfully...
                  </Text>
                </View>
                <TouchableOpacity
                  style={{marginTop: -63}}
                  onPress={() => {
                    this.setState({successModal: false});
                    this.props.navigation.navigate('OverdueList');
                  }}>
                  <Image
                    source={require('../../Assets/icons/close.png')}
                    style={{
                      resizeMode: 'contain',
                      width: 40,
                      height: 40,
                      marginLeft: width - 90,
                      marginTop: 8,
                    }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
          {/** Holiday Modal Dialog */}
          <Modal
            visible={this.state.holidayModal}
            dismissable={false}
            contentContainerStyle={{
              ...STYLES.modalDialog,
              backgroundColor: PROPERTY.background,
            }}>
            <TouchableOpacity
              onPress={() => {
                this.setState({holidayModal: false, faerr: false});
              }}>
              <Image
                source={require('../../Assets/icons/close.png')}
                style={{
                  resizeMode: 'contain',
                  width: 40,
                  height: 40,
                  marginLeft: width - 84,
                  marginTop: 5,
                }}
              />
            </TouchableOpacity>

            <View style={{paddingTop: 0, paddingLeft: 20, marginTop: 10}}>
              <Text style={{fontSize: 18, fontWeight: '500'}}>
                Do you want to Proceed to Mark Holiday for all students in this
                batch
              </Text>
            </View>
            <View style={{flexDirection: 'row', paddingTop: 10}}>
              <View style={{flex: 9, padding: 5}}></View>
              <View style={{flex: 40, paddingTop: 5}}>
                <Button
                  color={PROPERTY.overdueColor}
                  mode="contained"
                  style={{...STYLES.button, height: 40, paddingTop: 0}}
                  onPress={() => {
                    this.setState({holidayModal: false, faerr: false});
                  }}>
                  Cancel
                </Button>
              </View>
              <View style={{flex: 2, padding: 5}}></View>
              <View style={{flex: 40, paddingTop: 5}}>
                <Button
                  color={PROPERTY.buttonColor}
                  mode="contained"
                  style={{...STYLES.button, height: 40, paddingTop: 0}}
                  onPress={this.submitHoliday.bind(this)}>
                  Proceed
                </Button>
              </View>
              <View style={{flex: 9, padding: 5}}></View>
            </View>
          </Modal>

          {/** confirmation Modal Dialog */}
          <Modal
            visible={this.state.confirmModal}
            dismissable={false}
            contentContainerStyle={{
              ...STYLES.modalDialog,
              backgroundColor: PROPERTY.background,
              marginTop: 15,
            }}>
            <TouchableOpacity
              onPress={() => {
                this.setState({confirmModal: false});
              }}>
              <Image
                source={require('../../Assets/icons/close.png')}
                style={{
                  resizeMode: 'contain',
                  width: 40,
                  height: 40,
                  marginLeft: 325,
                  marginTop: 8,
                }}
              />
            </TouchableOpacity>

            <View style={{paddingTop: 0, paddingLeft: 20}}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: '500',
                  marginTop: -25,
                  color: PROPERTY.overdueColor,
                }}>
                Confirmation Alert
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '500',
                  marginTop: 15,
                  paddingLeft: 5,
                }}>
                Mark attendance request for :
              </Text>
            </View>
            <View style={{width: width - 80, marginLeft: 15, marginTop: 10}}>
              {this.state.student.map((value, index) => {
                return (
                  value.statusSet == 0 && (
                    <View
                      style={{
                        marginTop: 5,
                        marginLeft: 10,
                        borderRadius: 10,
                        backgroundColor: PROPERTY.calendarHeaderBackground,
                        height: 43,
                      }}
                      key={'content' + index}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          margin: 10,
                        }}>
                        <Text
                          style={{
                            fontSize: 16,
                            paddingLeft: 9,
                            color: PROPERTY.overdueColor,
                          }}>
                          {value.firstname} {value.lastname} : {value.sstatus}
                        </Text>
                      </View>
                    </View>
                  )
                );
              })}
            </View>
            <View style={{flexDirection: 'row', paddingTop: 10}}>
              <View style={{flex: 9, padding: 5}}></View>
              <View style={{flex: 40, paddingTop: 5}}>
                <Button
                  color={PROPERTY.overdueColor}
                  mode="contained"
                  style={{...STYLES.button, height: 40, paddingTop: 0}}
                  onPress={() => {
                    this.setState({confirmModal: false});
                  }}>
                  Cancel
                </Button>
              </View>
              <View style={{flex: 2, padding: 5}}></View>
              <View style={{flex: 40, paddingTop: 5}}>
                <Button
                  color={PROPERTY.buttonColor}
                  mode="contained"
                  style={{...STYLES.button, height: 40, paddingTop: 0}}
                  onPress={this.submitOverdue.bind(this)}>
                  Proceed
                </Button>
              </View>
              <View style={{flex: 9, padding: 5}}></View>
            </View>
          </Modal>
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

export default connect(mapstate)(OverdueBatch);
