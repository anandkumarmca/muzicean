/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import 'react-native-gesture-handler';

import React from 'react';
import {Appearance, AppState} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {PROPERTY} from './src/Common/Settings';
import {Provider} from 'react-redux';
import {applyMiddleware, createStore} from 'redux';
import {SafeAreaView} from 'react-native';
import MessageReply from './src/Pages/Faculty/MessageReply';
import {DefaultTheme, Provider as PaperProvider} from 'react-native-paper';
import rootReducers from './src/Redux/Reducer/Index';

import SplashScreen from './src/Pages/SplashScreen';
import LoginScreen from './src/Pages/Login';

import GuestNavigation from './src/Pages/Guest/Navigation';
import FacultyNavigation from './src/Pages/Faculty/Navigation';
import FacultyScreen from './src/Pages/Faculty/Index';

import BatchNavigation from './src/Pages/Faculty/BatchNavigation';
import OverdueNavigation from './src/Pages/Faculty/OverdueNavigation';
import OtherNavigation from './src/Pages/Faculty/OtherNavigation';
//import PendingAttendence from './src/Pages/Faculty/Pending';
import FacutlyOthers from './src/Pages/Faculty/Others';
//  import FacultyProfile from './src/Pages/Faculty/OthersProfile';
import PendingList from './src/Pages/Faculty/PendingList';
import OverdueList from './src/Pages/Faculty/OverdueList';
import OverdueAttendence from './src/Pages/Faculty/Overdue';
import OverdueBatch from './src/Pages/Faculty/OverdueBatch';
import OverdueBatchEdit from './src/Pages/Faculty/OverdueBatchEdit';
import RescheduleBatch from './src/Pages/Faculty/RescheduleBatch';
import FacultySchedule from './src/Pages/Faculty/Schedule';
import StudentsList from './src/Pages/Faculty/StudentsList';
import ScheduleCancel from './src/Pages/Faculty/ScheduleCancel';
import ScheduleHoliday from './src/Pages/Faculty/ScheduleHoliday';
import FacultyScheduleDetails from './src/Pages/Faculty/ScheduleDetails';
import Batch from './src/Pages/Faculty/Batch';
import Profile from './src/Pages/Faculty/Profile';
import StudentProfile from './src/Pages/Faculty/StudentProfile';
import RescheduleStudent from './src/Pages/Faculty/RescheduleStudent';
import Leave from './src/Pages/Faculty/Leave';
import LeaveApply from './src/Pages/Faculty/LeaveApply';
import LeaveEdit from './src/Pages/Faculty/LeaveEdit';
import StatusChange from './src/Pages/Faculty/StatusChange';
import ModuleAttendance from './src/Pages/Faculty/ModuleAttendance';
import FacultyMessage from './src/Pages/Faculty/Message';
import MessageRead from './src/Pages/Faculty/MessageRead';
import MessageWrite from './src/Pages/Faculty/MessageWrite';
// Global store
const store = createStore(rootReducers, applyMiddleware());
const Stack = createStackNavigator();

global.store = store;

const theme = {
  ...DefaultTheme,
  roundness: 0,
  colors: {
    ...DefaultTheme.colors,
    primary: 'rgba(255,255,255,0.8)',
    accent: '#f1c40f',
    background: PROPERTY.whiteColor,
    text: 'rgba(0,0,0,0.8)',
  },
};

class App extends React.Component {
  isDarkMode = null;
  headerStyle = {
    backgroundColor: PROPERTY.screenBackground,
  };

  constructor(props) {
    super(props);
    this.isDarkMode = Appearance.getColorScheme() === 'dark';
  }

  componentDidMount() {
    console.log(global.userinfo);
    this.appStateSubscription = AppState.addEventListener(
      'change',
      nextAppState => {
        if (nextAppState.match(/inactive|background/)) {
          // close db connection if app is inactive
          if (global.db != null) {
            global.db.close();
          }
        }
      },
    );
  }

