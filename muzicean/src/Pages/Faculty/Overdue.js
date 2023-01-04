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
} from 'react-native';
import {Dimensions} from 'react-native';
import {connect} from 'react-redux';

import {TextInput, Button, Modal} from 'react-native-paper';
import LoginReducer from '../../Redux/Reducer/Login';

import {Card} from 'react-native-paper';
import {PROPERTY, POST, SERVER} from '../../Common/Settings';
import {height, width, STYLES} from '../../Common/Style';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';
import BottomDrawer from '../Component/Drawer';

class OverdueAttendence extends React.Component {
  scrollRef = null;
  currentMonth = 0;

  info = {};
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

  scrolldate = [];

  constructor(props) {
    super(props);
    let defaultImage = require('../../Assets/icons/dp.png');
    let users = {
      name: global.userinfo.firstname + ' ' + global.userinfo.lastname,
      email: global.userinfo.email,
      role: 'Teacher',
      photo:
        global.userinfo.photo === '' ? defaultImage : global.userinfo.photo,
    };
    this.info.user = users;
    this.maininfo.total = new Date(
      this.maininfo.year,
      new Date().getMonth() + 1,
      0,
    ).getDate();
    this.state = {
      selectedClass: 0,
      maininfo: this.maininfo,
      isLoading: true,
      batchListing: '',
      currentDateBatch: [],
      dataChecked: null,
      batch_total: null,
      sdate: null,
      heading: 'Pending Batch List',
      verifyPending: 1,
      _css: PROPERTY.selectedColor,
      colorCoding: [],
      color_month: 0,
    };
    this.goBack = this.goBack.bind(this);
    this.changeDate = this.changeDate.bind(this);
    this.changeMonth = this.changeMonth.bind(this);
  }

  componentDidMount() {
    
    this.setState({isLoading: true});

    this.psdate = String(this.props.route.params.psdate);
    let parts =(this.psdate).split('-');

    this.state.maininfo.month = this.month[Number(parts[1])-1];
    this.state.maininfo.date = Number(parts[0]);
    this.state.maininfo.year = Number(parts[2]);

    this.m = this.month.indexOf(this.state.maininfo.month) + 1;
    this.state.color_month = this.m;
    this.sdate =
      this.state.maininfo.year + '-' + this.m + '-' + this.state.maininfo.date;

    POST(SERVER + 'users/oschedule.json').then(response => {
      this.setState({loading: false});
      if (response.error) {
        console.log(response.error);
      } else {
        this.setState({batchListing: response.overdue});

        this.c_date = moment().format('DD/MM/YYYY');
        this.setState({sdate: this.c_date});

        Object.keys(this.state.batchListing).map(key => {
          this.r_date = moment(this.state.batchListing[key].starttime).format(
            'DD/MM/YYYY',
          );
          if (this.c_date === this.r_date) {
            this.state.currentDateBatch.push(this.state.batchListing[key]);
            this.scrolldate.push(this.r_date);
          }
          this.state.colorCoding.push(this.r_date);
        });

        if (this.state.currentDateBatch.length == 0) {
          this.dataChecked = false;
        } else {
          this.dataChecked = true;
        }

        this.setState({
          dataChecked: this.dataChecked,
          batch_total: this.state.currentDateBatch.length,
          isLoading: false,
        });
      }
    });
  }

  goBack() {
    this.props.navigation.navigate('Faculty');
  }

  changeMonth(month) {
    this.currentMonth = month;
    const _d = new Date();
    _d.setMonth(new Date().getMonth() + this.currentMonth);
    this.maininfo = {
      month: this.month[_d.getMonth()],
      year: _d.getYear() + 1900,
      date: 1,
    };

    this.maininfo.total = new Date(
      this.maininfo.year,
      new Date().getMonth() + 1 + this.currentMonth,
      0,
    ).getDate();
    this.setState({maininfo: this.maininfo});
    this.state.color_month = _d.getMonth() + 1;
  }

