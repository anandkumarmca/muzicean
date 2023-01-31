import React from 'react';
import {
  View,
  Image,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  StyleSheet,
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
import Users from '../Component/User';
import moment from 'moment';
import Month from '../Component/Month';
import BottomDrawer from '../Component/Drawer';

class FacultyScheduleDetails extends React.Component {
  scrollRef = null;
  currentMonth = 0;
  fastart = null;
  selected = null;
  fa_allow = '';
  alertshow = 0;
  checktotal = 0;
  selectDated = new Date().getDate();
  info = {};
  maininfo = {
    month: Month[new Date().getMonth()],
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
      open: false,
      indexCount: 0,
      batchname: '',
      currentpage: false,
      starttime: '',
      totalcount: 0,
      endtime: '',
      id: 0,
      _centre_id: 0,
      _centrename: '',
      dateid: 0,
      isLoading: false,
      isSwiped: false,
      studentListing: '',
      batchListing: '',
      donotdisplay: 0,
      selectedDate: null,
      student: [],
      faremark: '',
      setHoliday: 0,
      holidayModal: false,
      batchDate: null,
    };

    this.goBack = this.goBack.bind(this);
    this.select = this.select.bind(this);
    this.checkAll = this.checkAll.bind(this);
    this.checkPresent = this.checkPresent.bind(this);
    this.checkAbsent = this.checkAbsent.bind(this);
    this.reschedule = this.reschedule.bind(this);
    this.studentInfo = this.studentInfo.bind(this);
    this.markAttendence = this.markAttendence.bind(this);
    this.checkUnfreeze = this.checkUnfreeze.bind(this);
    this.changeDate = this.changeDate.bind(this);
    this.changeMonth = this.changeMonth.bind(this);
    this.markFA = this.markFA.bind(this);
    this.onSwipeLeft = this.onSwipeLeft.bind(this);
    this.onSwipeRight = this.onSwipeRight.bind(this);
    this.closeModel = this.closeModel.bind(this);
    this.markUnhold = this.markUnhold.bind(this);
    this.markUnfreeze = this.markUnfreeze.bind(this);
    this.submitHoliday = this.submitHoliday.bind(this);
    this.markHoliday = this.markHoliday.bind(this);
    this.getalertshow = this.getalertshow.bind(this);
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
  componentDidMount() {
    this.setState({
      totalcount: 0,
      student: [],
      batchname: '',
      starttime: '',
      endtime: '',
      selectedClass: [],
      donotdisplay: 0,
      _centre_id: 0,
      _centrename: '',
      _selectedDay: '',
      showFA: false,
    });

    console.log(this.props.route.params.title);

    if (this.props.route.params.navigate == 'pending') {
      this.setState({showFA: true});
    }

    this.checktotal = this.props.route.params._total;

    if (
      this.state.currentpage == false &&
      this.checktotal > 0 &&
      this.props.route.params.title != 'batch'
    ) {
      this.setState({totalcount: this.props.route.params._total});

      this.c_date = moment().format('DD/MM/YYYY');
      this.setState({sdate: this.c_date});
      let sdate = this.props.route.params.starttime;
      let startdate = this.props.route.params.starttime;
      startdate = moment(startdate).format('D');
      let startmonth = moment(this.props.route.params.starttime).format('M');
      let startyear = moment(this.props.route.params.starttime).format('Y');

      this.selectDated = startdate;

      let maininfoo = {
        month: Month[startmonth - 1],
        year: startyear,
        date: this.selectDated,
      };
      maininfoo.total = new Date(startyear, startmonth, 0).getDate();
      this.setState({selectedDate: startdate, maininfo: maininfoo});

      this.m = startmonth;
      this.cday = moment(
        this.state.maininfo.year + '/' + this.m + '/' + this.selectDated,
      ).format('dddd');
      this.setState({_selectedDay: this.cday});

      POST(SERVER + 'users/FscheduleBydate.json', {
        startdate: sdate,
      }).then(response => {
        console.log(response);
        if (response == undefined || response._total == 0) {
          this.setState(state => ({
            isLoading: false,
          }));
        } else {
          let temparr = [];
          temparr = response;
          this.setState(state => ({
            totalcount: response._total,
            batchListing: response,
            student: [],
            studentListing: '',
          }));

          if (this.state.isSwiped == false) {
            this.setState({indexCount: this.props.route.params.indexcount});
          }
          let starttime = temparr[this.state.indexCount].starttime;
          this.fa_allow = temparr[this.state.indexCount].displayFA;
          this.att_allow = temparr[this.state.indexCount].displayAtt;
          this.fastart = temparr[this.state.indexCount].starttime;
          starttime = this.r_date = moment(starttime).format('h:mmA');
          let endtime = temparr[this.state.indexCount].endtime;
          endtime = this.r_date = moment(endtime).format('h:mmA');
          this.setState({
            batchname: temparr[this.state.indexCount].batchname,
            starttime: starttime,
            endtime: endtime,
            id: temparr[this.state.indexCount].schedule_id,
            dateid: temparr[this.state.indexCount].schedule_date_id,
            _centre_id: temparr[this.state.indexCount].centre_id,
            _centrename: temparr[this.state.indexCount].centrename,
          });

          POST(SERVER + 'users/checkHoliday.json', {
            selectedate: sdate,
            centre_id: this.state._centre_id,
            dateid: temparr[this.state.indexCount].schedule_date_id,
          }).then(response => {
            if (response == null || response == undefined) {
              this.setState(state => ({
                isLoading: false,
              }));
            } else {
              if (response.holiday == 1) {
                this.setState({setHoliday: 1, batchDate: response.batchdate});
              } else {
                this.setState({setHoliday: 0, batchDate: null});
              }
            }
          });

          POST(SERVER + 'users/scheduleMore.json', {
            id: temparr[this.state.indexCount].schedule_id,
            dateid: temparr[this.state.indexCount].schedule_date_id,
          }).then(response => {
            this.getalertshow(
              temparr[this.state.indexCount].schedule_id,
              temparr[this.state.indexCount].schedule_date_id,
            );
            if (response == null || response == undefined) {
              this.setState(state => ({
                isLoading: false,
              }));
            } else {
              if (response.schedule.classUsers == undefined) {
                this.setState(state => ({
                  isLoading: false,
                }));
                return;
              }
              console.log(response.schedule.classUsers);
              this.setState({
                studentListing: response.schedule.classUsers,
              });
              Object.keys(this.state.studentListing).map(key => {
                this.setState({
                  donotdisplay: this.state.studentListing[key].donotdisplay,
                });
                this.state.student.push(this.state.studentListing[key]);
              });

              this.setState({
                isLoading: false,
              });
            }
          });
        }
      });
    } else {
      this.setState(state => ({
        isLoading: true,
      }));
      let tempmonth = this.state.maininfo.month;
      let m = Month.indexOf(tempmonth) + 1;
      let sdate =
        this.state.maininfo.year + '-' + m + '-' + this.state.maininfo.date;

      if (
        this.props.route.params.title == 'batch' &&
        this.state.currentpage == false &&
        this.props.route.params._totalrec > 0
      ) {
        sdate = this.props.route.params.starttime;
        let startdate = this.props.route.params.starttime;
        startdate = moment(startdate).format('D');
        let startmonth = moment(this.props.route.params.starttime).format('M');
        let startyear = moment(this.props.route.params.starttime).format('Y');

        this.selectDated = startdate;

        let maininfoo = {
          month: Month[startmonth - 1],
          year: startyear,
          date: this.selectDated,
        };
        maininfoo.total = new Date(startyear, startmonth, 0).getDate();
        this.setState({selectedDate: startdate, maininfo: maininfoo});

        this.m = startmonth;
        this.cday = moment(
          this.state.maininfo.year + '/' + this.m + '/' + this.selectDated,
        ).format('dddd');
        this.setState({_selectedDay: this.cday});
      }
      POST(SERVER + 'users/FscheduleBydate.json', {
        startdate: sdate,
      }).then(response => {
        console.log(response);
        if (response == undefined || response._total == 0) {
          this.setState(state => ({
            isLoading: false,
          }));
        } else {
          let temparr = [];
          temparr = response;
          this.setState(state => ({
            totalcount: response._total,
            batchListing: response,
            student: [],
            studentListing: '',
          }));
          if (
            this.props.route.params.title == 'batch' &&
            this.state.currentpage == false &&
            this.state.isSwiped == false &&
            this.props.route.params._totalrec > 0
          ) {
            this.setState({indexCount: this.props.route.params.indexcount});
          }
          let starttime = temparr[this.state.indexCount].starttime;
          this.fa_allow = temparr[this.state.indexCount].displayFA;
          this.att_allow = temparr[this.state.indexCount].displayAtt;
          this.fastart = temparr[this.state.indexCount].starttime;
          starttime = this.r_date = moment(starttime).format('h:mmA');
          let endtime = temparr[this.state.indexCount].endtime;
          endtime = this.r_date = moment(endtime).format('h:mmA');
          this.setState({
            batchname: temparr[this.state.indexCount].batchname,
            starttime: starttime,
            endtime: endtime,
            id: temparr[this.state.indexCount].schedule_id,
            dateid: temparr[this.state.indexCount].schedule_date_id,
            _centre_id: temparr[this.state.indexCount].centre_id,
            _centrename: temparr[this.state.indexCount].centrename,
          });

          POST(SERVER + 'users/checkHoliday.json', {
            selectedate: sdate,
            centre_id: this.state._centre_id,
            dateid: temparr[this.state.indexCount].schedule_date_id,
          }).then(response => {
            if (response == null || response == undefined) {
              this.setState(state => ({
                isLoading: false,
              }));
            } else {
              if (response.holiday == 1) {
                this.setState({setHoliday: 1, batchDate: response.batchdate});
              } else {
                this.setState({setHoliday: 0, batchDate: null});
              }
            }
          });

          POST(SERVER + 'users/scheduleMore.json', {
            id: temparr[this.state.indexCount].schedule_id,
            dateid: temparr[this.state.indexCount].schedule_date_id,
          }).then(response => {
            this.getalertshow(
              temparr[this.state.indexCount].schedule_id,
              temparr[this.state.indexCount].schedule_date_id,
            );

            if (response == null || response == undefined) {
              this.setState(state => ({
                isLoading: false,
              }));
            } else {
              if (response.schedule.classUsers == undefined) {
                this.setState(state => ({
                  isLoading: false,
                }));
                return;
              }
              this.setState({
                studentListing: response.schedule.classUsers,
              });
              Object.keys(this.state.studentListing).map(key => {
                this.setState({
                  donotdisplay: this.state.studentListing[key].donotdisplay,
                });
                this.state.student.push(this.state.studentListing[key]);
              });

              this.setState({
                isLoading: false,
              });
            }
          });
        }
      });
    }
  }

  changeMonth(month) {
    this.setState(state => ({
      currentpage: true,
      indexCount: 0,
    }));
    this.currentMonth = month;
    const _d = new Date();
    _d.setMonth(new Date().getMonth() + this.currentMonth);
    let maininfoo = {
      month: Month[_d.getMonth()],
      year: _d.getYear() + 1900,
      date: 1,
    };

    this.m = _d.getMonth() + 1;
    this.y = _d.getYear() + 1900;
    this.state._selectedDay = moment(this.y + '/' + this.m + '/' + 1).format(
      'dddd',
    );

    maininfoo.total = new Date(
      this.maininfo.year,
      new Date().getMonth() + 1 + this.currentMonth,
      0,
    ).getDate();
    this.setState({maininfo: maininfoo});
  }

  changeDate(index) {
    let maininfoo = {
      month: this.state.maininfo.month,
      year: this.state.maininfo.year,
      date: index,
    };
    maininfoo.total = new Date(
      this.maininfo.year,
      new Date().getMonth() + 1 + this.currentMonth,
      0,
    ).getDate();

    this.m = new Date().getMonth() + 1 + this.currentMonth;
    this.y = this.state.maininfo.year;
    this.state._selectedDay = moment(
      this.y + '/' + this.m + '/' + index,
    ).format('dddd');

    this.setState({
      maininfo: maininfoo,
      batchListing: '',
      dataChecked: null,
      currentpage: true,
      indexCount: 0,
      selectedDate: index,
    });
  }
  markFA() {
    this.setState({faremarkModal: false, faerr: false});
    let sdate = this.props.route.params.starttime;
    let bdate = moment(this.fastart).format('DD-MM-YYYY');
    this.props.navigation.navigate('ScheduleCancel', {
      id: this.state.id,
      dateid: this.state.dateid,
      index: this.state.indexCount,
      date: sdate,
      batchdate: bdate,
      total: this.state._total,
      time: this.state.starttime + ' - ' + this.state.endtime,
      batchname: this.state.batchname,
      _centrename: this.state._centrename,
      navigate: 'scheduleDetails',
      _centre_id: this.state._centre_id,
      alertshow: this.alertshow,
    });
  }
  closeModel() {
    this.setState({
      faremarkModal: false,
      faremark: null,
    });
  }
  onSwipeLeft(gestureState) {
    if (this.state.indexCount != this.state.totalcount - 1) {
      this.setState(state => ({
        indexCount: state.indexCount + 1,
        isLoading: true,
        isSwiped: true,
      }));
    }
  }
  componentDidUpdate(prevProps, prevState) {
    if (
      this.state.indexCount !== prevState.indexCount &&
      this.state.isSwiped == true
    ) {
      this.componentDidMount();
    } else if (
      this.state.maininfo.month != prevState.maininfo.month &&
      this.state.currentpage == true
    ) {
      this.componentDidMount();
    } else if (
      this.state.maininfo.date != prevState.maininfo.date &&
      this.state.currentpage == true
    ) {
      this.componentDidMount();
    } else if (this.props.route.params !== prevProps.route.params) {
      this.componentDidMount();
    } else if (
      this.state.selectedDate !== prevState.selectedDate &&
      this.state.maininfo.date != prevState.maininfo.date &&
      this.state.currentpage == true
    ) {
      this.componentDidMount();
    }
  }

  onSwipeRight(gestureState) {
    if (this.state.indexCount != 0) {
      this.setState(state => ({
        indexCount: state.indexCount - 1,
        isLoading: true,
        isSwiped: true,
      }));
    }
  }
  studentInfo(index) {
    this.selected = index;
    this.setState({open: true});
  }
  checkUnfreeze() {
    if (this.state.selectedClass.length > 1) {
      Alert.alert(
        '',
        'You can select only one student at a time for Unfreeze!',
        [{text: 'OK'}],
      );
      return;
    } else {
      let selected = this.state.selectedClass;
      selected.forEach(value => {
        if (this.state.student[value].displayUnfreeze == 'none') {
          Alert.alert('', 'Unfreeze not allowed!', [{text: 'OK'}]);
          return;
        } else {
          this.markUnfreeze();
        }
      });
    }
  }
  checkUnhold() {
    if (this.state.selectedClass.length > 1) {
      Alert.alert('', 'You can select only one student at a time for Unhold!', [
        {text: 'OK'},
      ]);
      return;
    } else {
      let selected = this.state.selectedClass;

      selected.forEach(value => {
        if (this.state.student[value].displayUnHold == 'none') {
          Alert.alert('', 'Unhold not allowed!', [{text: 'OK'}]);
          return;
        } else {
          this.markUnhold();
        }
      });
    }
  }

  reschedule() {
    let selected = this.state.selectedClass;
    console.log(selected.length);
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
              this.state.student[value].sstatus == 'FA' ||
              this.state.student[value].sstatus == 'cancelled' ||
              this.state.student[value].sstatus == 'absent') &&
            this.state.student[value].studenttype != 'switch'
          ) {
            this.props.navigation.navigate('RescheduleStudent', {
              data: this.state.student[value],
              index: this.state.indexCount,
              date: this.state.selectedDate,
              total: this.state._total,
              time: this.state.starttime + ' - ' + this.state.endtime,
              batchname: this.state.batchname,
              centrename: this.state._centrename,
              selectedDay: this.state._selectedDay,
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
          this.state.student[value].sstatus != 'hold' &&
          this.state.student[value].sstatus != 'freeze' &&
          this.state.student[value].sstatus != 'reschedule' &&
          this.state.student[value].sstatus != 'FA' &&
          this.state.student[value].sstatus != 'transferred' &&
          this.state.student[value].smstatus != 'Discontinued' &&
          this.state.student[value].sstatus != 'reschedule' &&
          this.state.student[value].payment_cycle_id == 0 &&
          this.state.student[value].sstatus != 'cancelled'
          //this.state.student[value].displayPresent == 'block'
        ) {
          if (this.state.student[value].sstatus != 'present') {
            this.state.student[value].sstatus = 'present';
          } else {
            this.state.student[value].sstatus = '';
          }
        }
      });

      this.setState({student: this.state.student, selectedClass: []});
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
          this.state.student[value].sstatus != 'hold' &&
          this.state.student[value].sstatus != 'freeze' &&
          this.state.student[value].sstatus != 'reschedule' &&
          this.state.student[value].sstatus != 'FA' &&
          this.state.student[value].sstatus != 'transferred' &&
          this.state.student[value].smstatus != 'Discontinued' &&
          this.state.student[value].sstatus != 'reschedule' &&
          this.state.student[value].payment_cycle_id == 0 &&
          this.state.student[value].sstatus != 'cancelled'
          //this.state.student[value].displayAbsent == 'block'
        ) {
          if (this.state.student[value].sstatus != 'absent') {
            this.state.student[value].sstatus = 'absent';
          } else {
            this.state.student[value].sstatus = '';
          }
        }
      });

      this.setState({student: this.state.student, selectedClass: []});
    }
  }

  checkAll() {
    let selected = this.state.selectedClass;

    if (
      selected.length == [] ||
      (selected.length > 0 && selected.length < this.state.student.length)
    ) {
      for (let count = 0; count < this.state.student.length; count++) {
        if (!selected.includes(count)) {
          selected[selected.length] = count;
        }
      }

      this.setState({
        selectedClass: selected,
      });
    } else {
      if (selected.length != []) {
        console.log(selected.length);
        this.setState({
          selectedClass: [],
        });
        return;
      }
    }
  }

  select(index) {
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
  markAttendence() {
    // let selected = this.state.selectedClass;
    // this.selectedUser = {};

    // selected.forEach(value => {
    //   let at = this.state.student[value].schedule_attendee_id;
    //   let st = this.state.student[value].sstatus;
    //   this.selectedUser[at] = st;
    // });

    //code by shreedul START
    let cnt1 = 0;
    let cnt2 = 0;
    this.selectedUser = {};
    Object.keys(this.state.student).map(key => {
      var at = this.state.student[key].schedule_attendee_id;
      var st = this.state.student[key].sstatus;
      this.selectedUser[at] = st;
      if (st == '') {
        cnt1++;
      }
      cnt2++;
    });
    if (cnt1 != cnt2) {
      this.setState(state => ({
        isLoading: true,
      }));
    } else {
      Alert.alert('', 'Mark Attendance First', [{text: 'OK'}]);
    }
    //code by shreedul END

    POST(SERVER + 'users/scheduleMore.json', {
      attendee_id: this.selectedUser,
      id: this.state.id,
      dateid: this.state.dateid,
      _centre_id: this.state._centre_id,
    }).then(res => {
      if (res == null || res == undefined) {
      } else if (res.apires == true || res.apires == 'success') {
        this.setState(state => ({
          isLoading: false,
        }));
        Alert.alert('', 'Attendance Marked Sucessfully!', [
          {
            text: 'OK',
            onPress: () => {
              this.componentDidMount();
            },
          },
        ]);
      }
    });
  }
  markUnfreeze() {
    this.m = Month.indexOf(this.state.maininfo.month) + 1;
    this.cdate = moment(
      this.state.maininfo.year + '-' + this.m + '-' + this.state.maininfo.date,
    ).format('DD-MM-YYYY');

    Alert.alert('', 'Resume date is ' + this.cdate + ' ', [
      {
        text: 'CONFIRM',
        onPress: () => {
          this.setState(state => ({
            isLoading: true,
          }));
          let at;
          let selected = this.state.selectedClass;
          this.selectedUser = {};

          selected.forEach(value => {
            at = this.state.student[value].schedule_attendee_id;
          });

          POST(SERVER + 'users/scheduleMore.json', {
            edit: at,
            id: this.state.id,
            dateid: this.state.dateid,
            _centre_id: this.state._centre_id,
            __pagesapi: 'unfreeze',
            permission: 'faculty',
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
                    this.componentDidMount();
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
                    this.componentDidMount();
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
                  onPress: () => {
                    this.componentDidMount();
                  },
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
  markUnhold() {
    this.m = Month.indexOf(this.state.maininfo.month) + 1;
    this.cdate = moment(
      this.state.maininfo.year + '-' + this.m + '-' + this.state.maininfo.date,
    ).format('DD-MM-YYYY');

    Alert.alert('', 'Resume date is ' + this.cdate + ' ', [
      {
        text: 'CONTINUE',
        onPress: () => {
          this.setState(state => ({
            isLoading: true,
          }));
          let at;
          let selected = this.state.selectedClass;
          this.selectedUser = {};

          selected.forEach(value => {
            at = this.state.student[value].schedule_attendee_id;
          });

          POST(SERVER + 'users/scheduleMore.json', {
            edit: at,
            id: this.state.id,
            dateid: this.state.dateid,
            _centre_id: this.state._centre_id,
            __pagesapi: 'unhold',
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
                    this.componentDidMount();
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
                    this.componentDidMount();
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
                  onPress: () => {
                    this.componentDidMount();
                  },
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
  markHoliday() {
    this.setState({holidayModal: true});
  }
  submitHoliday() {
    this.setState({holidayModal: false});
    let sdate = this.props.route.params.starttime;
    let bdate = moment(this.fastart).format('DD-MM-YYYY');
    this.props.navigation.navigate('ScheduleHoliday', {
      id: this.state.id,
      dateid: this.state.dateid,
      index: this.state.indexCount,
      date: this.fastart,
      batchdate: bdate,
      total: this.state._total,
      time: this.state.starttime + ' - ' + this.state.endtime,
      batchname: this.state.batchname,
      _centrename: this.state._centrename,
      navigate: 'scheduleDetails',
      _centre_id: this.state._centre_id,
      alertshow: this.alertshow,
    });
  }
  goBack() {
    if (this.props.route.params.title == 'batchlist') {
      this.props.navigation.navigate('Batch', {
        sdate: this.props.route.params.starttime,
      });
    } else if (this.props.route.params.navigate == 'pending') {
      this.props.navigation.reset({index: 0, routes: [{name: 'PendingList'}]});
    } else {
      this.props.navigation.reset({index: 0, routes: [{name: 'Faculty'}]});
    }
    //this.props.navigation.navigate('Index');
  }

  ShowAttendance = item => {
    if (this.props.route.params.title == 'batchlist') {
      this.back = 'batchlist';
    } else if (this.props.route.params.navigate == 'pending') {
      this.back = 'pending';
    } else {
      this.back = '';
    }

    this.props.navigation.navigate('ModuleAttendance', {
      index: this.state.indexCount,
      date: this.state.selectedDate,
      total: this.state._total,
      time: this.state.starttime + ' - ' + this.state.endtime,
      data: item,
      _centrename: this.state._centrename,
      navigate: 'scheduleDetails',
      goback: this.back,
    });
  };

  /**
   * called to display page
   * @returns
   */
  render() {
    // const {id, dateid} = this.props.route.params;
    let config = {
      velocityThreshold: 0.3,
      directionalOffsetThreshold: 80,
    };
    setTimeout(() => {
      let position = (this.state.maininfo.date - 1.4) * 50;
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

          <Animatable.View
            animation="fadeInUpBig"
            style={{
              ...STYLES.topCurvedPage,
              width: width,
              flex: 120,
              // marginTop: -40,
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
                    <TouchableOpacity
                      style={{alignItems: 'flex-start'}}
                      onPress={() => {
                        this.changeMonth(parseInt(this.currentMonth) - 1);
                      }}>
                      <Icon
                        style={{paddingRight: 70, paddingTop: 4}}
                        name={'chevron-left'}
                        size={20}
                      />
                    </TouchableOpacity>
                    <Text style={{...STYLES.fontLarge, fontWeight: 'bold'}}>
                      {this.state.maininfo.month +
                        ' ' +
                        this.state.maininfo.year}
                    </Text>
                    <TouchableOpacity
                      style={{alignSelf: 'flex-end'}}
                      onPress={() => {
                        this.changeMonth(parseInt(this.currentMonth) + 1);
                      }}>
                      <Icon
                        style={{paddingLeft: 70, paddingBottom: 3}}
                        name={'chevron-right'}
                        size={20}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={{flex: 1, alignItems: 'flex-end'}}></View>
              </View>

              <View style={{height: 70}}>
                <ScrollView
                  ref={ref => {
                    this.scrollRef = ref;
                  }}
                  style={{width: width, marginTop: 10}}
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

                      if (ind == this.state.maininfo.date) {
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
                          <TouchableOpacity
                            onPress={() => {
                              this.changeDate(ind);
                            }}>
                            <Text
                              style={{
                                ...STYLES.fontNormal,
                                color: PROPERTY.scrollDateColor,
                                ...css1,
                              }}>
                              {ind}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      );
                    })}
                  </View>
                </ScrollView>
              </View>
            </View>

            {this.state.isLoading == false && (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: 10,
                }}>
                {[...Array(this.state.totalcount)].map((val, i) => {
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
            )}
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
                  // flex: 1,
                  margin: 20,
                  borderWidth: 2,
                  borderRadius: 5,
                  borderColor: PROPERTY.selectedColor,
                  backgroundColor: PROPERTY.innerColorBackground,
                }}>
                {this.state.batchname != '' && (
                  <Text
                    style={{
                      textAlign: 'center',
                      fontSize: 20,
                      color: PROPERTY.selectedColor,
                    }}>
                    {this.state.starttime} - {this.state.endtime}
                  </Text>
                )}
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 18,
                    color: PROPERTY.selectedColor,
                  }}>
                  {this.state._centrename} - {this.state.batchname}
                </Text>
                {this.state.student.length != 0 && (
                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: 5,
                      // marginLeft: 3,
                    }}>
                    <View style={{flex: 20}}>
                      {!(
                        this.state.selectedClass.length ==
                        this.state.student.length
                      ) && (
                        <TouchableOpacity
                          onPress={() => {
                            this.checkAll();
                          }}>
                          <View style={{paddingLeft: 3, marginTop: -3}}>
                            <Icon
                              name={'square-o'}
                              size={45}
                              color={PROPERTY.buttonColor}
                            />
                          </View>
                        </TouchableOpacity>
                      )}
                      {this.state.selectedClass.length ==
                        this.state.student.length &&
                        this.state.selectedClass.length != 0 && (
                          <TouchableOpacity
                            onPress={() => {
                              this.checkAll();
                            }}>
                            <View style={{paddingLeft: 3, marginTop: -3}}>
                              <Icon
                                name={'check-square-o'}
                                size={45}
                                color={PROPERTY.buttonColor}
                              />
                            </View>
                          </TouchableOpacity>
                        )}
                    </View>
                    <View style={{flex: 100}}>
                      <View style={{flexDirection: 'row'}}>
                        {this.att_allow == 'display:block' && (
                          <TouchableOpacity
                            onPress={() => {
                              this.checkUnfreeze();
                            }}>
                            <View
                              style={{
                                ...STYLES.scheduleBtn2,
                              }}>
                              <Text style={{...STYLES.scheduleBtnText}}>
                                UF
                              </Text>
                            </View>
                          </TouchableOpacity>
                        )}
                        {this.att_allow == 'display:block' && (
                          <TouchableOpacity
                            onPress={() => {
                              this.checkUnhold();
                            }}>
                            <View
                              style={{
                                ...STYLES.scheduleBtn2,
                              }}>
                              <Text style={{...STYLES.scheduleBtnText}}>
                                UH
                              </Text>
                            </View>
                          </TouchableOpacity>
                        )}
                        {this.fa_allow == 'display:block' &&
                          this.att_allow == 'display:block' && (
                            <TouchableOpacity
                              onPress={() => {
                                this.setState({faremarkModal: true});
                              }}>
                              <View
                                style={{
                                  ...STYLES.scheduleBtn2,
                                }}>
                                <Text style={{...STYLES.scheduleBtnText}}>
                                  FA
                                </Text>
                              </View>
                            </TouchableOpacity>
                          )}
                        {this.att_allow == 'display:block' && (
                          <TouchableOpacity
                            onPress={() => {
                              this.checkPresent();
                            }}>
                            <View
                              style={{
                                ...STYLES.scheduleBtn2,
                                paddingLeft: 7,
                                paddingRight: 7,
                              }}>
                              <Text style={{...STYLES.scheduleBtnText}}>P</Text>
                            </View>
                          </TouchableOpacity>
                        )}
                        {this.att_allow == 'display:block' && (
                          <TouchableOpacity
                            onPress={() => {
                              this.checkAbsent();
                            }}>
                            <View
                              style={{
                                ...STYLES.scheduleBtn2,
                                paddingLeft: 7,
                                paddingRight: 7,
                              }}>
                              <Text style={{...STYLES.scheduleBtnText}}>A</Text>
                            </View>
                          </TouchableOpacity>
                        )}
                        {this.att_allow == 'display:block' && (
                          <TouchableOpacity
                            onPress={() => {
                              this.reschedule();
                            }}>
                            <View
                              style={{
                                ...STYLES.scheduleBtn2,
                                paddingBottom: 9,
                                paddingTop: 10,
                                paddingLeft: 7,
                                paddingRight: 7,
                              }}>
                              <Icon
                                name={'exchange'}
                                size={16}
                                color={'#E8E8E9'}
                              />
                            </View>
                          </TouchableOpacity>
                        )}
                        {this.att_allow == 'display:block' &&
                          this.state.setHoliday == 1 && (
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
                )}

                <View
                  style={{
                    marginTop: 15,
                    marginLeft: 10,
                    marginRight: 10,
                    height: height * 0.23,
                    overflow: 'hidden',
                  }}>
                  {this.state.isLoading && (
                    <ActivityIndicator
                      size="large"
                      color={PROPERTY.selectedColor}
                      style={{marginTop: 80}}
                    />
                  )}
                  {this.state.student.length == 0 &&
                    this.state.isLoading == false && (
                      <View
                        style={{
                          flex: 80,
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginTop: -170,
                        }}>
                        <Image source={PROPERTY.noDataFound} />
                        <Text
                          style={{
                            color: PROPERTY.selectedColor,
                            fontSize: 15,
                            marginTop: -225,
                          }}>
                          No Record Found!
                        </Text>
                      </View>
                    )}
                  {this.state.student.length > 0 && (
                    <FlatList
                      data={this.state.student}
                      renderItem={({item, index}) => (
                        <View style={{flexDirection: 'row'}}>
                          {item.sstatus != 'transferred' &&
                            item.smstatus != 'Discontinued' &&
                            item.sstatus != 'reschedule' &&
                            item.payment_cycle_id == 0 && (
                              <View>
                                {!this.state.selectedClass.includes(index) && (
                                  <TouchableOpacity
                                    style={{flex: 1, marginLeft: 5}}
                                    onPress={() => {
                                      this.select(index);
                                    }}>
                                    <View style={{marginTop: 5}}>
                                      <Icon name={'square-o'} size={32} />
                                    </View>
                                  </TouchableOpacity>
                                )}
                                {this.state.selectedClass.includes(index) && (
                                  <TouchableOpacity
                                    style={{flex: 1, marginLeft: 5}}
                                    onPress={() => {
                                      this.select(index);
                                    }}>
                                    <View style={{marginTop: 5}}>
                                      <Icon name={'check-square-o'} size={32} />
                                    </View>
                                  </TouchableOpacity>
                                )}
                              </View>
                            )}
                          <TouchableOpacity
                            style={{flex: 9}}
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
                              <View>
                                <Text style={{...STYLES.fontSmall}}>
                                  {item.firstname} {item.lastname}
                                </Text>
                              </View>
                            </View>
                          </TouchableOpacity>
                          <View style={{flex: 2}}>
                            <View
                              style={
                                item.sstatus != 'freeze' &&
                                item.sstatus != 'hold'
                                  ? {
                                      borderWidth: 2,
                                      borderRadius: 5,
                                      borderColor: PROPERTY.selectedColor,
                                      margin: 7,
                                      paddingTop: 5,
                                      paddingBottom: 7,
                                      marginTop: 0,
                                    }
                                  : {
                                      borderWidth: 2,
                                      borderRadius: 5,
                                      borderColor: PROPERTY.selectedColor,
                                      margin: 7,
                                      paddingTop: 5,
                                      paddingBottom: 7,
                                      marginTop: 0,
                                      backgroundColor: PROPERTY.redColor,
                                    }
                              }>
                              {item.sstatus === 'reschedule' && (
                                <Icon
                                  name={'refresh'}
                                  // color={color}
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
                              {item.sstatus === 'FA' &&
                                item.deleted !=
                                  1(
                                    <Text
                                      style={{
                                        textAlign: 'center',
                                        fontWeight: 'bold',
                                        fontSize: 18,
                                      }}>
                                      FA
                                    </Text>,
                                  )}
                              {item.sstatus === 'absent' && item.deleted != 1 && (
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
                              {item.sstatus === 'cancelled' &&
                                item.deleted !=
                                  1(
                                    <Text
                                      style={{
                                        textAlign: 'center',
                                        fontWeight: 'bold',
                                        fontSize: 18,
                                      }}>
                                      C
                                    </Text>,
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
                        </View>
                      )}
                      keyExtractor={(item, index) => index}
                    />
                  )}
                  {this.state.student.length > 0 &&
                    this.state.donotdisplay != 1 && (
                      <View style={{flexDirection: 'row', padding: 5}}>
                        <View style={{flex: 30, marginLeft: 10}}></View>
                        <View style={{flex: 40}}>
                          <Button
                            onPress={this.markAttendence}
                            color={PROPERTY.buttonColor}
                            mode="contained"
                            style={{
                              ...STYLES.button,
                            }}>
                            Submit
                          </Button>
                        </View>
                        <View style={{flex: 30}}></View>
                      </View>
                    )}
                </View>
              </View>
            </GestureRecognizer>
          </Animatable.View>

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
        </View>
        <BottomDrawer {...this.props}></BottomDrawer>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  inputContainer: {
    flex: 88,
    // width: 500,
    // height: 400,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 4,
    borderColor: 'black',
    borderWidth: 1,
    padding: 10,
    // width: '80%',
    marginVertical: 10,
  },
  buttonContainer: {
    flex: 4,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  button: {
    // width: '40%',
  },
});
const mapstate = state => {
  return {
    login: LoginReducer,
  };
};

export default connect(mapstate)(FacultyScheduleDetails);
