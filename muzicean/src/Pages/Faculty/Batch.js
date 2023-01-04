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
import Users from '../Component/User';
import {white} from 'react-native-paper/lib/typescript/styles/colors';

class Batch extends React.Component {
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
      selectedClass: 0,
      maininfo: this.maininfo,
      isLoading: true,
      batchListing: '',
      currentDateBatch: [],
      dataChecked: null,
      batch_total: null,
      sdate: null,
      heading: 'Batch List',
      _css: PROPERTY.selectedColor,
    };
    this.goBack = this.goBack.bind(this);
    this.changeDate = this.changeDate.bind(this);
    this.changeMonth = this.changeMonth.bind(this);
  }

  componentDidMount() {
    this.setState({
      batch_total: 0,
      currentDateBatch: [],
    });

    this.setState({isLoading: true});
    this.m = month.indexOf(this.state.maininfo.month) + 1;

    if (this.props.route.params.sdate == undefined) {
      this.sdate =
        this.state.maininfo.year +
        '-' +
        this.m +
        '-' +
        this.state.maininfo.date;
    } else {
      this.psdate = String(this.props.route.params.sdate);
      let parts = this.psdate.split('-');
      this.state.maininfo.month = this.month[Number(parts[1]) - 1];
      this.state.maininfo.date = Number(parts[0]);
      this.state.maininfo.year = Number(parts[2]);
      this.m = this.month.indexOf(this.state.maininfo.month) + 1;
      this.sdate =
        this.state.maininfo.year +
        '-' +
        this.m +
        '-' +
        this.state.maininfo.date;
    }

    POST(SERVER + 'users/batches.json', {startdate: this.sdate}).then(
      response => {
        this.setState({loading: false});
        if (response.error) {
          console.log(response.error);
        } else {
          this.setState(state => ({
            currentDateBatch: [],
            batchListing: '',
          }));

          this.setState({batchListing: response});
          Object.keys(this.state.batchListing).map(key => {
            this.state.currentDateBatch.push(this.state.batchListing[key]);
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
      },
    );
  }

  getBatch = date => {
    this.setState({
      batchListing: '',
      currentDateBatch: [],
      isLoading: true,
      batch_total: 0,
    });

    POST(SERVER + 'users/batches.json', {startdate: date}).then(response => {
      this.setState({loading: false});
      if (response.error) {
        console.log(response.error);
      } else {
        this.setState(state => ({
          currentDateBatch: [],
          batchListing: '',
        }));

        this.setState({batchListing: response});
        Object.keys(this.state.batchListing).map(key => {
          this.state.currentDateBatch.push(this.state.batchListing[key]);
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
  };

  goBack() {
    if (this.props.route.params.goback == 'schedule') {
      this.props.navigation.reset({
        index: 0,
        routes: [{name: 'FacultySchedule'}],
      });
    } else {
      this.props.navigation.reset({index: 0, routes: [{name: 'Faculty'}]});
    }
  }

  changeMonth(month) {
    this.currentMonth = month;
    const _d = new Date();
    _d.setMonth(new Date().getMonth() + this.currentMonth);
    let maininfoo = {
      month: this.month[_d.getMonth()],
      year: _d.getYear() + 1900,
      date: 1,
    };
    maininfoo.total = new Date(
      this.maininfo.year,
      new Date().getMonth() + 1 + this.currentMonth,
      0,
    ).getDate();
    this.state.maininfo = maininfoo;

    this.setState(state => ({
      selectedDate: 1,
    }));

    this.m = this.month.indexOf(this.state.maininfo.month) + 1;
    this.sdate =
      this.state.maininfo.year + '-' + this.m + '-' + this.state.maininfo.date;
    this.getBatch(this.sdate);
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

    this.state.maininfo = maininfoo;

    this.setState(state => ({
      selectedDate: index,
    }));

    this.m = this.month.indexOf(this.state.maininfo.month) + 1;
    this.sdate =
      this.state.maininfo.year + '-' + this.m + '-' + this.state.maininfo.date;
    this.getBatch(this.sdate);
  }

  markFA = batch => {
    POST(SERVER + 'api/showCentre.json', {
      centre_id: batch.centre_id,
    }).then(response => {
      if (response.error) {
        console.log(response.error);
      } else {
        if (response.centre_id != null) {
          this.m = this.month.indexOf(this.state.maininfo.month) + 1;
          this.props.navigation.navigate('ScheduleCancel', {
            id: batch.schedule_id,
            dateid: batch.schedule_date_id,
            date: this.sdate,
            batchdate: batch.batchdate,
            rdate: this.state.maininfo.date,
            month: this.m,
            year: this.state.maininfo.year,
            time: batch.stime + ' - ' + batch.etime,
            batchname: batch.batchname,
            _centrename: response.name,
            _centre_id: batch.centre_id,
            alertshow: batch.alertshow,
            navigate: 'batchlist',
          });
        }
      }
    });
  };

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
                      style={{marginTop: 170}}
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
                      style={{height: height - 400}}
                      data={this.state.currentDateBatch}
                      renderItem={({item, index}) => (
                        <View style={{flexDirection: 'row'}}>
                          <View style={{flex: 85}}>
                            <TouchableOpacity
                              onPress={() => {
                                this.props.navigation.navigate(
                                  'FacultyScheduleDetails',
                                  {
                                    indexcount: index,
                                    starttime: item.attdate,

                                    _total: this.state.batch_total,
                                    title: 'batchlist',
                                  },
                                );
                              }}>
                              <View
                                style={{
                                  flex: 1,
                                  alignItems: 'center',
                                  marginBottom: 10,
                                  padding: 15,
                                  marginLeft: 10,
                                  fontColor: 'white',
                                  borderRadius: 10,
                                  marginHorizontal: 10,
                                  backgroundColor:
                                    item.color != 'none'
                                      ? item.color
                                      : PROPERTY.calendarHeaderBackground,
                                }}>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                  }}>
                                  <View style={{flex: 47}}>
                                    <Text
                                      style={{
                                        ...STYLES.fontSmall,
                                        fontWeight: '600',
                                        color:
                                          item.color != 'none'
                                            ? 'white'
                                            : PROPERTY.fontColor,
                                        textDecorationLine:
                                          item.textDecorationLine != 'none'
                                            ? item.textDecorationLine
                                            : '',
                                      }}>
                                      {item.batchname}
                                    </Text>
                                    <Text
                                      style={{
                                        fontSize: 15,
                                        color:
                                          item.color != 'none'
                                            ? 'white'
                                            : PROPERTY.fontColor,
                                        textDecorationLine:
                                          item.textDecorationLine != 'none'
                                            ? item.textDecorationLine
                                            : '',
                                      }}>
                                      {item.centre_name}
                                    </Text>
                                  </View>
                                  <View style={{flex: 25}}>
                                    <Text style={{fontSize: 15}}></Text>
                                    <Text
                                      style={{
                                        fontSize: 15,
                                        color:
                                          item.color != 'none'
                                            ? 'white'
                                            : PROPERTY.fontColor,
                                        textDecorationLine:
                                          item.textDecorationLine != 'none'
                                            ? item.textDecorationLine
                                            : '',
                                      }}>
                                      SC : {item.totaluser}
                                    </Text>
                                  </View>
                                  <View style={{flex: 28}}>
                                    <Text
                                      style={{
                                        fontSize: 15,

                                        color:
                                          item.color != 'none'
                                            ? 'white'
                                            : PROPERTY.fontColor,
                                        textDecorationLine:
                                          item.textDecorationLine != 'none'
                                            ? item.textDecorationLine
                                            : '',
                                      }}>
                                      {item.stime}
                                    </Text>
                                    <Text
                                      style={{
                                        fontSize: 15,
                                        color:
                                          item.color != 'none'
                                            ? 'white'
                                            : PROPERTY.fontColor,
                                        textDecorationLine:
                                          item.textDecorationLine != 'none'
                                            ? item.textDecorationLine
                                            : '',
                                      }}>
                                      {item.etime}
                                    </Text>
                                  </View>
                                </View>
                              </View>
                            </TouchableOpacity>
                          </View>
                        </View>
                      )}
                      keyExtractor={(item, index) => index}
                    />
                  )}
                </View>
              </View>
            )}
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

export default connect(mapstate)(Batch);
