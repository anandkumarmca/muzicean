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
import { Dimensions, Linking } from 'react-native';
import { connect } from 'react-redux';

import { TextInput, Button, Modal } from 'react-native-paper';
import LoginReducer from '../../Redux/Reducer/Login';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Card } from 'react-native-paper';

import { PROPERTY, POST, SERVER } from '../../Common/Settings';
import { height, width, STYLES } from '../../Common/Style';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/FontAwesome';
import Users from '../Component/User';
import moment from 'moment';
import SelectDropdown from 'react-native-select-dropdown';
import BottomDrawer from '../Component/Drawer';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Tab = createMaterialTopTabNavigator();

class FacultyMessage extends React.Component {
  scrollRef = null;
  currentMonth = 0;

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

  constructor(props) {
    super(props);
    this.maininfo.total = new Date(
      this.maininfo.year,
      new Date().getMonth(),
      0,
    ).getDate();
    this.state = {
      maininfo: this.maininfo,
      isLoading: true,
      isLoading1: true,
      dataChecked: null,
      sentlisting: '',
      sentlist: [],
      sent_total: null,
      dataChecked1: null,
      inboxlisting: '',
      inboxlist: [],
      inbox_total: null,
    };
  }

  InboxScreen = () => {
    return (
      <View style={{ flex: 1, backgroundColor: PROPERTY.headerColorBackground }}>
        <View style={{ marginTop: 20 }}>
          {this.state.isLoading1 && (
            <ActivityIndicator
              size="large"
              color={PROPERTY.selectedColor}
              style={{ marginTop: height - 600 }}
            />
          )}
          {this.state.dataChecked1 == false && (
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
          {this.state.dataChecked1 && (
            <FlatList
              style={{ height: height - 210 }}
              data={this.state.inboxlist}
              renderItem={({ item, index }) => (
                <View style={{ flexDirection: 'row' }}>
                  <TouchableOpacity
                    style={{ flex: 20 }}
                    onPress={() => {
                      console.log(item);
                      this.props.navigation.navigate('MessageRead', {
                        data: item,
                      });
                    }}>
                    <View
                      style={{
                        marginTop: 2,
                        marginLeft: 7,
                      }}>
                      <Image
                        source={require('../../Assets/icons/msg.png')}
                        style={{
                          width: 75,
                          height: 75,
                          resizeMode: 'cover',
                          borderRadius: 60,
                          borderWidth: 1,
                          borderColor: PROPERTY.selectedColor,
                        }}
                      />
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{ flex: 80 }}
                    onPress={() => {
                      this.props.navigation.navigate('MessageRead', {
                        data: item,
                      });
                    }}>
                    <View
                      style={{
                        marginBottom: 20,
                        paddingLeft: 10,
                        paddingRight: 5,
                        paddingBottom: 5,
                        paddingTop: 10,
                        borderRadius: 10,
                        marginHorizontal: 10,
                        backgroundColor: PROPERTY.calendarHeaderBackground,
                      }}>
                      <View style={{ flexDirection: 'row' }}>
                        <View style={{ flex: 2 }}>
                          {item.unread == 1 && (
                            <Image
                              source={require('../../Assets/icons/new-tag.png')}
                              style={{
                                width: 25,
                                height: 25,
                                paddingRight: 35,
                                marginLeft: -20,
                                marginTop: -14
                              }}
                            />
                          )}
                        </View>
                        <View style={{ flex: 74 }}>
                          <Text
                            style={{
                              fontWeight: 'bold',
                              fontSize: 16,
                            }}>
                            {item.firstname} {item.lastname}
                          </Text>
                          <Text style={{ fontSize: 14, fontWeight: '600' }}>
                            {item.subject}
                          </Text>
                          <Text style={{ fontSize: 14 }}>{item.shortmsg}</Text>
                        </View>
                        <View style={{ flex: 25 }}>
                          <Text style={{ fontSize: 14 }}>{moment(item.createdate).format('DD-MM-YYYY')}</Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              )}
              keyExtractor={(item, index) => index}
            />
          )}
        </View>

        <View>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              this.props.navigation.navigate('MessageWrite');
            }}
            style={styles.touchableOpacityStyle}>
            <Image
              style={{
                resizeMode: 'contain',
                width: 48,
                height: 48,
                resizeMode: 'cover',
                borderRadius: 60,
                borderWidth: 1,
                borderColor: PROPERTY.selectedColor,
                marginLeft: 45,
                marginTop: 92,
              }}
              source={require('../../Assets/icons/send.png')}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  ArchivedScreen = () => {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: PROPERTY.headerColorBackground,
        }}>
        <Text>Archived module under process.....</Text>
      </View>
    );
  };

  SentScreen = () => {
    return (
      <View style={{ flex: 1, backgroundColor: PROPERTY.headerColorBackground }}>
        <View style={{ marginTop: 20 }}>
          {this.state.isLoading && (
            <ActivityIndicator
              size="large"
              color={PROPERTY.selectedColor}
              style={{ marginTop: height - 600 }}
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
              style={{ height: height - 210 }}
              data={this.state.sentlist}
              renderItem={({ item, index }) => (
                <View style={{ flexDirection: 'row' }}>
                  <TouchableOpacity
                    style={{ flex: 20 }}
                    onPress={() => {
                      this.props.navigation.navigate('MessageRead', {
                        data: item,
                      });
                    }}>
                    <View
                      style={{
                        marginTop: 2,
                        marginLeft: 7,
                      }}>
                      <Image
                        source={require('../../Assets/icons/msg.png')}
                        style={{
                          width: 75,
                          height: 75,
                          resizeMode: 'cover',
                          borderRadius: 60,
                          borderWidth: 1,
                          borderColor: PROPERTY.selectedColor,
                        }}
                      />
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{ flex: 80 }}
                    onPress={() => {
                      this.props.navigation.navigate('MessageRead', {
                        data: item,
                      });
                    }}>
                    <View
                      style={{
                        marginBottom: 20,
                        paddingLeft: 10,
                        paddingRight: 5,
                        paddingBottom: 0,
                        paddingTop: 10,
                        borderRadius: 10,
                        marginHorizontal: 10,
                        backgroundColor: PROPERTY.calendarHeaderBackground,
                      }}>
                      <View>
                        <Text
                          style={{
                            fontWeight: 'bold',
                            fontSize: 16,
                          }}>
                          {item.type}
                        </Text>
                        <Text style={{ fontSize: 14, fontWeight: '600' }}>
                          {item.subject}
                        </Text>
                        <Text style={{ fontSize: 14 }}>{item.message}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              )}
              keyExtractor={(item, index) => index}
            />
          )}
        </View>
        <View>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              this.props.navigation.navigate('MessageWrite');
            }}
            style={styles.touchableOpacityStyle}>
            <Image
              style={{
                resizeMode: 'contain',
                width: 48,
                height: 48,
                resizeMode: 'cover',
                borderRadius: 60,
                borderWidth: 1,
                borderColor: PROPERTY.selectedColor,
                marginLeft: 45,
                marginTop: 92,
              }}
              source={require('../../Assets/icons/send.png')}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  componentDidMount() {
    POST(SERVER + 'messages/all.json?msg=', {
      permission: 'faculty',
    }).then(response => {
      if (response.error) {
        console.log(response.error);
      } else {
       // console.log(response.list);
        this.setState({ inboxlisting: response.list });

        Object.keys(this.state.inboxlisting).map(key => {
          this.state.inboxlist.push(this.state.inboxlisting[key]);
        });

        if (this.state.inboxlist.length == 0) {
          this.dataChecked1 = false;
        } else {
          this.dataChecked1 = true;
        }

        console.log(this.state.inboxlist.length);

        this.setState({
          dataChecked1: this.dataChecked1,
          inbox_total: this.state.inboxlist.length,
          isLoading1: false,
        });
      }
    });

    POST(SERVER + 'messages/all.json?sent=1', {
      permission: 'faculty',
    }).then(response => {
      if (response.error) {
        console.log(response.error);
      } else {
        console.log(response.list);
        this.setState({ sentlisting: response.list });

        Object.keys(this.state.sentlisting).map(key => {
          this.state.sentlist.push(this.state.sentlisting[key]);
        });

        if (this.state.sentlist.length == 0) {
          this.dataChecked = false;
        } else {
          this.dataChecked = true;
        }

        this.setState({
          dataChecked: this.dataChecked,
          sent_total: this.state.sentlist.length,
          isLoading: false,
        });
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
        contentContainerStyle={{ height: height - 90 }}>
        <View
          style={{
            flex: 1,
            backgroundColor: PROPERTY.headerColorBackground,
            marginBottom: -70,
          }}
          showsVerticalScrollIndicator={false}>
          <View style={{ width: width }}>
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
                    routes: [{ name: 'Faculty' }],
                  });
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
                  Messages
                </Text>
              </View>
            </View>
          </View>
          {this.state.dataChecked1 && (
            <Tab.Navigator>
              <Tab.Screen
                name="Inbox"
                component={this.InboxScreen}
                initialParams={{ data: this.state.inboxlist }}
                options={{
                  tabBarLabel: 'Inbox (' + this.state.inbox_total + ')',
                }}
              />
              <Tab.Screen
                name="Sent"
                component={this.SentScreen}
                initialParams={{ data: this.state.sentlist }}
                options={{ tabBarLabel: 'Sent (' + this.state.sent_total + ')' }}
              />
              <Tab.Screen
                name="Archived"
                component={this.ArchivedScreen}
                options={{ tabBarLabel: 'Archived (0)' }}
              />
            </Tab.Navigator>
          )}
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

export default connect(mapstate)(FacultyMessage);