  changeDate(index) {
    this.maininfo.date = index;
    this.state.currentDateBatch = [];
    this.state.batch_total = null;
    this.setState({maininfo: this.maininfo, dataChecked: null});
    this.m = this.month.indexOf(this.state.maininfo.month) + 1;
    this.state.color_month = this.m;
    this.checkdate = moment().subtract(2, 'd').format('YYYY-MM-DD');
    this.cdate = moment().format('YYYY-MM-DD');

    Object.keys(this.state.batchListing).map(key => {
      this.sdate = moment(
        this.state.maininfo.year +
          '/' +
          this.m +
          '/' +
          this.state.maininfo.date,
      ).format('YYYY-MM-DD');
      this.setState({sdate: this.sdate});
      this.r_date = moment(this.state.batchListing[key].starttime).format(
        'YYYY-MM-DD',
      );
      if (this.sdate === this.r_date) {
        this.state.currentDateBatch.push(this.state.batchListing[key]);
      }
    });

    if (this.checkdate <= this.sdate) {
      this.setState({
        heading: 'Pending Batch List',
        _css: PROPERTY.selectedColor,
        verifyPending: 1,
      });
    }
    if (this.checkdate > this.sdate) {
      this.setState({
        heading: 'Overdue Batch List',
        _css: PROPERTY.overdueColor,
        verifyPending: 0,
      });
    }
    if (this.cdate < this.sdate) {
      this.setState({
        heading: 'Pending Batch List',
        _css: PROPERTY.selectedColor,
        verifyPending: 1,
      });
    }

    if (this.state.currentDateBatch.length == 0) {
      this.dataChecked = false;
    } else {
      this.dataChecked = true;
    }

    this.setState({
      dataChecked: this.dataChecked,
      batch_total: this.state.currentDateBatch.length,
    });
  }

  overdueModalbtn(
    stime,
    etime,
    scheduledays,
    course,
    batchname,
    mode,
    sch_id,
    date_id,
  ) {
    this.stime = stime;
    this.etime = etime;
    this.scheduledays = scheduledays;
    this.course = course;
    this.batchname = batchname;
    this.mode = mode;
    this.sch_id = sch_id;
    this.date_id = date_id;
    this.setState({overdueModal: true});
  }

  overdueModalhide() {
    this.stime = null;
    this.etime = null;
    this.scheduledays = null;
    this.course = null;
    this.batchname = null;
    this.mode = null;
    this.sch_id = null;
    this.date_id = null;
    this.setState({overdueModal: false});
  }

  submitOverdue() {
    this.setState({successModal: true});
  }

