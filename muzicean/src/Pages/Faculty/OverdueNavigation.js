import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import OverdueAttendence from './Overdue'
import OverdueBatch from './OverdueBatch'
import RescheduleBatch from './RescheduleBatch'


const BatchStack = createStackNavigator();

function OverdueNavigation() {
    return (
      <BatchStack.Navigator initialRouteName='Index'>
        <BatchStack.Screen name="Index" component={OverdueAttendence} options={({ navigation }) => ({ headerShown: false })}/>
        <BatchStack.Screen name="OverdueBatch" component={OverdueBatch} options={({ navigation }) => ({ headerShown: false })}/>
        <BatchStack.Screen name="RescheduleBatch" component={RescheduleBatch} options={({ navigation }) => ({ headerShown: false })}/>
      </BatchStack.Navigator>
    );
  }
  
  export default OverdueNavigation;