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
import { Dimensions, Linking } from 'react-native';
import { connect } from 'react-redux';

import { TextInput, Button, Modal, DataTable } from 'react-native-paper';
import LoginReducer from '../../Redux/Reducer/Login';

import { Card } from 'react-native-paper';
import {
  PROPERTY,
  POST,
  SERVER,
  UPLOAD,
  DEVICE_ID,
  TOKEN,
} from '../../Common/Settings';
import { height, width, STYLES } from '../../Common/Style';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/FontAwesome';
import Users from '../Component/User';
import moment from 'moment';
import BottomDrawer from '../Component/Drawer';

class ModuleAttendance extends React.Component {
  scrollRef = null;
  currentMonth = 0;
  info = {};
  defaultImage = require('../../Assets/icons/dp.png');

  constructor(props) {
    super(props);
    this.state = {
      selectedClass: 0,
      isLoading: true,
      studentProfile: false,
      studentDp: null,
      moduleListing: '',
      moduleClasses: [],
      dataChecked: null,
      noteModal: false,
      noteDate: null,
    };
  }

  componentDidMount() {
    console.log(this.props.route.params.data);

    POST(SERVER + 'users/studentById.json', {
      users_id: this.props.route.params.data.users_id,
    }).then(response => {
      this.setState({ loading: false });
      if (response.error) {
        console.log(response.error);
      } else {
        this.info = response.data;
        this.info.name = response.data.firstname + ' ' + response.data.lastname;
        if (response.data.photo != '') {
          this.setState({
            studentProfile: true,
            studentDp: SERVER + 'upload/' + response.data.photo,
          });
        } else {
          this.setState({ studentProfile: false });
        }
      }
    });

    POST(SERVER + 'api/attendence.json', {
      users_id: this.props.route.params.data.users_id,
      master_id: this.props.route.params.data.schedule_master_id,
    }).then(response => {
      this.setState({ loading: false });
      if (response.error) {
        console.log(response.error);
      } else {
        // console.log(response);
        this.setState({ moduleListing: response });
        Object.keys(this.state.moduleListing).map(key => {
          if (this.state.moduleListing[key].dayname == 'Monday') {

            this.state.moduleListing[key] = {
              ...this.state.moduleListing[key],
              shortday: "MON",
            };

          } else if (this.state.moduleListing[key].dayname == 'Tuesday') {
            this.state.moduleListing[key] = {
              ...this.state.moduleListing[key],
              shortday: "TUE",
            };

          } else if (this.state.moduleListing[key].dayname == 'Wednesday') {
            this.state.moduleListing[key] = {
              ...this.state.moduleListing[key],
              shortday: "WED",
            };

          } else if (this.state.moduleListing[key].dayname == 'Thursday') {
            this.state.moduleListing[key] = {
              ...this.state.moduleListing[key],
              shortday: "THU",
            };

          } else if (this.state.moduleListing[key].dayname == 'Friday') {
            this.state.moduleListing[key] = {
              ...this.state.moduleListing[key],
              shortday: "FRI",
            };

          } else if (this.state.moduleListing[key].dayname == 'Saturday') {
            this.state.moduleListing[key] = {
              ...this.state.moduleListing[key],
              shortday: "SAT",
            };

          } else if (this.state.moduleListing[key].dayname == 'Sunday') {
            this.state.moduleListing[key] = {
              ...this.state.moduleListing[key],
              shortday: "SUN",
            };

          }
          this.state.moduleClasses.push(this.state.moduleListing[key]);
        });

        if (this.state.moduleClasses.length == 0) {
          this.dataChecked = false;
        } else {
          this.dataChecked = true;
        }

        this.setState({
          dataChecked: this.dataChecked,
          isLoading: false,
        });
      }
    });
  }

