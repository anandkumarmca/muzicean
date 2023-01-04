import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import FacultyMessage from './Message'


const MStack = createStackNavigator();

function MessageNavigation() {
    return (
      <MStack.Navigator initialRouteName='Index'>
        <MStack.Screen name="Index" component={FacultyMessage} options={({ navigation }) => ({ headerShown: false })}/>
        <MStack.Screen name="Message" component={FacultyMessage} options={({ navigation }) => ({ headerShown: false })}/>
        <MStack.Screen name="MessageDetails" component={FacultyMessage} options={({ navigation }) => ({ headerShown: false })}/>
      </MStack.Navigator>
    );
  }
  
  export default MessageNavigation;