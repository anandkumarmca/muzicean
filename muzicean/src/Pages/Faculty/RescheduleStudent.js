import React, {createRef} from 'react';
import {
  View,
  Image,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  FlatList,
} from 'react-native';
import {Dimensions} from 'react-native';
import {connect} from 'react-redux';
import {TextInput, Button, Modal, Checkbox} from 'react-native-paper';
import LoginReducer from '../../Redux/Reducer/Login';
import {Card} from 'react-native-paper';
import {PROPERTY, POST, GET, SERVER} from '../../Common/Settings';
import {height, width, STYLES} from '../../Common/Style';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/FontAwesome';
import Users from '../Component/User';
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';
import SelectDropdown from 'react-native-select-dropdown';
import BottomDrawer from '../Component/Drawer';

class RescheduleStudent extends React.Component {
  realert = '';
  constructor(props) {
    super(props);
    this.state = {
      selectedClass: 0,
      date: new Date(),
      time: null,
      mode: 'date',
      show: false,

      date1: new Date(),
      mode1: 'time',
      show1: false,

      defdate: '',
      text: 'Empty',
      curddate: null,
      nextddate: null,
      tddate: null,
      tempcurdate: null,
      rbatchlist: [],
      currentClassroom: [],
      timeShow: false,
      selectTime: false,
      checked: false,
      selectClassroom_id: null,
      selectClassroom: null,
      successModal: false,
      batchChecked: [],
    };
    this.selectTime = this.selectTime.bind(this);
    this.reschedule = this.reschedule.bind(this);
    this.getRadioValue = this.getRadioValue.bind(this);
    this.getbatch = this.getbatch.bind(this);
    this.dropdownRef = createRef();
  }

