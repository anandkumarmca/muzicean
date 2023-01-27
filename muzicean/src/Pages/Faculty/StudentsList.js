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
  ActivityIndicator,
  Alert,
} from 'react-native';
import {Dimensions, Linking} from 'react-native';
import {connect} from 'react-redux';

import {TextInput, Button, Modal} from 'react-native-paper';
import LoginReducer from '../../Redux/Reducer/Login';

import {Card} from 'react-native-paper';

import {PROPERTY, POST, SERVER} from '../../Common/Settings';
import {height, width, STYLES} from '../../Common/Style';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/FontAwesome';
import Users from '../Component/User';
import moment from 'moment';
import SelectDropdown from 'react-native-select-dropdown';
import BottomDrawer from '../Component/Drawer';

class StudentsList extends React.Component {
  scrollRef = null;
  currentMonth = 0;

  form = {
    search_name: '',
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

  Status = [
    {id: 0, name: 'All'},
    {id: 1, name: 'Active'},
    {id: 2, name: 'Inactive'},
    {id: 3, name: 'Hold'},
    {id: 4, name: 'Freeze'},
  ];

  selectDated = new Date().getDate();

  maininfo = {
    month: this.month[new Date().getMonth()],
    year: new Date().getYear() + 1900,
    date: this.selectDated,
  };

  constructor(props) {
    super(props);
    this.maininfo.total = new Date(
      this.maininfo.year,
      new Date().getMonth(),
      0,
    ).getDate();
    this.state = {
      selectedStudent: [],
      maininfo: this.maininfo,
      selectedCheck: false,
      dataChecked: null,
      selectStatus_id: 0,
      selectStatusName: 'All',
      isLoading: true,
      studentlisting: '',
      studentlist: [],
      students_total: null,
      searchBox: false,
      searchName: '',
      search_err: false,
      discontinuedCheck: false,
    };
  }

  componentDidMount() {
    this.getDiscontinued(false);
  }

  getDiscontinued = flag => {
    this.state.studentlisting = '';
    this.state.studentlist = [];
    this.state.students_total = null;
    this.state.dataChecked = null;
    POST(SERVER + 'api/students.json').then(response => {
      this.setState({loading: false});
      if (response.error) {
        console.log(response.error);
      } else {
        console.log(response.students);
        this.setState({studentlisting: response.students});

        if (flag == false) {
          Object.keys(this.state.studentlisting).map(key => {
            if (
              this.state.studentlisting[key].course_status != 'Discontinued'
            ) {
              this.state.studentlist.push(this.state.studentlisting[key]);
            }
          });
        } else {
          Object.keys(this.state.studentlisting).map(key => {
            if (
              this.state.studentlisting[key].course_status == 'Discontinued'
            ) {
              this.state.studentlist.push(this.state.studentlisting[key]);
            }
          });
        }

        if (this.state.studentlist.length == 0) {
          this.dataChecked = false;
        } else {
          this.dataChecked = true;
        }

        this.setState({
          dataChecked: this.dataChecked,
          students_total: this.state.studentlist.length,
          isLoading: false,
        });
      }
    });
  };

  getStatusFilter = value => {
    this.state.selectStatusName = value.name;
    this.searchApi();
  };

  checkAll = () => {
    let selected = this.state.selectedStudent;

    if (
      selected.length == [] ||
      (selected.length > 0 && selected.length < this.state.studentlist.length)
    ) {
      Object.keys(this.state.studentlist).map(key => {
        selected[key] = Number(key);
      });

      this.setState({
        selectedStudent: selected,
        selectedCheck: true,
      });
    } else {
      if (selected.length != []) {
        this.setState({
          selectedStudent: [],
          selectedCheck: false,
        });
        return;
      }
    }
  };

  select = index => {
    let selected = this.state.selectedStudent;
    if (!selected.includes(index)) {
      selected[selected.length] = index;
    } else {
      selected = selected.filter(function (ele) {
        return ele != index;
      });
    }

    this.setState({
      selectedStudent: selected,
    });
  };

  searchApi = () => {
    this.setState({isLoading: true});
    this.state.studentlisting = '';
    this.state.studentlist = [];
    this.state.students_total = null;
    this.state.dataChecked = null;
    if (this.state.selectStatusName != 'All') {
      this.sstatus = this.state.selectStatusName;
    } else {
      this.sstatus = '';
    }

    if (this.state.searchName != '') {
      this.ssname = this.state.searchName;
    } else {
      this.ssname = '';
    }

    console.log(global.userinfo.users_id);
    POST(SERVER + 'api/students.json?name=&status=').then(response => {
      this.setState({loading: false});
      if (response.error) {
        console.log(response.error);
      } else {
        console.log(response.students);
        this.setState({studentlisting: response.students});
        //code by shreedul START
        if (this.state.discontinuedCheck == false) {
          Object.keys(this.state.studentlisting).map(key => {
            if (
              this.state.studentlisting[key].course_status != 'Discontinued' &&
              this.state.studentlisting[key].teacher_id ==
                global.userinfo.users_id
            ) {
              if (this.sstatus != '' && this.ssname != '') {
                if (
                  this.sstatus == this.state.studentlisting[key].course_status
                ) {
                  var crs = this.state.studentlisting[key].course.toLowerCase();
                  var fnm =
                    this.state.studentlisting[key].firstname.toLowerCase();
                  var lnm =
                    this.state.studentlisting[key].lastname.toLowerCase();
                  if (
                    crs.includes(this.ssname) ||
                    fnm.includes(this.ssname) ||
                    lnm.includes(this.ssname)
                  ) {
                    this.state.studentlist.push(this.state.studentlisting[key]);
                  }
                }
              }
              if (this.sstatus != '' && this.ssname == '') {
                if (
                  this.sstatus == this.state.studentlisting[key].course_status
                ) {
                  this.state.studentlist.push(this.state.studentlisting[key]);
                }
              }
              if (this.sstatus == '' && this.ssname != '') {
                var crs = this.state.studentlisting[key].course.toLowerCase();
                var fnm =
                  this.state.studentlisting[key].firstname.toLowerCase();
                var lnm = this.state.studentlisting[key].lastname.toLowerCase();
                if (
                  crs.includes(this.ssname) ||
                  fnm.includes(this.ssname) ||
                  lnm.includes(this.ssname)
                ) {
                  this.state.studentlist.push(this.state.studentlisting[key]);
                }
              }
              if (this.sstatus == '' && this.ssname == '') {
                this.state.studentlist.push(this.state.studentlisting[key]);
              }
            }
          });
        } else {
          Object.keys(this.state.studentlisting).map(key => {
            if (
              this.state.studentlisting[key].course_status == 'Discontinued' &&
              this.state.studentlisting[key].teacher_id ==
                global.userinfo.users_id
            ) {
              if (this.sstatus != '' && this.ssname != '') {
                if (
                  this.sstatus == this.state.studentlisting[key].course_status
                ) {
                  var crs = this.state.studentlisting[key].course.toLowerCase();
                  var fnm =
                    this.state.studentlisting[key].firstname.toLowerCase();
                  var lnm =
                    this.state.studentlisting[key].lastname.toLowerCase();
                  if (
                    crs.includes(this.ssname) ||
                    fnm.includes(this.ssname) ||
                    lnm.includes(this.ssname)
                  ) {
                    this.state.studentlist.push(this.state.studentlisting[key]);
                  }
                }
              }
              if (this.sstatus != '' && this.ssname == '') {
                if (
                  this.sstatus == this.state.studentlisting[key].course_status
                ) {
                  this.state.studentlist.push(this.state.studentlisting[key]);
                }
              }
              if (this.sstatus == '' && this.ssname != '') {
                var crs = this.state.studentlisting[key].course.toLowerCase();
                var fnm =
                  this.state.studentlisting[key].firstname.toLowerCase();
                var lnm = this.state.studentlisting[key].lastname.toLowerCase();
                if (
                  crs.includes(this.ssname) ||
                  fnm.includes(this.ssname) ||
                  lnm.includes(this.ssname)
                ) {
                  this.state.studentlist.push(this.state.studentlisting[key]);
                }
              }
              if (this.sstatus == '' && this.ssname == '') {
                this.state.studentlist.push(this.state.studentlisting[key]);
              }
            }
          });
        }
        //code by shreedul END
        if (this.state.studentlist.length == 0) {
          this.dataChecked = false;
        } else {
          this.dataChecked = true;
        }

        this.setState({
          dataChecked: this.dataChecked,
          students_total: this.state.studentlist.length,
          isLoading: false,
        });
      }
    });
  };

  searchFilter = () => {
    if (this.form.search_name.state.value != '') {
      this.setState({
        searchBox: false,
      });
      this.state.searchName = this.form.search_name.state.value;
      this.searchApi();
    }
  };

  searchReset = () => {
    this.setState({searchBox: false, search_err: false, isLoading: true});
    this.state.searchName = '';
    this.searchApi();
  };

  whatsappClick = () => {
    if (this.state.selectedStudent.length != 0) {
      if (this.state.selectedStudent.length > 1) {
        Alert.alert(
          'Whatsapp Alert',
          'You can select only one atudent at a time for sending a message!',
        );
        return;
      } else {
        Linking.openURL(
          'whatsapp://send?phone=' +
            this.state.studentlist[this.state.selectedStudent[0]].mobile,
        );
      }
    } else {
      Alert.alert('Whatsapp Alert', 'Please select student..!!');
    }
  };

  mailClick = () => {
    if (this.state.selectedStudent.length != 0) {
      if (this.state.selectedStudent.length > 1) {
        Alert.alert(
          'Mail Alert',
          'You can select only one atudent at a time for sending a mail!',
        );
        return;
      } else {
        Linking.openURL(
          'mailto:' +
            this.state.studentlist[this.state.selectedStudent[0]].email,
        );
      }
    } else {
      Alert.alert('Mail Alert', 'Please select student..!!');
    }
  };

  messageClick = () => {
    Alert.alert('Message Alert', 'Message module under process...');
  };

  checkUnfreeze = () => {
    if (this.state.selectedStudent.length != 0) {
      if (this.state.selectedStudent.length > 1) {
        Alert.alert(
          'Unfreeze Alert',
          'You can select only one atudent at a time for Unfreeze!',
        );
        return;
      } else {
        //l?id=449&enddate=01-09-2022&users_id=816&course_id=2&smid=1209&dateid=
        let selected = this.state.selectedStudent;
        selected.forEach(value => {
          if (this.state.studentlist[value].course_status != 'Freeze') {
            Alert.alert('', 'Unfreeze not allowed!', [{text: 'OK'}]);
            return;
          } else if (this.state.studentlist[value].freezeshow == 'none') {
            Alert.alert('', 'Unfreeze not allowed!', [{text: 'OK'}]);
            return;
          } else {
            this.props.navigation.navigate('StatusChange', {
              status: 'Unfreeze',
              data: this.state.studentlist[value],
            });
          }
        });
      }
    } else {
      Alert.alert('Unfreeze Alert', 'Please select student..!!');
    }
  };

  checkUnhold = () => {
    if (this.state.selectedStudent.length != 0) {
      if (this.state.selectedStudent.length > 1) {
        Alert.alert(
          'Unhold Alert',
          'You can select only one atudent at a time for Unhold!',
        );
        return;
      } else {
        //l?id=449&enddate=01-09-2022&users_id=816&course_id=2&smid=1209&dateid=
        let selected = this.state.selectedStudent;
        selected.forEach(value => {
          if (this.state.studentlist[value].course_status != 'Hold') {
            Alert.alert('', 'Unhold not allowed!', [{text: 'OK'}]);
            return;
          } else if (this.state.studentlist[value].holdshow == 'none') {
            Alert.alert('', 'Unhold not allowed!', [{text: 'OK'}]);
            return;
          } else {
            this.props.navigation.navigate('StatusChange', {
              status: 'Unhold',
              data: this.state.studentlist[value],
            });
          }
        });
      }
    } else {
      Alert.alert('Unhold Alert', 'Please select student..!!');
    }
  };
  ShowAttendance = item => {
    this.props.navigation.navigate('ModuleAttendance', {
      date: item.startdate,
      time: item.stime + ' - ' + item.etime,
      data: item,
      _centrename: item.centre,
      navigate: 'studentsList',
    });
  };

  discontinued = () => {
    this.setState({isLoading: true});
    if (this.state.discontinuedCheck == false) {
      this.setState({
        discontinuedCheck: true,
      });
      this.getDiscontinued(true);
    } else {
      this.setState({
        discontinuedCheck: false,
      });
      this.getDiscontinued(false);
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
                  this.props.navigation.reset({
                    index: 0,
                    routes: [{name: 'Faculty'}],
                  });
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
                  Students List ({this.state.students_total})
                </Text>
              </View>
            </View>
          </Animatable.View>
          <Animatable.View
            animation="fadeInUpBig"
            style={{width: width, marginTop: 10}}>
            <View style={{backgroundColor: PROPERTY.innerColorBackground}}>
              <View>
                <Text
                  style={{
                    fontSize: 18,
                    color: PROPERTY.selectedColor,
                    paddingStart: 23,
                  }}>
                  Filter By :
                </Text>
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  alwaysBounceVertical={false}
                  contentContainerStyle={{...STYLES.scrollViewContainer}}>
                  <SelectDropdown
                    data={this.Status}
                    defaultValueByIndex={0}
                    // defaultValue={'All'}
                    onSelect={(selectedItem, index) => {
                      this.getStatusFilter(selectedItem);
                    }}
                    //defaultButtonText={'Select Classroom...'}
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
                    }}
                    rowStyle={{...STYLES.dropdownRowStyle}}
                    rowTextStyle={{...STYLES.dropdownRowTxtStyle}}
                  />
                </ScrollView>
                <Text
                  style={{
                    fontSize: 18,
                    color: PROPERTY.selectedColor,
                    paddingStart: 23,
                    paddingTop: 5,
                  }}>
                  Search name/course :
                </Text>
                <TouchableOpacity
                  style={{
                    height: 35,
                    marginLeft: 20,
                    marginRight: 20,
                    marginTop: 5,
                    borderWidth: 1.5,
                    borderRadius: 5,
                    borderColor: PROPERTY.selectedColor,
                    backgroundColor: PROPERTY.innerColorBackground,
                  }}
                  onPress={() => {
                    this.setState({searchBox: true});
                  }}>
                  <Text
                    style={{
                      paddingLeft: 6,
                      paddingTop: 1,
                      fontSize: 18,
                      color: PROPERTY.selectedColor,
                    }}>
                    {this.state.searchName}
                  </Text>
                </TouchableOpacity>
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: 10,
                    marginBottom: 10,
                  }}>
                  <View style={{flex: 12}}>
                    <TouchableOpacity
                      style={{flex: 10, marginLeft: 20}}
                      onPress={() => {
                        this.discontinued();
                      }}>
                      {this.state.discontinuedCheck && (
                        <View style={{}}>
                          <Icon name={'check-square-o'} size={32} />
                        </View>
                      )}
                      {!this.state.discontinuedCheck && (
                        <View style={{}}>
                          <Icon name={'square-o'} size={35} />
                        </View>
                      )}
                    </TouchableOpacity>
                  </View>
                  <View style={{flex: 88}}>
                    <Text
                      style={{
                        fontSize: 18,
                        color: PROPERTY.selectedColor,
                        paddingStart: 23,
                        paddingTop: 5,
                      }}>
                      Display Discontinued Students
                    </Text>
                  </View>
                </View>
              </View>
              <View
                style={{
                  borderBottomColor: 'black',
                  marginLeft: 10,
                  marginRight: 10,
                  marginTop: 10,
                  borderBottomWidth: 2,
                }}></View>
              <View style={{flexDirection: 'row', marginTop: 25}}>
                <View style={{flex: 34, marginStart: 12}}>
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
                <View style={{flex: 66}}>
                  <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity
                      onPress={() => {
                        this.checkUnfreeze();
                      }}>
                      <View
                        style={{
                          ...STYLES.scheduleBtn,
                          paddingLeft: 7,
                          paddingRight: 7,
                        }}>
                        <Text style={{...STYLES.scheduleBtnText}}>UF</Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{marginLeft: 3}}
                      onPress={() => {
                        this.checkUnhold();
                      }}>
                      <View
                        style={{
                          ...STYLES.scheduleBtn,
                          paddingLeft: 7,
                          paddingRight: 7,
                        }}>
                        <Text style={{...STYLES.scheduleBtnText}}>UH</Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{marginLeft: 3}}
                      onPress={() => {
                        this.whatsappClick();
                      }}>
                      <View
                        style={{
                          ...STYLES.scheduleBtn,
                          paddingLeft: 7,
                          paddingRight: 7,
                        }}>
                        <Icon name={'whatsapp'} size={25} color={'#E8E8E9'} />
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{marginLeft: 3}}
                      onPress={() => {
                        this.mailClick();
                      }}>
                      <View
                        style={{
                          ...STYLES.scheduleBtn,
                          paddingLeft: 8,
                          paddingRight: 8,
                        }}>
                        <Icon name={'envelope'} size={25} color={'#E8E8E9'} />
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{marginLeft: 3}}
                      onPress={() => {
                        this.messageClick();
                      }}>
                      <View
                        style={{
                          ...STYLES.scheduleBtn,
                          paddingLeft: 8,
                          paddingRight: 8,
                        }}>
                        <Icon name={'comment'} size={25} color={'#E8E8E9'} />
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              <View style={{marginTop: 10}}>
                <View
                  style={{
                    height: height - 320,
                    margin: 18,
                  }}>
                  <View>
                    {this.state.isLoading && (
                      <ActivityIndicator
                        size="large"
                        color={PROPERTY.selectedColor}
                        style={{marginTop: height - 600}}
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
                        style={{height: height - 425}}
                        data={this.state.studentlist}
                        renderItem={({item, index}) => (
                          <View style={{flexDirection: 'row'}}>
                            {!this.state.selectedStudent.includes(index) && (
                              <TouchableOpacity
                                style={{flex: 10, marginLeft: 5, marginTop: 10}}
                                onPress={() => {
                                  this.select(index);
                                }}>
                                <View style={{marginTop: 5}}>
                                  <Icon name={'square-o'} size={35} />
                                </View>
                              </TouchableOpacity>
                            )}
                            {this.state.selectedStudent.includes(index) && (
                              <TouchableOpacity
                                style={{flex: 10, marginLeft: 5, marginTop: 10}}
                                onPress={() => {
                                  this.select(index);
                                }}>
                                <View style={{marginTop: 5}}>
                                  <Icon name={'check-square-o'} size={35} />
                                </View>
                              </TouchableOpacity>
                            )}
                            <TouchableOpacity
                              style={{flex: 63}}
                              onPress={() => {
                                this.ShowAttendance(item);
                              }}>
                              <View
                                style={
                                  item.course_status != 'Freeze' &&
                                  item.course_status != 'Discontinued' &&
                                  item.course_status != 'Hold'
                                    ? {
                                        marginBottom: 10,
                                        padding: 10,
                                        borderRadius: 10,
                                        marginHorizontal: 10,
                                        backgroundColor:
                                          PROPERTY.calendarHeaderBackground,
                                      }
                                    : {
                                        marginBottom: 10,
                                        padding: 10,
                                        borderRadius: 10,
                                        marginHorizontal: 10,
                                        backgroundColor: PROPERTY.redColor,
                                      }
                                }>
                                {item.course_status != 'Freeze' &&
                                  item.course_status != 'Discontinued' &&
                                  item.course_status != 'Hold' && (
                                    <View>
                                      <Text
                                        style={{
                                          fontWeight: 'bold',
                                          fontSize: 16,
                                        }}>
                                        {item.firstname} {item.lastname}
                                      </Text>
                                      <Text style={{fontSize: 14}}>
                                        {item.levelName} - {item.centre}
                                      </Text>
                                    </View>
                                  )}
                                {item.course_status === 'Freeze' && (
                                  <View>
                                    <Text
                                      style={{
                                        fontWeight: 'bold',
                                        fontSize: 16,
                                      }}>
                                      {item.firstname} {item.lastname}
                                    </Text>
                                    <Text style={{fontSize: 14}}>
                                      {item.levelName} - {item.centre}
                                    </Text>
                                  </View>
                                )}
                                {item.course_status === 'Hold' && (
                                  <View>
                                    <Text
                                      style={{
                                        fontWeight: 'bold',
                                        fontSize: 16,
                                      }}>
                                      {item.firstname} {item.lastname}
                                    </Text>
                                    <Text style={{fontSize: 14}}>
                                      {item.levelName} - {item.centre}
                                    </Text>
                                  </View>
                                )}
                                {item.course_status === 'Discontinued' && (
                                  <View>
                                    <Text
                                      style={{
                                        fontWeight: 'bold',
                                        fontSize: 16,
                                      }}>
                                      {item.firstname} {item.lastname}
                                    </Text>
                                    <Text style={{fontSize: 14}}>
                                      {item.levelName} - {item.centre}
                                    </Text>
                                  </View>
                                )}
                              </View>
                            </TouchableOpacity>
                            <View style={{flex: 37}}>
                              <View
                                style={
                                  item.course_status != 'Freeze' &&
                                  item.course_status != 'Discontinued' &&
                                  item.course_status != 'Hold'
                                    ? {
                                        marginBottom: 10,
                                        padding: 10,
                                        paddingTop: 15,
                                        paddingBottom: 15,
                                        marginTop: 5,
                                        borderRadius: 10,
                                        marginHorizontal: 10,
                                        backgroundColor:
                                          PROPERTY.calendarHeaderBackground,
                                      }
                                    : {
                                        marginBottom: 10,
                                        padding: 10,
                                        paddingTop: 15,
                                        paddingBottom: 15,
                                        marginTop: 5,
                                        borderRadius: 10,
                                        marginHorizontal: 10,
                                        backgroundColor: PROPERTY.redColor,
                                      }
                                }>
                                <Text
                                  style={{
                                    textAlign: 'center',
                                    fontWeight: 'bold',
                                    fontSize: 14,
                                  }}>
                                  {item.course_status}
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
              </View>
            </View>
          </Animatable.View>
          {/** Search Modal Dialog */}
          <Modal
            visible={this.state.searchBox}
            dismissable={false}
            contentContainerStyle={{
              ...STYLES.modalDialog,
              backgroundColor: PROPERTY.background,
            }}>
            <TouchableOpacity
              onPress={() => {
                this.setState({searchBox: false, search_err: false});
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
            <View
              style={{
                width: width - 50,
                height: 100,
                padding: 15,
                marginStart: 8,
              }}>
              <TextInput
                label="Search Name"
                mode="outlined"
                ref={ref => (this.form.search_name = ref)}
                defaultValue={this.state.searchName}
                style={{height: 35, marginLeft: 20, marginRight: 20}}
                theme={STYLES.inputStyle}
              />
              {this.state.search_err && (
                <Text style={{color: PROPERTY.overdueColor, paddingLeft: 23}}>
                  This field should not be empty..
                </Text>
              )}
            </View>
            <View style={{flexDirection: 'row', marginTop: -22}}>
              <View style={{flex: 10}}></View>
              <View style={{flex: 38}}>
                <Button
                  color={PROPERTY.buttonColor}
                  mode="contained"
                  style={{...STYLES.button, height: 40, paddingTop: 0}}
                  onPress={() => {
                    this.searchReset();
                  }}>
                  Reset
                </Button>
              </View>
              <View style={{flex: 6}}></View>
              <View style={{flex: 38}}>
                <Button
                  color={PROPERTY.buttonColor}
                  mode="contained"
                  style={{...STYLES.button, height: 40, paddingTop: 0}}
                  onPress={() => {
                    this.searchFilter();
                  }}>
                  Search
                </Button>
              </View>
              <View style={{flex: 10}}></View>
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

export default connect(mapstate)(StudentsList);
