import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import FacultySchedule from './Schedule'
import FacultyScheduleDetails from './ScheduleDetails'


const BatchStack = createStackNavigator();

function BatchNavigation() {
    return (
      <BatchStack.Navigator initialRouteName='Index'>
        <BatchStack.Screen name="Index" component={FacultySchedule} options={({ navigation }) => ({ headerShown: false })}/>
        <BatchStack.Screen name="FacultySchedule" component={FacultySchedule} options={({ navigation }) => ({ headerShown: false })}/>
        <BatchStack.Screen name="FacultyScheduleDetails" component={FacultyScheduleDetails} options={({ navigation }) => ({ headerShown: false })}/>
      </BatchStack.Navigator>
    );
  }
  
  export default BatchNavigation;