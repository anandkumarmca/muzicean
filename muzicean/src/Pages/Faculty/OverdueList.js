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
import { Dimensions } from 'react-native';
import { connect } from 'react-redux';

import { TextInput, Button, Modal } from 'react-native-paper';
import LoginReducer from '../../Redux/Reducer/Login';

import { Card } from 'react-native-paper';
import { PROPERTY, POST, SERVER } from '../../Common/Settings';
import { height, width, STYLES } from '../../Common/Style';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';
import BottomDrawer from '../Component/Drawer';
import { Item } from 'react-native-paper/lib/typescript/components/List/List';

class OverdueList extends React.Component {
  //scrollRef = null;
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
          : { uri: global.userinfo.photo },
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
      submittedbatchListing: '',
      submittedBatch: [],
      submittedbatchListingShow: '',
      submittedBatchShow: [],
      currentDateBatch: [],
      dataChecked: null,
      batch_total: null,
      sdataChecked: null,
      ssdataChecked: null,
      sbatch_total: null,
      showBachList: [],
      sdate: null,
      heading: 'Overdue Batch List',
      _css: PROPERTY.selectedColor,
      sbatchModal: false,
      stiming: '',
      scentre_batch: '',
    };
    this.goBack = this.goBack.bind(this);
  }

  componentDidMount() {
    this.setState({ isLoading: true });
    this.m = this.month.indexOf(this.state.maininfo.month) + 1;
    this.sdate =
      this.state.maininfo.year + '-' + this.m + '-' + this.state.maininfo.date;
    this.overdueList();
  }

  overdueList = () => {
    POST(SERVER + 'users/overdueschedule.json').then(response => {
      this.setState({ loading: false });
      if (response.error) {
        console.log(response.error);
      } else {
        this.setState({
          batchListing: response.overdue,
          submittedbatchListing: response.overduesubmit,
        });

        Object.keys(this.state.batchListing).map(key => {
          this.state.currentDateBatch.push(this.state.batchListing[key]);
        });

        Object.keys(this.state.submittedbatchListing).map(key => {
          this.state.submittedBatch.push(this.state.submittedbatchListing[key]);
        });

        if (this.state.currentDateBatch.length == 0) {
          this.dataChecked = false;
        } else {
          this.dataChecked = true;
        }
        
        if (this.state.submittedBatch.length == 0) {
          this.sdataChecked = false;
        } else {
          this.sdataChecked = true;
        }

        this.setState({
          dataChecked: this.dataChecked,
          batch_total: this.state.currentDateBatch.length,
          sdataChecked: this.sdataChecked,
          sbatch_total: this.state.submittedBatch.length,
          isLoading: false,
        });
      }
    });
  };

  goBack() {
    this.props.navigation.reset({ index: 0, routes: [{ name: 'Faculty' }] });
  }

  showBatchEditView = data => {
    this.props.navigation.navigate('OverdueBatchEdit', { batch: data });
  };

  showBatchView = item => {
    this.props.navigation.navigate('OverdueBatch', {data: item.icount,date: item.attdate,total: item.btotal,
    });
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
          style={{ flex: 1, backgroundColor: PROPERTY.headerColorBackground }}
          showsVerticalScrollIndicator={false}>
          <Animatable.View
            animation="fadeInUpBig"
            style={{ width: width, flex: 20 }}>
            <View
              style={{ flexDirection: 'row', paddingTop: 20, paddingLeft: 10 }}>
              <TouchableOpacity
                onPress={() => {
                  this.goBack();
                }}>
                <View style={{ paddingLeft: 20, paddingTop: 25 }}>
                  <Icon name={'chevron-left'} size={20} />
                </View>
              </TouchableOpacity>
              <View style={{ flex: 30, alignItems: 'flex-start' }}>
                <Image
                  source={this.info.user.photo}
                  style={{ ...STYLES.topPhoto }}
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
                <Text style={{ ...STYLES.fontLarge, color: PROPERTY.fontColor }}>
                  {this.info.user.name}
                </Text>
                <Text style={{ ...STYLES.fontSmall, color: PROPERTY.fontColor }}>
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
            {/** Display class list if non of the class is selected */}
            {this.state.selectedClass === 0 && (
              <View
                style={{
                  height: height - 450,
                  margin: 18,
                  borderWidth: 2,
                  borderRadius: 5,
                  borderColor: PROPERTY.selectedColor,
                  backgroundColor: PROPERTY.innerColorBackground,
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 25,
                    color: PROPERTY.overdueColor,
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
                      style={{ marginTop: 130 }}
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
                    <ScrollView
                      ref={ref => {
                        this.scrollRef = ref;
                      }}
                      style={{ height: height - 530 }}
                      showsHorizontalScrollIndicator={false}
                      showsVerticalScrollIndicator={false}>
                      {this.state.currentDateBatch.map((item, index) => {
                        return (
                          <View
                            style={{
                              marginTop: 5,
                              marginLeft: 10,
                              marginRight: 10,
                              borderRadius: 10,
                              backgroundColor: PROPERTY.calendarHeaderBackground,
                              height: 60,
                              marginBottom: 6,
                            }}
                            key={'content' + index}>
                            <TouchableOpacity
                              onPress={() => {
                                this.showBatchView(item);
                              }}>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                  margin: 10,
                                  marginBottom: -20,
                                }}>
                                <View style={{ flex: 34 }}>
                                  <Text
                                    style={{
                                      ...STYLES.fontSmall,
                                      color: PROPERTY.overdueColor,
                                    }}>
                                    {moment(item.starttime).format('DD-MM-YYYY')}
                                  </Text>
                                </View>
                                <View style={{ flex: 29 }}>
                                  <Text
                                    style={{
                                      ...STYLES.fontSmall,
                                      color: PROPERTY.overdueColor,
                                    }}>
                                    {item.centre_name}
                                  </Text>
                                </View>
                                <View style={{ flex: 28 }}>
                                  <Text
                                    style={{
                                      ...STYLES.fontSmall,
                                      color: PROPERTY.overdueColor,
                                    }}>
                                    {item.course}
                                  </Text>
                                </View>
                                <View style={{ flex: 29 }}>
                                  <Text
                                    style={{
                                      ...STYLES.fontSmall,
                                      paddingLeft: 9,
                                      color: PROPERTY.overdueColor,
                                    }}>
                                    {item.stime}
                                  </Text>
                                </View>
                              </View>
                            </TouchableOpacity>
                          </View>
                        );
                      })}
                    </ScrollView>
                  )}
                </View>
              </View>
            )}

            <View
              style={{
                height: height - 555,
                margin: 18,
                borderWidth: 2,
                borderRadius: 5,
                borderColor: PROPERTY.selectedColor,
                backgroundColor: PROPERTY.innerColorBackground,
                marginTop: 5,
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 25,
                  color: PROPERTY.overdueColor,
                  paddingBottom: 20,
                  paddingTop: 10,
                }}>
                Submitted Batch List ({this.state.sbatch_total})
              </Text>
              <View>
                {this.state.isLoading && (
                  <ActivityIndicator
                    size="large"
                    color={PROPERTY.selectedColor}
                    style={{ marginTop: 70 }}
                  />
                )}
                {this.state.sdataChecked == false && (
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginTop: 180,
                    }}>
                    {/* <Image source={PROPERTY.noDataFound} /> */}
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
                {this.state.sdataChecked && (
                  <ScrollView
                    ref={ref => {
                      this.scrollRef = ref;
                    }}
                    style={{ height: height - 630 }}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}>
                    {this.state.submittedBatch.map((item, index) => {
                      return (
                        <View
                          style={{
                            marginTop: 5,
                            marginLeft: 10,
                            marginRight: 10,
                            borderRadius: 10,
                            backgroundColor: PROPERTY.calendarHeaderBackground,
                            height: 60,
                            marginBottom: 6,
                          }}
                          key={'content' + index}>
                          <TouchableOpacity
                            onPress={() => {
                              this.showBatchEditView(item);
                            }}>
                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                margin: 10,
                                marginBottom: -20,
                              }}>
                              <View style={{ flex: 34 }}>
                                <Text
                                  style={{
                                    ...STYLES.fontSmall,
                                    color: PROPERTY.overdueColor,
                                  }}>
                                  {moment(item.starttime).format('DD-MM-YYYY')}
                                </Text>
                              </View>
                              <View style={{ flex: 29 }}>
                                <Text
                                  style={{
                                    ...STYLES.fontSmall,
                                    color: PROPERTY.overdueColor,
                                  }}>
                                  {item.centre_name}
                                </Text>
                              </View>
                              <View style={{ flex: 28 }}>
                                <Text
                                  style={{
                                    ...STYLES.fontSmall,
                                    color: PROPERTY.overdueColor,
                                  }}>
                                  {item.course}
                                </Text>
                              </View>
                              <View style={{ flex: 29 }}>
                                <Text
                                  style={{
                                    ...STYLES.fontSmall,
                                    paddingLeft: 9,
                                    color: PROPERTY.overdueColor,
                                  }}>
                                  {item.stime}
                                </Text>
                              </View>
                            </View>
                          </TouchableOpacity>
                        </View>
                      );
                    })}
                  </ScrollView>
                )}
              </View>
            </View>
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
                this.setState({ overdueModal: false });
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

            <View style={{ paddingTop: 0, paddingLeft: 20 }}>
              <Text style={{ ...STYLES.fontNormal, fontWeight: 'bold' }}></Text>
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
              <Text style={{ fontSize: 18 }}>
                Time : {this.stime} - {this.etime}
              </Text>
              <Text style={{ fontSize: 18 }}>Day : {this.scheduledays} </Text>
              <Text style={{ fontSize: 18 }}>Class : {this.course} </Text>
              <Text style={{ fontSize: 18 }}>Mode : {this.mode} </Text>
            </View>
            <View style={{ paddingStart: 100, paddingTop: 10 }}>
              <Text style={{ color: PROPERTY.overdueColor }}>
                Send request for this batch?
              </Text>
            </View>
            <View style={{ flexDirection: 'row', paddingTop: 8 }}>
              <View style={{ flex: 1, padding: 5 }}></View>
              <View style={{ flex: 1, paddingTop: 5 }}>
                <Button
                  color={PROPERTY.buttonColor}
                  mode="contained"
                  style={{ ...STYLES.button, height: 40, paddingTop: 0 }}>
                  Proceed
                </Button>
              </View>
              <View style={{ flex: 1, padding: 5 }}></View>
            </View>
          </Modal>

          {/** Submitted batch Modal Dialog */}
          <Modal
            visible={this.state.sbatchModal}
            dismissable={false}
            contentContainerStyle={{
              ...STYLES.modalDialog,
              backgroundColor: PROPERTY.background,
            }}>
            <TouchableOpacity
              onPress={() => {
                this.setState({
                  sbatchModal: false,
                  submittedBatchShow: [],
                  ssdataChecked: false,
                });
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

            <View style={{ paddingTop: 0, paddingLeft: 20 }}>
              <Text style={{ fontSize: 20, fontWeight: '500', marginTop: -35 }}>
                Batch Details
              </Text>
            </View>
            <View
              style={{ marginStart: 80, alignItems: 'center', marginTop: 10 }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '500',
                  color: PROPERTY.overdueColor,
                }}>
                {this.state.stiming}
              </Text>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '500',
                  color: PROPERTY.overdueColor,
                }}>
                {this.state.scentre_batch}
              </Text>
            </View>
            <View>
              {this.state.submittedBatchShow.map((value, index) => {
                return (
                  <TouchableOpacity key={'content' + index}>
                    {/* <View style={{ flexDirection: 'row' }}> */}
                    <View style={{ flex: 50, alignItems: 'center', margin: 10 }}>
                      <Text>
                        {value.firstname} {value.lastname} : {value.status}
                      </Text>
                    </View>
                    {/* </View> */}
                  </TouchableOpacity>
                );
              })}
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
            <View style={{ flexDirection: 'row', paddingTop: 20 }}>
              <View style={{ flex: 1, padding: 5 }}>
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
                  <Text style={{ fontSize: 18, color: PROPERTY.green }}>
                    Request sent successfully...
                  </Text>
                </View>
                <TouchableOpacity
                  style={{ marginTop: -63, marginLeft: -14 }}
                  onPress={() => {
                    this.setState({ successModal: false });
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

export default connect(mapstate)(OverdueList);