  getNote = value => {
    // console.log(value);

    this.setState({ noteDate: value.starttimed });

    if (value.cancelreason == '') {
      this.setState({ noteRemark: '' });
    }

    if (value.cancelreason != '') {
      this.setState({ noteRemark: value.cancelreason });
      this.setState({ noteModal: true });
    }

    if (value.status == 'hold' || value.status == 'freeze' || value.deleted == 1 || value.facultyabsent == 1) {
      this.setState({ noteRemark: '' });
    }

    if (value.deleted == 1) {
      this.setState({ noteRemark: "Discontinued" });
      this.setState({ noteModal: true });
    }

    if (value.staffcomment != '') {
      this.reason1 = value.cancelreason + " " + value.staffcomment;
      this.setState({ noteRemark: this.reason1 });
      this.setState({ noteModal: true });
    }

    if (value.comments != '') {
      this.reason = value.cancelreason + " " + value.comments;
      this.setState({ noteRemark: this.reason });
      this.setState({ noteModal: true });
    }

  };

  /**
   * called to display page
   * @returns
   */
  render() {
    return (
      <KeyboardAvoidingView
        behavior="position"
        contentContainerStyle={{ height: height - 90 }}>
        <View
          style={{
            flex: 1,
            backgroundColor: PROPERTY.headerColorBackground,
            marginBottom: -90,
          }}
          showsVerticalScrollIndicator={false}>
          <Animatable.View animation="fadeInUpBig" style={{ width: width }}>
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
                  if (this.props.route.params.navigate == 'overdue') {
                    this.props.navigation.navigate('OverdueBatch', {
                      data: this.props.route.params.index,
                      date: this.props.route.params.date,
                      total: this.props.route.params.total,
                    });
                  } else if (
                    this.props.route.params.navigate == 'overdueedit'
                  ) {
                    this.props.navigation.navigate('OverdueBatchEdit', {
                      batch: this.props.route.params.batch,
                    });
                  } else if (
                    this.props.route.params.navigate == 'studentsList'
                  ) {
                    this.props.navigation.navigate('StudentsList');
                  } else {

                    if (this.props.route.params.goback == 'batchlist') {
                      this.back = 'batchlist';
                    } else if (this.props.route.params.goback == 'pending') {
                      this.back = 'pending';
                    } else {
                      this.back = '';
                    }

                    this.props.navigation.navigate('FacultyScheduleDetails', {
                      data: this.props.route.params.index,
                      date: this.props.route.params.date,
                      total: this.props.route.params.total,
                      title: this.back,
                      navigate: this.back,
                    });
                  }
                }}>
                <View style={{ paddingLeft: 20, paddingTop: 25 }}>
                  <Icon name={'chevron-left'} size={20} />
                </View>
              </TouchableOpacity>
              <View style={{ flex: 9, alignItems: 'flex-start' }}></View>
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
                  Student Module Attendance
                </Text>
              </View>
            </View>
          </Animatable.View>
          <Animatable.View
            animation="fadeInUpBig"
            style={{ width: width, marginTop: 0 }}>
            <View style={{ backgroundColor: PROPERTY.innerColorBackground }}>
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: 10,
                }}>
                <Image
                  source={
                    this.state.studentProfile
                      ? { uri: this.state.studentDp }
                      : this.defaultImage
                  }
                  style={{
                    width: 70,
                    height: 70,
                    resizeMode: 'cover',
                    borderRadius: 60,
                    borderWidth: 1,
                    borderColor: PROPERTY.selectedColor,
                  }}
                />
                <Text
                  style={{
                    paddingLeft: 4,
                    paddingTop: 7,
                    fontSize: 19,
                    color: PROPERTY.selectedColor,
                  }}>
                  {this.info.name}
                </Text>
                <View style={{ flexDirection: 'row', marginTop: 20 }}></View>
                <View style={{ paddingBottom: 100 }}></View>
              </View>
            </View>
            <View
              style={{
                height: height - 695,
                marginLeft: 30,
                marginRight: 30,
                marginTop: -100,
                paddingStart: 10,
                padding: 5,
                borderWidth: 2,
                borderRadius: 5,
                borderColor: PROPERTY.selectedColor,
                backgroundColor: PROPERTY.innerColorBackground,
              }}>
              <Text style={{ fontSize: 18, color: PROPERTY.selectedColor }}>
                Time      :     {this.props.route.params.time}
              </Text>
              <Text style={{ fontSize: 18, color: PROPERTY.selectedColor }}>
                Day        :     {moment(
                  this.props.route.params.date,
                  'YYYY-MM-DD HH:mm:ss',
                ).format('dddd')}
              </Text>
              <Text style={{ fontSize: 18, color: PROPERTY.selectedColor }}>
                Class     :     {this.props.route.params.data.coursename} ({this.props.route.params.data.levelName})
              </Text>
              <Text style={{ fontSize: 18, color: PROPERTY.selectedColor }}>
                Centre   :     {this.props.route.params._centrename}
              </Text>
            </View>
            <View>
              {this.state.isLoading && (
                <ActivityIndicator
                  size="large"
                  color={PROPERTY.selectedColor}
                  style={{ marginTop: 130 }}
                />
              )}
              {this.state.dataChecked == false && (
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: height - 410,
                    margin: 18,
                    borderWidth: 2,
                    borderRadius: 5,
                    borderColor: PROPERTY.selectedColor,
                    backgroundColor: PROPERTY.innerColorBackground,
                    marginTop: 20,
                  }}>
                  <Image
                    style={{ marginTop: -220 }}
                    source={PROPERTY.noDataFound}
                  />
                  <Text
                    style={{
                      color: PROPERTY.selectedColor,
                      fontSize: 15,
                      marginTop: -225,
                    }}>
                    Attendance Not Found!
                  </Text>
                </View>
              )}
              {this.state.dataChecked && (
                <View
                  style={{
                    height: height - 408,
                    margin: 18,
                    borderWidth: 2,
                    borderRadius: 5,
                    borderColor: PROPERTY.selectedColor,
                    backgroundColor: PROPERTY.innerColorBackground,
                    marginTop: 20,
                  }}>
                  <DataTable>
                    <DataTable.Header>
                      <DataTable.Title style={{ paddingLeft: 6 }}>
                        Date
                      </DataTable.Title>
                      <DataTable.Title style={{ paddingLeft: 20 }}>Day</DataTable.Title>
                      <DataTable.Title style={{ paddingLeft: 5 }}>
                        Time
                      </DataTable.Title>
                      <DataTable.Title style={{ paddingLeft: 20 }}>
                        Status
                      </DataTable.Title>
                      <DataTable.Title style={{ paddingLeft: 5 }}>Note</DataTable.Title>
                    </DataTable.Header>
                    <FlatList
                      style={{ height: height - 460 }}
                      data={this.state.moduleClasses}
                      renderItem={({ item, index }) => (
                        <DataTable.Row
                          onPress={() => {
                            this.getNote(item);
                          }}
                          style={
                            item.cover != 'coverupcancel' &&
                              item.sddate > item.smtime
                              ? {
                                backgroundColor: '#d3d3d3',
                              }
                              : {}
                          }>
                          {/* date  */}
                          <DataTable.Cell
                            style={
                              item.sddate == item.smdate ||
                                item.sddate == item.smtime
                                ? {
                                  backgroundColor: '#6f4e37',
                                  paddingLeft: 6,
                                }
                                : { paddingLeft: 6 }
                            }>
                            {moment(item.starttimed, 'DD/MM/YYYY').format(
                              'DD/MM/YY',
                            )}
                          </DataTable.Cell>

                          {/* day  */}
                          <DataTable.Cell style={{ paddingLeft: 10 }}>
                            <Text
                              style={
                                item.sdstatus == 'cancelled' &&
                                  item.deleted != 1
                                  ? {
                                    color: PROPERTY.overdueColor,
                                    textDecorationLine: 'line-through',
                                    textDecorationStyle: 'solid',
                                  }
                                  : {}
                              }>
                              {item.shortday}
                            </Text>
                          </DataTable.Cell>

                          {/* timing  */}
                          <DataTable.Cell style={{ paddingLeft: 0 }}>
                            <Text
                              style={
                                item.sdstatus == 'cancelled' &&
                                  item.deleted != 1
                                  ? {
                                    color: PROPERTY.overdueColor,
                                    textDecorationLine: 'line-through',
                                    textDecorationStyle: 'solid',
                                  }
                                  : {}
                              }>
                              {item.timing}
                            </Text>
                          </DataTable.Cell>

                          {/* status  */}
                          <DataTable.Cell style={{ paddingLeft: 20 }}>
                            {item.status == '' && <Text></Text>}
                            {item.status == 'absent' && (
                              <Text>{item.status}</Text>
                            )}
                            {item.status == 'reschedule' && (
                              <Text>{item.status}</Text>
                            )}
                            {item.status == 'present' && (
                              <Text style={{ color: PROPERTY.buttonColor }}>
                                {item.status}
                              </Text>
                            )}
                            {item.status == 'FA' && (
                              <Text
                                style={
                                  item.sdstatus == 'cancelled'
                                    ? {
                                      color: PROPERTY.overdueColor,
                                      textDecorationLine: 'line-through',
                                      textDecorationStyle: 'solid',
                                    }
                                    : {}
                                }>
                                FA
                              </Text>
                            )}
                            {item.status == 'hold' && (
                              <Text>{item.status}</Text>
                            )}
                            {item.status == 'freeze' && (
                              <Text>{item.status}</Text>
                            )}
                            {item.sdstatus == 'cancelled' &&
                              item.facultyabsent == 1 &&
                              item.status != 'transferred' &&
                              item.status != 'reschedule' &&
                              item.smstatus != 'Hold' &&
                              item.status != 'FA' &&
                              item.status != 'hold' &&
                              item.status != 'freeze' &&
                              item.smstatus != 'Freeze' &&
                              item.smstatus != 'Discontinued' &&
                              item.status != 'present' &&
                              item.status != 'absent' && <Text style={{ color: PROPERTY.overdueColor, textDecorationLine: 'line-through', textDecorationStyle: 'solid' }}>Cancelled</Text>}
                            {item.sdstatus == 'cancelled' &&
                              item.status == '' && <Text style={{ color: PROPERTY.overdueColor, textDecorationLine: 'line-through', textDecorationStyle: 'solid' }}>Cancelled</Text>}
                            {item.sdstatus == 'cancelled' &&
                              item.status == '' &&
                              item.canceltype == 'reschedule' && (
                                <Text>Rescheduled</Text>
                              )}
                          </DataTable.Cell>

                          {/* cancelreason  */}
                          <DataTable.Cell>
                            {item.cancelreason != '' && (
                              <Text style={{ color: PROPERTY.overdueColor }}>view</Text>
                            )}
                            {item.staffcomment != '' && (
                              <Text style={{ color: PROPERTY.overdueColor }}>view</Text>
                            )}
                            {item.comments != '' && (
                              <Text style={{ color: PROPERTY.overdueColor }}>view</Text>
                            )}
                            {item.deleted == 1 && (
                              <Text style={{ color: PROPERTY.overdueColor }}>view</Text>
                            )}
                          </DataTable.Cell>
                        </DataTable.Row>
                      )}
                      keyExtractor={(item, index) => index}
                    />
                  </DataTable>
                </View>
              )}
            </View>
          </Animatable.View>
        </View>
        {/** note Modal Dialog */}
        <Modal
          visible={this.state.noteModal}
          dismissable={false}
          contentContainerStyle={{
            ...STYLES.modalDialog,
            backgroundColor: PROPERTY.background,
          }}>
          <TouchableOpacity
            onPress={() => {
              this.setState({ noteModal: false });
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
            <Text style={{ fontSize: 18, fontWeight: '400', paddingStart: 10 }}>Note : {this.state.noteDate}</Text>
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
              editable={false}
              multiline={true}
              numberOfLines={5}
              style={{ fontSize: 16, backgroundColor: PROPERTY.bwColor }}
              defaultValue={this.state.noteRemark}
            />
          </View>
        </Modal>
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

export default connect(mapstate)(ModuleAttendance);