  /**
   * called to display page
   * @returns
   */
  render() {
    setTimeout(() => {
      let position = (this.state.maininfo.date - 3.3) * 50;
      if (position < 1) {
        position = 0;
      }
      this.scrollRef.scrollTo({x: position, y: 0, animated: true});
    }, 50);

    return (
      <KeyboardAvoidingView
        behavior="position"
        contentContainerStyle={{height: height - 80}}>
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
                      let cdate = moment().format('DD/MM/YYYY');
                      let odate = moment()
                        .subtract(2, 'd')
                        .format('DD/MM/YYYY');
                      let vdate = moment(
                        this.maininfo.year +
                          '/' +
                          this.state.color_month +
                          '/' +
                          ind,
                      ).format('DD/MM/YYYY');

                      if (
                        !this.state.colorCoding.includes(vdate) &&
                        vdate < cdate
                      ) {
                        css = {
                          backgroundColor: PROPERTY.greenColor,
                          borderWidth: 1,
                          fontColor: 'white',
                          borderColor: PROPERTY.calendarHeaderBorderColor,
                          borderRadius: 5,
                          margin: 4.4,
                        };
                      } else if (
                        this.state.colorCoding.includes(vdate) &&
                        vdate < odate
                      ) {
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
            {/** Display class list if non of the class is selected */}
            {this.state.selectedClass === 0 && (
              <View
                style={{
                  height: height - 320,
                  margin: 25,
                  borderWidth: 2,
                  borderRadius: 5,
                  borderColor: PROPERTY.selectedColor,
                  backgroundColor: PROPERTY.innerColorBackground,
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 25,
                    color: this.state._css,
                    paddingBottom: 20,
                    paddingTop: 10,
                  }}>
                  {this.state.heading} ({this.state.batch_total})
                </Text>

                <View>
                  {this.state.isLoading && (
                    <ActivityIndicator
                      size="large"
                      color={PROPERTY.selectedColor}
                      style={{marginTop: 130}}
                    />
                  )}
                  {this.state.dataChecked == false && (
                    <View
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: -80,
                      }}>
                      <Image source={PROPERTY.noDataFound} />
                      <Text
                        style={{
                          color: PROPERTY.selectedColor,
                          fontSize: 15,
                          marginTop: -225,
                        }}>
                        No Data Found!
                      </Text>
                    </View>
                  )}
                  {this.state.dataChecked && (
                    <FlatList
                      style={{height: height}}
                      data={this.state.currentDateBatch}
                      renderItem={({item, index}) => (
                        <TouchableOpacity
                          onPress={() => {
                            this.state.verifyPending == 0
                              ? this.props.navigation.navigate('OverdueBatch', {
                                  data: index,
                                  date: this.state.sdate,
                                  total: this.state.batch_total,
                                })
                              : // this.props.navigation.navigate('OverdueBatch', { data: index, date: this.state.sdate, total: this.state.batch_total }, )
                                this.props.navigation.navigate(
                                  'FacultyScheduleDetails',
                                  {
                                    indexcount: index,
                                    starttime: item.attdate,
                                    _total: this.state.batch_total,
                                  },
                                );
                            console.log(item.attdate);
                            // this.props.navigation.navigate('FacultyScheduleDetails', { data: this.state.currentDateBatch, _total: this.state.batch_total, indexcount: index }, )
                          }}>
                          <View
                            style={{
                              flex: 1,
                              alignItems: 'center',
                              marginBottom: 10,
                              padding: 15,
                              marginLeft: 10,
                              borderRadius: 10,
                              marginHorizontal: 10,
                              backgroundColor:
                                PROPERTY.calendarHeaderBackground,
                            }}>
                            <View style={{flexDirection: 'row'}}>
                              <View style={{flex: 52}}>
                                <Text
                                  style={{
                                    ...STYLES.fontSmall,
                                    color: this.state._css,
                                  }}>
                                  {item.batchname}
                                </Text>
                              </View>
                              <View style={{flex: 68}}>
                                <Text
                                  style={{
                                    ...STYLES.fontSmall,
                                    color: this.state._css,
                                  }}>
                                  {item.stime} - {item.etime}
                                </Text>
                              </View>
                            </View>
                          </View>
                        </TouchableOpacity>
                      )}
                      keyExtractor={(item, index) => index}
                    />
                  )}
                </View>
              </View>
            )}
          </Animatable.View>

          {/** Overdue Modal Dialog */}
          <Modal
            visible={this.state.overdueModal}
            dismissable={false}
            contentContainerStyle={{
              ...STYLES.modalDialog,
              backgroundColor: PROPERTY.background,
            }}>
            <TouchableOpacity
              onPress={() => {
                this.setState({overdueModal: false});
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
              <Text style={{...STYLES.fontNormal, fontWeight: 'bold'}}></Text>
            </View>

            <View
              style={{
                width: 330,
                height: 150,
                backgroundColor: PROPERTY.bwColor,
                paddingTop: 20,
                padding: 15,
                borderRadius: 20,
                marginStart: 20,
                paddingStart: 20,
              }}>
              <Text style={{fontSize: 18}}>
                Time : {this.stime} - {this.etime}
              </Text>
              <Text style={{fontSize: 18}}>Day : {this.scheduledays} </Text>
              <Text style={{fontSize: 18}}>Class : {this.course} </Text>
              <Text style={{fontSize: 18}}>Mode : {this.mode} </Text>
            </View>
            <View style={{paddingStart: 100, paddingTop: 10}}>
              <Text style={{color: PROPERTY.overdueColor}}>
                Send request for this batch?
              </Text>
            </View>
            <View style={{flexDirection: 'row', paddingTop: 8}}>
              <View style={{flex: 1, padding: 5}}></View>
              <View style={{flex: 1, paddingTop: 5}}>
                <Button
                  color={PROPERTY.buttonColor}
                  mode="contained"
                  style={{...STYLES.button, height: 40, paddingTop: 0}}
                  onPress={this.submitOverdue.bind(this)}>
                  Proceed
                </Button>
              </View>
              <View style={{flex: 1, padding: 5}}></View>
            </View>
          </Modal>

          {/** Success Modal Dialog */}
          <Modal
            visible={this.state.successModal}
            dismissable={false}
            contentContainerStyle={{
              ...STYLES.modalDialog,
              backgroundColor: PROPERTY.background,
              marginBottom: 60,
            }}>
            <View style={{flexDirection: 'row', paddingTop: 20}}>
              <View style={{flex: 1, padding: 5}}>
                <View
                  style={{
                    width: 280,
                    height: 70,
                    backgroundColor: PROPERTY.bwColor,
                    paddingTop: 20,
                    padding: 15,
                    borderRadius: 20,
                    marginStart: 15,
                    paddingStart: 20,
                  }}>
                  <Text style={{fontSize: 18, color: PROPERTY.green}}>
                    Request sent successfully...
                  </Text>
                </View>
                <TouchableOpacity
                  style={{marginTop: -63, marginLeft: -14}}
                  onPress={() => {
                    this.setState({successModal: false});
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
              </View>
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

export default connect(mapstate)(OverdueAttendence);
