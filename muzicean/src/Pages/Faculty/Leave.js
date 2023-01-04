import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from 'react-native';
import {FloatingAction} from 'react-native-floating-action';
import {connect} from 'react-redux';

import {Button, Modal} from 'react-native-paper';
import LoginReducer from '../../Redux/Reducer/Login';

import {PROPERTY, POST, SERVER} from '../../Common/Settings';
import {height, width, STYLES} from '../../Common/Style';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';
import BottomDrawer from '../Component/Drawer';
import Month from '../Component/Month';

class Leave extends React.Component {
  scrollRef = null;
  currentMonth = 0;
  selected = null;
  checktotal = 0;
  selectDated = new Date().getDate();

  maininfo = {
    month: Month[new Date().getMonth()],
    year: new Date().getYear() + 1900,
    date: this.selectDated,
  };

  info = {};

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
      isLoading: true,
      leaveListing: '',
      leavelist: [],
      dataChecked: false,
      leave_total: 0,
      _css: PROPERTY.selectedColor,
      leaveDetailsModal: false,
      selecteditem: null,
    };
    this.goBack = this.goBack.bind(this);
    this.clickHandler = this.clickHandler.bind(this);
    this.changeMonth = this.changeMonth.bind(this);
    this.leaveCancelcheck = this.leaveCancelcheck.bind(this);
  }

  componentDidMount() {
    this.setState({
      leaveListing: '',
      leavelist: [],
      dataChecked: false,
      leave_total: 0,
    });

    this.setState({isLoading: true});

    POST(SERVER + 'manage/leave.json', {
      leaveyear: this.state.maininfo.year,
    }).then(response => {
      if (
        response == undefined ||
        response == null ||
        response.data._total == 0
      ) {
        console.log('No leave');
        this.setState({isLoading: false});
      } else {
        this.setState({leaveListing: response.data});
        if (response.data._total > 0) {
          Object.keys(this.state.leaveListing).map(key => {
            if (key != '_total') {
              this.state.leavelist.push(this.state.leaveListing[key]);
            }
          });
        }

        if (response.data._total == 0) {
          this.dataChecked = false;
        } else {
          this.dataChecked = true;
        }
        this.setState({
          dataChecked: this.dataChecked,
          leave_total: response.data._total,
          isLoading: false,
        });
      }
    });
  }

  goBack() {
    this.props.navigation.reset({index: 0, routes: [{name: 'Faculty'}]});
  }
  leaveCancelcheck() {
    Alert.alert('Cancel Leave Alert', 'This leave will be Cancelled?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => {
          this.leaveCancel();
        },
      },
    ]);
  }
  clickHandler() {
    this.props.navigation.navigate('LeaveApply');
  }

  changeYear = year => {
    console.log(year);
    this.maininfo.year = year;

    let maininfoo = {
      year: this.maininfo.year,
      month: new Date().getMonth() + 1 + this.currentMonth,
      date: 1,
    };
    this.setState({maininfo: maininfoo});
    setTimeout(() => {
      this.componentDidMount();
    }, 50);
  };

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

  leaveCancel = () => {
    this.setState({leaveDetailsModal: false});
    this.setState(state => ({
      isLoading: true,
    }));

    POST(SERVER + 'manage/LeaveReview.json', {
      cancelleave: 1,
      users_leave_id: this.state.selecteditem.users_leave_id,
    }).then(res => {
      if (res == null || res == undefined) {
        this.setState(state => ({
          isLoading: false,
        }));
      } else if (res.success == true) {
        this.setState(state => ({
          isLoading: false,
        }));
        Alert.alert('', 'Leave Cancelled Sucessfully!', [
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

    // Alert.alert('Leave Alert', 'Leave canceled successfully..!!');
  };

  /**
   * called to display page
   * @returns
   */
  render() {
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
              marginTop: -70,
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
                        this.changeYear(parseInt(this.maininfo.year) - 1);
                      }}>
                      <Icon
                        style={{paddingRight: 120, paddingTop: 4}}
                        name={'chevron-left'}
                        size={20}
                      />
                    </TouchableOpacity>
                    <Text style={{...STYLES.fontLarge, fontWeight: 'bold'}}>
                      {this.state.maininfo.year}
                    </Text>
                    <TouchableOpacity
                      style={{alignSelf: 'flex-end'}}
                      onPress={() => {
                        this.changeYear(parseInt(this.maininfo.year) + 1);
                      }}>
                      <Icon
                        style={{paddingLeft: 120, paddingBottom: 3}}
                        name={'chevron-right'}
                        size={20}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={{flex: 1, alignItems: 'flex-end'}}></View>
              </View>
            </View>
            <View
              style={{
                height: height - 320,
                margin: 18,
                borderWidth: 2,
                borderRadius: 5,
                borderColor: PROPERTY.selectedColor,
                backgroundColor: PROPERTY.innerColorBackground,
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 20,
                  fontWeight: '600',
                  color: this.state._css,
                  paddingBottom: 20,
                  paddingTop: 10,
                }}>
                Leave Application Records({this.state.leave_total})
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
                      No Leave Found!
                    </Text>
                  </View>
                )}
                {this.state.dataChecked && (
                  <FlatList
                    style={{height: height - 400}}
                    data={this.state.leavelist}
                    renderItem={({item, index}) => (
                      <View style={{flexDirection: 'row'}}>
                        <View style={{flex: 65}}>
                          <TouchableOpacity
                            onPress={() => {
                              if (item.status == 'applied') {
                                this.setState({
                                  leaveDetailsModal: true,
                                  selecteditem: item,
                                });
                              }
                            }}>
                            <View
                              style={{
                                alignItems: 'center',
                                marginBottom: 10,
                                paddingBottom: 10,
                                paddingLeft: 8,
                                paddingTop: 10,
                                marginLeft: 10,
                                borderRadius: 10,
                                marginHorizontal: 10,
                                backgroundColor:
                                  PROPERTY.calendarHeaderBackground,
                              }}>
                              <Text
                                style={{
                                  ...STYLES.fontSmall,
                                  color: this.state._css,
                                }}>
                                {moment(item.applicationdate).format(
                                  'DD-MM-YYYY',
                                )}{' '}
                                - {moment(item.enddate).format('DD-MM-YYYY')}
                              </Text>
                              <Text
                                style={{
                                  ...STYLES.fontSmall,
                                  color: this.state._css,
                                }}>
                                {item.centre_name}
                              </Text>
                              <Text
                                style={{
                                  ...STYLES.fontSmall,
                                  color: this.state._css,
                                }}>
                                {item.details}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        </View>

                        <View style={{flex: 35}}>
                          <View
                            style={{
                              alignItems: 'center',
                              marginBottom: 10,
                              paddingBottom: 20,
                              paddingLeft: 8,
                              paddingTop: 20,
                              marginLeft: 10,
                              borderRadius: 10,
                              marginHorizontal: 10,
                              backgroundColor:
                                PROPERTY.calendarHeaderBackground,
                            }}>
                            <Text
                              style={{
                                ...STYLES.fontSmall,
                                color: this.state._css,
                              }}>
                              {item.status}
                            </Text>
                          </View>
                        </View>
                      </View>
                    )}
                    keyExtractor={(item, index) => index}
                  />
                )}
              </View>
            </View>
          </Animatable.View>
          {/** Leave details Modal Dialog */}
          <Modal
            visible={this.state.leaveDetailsModal}
            dismissable={false}
            contentContainerStyle={{
              ...STYLES.modalDialog,
              backgroundColor: PROPERTY.background,
              marginTop: 15,
            }}>
            <TouchableOpacity
              onPress={() => {
                this.setState({leaveDetailsModal: false});
              }}>
              <Image
                source={require('../../Assets/icons/close.png')}
                style={{
                  resizeMode: 'contain',
                  width: 40,
                  height: 40,
                  marginLeft: 280,
                  marginTop: 8,
                }}
              />
            </TouchableOpacity>

            <View style={{paddingTop: 0, paddingLeft: 20}}>
              <Text style={{fontSize: 20, fontWeight: '500', marginTop: -35}}>
                {this.state.selecteditem
                  ? moment(this.state.selecteditem.applicationdate).format(
                      'DD/MM/YYYY',
                    ) +
                    '-' +
                    moment(this.state.selecteditem.enddate).format('DD/MM/YYYY')
                  : ''}
              </Text>
            </View>
            <View>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: '500',
                  paddingLeft: 20,
                  marginTop: 1,
                }}>
                {this.state.selecteditem
                  ? this.state.selecteditem.centre_name
                  : ''}
              </Text>
            </View>
            <View style={{flexDirection: 'row', paddingTop: 10}}>
              <View style={{flex: 5, padding: 5}}></View>
              <View style={{flex: 40, paddingTop: 5}}>
                <Button
                  color={PROPERTY.buttonColor}
                  mode="contained"
                  style={{...STYLES.button, height: 40, paddingTop: 0}}
                  onPress={() => {
                    this.leaveCancelcheck();
                  }}>
                  Cancel
                </Button>
              </View>
              <View style={{flex: 2, padding: 5}}></View>
              <View style={{flex: 44, paddingTop: 5}}>
                <Button
                  color={PROPERTY.buttonColor}
                  mode="contained"
                  style={{...STYLES.button, height: 40, paddingTop: 0}}
                  onPress={() => {
                    this.props.navigation.navigate('LeaveEdit', {
                      selecteditem: this.state.selecteditem,
                    });
                  }}>
                  Edit
                </Button>
              </View>
              <View style={{flex: 5, padding: 5}}></View>
            </View>
          </Modal>
        </View>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={this.clickHandler}
          style={styles.touchableOpacityStyle}>
          <Image
            style={{
              resizeMode: 'contain',
              width: 50,
              height: 50,
              marginLeft: 20,
              marginTop: 100,
            }}
            source={require('../../Assets/icons/fab.png')}
          />
        </TouchableOpacity>
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

export default connect(mapstate)(Leave);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'blue',
    padding: 10,
  },
  titleStyle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 10,
  },
  textStyle: {
    fontSize: 16,
    textAlign: 'center',
    padding: 10,
  },
  touchableOpacityStyle: {
    position: 'absolute',
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    right: 30,
    bottom: 30,
  },
  floatingButtonStyle: {
    resizeMode: 'contain',
    width: 50,
    height: 50,
    backgroundColor: 'blue',
  },
});
