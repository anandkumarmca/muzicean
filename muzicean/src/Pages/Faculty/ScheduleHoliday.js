import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {connect} from 'react-redux';
import {TextInput, Button} from 'react-native-paper';
import LoginReducer from '../../Redux/Reducer/Login';
import {PROPERTY, POST, GET, SERVER} from '../../Common/Settings';
import {height, width, STYLES} from '../../Common/Style';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';
import SelectDropdown from 'react-native-select-dropdown';
import BottomDrawer from '../Component/Drawer';

class ScheduleHoliday extends React.Component {
  Status = [{id: 0, name: 'Faculty Absent'}];

  form = {
    remark: '',
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedClass: 0,
      checked: false,
      checkflag: 0,
      selectReason_id: null,
      isLoading: false,
      selectReasonName: null,
    };
    this.submitHoliday = this.submitHoliday.bind(this);
  }

  componentDidMount() {
    console.log(this.props.route.params);
    if (this.props.route.params.alertshow == 0) {
      this.setState({checked: true, checkflag: 1});
    }
  }

  getReason = value => {
    this.setState({selectReason_id: value.id, selectReasonName: value.name});
  };

  clickCheck = () => {
    if (this.state.checked == false) {
      this.setState({checked: true, checkflag: 1});
    } else {
      this.setState({checked: false, checkflag: 0});
    }
  };

  submitHoliday() {
    this.setState({holidayModal: false});

    POST(SERVER + 'users/markHoliday.json', {
      id: this.props.route.params.id,
      dateid: this.props.route.params.dateid,
      centre_id: this.props.route.params._centre_id,
    }).then(response => {
      if (response.error) {
        console.log(response.error);
      } else {
        // this.props.navigation.reset({
        //   index: 0,
        //   routes: [{name: 'OverdueList'}],
        // });
        Alert.alert('Holiday Alert', 'Mark holiday successfull!');
        if (this.props.route.params.navigate == 'overdue') {
          this.props.navigation.reset({
            index: 0,
            routes: [{name: 'OverdueList'}],
          });
        } else if (this.props.route.params.navigate == 'overdueedit') {
          this.props.navigation.reset({
            index: 0,
            routes: [{name: 'OverdueList'}],
          });
        } else {
          this.props.navigation.navigate('FacultyScheduleDetails', {
            data: this.props.route.params.index,
            date: this.props.route.params.date,
            total: this.props.route.params.total,
            navigate: 'pending',
          });
        }
      }
    });
  }
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
                  if (this.props.route.params.navigate == 'batchlist') {
                    this.props.navigation.navigate('Batch', {
                      sdate: this.props.route.params.rdate,
                      smonth: this.props.route.params.month,
                      syear: this.props.route.params.year,
                    });
                  } else if (this.props.route.params.navigate == 'overdue') {
                    this.props.navigation.navigate('OverdueBatch', {
                      data: this.props.route.params.index,
                      date: this.props.route.params.date,
                      total: this.props.route.params.total,
                    });
                  } else if (
                    this.props.route.params.navigate == 'overdueedit'
                  ) {
                    this.props.navigation.navigate('OverdueBatchEdit', {
                      batch: this.props.route.params.data,
                    });
                  } else {
                    this.props.navigation.navigate('FacultyScheduleDetails', {
                      data: this.props.route.params.index,
                      date: this.props.route.params.date,
                      total: this.props.route.params.total,
                      navigate: 'pending',
                    });
                  }
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
                  Mark Holiday
                </Text>
              </View>
            </View>
          </Animatable.View>
          <Animatable.View
            animation="fadeInUpBig"
            style={{...STYLES.topCurvedPage, width: width}}>
            <ScrollView
              style={{marginTop: 5, marginBottom: 5}}
              showsVerticalScrollIndicator={false}
              alwaysBounceVertical={false}>
              <View
                style={{
                  height: 120,
                  marginBottom: 5,
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
                  Date :
                  {moment(this.props.route.params.date).format('DD/MM/YYYY')}
                </Text>
                <Text style={{fontSize: 18, color: PROPERTY.selectedColor}}>
                  time : {this.props.route.params.time}
                </Text>
                <Text style={{fontSize: 18, color: PROPERTY.selectedColor}}>
                  Batch : {this.props.route.params.batchname}
                </Text>
                <Text style={{fontSize: 18, color: PROPERTY.selectedColor}}>
                  Centre : {this.props.route.params._centrename}
                </Text>
              </View>

              {/* <View
                style={{
                  marginLeft: 10,
                }}>
                <Text
                  style={{
                    fontSize: 18,
                    color: PROPERTY.selectedColor,
                    paddingStart: 23,
                  }}>
                  Leave Reason :
                </Text>

                <SelectDropdown
                  data={this.Status}
                  defaultValueByIndex={0}
                  onSelect={(selectedItem, index) => {
                    this.getReason(selectedItem);
                  }}
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
                    height: 70,
                  }}
                  rowStyle={{...STYLES.dropdownRowStyle, marginTop: 10}}
                  rowTextStyle={{...STYLES.dropdownRowTxtStyle}}
                />

                <Text
                  style={{
                    fontSize: 18,
                    color: PROPERTY.selectedColor,
                    paddingStart: 23,
                    marginTop: 5,
                  }}>
                  Leave Remarks :
                </Text>
                <View
                  style={{
                    width: width - 43,
                    height: height - 700,
                    backgroundColor: PROPERTY.bwColor,
                    paddingTop: 20,
                    padding: 15,
                    borderRadius: 20,

                    marginTop: 5,
                  }}>
                  <TextInput
                    multiline={true}
                    numberOfLines={5}
                    placeholder="Enter remark.."
                    style={{fontSize: 18, backgroundColor: PROPERTY.bwColor}}
                    ref={ref => (this.form.remark = ref)}
                  />
                </View>
              </View> */}
              {this.props.route.params.alertshow > 0 && (
                <View
                  style={{
                    height: height - 720,
                    margin: 22,
                    borderWidth: 1.2,
                    borderRadius: 5,
                    borderColor: PROPERTY.overdueColor,
                    backgroundColor: PROPERTY.innerColorBackground,
                  }}>
                  <View>
                    <Text
                      style={{
                        fontSize: 16,
                        color: PROPERTY.overdueColor,
                        paddingStart: 16,
                        marginTop: 10,
                      }}>
                      Some Students attendance marked!{' '}
                    </Text>
                    <View style={{flexDirection: 'row'}}>
                      <View style={{flex: 14}}>
                        <TouchableOpacity
                          onPress={() => {
                            this.clickCheck();
                          }}>
                          <Icon
                            name={
                              this.state.checked == true
                                ? 'check-square-o'
                                : 'square-o'
                            }
                            size={25}
                            style={{paddingStart: 26, paddingTop: 20}}
                          />
                        </TouchableOpacity>
                      </View>
                      <View style={{flex: 86}}>
                        <Text
                          style={{
                            fontSize: 16,
                            color: PROPERTY.overdueColor,
                            paddingStart: 10,
                            paddingTop: 20,
                          }}>
                          Confirm to Mark Holiday for All in this batch{' '}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              )}
              <View
                style={{flexDirection: 'row', marginTop: 10, marginBottom: 5}}>
                <View style={{flex: 20}}></View>
                <View style={{flex: 60, paddingTop: 5}}>
                  <Button
                    disabled={!this.state.checked}
                    color={PROPERTY.buttonColor}
                    mode="contained"
                    style={{...STYLES.button}}
                    onPress={() => {
                      this.submitHoliday();
                    }}>
                    Mark Holiday
                  </Button>
                </View>
                <View style={{flex: 20}}></View>
              </View>
            </ScrollView>
          </Animatable.View>
          <BottomDrawer {...this.props}></BottomDrawer>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const mapstate = state => {
  return {
    login: LoginReducer,
  };
};

export default connect(mapstate)(ScheduleHoliday);