  setDate = (event, date) => {
    this.realert = '';
    date = date || this.state.date;

    this.setState({
      show: Platform.OS === 'ios' ? true : false,
      date,
      defdate: date,
      timeShow: true,
    });

    if (this.state.mode == 'date') {
      hourshow = 0;
      this.ssdate = moment(date).format('YYYY-MM-DD');

      POST(
        SERVER +
          'api/hourtimeshow.json?edit=' +
          this.props.route.params.data.schedule_attendee_id +
          '&id=' +
          this.props.route.params.data.id +
          '&dates=' +
          this.ssdate,
      ).then(response => {
        if (response.error) {
          console.log(response.error);
        } else {
          if (response.hide == 1) {
            hourshow = response.hourshow;
          }
        }
      });

      this.test = 0;
      // this.maindate = moment(this.ssdate).format("DD-MM-YYYY");
      // this.curddate = moment(this.state.curddate).format("DD-MM-YYYY");
      // this.nextddate = moment(this.state.nextddate).format("DD-MM-YYYY");
      // this.tddate = moment(this.state.tddate).format("DD-MM-YYYY");
      // this.tempcurdate = moment(this.state.tempcurdate).format("DD-MM-YYYY");

      this.maindate = moment(this.ssdate).format('YYYY-MM-DD');
      this.curddate = this.state.curddate;
      this.nextddate = this.state.nextddate;
      this.tddate = this.state.tddate;
      this.tempcurdate = this.state.tempcurdate;

      if (this.tempcurdate < this.tddate) {
        if (this.maindate < this.curddate || this.maindate > this.nextddate) {
          this.test = 1;

          this.realert =
            'Please select dates from ' +
            moment(this.tempcurdate).format('DD-MM-YYYY') +
            ' to ' +
            moment(this.nextddate).format('DD-MM-YYYY');
          this.setState({batchShow: false, defdate: ''});
          Alert.alert(
            'Reschedule Alert',
            'Please select dates from ' +
              moment(this.tempcurdate).format('DD-MM-YYYY') +
              ' to ' +
              moment(this.nextddate).format('DD-MM-YYYY'),
          );
        }
      } else if (this.tempcurdate > this.tddate) {
        if (this.maindate < this.curddate || this.maindate > this.tempcurdate) {
          this.test = 1;
          this.setState({batchShow: false, defdate: ''});
          this.realert =
            'Please select dates from ' +
            moment(this.tddate).format('DD-MM-YYYY') +
            ' to ' +
            moment(this.tempcurdate).format('DD-MM-YYYY');
          Alert.alert(
            'Reschedule Alert',
            'Please select dates from ' +
              moment(this.tddate).format('DD-MM-YYYY') +
              ' to ' +
              moment(this.tempcurdate).format('DD-MM-YYYY'),
          );
        }
      } else if (this.tempcurdate == this.tddate) {
        if (this.maindate < this.curddate || this.maindate > this.nextddate) {
          this.test = 1;
          this.setState({batchShow: false, defdate: ''});
          this.realert =
            'Please select dates from ' +
            moment(this.tempcurdate).format('DD-MM-YYYY') +
            ' to ' +
            moment(this.nextddate).format('DD-MM-YYYY');
          Alert.alert(
            'Reschedule Alert',
            'Please select dates from ' +
              moment(this.tempcurdate).format('DD-MM-YYYY') +
              ' to ' +
              moment(this.nextddate).format('DD-MM-YYYY'),
          );
        }
      } else {
        this.setState({checked: true, defdate: this.state.date});
        this.realert = '';
      }

      if (this.test == 0) {
        POST(
          SERVER +
            'manage/scheduleMoreDate.json?id=' +
            this.props.route.params.data.id +
            '&edit=' +
            this.props.route.params.data.schedule_attendee_id +
            '&dateid=' +
            this.props.route.params.data.dateid +
            '&permission=faculty' +
            '&date=' +
            this.maindate,
          {_centre_id: this.props.route.params.data.centre_id},
        ).then(response => {
          if (response.error) {
            console.log(response.error);
          } else {
            console.log(response);
            this.setState({rbatchlist: response.data});

            Object.keys(this.state.rbatchlist).map(key => {
              let rbatchlist = [...this.state.rbatchlist];
              rbatchlist[key] = {...rbatchlist[key], status: 'unchecked'};
              this.setState({rbatchlist});
            });
            console.log(this.state.rbatchlist.length);
            if (this.state.rbatchlist.length == 0) {
              this.setState({batchShow: false});
            } else {
              this.setState({batchShow: true, selectedDate: this.maindate});
            }
          }
        });
      } else {
        this.setState({rbatchlist: []});
      }
    } else {
      if (this.state.selectTime == true) {
        this.ddate = moment(this.state.date).format('DD-MM-YYYY');
        this.stime = moment(this.state.date).format('hh:mm a');
        this.setState({currentClassroom: []});
        hourshow = 0;
        this.fadate = 0;
        this.setState({is});
        POST(
          SERVER +
            'api/classtime.json?schid=' +
            this.ddate +
            '&stime=' +
            this.stime +
            '&dateid=' +
            this.props.route.params.data.dateid,
          {_centre_id: this.props.route.params.data.centre_id},
        ).then(response => {
          if (response == null) {
            console.log('no class');
          } else {
            console.log(response.classroom);

            Object.keys(response.classroom).map(key => {
              this.state.currentClassroom.push(response.classroom[key]);
            });
          }
        });

        POST(
          SERVER +
            'api/checkfatime.json?edit=' +
            this.props.route.params.data.schedule_attendee_id +
            '&starttime=' +
            this.stime +
            '&date=' +
            this.ddate,
        ).then(response => {
          if (response.error) {
            console.log(response.error);
          } else {
            if (response.got == 1) {
              this.fadate = 1;
              Alert.alert(
                'Reschedule Alert',
                'Selected date and time marked as FA!!',
              );
            }
          }
        });

        POST(
          SERVER +
            'api/hourtimeshow.json?edit=' +
            this.props.route.params.data.schedule_attendee_id +
            '&id=' +
            this.props.route.params.data.id +
            '&dates=' +
            this.ddate,
        ).then(response => {
          if (response.error) {
            console.log(response.error);
          } else {
            if (response.hide == 1) {
              hourshow = response.hourshow;
            }
            if (hourshow != 0) {
              if ($('#atime').val() == hourshow) {
                Alert.alert(
                  'Reschedule Alert',
                  'Rescheduling to same batch not allowed!! Student already has a planned class at selected batch time!!',
                );
              }
            }
          }
        });
      }
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

  timepicker = () => {
    this.show1('time');
  };

  setDate1 = (event, date1) => {
    console.log(this.date1);

    date1 = date1 || this.state.date1;

    this.setState({
      show1: Platform.OS === 'ios' ? true : false,
      date1,
      timeShow: true,
    });

    this.ddate = moment(this.state.date).format('DD-MM-YYYY');
    this.stime = moment(this.state.date1).format('hh:mm a');
    this.setState({currentClassroom: [], selectClassroom: null});

    hourshow = 0;
    this.fadate = 0;
    POST(
      SERVER +
        'api/classtime.json?schid=' +
        this.ddate +
        '&stime=' +
        this.stime +
        '&dateid=' +
        this.props.route.params.data.dateid,
      {_centre_id: this.props.route.params.data.centre_id},
    ).then(response => {
      if (response == null) {
        console.log('no class');
      } else {
        Object.keys(response.classroom).map(key => {
          this.state.currentClassroom.push(response.classroom[key]);
        });
      }
    });

    POST(
      SERVER +
        'api/checkfatime.json?edit=' +
        this.props.route.params.data.schedule_attendee_id +
        '&starttime=' +
        this.stime +
        '&date=' +
        this.ddate,
    ).then(response => {
      if (response.error) {
        console.log(response.error);
      } else {
        if (response.got == 1) {
          this.fadate = 1;
          Alert.alert(
            'Reschedule Alert',
            'Selected date and time marked as FA!!',
          );
        }
      }
    });
    this.dropdownRef.current.reset();
    POST(
      SERVER +
        'api/hourtimeshow.json?edit=' +
        this.props.route.params.data.schedule_attendee_id +
        '&id=' +
        this.props.route.params.data.id +
        '&dates=' +
        this.ddate,
    ).then(response => {
      if (response.error) {
        console.log(response.error);
      } else {
        if (response.hide == 1) {
          hourshow = response.hourshow;
        }
        if (hourshow != 0) {
          if ($('#atime').val() == hourshow) {
            Alert.alert(
              'Reschedule Alert',
              'Rescheduling to same batch not allowed!! Student already has a planned class at selected batch time!!',
            );
          }
        }
      }
    });
  };

  show1 = mode1 => {
    this.setState({
      show1: true,
      mode1,
    });
  };

  selectTime() {
    Object.keys(this.state.rbatchlist).map(key => {
      let rbatchlist = [...this.state.rbatchlist];
      if (this.state.rbatchlist[key].status == 'checked') {
        rbatchlist[key].status = 'unchecked';
      }
      this.setState({rbatchlist});
    });

    if (this.state.selectTime == false) {
      this.setState({selectTime: true});

      this.ddate = moment(this.state.date).format('DD-MM-YYYY');
      this.stime = moment(this.state.date).format('hh:mm a');
      this.setState({currentClassroom: []});
      POST(
        SERVER +
          'api/classtime.json?schid=' +
          this.ddate +
          '&stime=' +
          this.stime +
          '&dateid=' +
          this.props.route.params.data.dateid,
        {_centre_id: this.props.route.params.data.centre_id},
      ).then(response => {
        if (response == null) {
          console.log('no class');
        } else {
          console.log(response.classroom);
          Object.keys(response.classroom).map(key => {
            this.state.currentClassroom.push(response.classroom[key]);
          });
        }
      });
    } else {
      this.setState({selectTime: false});
      this.setState({currentClassroom: []});
    }
  }

  getRadioValue(value) {
    this.setState({
      selectClassroom_id: value.centre_classroom_id,
      selectClassroom: value.name,
    });
  }

  getbatch(ind) {
    this.setState({selectTime: false});
    Object.keys(this.state.rbatchlist).map(key => {
      let rbatchlist = [...this.state.rbatchlist];
      if (ind == key) {
        rbatchlist[key].status = 'checked';
      } else {
        rbatchlist[key].status = 'unchecked';
      }
      this.setState({rbatchlist});
    });
  }

  reschedule() {
    if (this.realert != '') {
      Alert.alert('Reschedule Alert', this.realert);
      return;
    }
    this.ddate = moment(this.state.date).format('DD-MM-YYYY');
    this.stime = moment(this.state.date).format('hh:mm A');

    if (this.state.selectTime == true && this.stime != null) {
      this.stime = moment(this.state.date1).format('hh:mm A');
      this.rbatchname = '-';
      let valtime = moment(this.state.date1).format('mm');
      if (String(valtime) != '00' && String(valtime) != '30') {
        Alert.alert('Reschedule Alert', 'Invalid time selected!');
        return;
      }
      if (this.state.selectClassroom != null) {
        console.log(this.state.selectClassroom);

        if (hourshow != 0) {
          if (this.stime == hourshow) {
            Alert.alert(
              'Reschedule Alert',
              'Rescheduling to same batch not allowed!! Student already has a planned class at selected batch time',
            );
          }
        }
        if (this.fadate == 1) {
          Alert.alert(
            'Reschedule Alert',
            'Selected date and time marked as FA!!',
          );
        }

        if (hourshow == 0 && this.fadate != 1) {
          let stdate = moment(this.props.route.params.data.scheduledate).format(
            'DD-MM-YYYY',
          );
          let rcdate = this.ddate;
          let rctime = this.stime;
          let rcname =
            this.props.route.params.data.firstname +
            ' ' +
            this.props.route.params.data.lastname;
          let msgc =
            rcname +
            ' - ' +
            stdate +
            ' will be rescheduled to ' +
            rcdate +
            ' at ' +
            rctime;
          Alert.alert('Reschedule Alert', msgc, [
            {
              text: 'Cancel',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {
              text: 'OK',
              onPress: () => {
                POST(
                  SERVER +
                    'users/scheduleMoreReschedule.json?edit=' +
                    this.props.route.params.data.schedule_attendee_id +
                    '&id=' +
                    this.props.route.params.data.id +
                    '&dateid=' +
                    this.props.route.params.data.dateid +
                    '&permission=faculty',
                  {
                    date: this.ddate,
                    starttime: this.stime,
                    centre_classroom_id: this.state.selectClassroom_id,
                    extra: 1,
                    _centre_id: this.props.route.params.data.centre_id,
                  },
                )
                  .then(response => {
                    if (response.error) {
                      console.log(response.error);
                    } else {
                      if (response.data == true) {
                        Alert.alert(
                          'Reschedule Alert',
                          'Student rescheduled to other schedule',
                        );

                        this.props.navigation.navigate(
                          'FacultyScheduleDetails',
                          {
                            data: this.props.route.params.index,
                            date: this.props.route.params.date,
                            total: this.props.route.params.total,
                          },
                        );
                      }
                    }
                  })
                  .catch(function (error) {
                    console.log(
                      'There has been a problem with reschedule operation: ' +
                        error.message,
                    );
                  });
              },
            },
          ]);
        }
      } else {
        Alert.alert('Reschedule Alert', 'Please select classroom!!');
      }
    }

    if (this.state.selectTime == false) {
      this.batcharr = [];

      Object.keys(this.state.rbatchlist).map(key => {
        if (this.state.rbatchlist[key].status == 'checked') {
          this.batcharr.push(this.state.rbatchlist[key]);
        }
      });

      if (this.batcharr[0] == undefined) {
        Alert.alert(
          'Reschedule Alert',
          'Please select schedule before rescheduling..',
        );
      } else {
        let stdate = moment(this.props.route.params.data.scheduledate).format(
          'DD-MM-YYYY',
        );
        let rcdate = this.ddate;
        let rctime = (this.stime = moment(this.batcharr[0].starttime).format(
          'hh:mm a',
        ));
        let rcname =
          this.props.route.params.data.firstname +
          ' ' +
          this.props.route.params.data.lastname;
        let msgc =
          rcname +
          ' - ' +
          stdate +
          ' will be rescheduled to ' +
          rcdate +
          ' at ' +
          rctime;
        Alert.alert('Reschedule Alert', msgc, [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {
            text: 'OK',
            onPress: () => {
              POST(
                SERVER +
                  'users/scheduleMoreReschedule.json?edit=' +
                  this.props.route.params.data.schedule_attendee_id +
                  '&id=' +
                  this.props.route.params.data.id +
                  '&dateid=' +
                  this.props.route.params.data.dateid +
                  '&permission=faculty',
                {
                  centre_classroom_id: '',
                  _centre_id: this.props.route.params.data.centre_id,
                  extra: 0,
                  schedule_date_id: this.batcharr[0].schedule_date_id,
                },
              )
                .then(response => {
                  if (response.error) {
                    console.log(response.error);
                  } else {
                    if (response.data == true) {
                      this.props.navigation.navigate('FacultyScheduleDetails', {
                        data: this.props.route.params.index,
                        date: this.props.route.params.date,
                        total: this.props.route.params.total,
                      });
                      Alert.alert(
                        'Reschedule Alert',
                        'Student rescheduled to other schedule',
                      );
                    }
                  }
                })
                .catch(function (error) {
                  console.log(
                    'There has been a problem with reschedule operation: ' +
                      error.message,
                  );
                });
            },
          },
        ]);
      }
    }
  }

  componentDidMount() {
    console.log(this.props.route.params.data);
    POST(
      SERVER +
        'users/scheduleMoreGetReschedule.json?edit=' +
        this.props.route.params.data.schedule_attendee_id +
        '&id=' +
        this.props.route.params.data.id +
        '&dateid=' +
        this.props.route.params.data.dateid,
    )
      .then(response => {
        if (response.error) {
          console.log(response.error);
        } else {
          this.setState({
            curddate: response.curddate,
            nextddate: response.nextddate,
            tddate: response.tddate,
            tempcurdate: response.tempcurdate,
          });
        }
      })
      .catch(function (error) {
        console.log(
          'There has been a problem with your fetch operation: ' +
            error.message,
        );
      });
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
        contentContainerStyle={{height: height - 90}}>
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
                  this.props.navigation.navigate('FacultyScheduleDetails', {
                    data: this.props.route.params.index,
                    date: this.props.route.params.date,
                    total: this.props.route.params.total,
                  });
                  // this.props.navigation.reset({
                  //   index: 0,
                  //   routes: [{name: 'PendingList'}],
                  // });
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
                  Reschedule Student
                </Text>
              </View>
            </View>
          </Animatable.View>
          <Animatable.View
            animation="fadeInUpBig"
            style={{...STYLES.topCurvedPage, width: width}}>
            <View
              style={{
                height: height - 660,
                marginBottom: 12,
                marginLeft: 20,
                marginRight: 20,
                paddingStart: 10,
                padding: 5,
                borderWidth: 2,
                borderRadius: 5,
                borderColor: PROPERTY.selectedColor,
                backgroundColor: PROPERTY.innerColorBackground,
              }}>
              <Text style={{fontSize: 18, color: PROPERTY.selectedColor}}>
                Time : {this.props.route.params.time}
              </Text>
              <Text style={{fontSize: 18, color: PROPERTY.selectedColor}}>
                Day : {this.props.route.params.data.days}
              </Text>
              <Text style={{fontSize: 18, color: PROPERTY.selectedColor}}>
                Class : {this.props.route.params.data.coursename}
              </Text>
              <Text style={{fontSize: 18, color: PROPERTY.selectedColor}}>
                Centre : {this.props.route.params.centrename}
              </Text>
              <Text style={{fontSize: 18, color: PROPERTY.selectedColor}}>
                Student : {this.props.route.params.data.firstname}{' '}
                {this.props.route.params.data.lastname}
              </Text>
            </View>
            <View
              style={{
                height: 41,
                margin: 20,
                paddingStart: 20,
                marginTop: -8,
                padding: 7,
                borderRadius: 5,
                backgroundColor: PROPERTY.bwColor,
              }}>
              <View style={{flexDirection: 'row'}}>
                {/* <View style={{flex: 55}}>
                  <Text style={{fontSize: 18, color: PROPERTY.selectedColor}}>
                    Date to Reschedule
                  </Text>
                </View>
                <View style={{flex: 12}}>
                  <Text
                    style={{
                      fontSize: 18,
                      color: PROPERTY.selectedColor,
                      paddingLeft: 0,
                    }}>
                    :
                  </Text>
                </View> */}
                <View style={{flex: 50}}>
                  <TouchableOpacity onPress={this.datepicker}>
                    <View style={{flexDirection: 'row'}}>
                      <View style={{flex: 90}}>
                        <Text
                          style={{
                            fontSize: 19,
                            color: PROPERTY.selectedColor,
                            textDecorationLine: 'none',
                            paddingRight: 0,
                          }}>
                          {this.state.defdate != ''
                            ? moment(this.state.defdate).format('DD-MM-YYYY')
                            : 'Select Date to Reschedule'}
                        </Text>
                      </View>
                      <View style={{flex: 30}}>
                        <Text
                          style={{
                            fontSize: 19,
                            color: PROPERTY.selectedColor,
                            paddingTop: 3,
                            marginLeft: 8,
                          }}>
                          <Icon
                            name={'calendar'}
                            size={20}
                            style={{paddingLeft: 50}}
                          />
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
                {show && (
                  <DateTimePicker
                    value={date}
                    minuteInterval={30}
                    mode={mode}
                    is24Hour={true}
                    display="default"
                    onChange={this.setDate}
                  />
                )}
              </View>
            </View>
            {this.state.batchShow && (
              <View
                style={{
                  height: height - 500,

                  marginLeft: 20,
                  marginBottom: 12,
                  marginRight: 20,
                  paddingStart: 10,
                  padding: 5,
                  marginTop: -17,
                  borderWidth: 2,
                  borderRadius: 5,
                  borderColor: PROPERTY.selectedColor,
                  backgroundColor: PROPERTY.innerColorBackground,
                }}>
                <Text style={{fontSize: 20, color: PROPERTY.selectedColor}}>
                  Schedule of {this.state.selectedDate}
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    borderRadius: 5,
                    backgroundColor: PROPERTY.bwColor,
                    padding: 6,
                    marginTop: 5,
                    paddingStart: 9,
                    marginRight: 5,
                  }}>
                  <View style={{flex: 40}}>
                    <Text
                      style={{
                        fontSize: 16,
                        color: PROPERTY.selectedColor,
                        paddingLeft: 2,
                      }}>
                      Batch Name
                    </Text>
                  </View>
                  <View style={{flex: 35, paddingLeft: 14}}>
                    <Text style={{fontSize: 16, color: PROPERTY.selectedColor}}>
                      Time
                    </Text>
                  </View>
                  <View style={{flex: 25, paddingRight: 16}}>
                    <Text style={{fontSize: 16, color: PROPERTY.selectedColor}}>
                      Centre
                    </Text>
                  </View>
                  <View style={{flex: 17, paddingRight: 5}}>
                    <Text style={{fontSize: 16, color: PROPERTY.selectedColor}}>
                      Count
                    </Text>
                  </View>
                </View>
                <FlatList
                  data={this.state.rbatchlist}
                  renderItem={({item, index}) => (
                    <View
                      style={{
                        flexDirection: 'row',
                        borderRadius: 5,
                        backgroundColor: PROPERTY.bwColor,
                        padding: 6,
                        marginTop: 5,
                        paddingStart: 9,
                        marginRight: 5,
                      }}>
                      <View style={{flex: 15, marginLeft: -10, marginTop: -2}}>
                        <Checkbox
                          status={item.status}
                          onPress={() => {
                            this.getbatch(index);
                          }}
                        />
                      </View>
                      <View style={{flex: 37}}>
                        <Text
                          style={{
                            fontSize: 16,
                            color: PROPERTY.selectedColor,
                            paddingTop: 3,
                          }}>
                          {item.cname}
                        </Text>
                      </View>
                      <View style={{flex: 32}}>
                        <Text
                          style={{
                            fontSize: 16,
                            color: PROPERTY.selectedColor,
                            paddingTop: 3,
                          }}>
                          {item.stiming}
                        </Text>
                      </View>
                      <View style={{flex: 32, paddingLeft: 10}}>
                        <Text
                          style={{
                            fontSize: 16,
                            color: PROPERTY.selectedColor,
                            paddingTop: 3,
                          }}>
                          {item.centre_name}
                        </Text>
                      </View>
                      <View style={{flex: 13, paddingLeft: 15}}>
                        <Text
                          style={{
                            fontSize: 16,
                            color: PROPERTY.selectedColor,
                            paddingTop: 3,
                          }}>
                          {item.totaluser}
                        </Text>
                      </View>
                    </View>
                  )}
                  keyExtractor={(item, index) => index}
                />
              </View>
            )}
            {this.state.timeShow && (
              <View
                style={{
                  height: 41,
                  margin: 20,
                  paddingStart: 10,
                  marginTop: -8,
                  padding: 7,
                  borderRadius: 5,
                  backgroundColor: PROPERTY.bwColor,
                }}>
                <View style={{flexDirection: 'row'}}>
                  <TouchableOpacity
                    style={{flex: 10, marginRight: 8, marginTop: -5}}
                    onPress={() => {
                      this.selectTime();
                    }}>
                    {this.state.selectTime == false && (
                      <View style={{marginTop: 5}}>
                        <Icon name={'square-o'} size={32} />
                      </View>
                    )}
                    {this.state.selectTime == true && (
                      <View style={{marginTop: 5}}>
                        <Icon name={'check-square-o'} size={32} />
                      </View>
                    )}
                  </TouchableOpacity>
                  <View style={{flex: 78}}>
                    <Text style={{fontSize: 18, color: PROPERTY.selectedColor}}>
                      Select Another Time :
                    </Text>
                  </View>
                  <View style={{flex: 40}}>
                    <TouchableOpacity onPress={this.timepicker}>
                      <View style={{flexDirection: 'row'}}>
                        <View style={{flex: 90, paddingLeft: 5}}>
                          <Text
                            style={{
                              fontSize: 19,
                              color: PROPERTY.selectedColor,
                              textDecorationLine: 'underline',
                              paddingRight: 15,
                            }}>
                            {moment(date1).format('hh:mm')}
                          </Text>
                        </View>
                        <View style={{flex: 30}}>
                          <Text
                            style={{
                              fontSize: 19,
                              color: PROPERTY.selectedColor,
                              paddingTop: 2,
                            }}>
                            <Icon name={'clock-o'} size={23} />
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </View>
                  {/* {show && <DateTimePicker value={date}
                                    mode={mode}
                                    is24Hour={true}
                                    display="default"
                                    onChange={this.setTime} />
                                } */}
                  {show1 && (
                    <DateTimePicker
                      value={date1}
                      minuteInterval={30}
                      mode={mode1}
                      is24Hour={true}
                      display="default"
                      onChange={this.setDate1}
                    />
                  )}
                </View>
              </View>
            )}
            {this.state.selectTime && (
              <View style={{marginTop: -10}}>
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  alwaysBounceVertical={false}
                  contentContainerStyle={{...STYLES.scrollViewContainer}}>
                  <SelectDropdown
                    data={this.state.currentClassroom}
                    onSelect={(selectedItem, index) => {
                      this.getRadioValue(selectedItem);
                    }}
                    ref={this.dropdownRef}
                    defaultButtonText={'Select Classroom...'}
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
                    dropdownStyle={{...STYLES.dropdownDropdownStyle}}
                    rowStyle={{...STYLES.dropdownRowStyle}}
                    rowTextStyle={{...STYLES.dropdownRowTxtStyle}}
                  />
                </ScrollView>
              </View>
            )}

            <View style={{flexDirection: 'row', marginTop: 5}}>
              <View style={{flex: 25}}></View>
              <View style={{flex: 50, paddingTop: 5}}>
                <Button
                  disabled={this.state.checked}
                  color={PROPERTY.buttonColor}
                  mode="contained"
                  style={{...STYLES.button}}
                  onPress={this.reschedule}>
                  Reschedule
                </Button>
              </View>
              <View style={{flex: 25}}></View>
            </View>
          </Animatable.View>
          {/** Success Modal Dialog */}
          <Modal
            visible={this.state.successModal}
            dismissable={false}
            contentContainerStyle={{
              ...STYLES.modalDialog,
              backgroundColor: PROPERTY.background,
              marginBottom: 40,
            }}>
            <View style={{flexDirection: 'row', paddingTop: 10}}>
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
          {/* <Users /> */}
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

export default connect(mapstate)(RescheduleStudent);
