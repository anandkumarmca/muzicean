import React, {useRef} from 'react';
import {height, width, STYLES} from '../../Common/Style';
import {PROPERTY} from '../../Common/Settings';
import {
  Animated,
  PanResponder,
  TouchableOpacity,
  View,
  Image,
  Text,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DrawerState = {
  Open: height - 400,
  Peek: 300,
  Closed: 0,
};

class BottomDrawer extends React.Component {
  aState = null;
  margin = 0.02 * height;
  status = 'closed';

  links = [
    {
      icon: require('../../Assets/icons/dashboard-1.png'),
      title: 'Dashboard',
      moveto: 'Faculty',
    },
    {
      icon: require('../../Assets/icons/profile.png'),
      title: 'Profile',
      info: '39',
      moveto: 'Profile',
      data: [],
    },
    {
      icon: require('../../Assets/icons/students_list.png'),
      title: 'Students List',
      info: '39',
      moveto: 'StudentsList',
      data: [],
    },
    {
      icon: require('../../Assets/icons/batch_list.png'),
      title: 'Batch List',
      info: '39',
      moveto: 'Batch',
      data: [],
    },
    {
      icon: require('../../Assets/icons/schedule.png'),
      title: 'Schedule',
      info: '39',
      moveto: 'FacultySchedule',
      data: [],
    },
    {
      icon: require('../../Assets/icons/notification.png'),
      title: 'Notification',
      info: '39',
      moveto: 'Other',
      data: [],
    },
    {
      icon: require('../../Assets/icons/leave.png'),
      title: 'Leave Application',
      info: '39',
      moveto: 'Leave',
      data: [],
    },
    {
      icon: require('../../Assets/icons/payroll.png'),
      title: 'Payroll',
      moveto: '',
    },
    {
      icon: require('../../Assets/icons/logout.png'),
      title: 'Logout',
      moveto: 'Login',
    },
  ];

  constructor(props) {
    super(props);

    this.animateMove = this.animateMove.bind(this);
    this.moveScreen = this.moveScreen.bind(this);
    this.aState = new Animated.Value(DrawerState.Closed);
    this.state = {y: 0, pan: new Animated.ValueXY(), arrow: 'angle-up'};

    this.aState.addListener(({value}) => {
      this.setState({y: value});
    });
  }

  moveScreen(data) {
    if (data.moveto.indexOf('/') > 1) {
      let $route = data.moveto.split('/');
      this.props.navigation.navigate($route[0], {
        screen: $route[1],
        params: data,
      });
    } else {
      if (data.moveto == 'Login') {
        AsyncStorage.setItem('userinfo', '');
        AsyncStorage.setItem('serverToken', '');
        this.props.navigation.reset({
          index: 0,
          routes: [{name: 'Login'}],
        });
        //this.props.navigation.navigate(data.moveto, { params: data });
      } else {
        this.props.navigation.navigate(data.moveto, {params: data});
      }
    }
  }

  movementValue(moveY) {
    return height - moveY;
  }

  animateMove(start, to) {
    Animated.spring(this.aState, {
      toValue: new Animated.Value(-to),
      tension: 20,
      useNativeDriver: true,
    }).start(finished => {
      console.log('Done');
    });
  }

  getNextState(currentState, val, margin) {
    switch (currentState) {
      case DrawerState.Peek:
        return val >= currentState + margin
          ? DrawerState.Open
          : val <= DrawerState.Peek - margin
          ? DrawerState.Closed
          : DrawerState.Peek;
      case DrawerState.Open:
        return val >= currentState
          ? DrawerState.Open
          : val <= DrawerState.Peek
          ? DrawerState.Closed
          : DrawerState.Peek;
      case DrawerState.Closed:
        return val >= currentState + margin
          ? val <= DrawerState.Peek + margin
            ? DrawerState.Peek
            : DrawerState.Open
          : DrawerState.Closed;
      default:
        return currentState;
    }
  }

  render() {
    return (
      <Animated.View
        style={{
          ...(this.state.arrow == 'angle-up'
            ? {
                width: '100%',
                height: height,
                backgroundColor: PROPERTY.background,
                borderRadius: 25,
                position: 'absolute',
                bottom: -height - 40,
                transform: [{translateY: this.state.y}],
              }
            : {
                width: '100%',
                height: height,
                backgroundColor: PROPERTY.background,
                borderRadius: 25,
                position: 'absolute',
                bottom: -height - 40,
                transform: [{translateY: this.state.y}],
                borderWidth: 0.5,
                borderColor: PROPERTY.selectedColor,
              }),
        }}>
        {/* {...this.panResponder.panHandlers} */}

        <View
          style={{
            height: 50,
            width: 50,
            marginTop: -10,
            marginLeft: width / 2 - 25,
          }}>
          <TouchableOpacity
            onPress={() => {
              if (this.status == 'closed') {
                this.status = 'open';
                this.animateMove(0, DrawerState.Peek);
                setTimeout(() => {
                  this.setState({arrow: 'angle-down'});
                }, 20);
              } else {
                this.animateMove(0, 0);
                this.status = 'closed';
                setTimeout(() => {
                  this.setState({arrow: 'angle-up'});
                }, 20);
              }
            }}>
            <Icon
              name={this.state.arrow}
              size={45}
              color={PROPERTY.selectedColor}
              style={{paddingLeft: 14, paddingTop: 10}}
            />
          </TouchableOpacity>
        </View>

        <View style={{paddingTop: 5}}>
          <FlatList
            data={this.links}
            numColumns={3}
            renderItem={({item, index}) => (
              <View style={{flex: 1, height: 85, margin: 5}}>
                <TouchableOpacity
                  onPress={() => {
                    this.moveScreen(item);
                  }}>
                  <View style={{alignItems: 'center'}}>
                    <View
                      style={{
                        width: 60,
                        height: 60,
                        backgroundColor: PROPERTY.bwColor,
                        borderRadius: 50,
                        marginRight: 7,
                        overflow: 'hidden',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Image
                        source={item.icon}
                        style={{width: 35, height: 35, resizeMode: 'cover'}}
                      />
                    </View>
                    <Text
                      style={{
                        fontSize: 13,
                        color: PROPERTY.selectedColor,
                        marginTop: 3,
                      }}>
                      {item.title}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      </Animated.View>
    );
  }
}

export default BottomDrawer;