  // Render default activity
  render() {
    return (
      <Provider store={store}>
        <PaperProvider>
          <NavigationContainer>
            {/** Navigation listing*/}
            <Stack.Navigator>
              <Stack.Screen
                name="Home"
                component={SplashScreen}
                options={({navigation}) => ({headerShown: false})}
              />
              <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={({navigation}) => ({headerShown: false})}
              />
              <Stack.Screen
                name="Guest"
                component={GuestNavigation}
                options={({navigation}) => ({
                  headerTintColor: PROPERTY.fontColor,
                  headerStyle: this.headerStyle,
                })}
              />

              <Stack.Screen
                name="Faculty"
                component={FacultyScreen}
                options={({navigation}) => ({
                  headerTintColor: PROPERTY.fontColor,
                  headerStyle: this.headerStyle,
                  headerShown: false,
                })}
              />

              <Stack.Screen
                name="FacultyMessage"
                component={FacultyMessage}
                options={({navigation}) => ({
                  headerTintColor: PROPERTY.fontColor,
                  headerStyle: this.headerStyle,
                  headerShown: false,
                })}
              />

              <Stack.Screen
                name="MessageRead"
                component={MessageRead}
                options={({navigation}) => ({
                  headerTintColor: PROPERTY.fontColor,
                  headerStyle: this.headerStyle,
                  headerShown: false,
                })}
              />
              <Stack.Screen
                name="MessageReply"
                component={MessageReply}
                options={({navigation}) => ({
                  headerTintColor: PROPERTY.fontColor,
                  headerStyle: this.headerStyle,
                  headerShown: false,
                })}
              />

              <Stack.Screen
                name="MessageWrite"
                component={MessageWrite}
                options={({navigation}) => ({
                  headerTintColor: PROPERTY.fontColor,
                  headerStyle: this.headerStyle,
                  headerShown: false,
                })}
              />

              <Stack.Screen
                name="FacultySchedule"
                component={FacultySchedule}
                options={({navigation}) => ({headerShown: false})}
              />

              <Stack.Screen
                name="ScheduleCancel"
                component={ScheduleCancel}
                options={({navigation}) => ({headerShown: false})}
              />
              <Stack.Screen
                name="ScheduleHoliday"
                component={ScheduleHoliday}
                options={({navigation}) => ({headerShown: false})}
              />

              <Stack.Screen
                name="StudentsList"
                component={StudentsList}
                options={({navigation}) => ({headerShown: false})}
              />

              <Stack.Screen
                name="StatusChange"
                component={StatusChange}
                options={({navigation}) => ({headerShown: false})}
              />

              <Stack.Screen
                name="FacultyScheduleDetails"
                component={FacultyScheduleDetails}
                options={({navigation}) => ({headerShown: false})}
              />
              <Stack.Screen
                name="RescheduleStudent"
                component={RescheduleStudent}
                options={({navigation}) => ({headerShown: false})}
              />

              <Stack.Screen
                name="ModuleAttendance"
                component={ModuleAttendance}
                options={({navigation}) => ({headerShown: false})}
              />

              {/* PendingList*/}
              <Stack.Screen
                name="PendingList"
                component={PendingList}
                options={({navigation}) => ({headerShown: false})}
              />

              {/* OverDue*/}
              <Stack.Screen
                name="OverdueList"
                component={OverdueList}
                options={({navigation}) => ({headerShown: false})}
              />
              <Stack.Screen
                name="Overdue"
                component={OverdueAttendence}
                options={({navigation}) => ({headerShown: false})}
              />
              <Stack.Screen
                name="OverdueBatch"
                component={OverdueBatch}
                options={({navigation}) => ({headerShown: false})}
              />
              <Stack.Screen
                name="OverdueBatchEdit"
                component={OverdueBatchEdit}
                options={({navigation}) => ({headerShown: false})}
              />
              <Stack.Screen
                name="RescheduleBatch"
                component={RescheduleBatch}
                options={({navigation}) => ({headerShown: false})}
              />

              {/* Profile Navigation*/}

              <Stack.Screen
                name="Batch"
                component={Batch}
                options={({navigation}) => ({headerShown: false})}
              />
              <Stack.Screen
                name="Other"
                component={FacutlyOthers}
                options={({navigation}) => ({headerShown: false})}
              />
              <Stack.Screen
                name="Profile"
                component={Profile}
                options={({navigation}) => ({headerShown: false})}
              />
              <Stack.Screen
                name="StudentProfile"
                component={StudentProfile}
                options={({navigation}) => ({headerShown: false})}
              />
              <Stack.Screen
                name="Password"
                component={FacutlyOthers}
                options={({navigation}) => ({headerShown: false})}
              />
              <Stack.Screen
                name="Assessment"
                component={FacutlyOthers}
                options={({navigation}) => ({headerShown: false})}
              />
              <Stack.Screen
                name="Leave"
                component={Leave}
                options={({navigation}) => ({headerShown: false})}
              />
              <Stack.Screen
                name="LeaveApply"
                component={LeaveApply}
                options={({navigation}) => ({headerShown: false})}
              />
              <Stack.Screen
                name="LeaveEdit"
                component={LeaveEdit}
                options={({navigation}) => ({headerShown: false})}
              />
              <Stack.Screen
                name="Payment"
                component={FacutlyOthers}
                options={({navigation}) => ({headerShown: false})}
              />
              <Stack.Screen
                name="Logout"
                component={FacutlyOthers}
                options={({navigation}) => ({headerShown: false})}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </PaperProvider>
      </Provider>
    );
  }
}

export default App;
