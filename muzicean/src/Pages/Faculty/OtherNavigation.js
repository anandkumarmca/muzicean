import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import FacutlyOthers from './Others'
import FacultyProfile from './OthersProfile'


const BatchStack = createStackNavigator();

function OtherNavigation() {
    return (
      <BatchStack.Navigator initialRouteName='OtherIndex'>
        <BatchStack.Screen name="OtherIndex" component={FacutlyOthers} options={({ navigation }) => ({ headerShown: false })}/>
        <BatchStack.Screen name="Profile" component={FacultyProfile} options={({ navigation }) => ({ headerShown: false })}/>
        <BatchStack.Screen name="Password" component={FacutlyOthers} options={({ navigation }) => ({ headerShown: false })}/>
        <BatchStack.Screen name="Assessment" component={FacutlyOthers} options={({ navigation }) => ({ headerShown: false })}/>
        <BatchStack.Screen name="Leave" component={FacutlyOthers} options={({ navigation }) => ({ headerShown: false })}/>
        <BatchStack.Screen name="Payment" component={FacutlyOthers} options={({ navigation }) => ({ headerShown: false })}/>
        <BatchStack.Screen name="Logout" component={FacutlyOthers} options={({ navigation }) => ({ headerShown: false })}/>
      </BatchStack.Navigator>
    );
  }
  
  export default OtherNavigation;