import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { PROPERTY } from '../../Common/Settings';

import { height, width, STYLES } from '../../Common/Style';
import Icon from 'react-native-vector-icons/FontAwesome';
import FacultyScreen from './Index'
import BatchNavigation  from './BatchNavigation';
import OverdueNavigation  from './OverdueNavigation';
import MessageNavigation from './MessageNavigation';
import OtherNavigation from './OtherNavigation'

const Tab = createBottomTabNavigator();

function FacultyNavigation() {
    return (
        <Tab.Navigator screenOptions={({ route }) => ({
            tabBarActiveTintColor: PROPERTY.darkFontColor,
            tabBarInactiveTintColor: PROPERTY.fontColor,
            tabBarActiveBackgroundColor: PROPERTY.lightButtonBackground,
            tabBarInactiveBackgroundColor: PROPERTY.screenBackground,
            tabBarIcon: ({ color }) => {
                let icon = 'tv';
                switch (route.name) {
                    case 'Schedule':
                        icon = 'calendar';
                        break;
                    case 'Other':
                        icon = 'filter';
                        break;
                    case 'Message':
                        icon = 'envelope';
                        break;
                    case 'Pending':
                            icon = 'clipboard';
                            break;
                    case 'Overdue':
                            icon = 'calendar';
                            break;
                }
                return <Icon name={icon} color={color} size={24} />;
            },
            tabBarLabelStyle: {
                ...STYLES.fontSmall
            },
            tabBarStyle: {
                backgroundColor: PROPERTY.background,
                color: PROPERTY.fontColor,
                height: 80,
                borderTopWidth: 0,
            },
            tabBarItemStyle: {
                paddingBottom: 10,
                borderWidth: 0,
            }
        })}>
            <Tab.Screen name="Dashbaord" component={FacultyScreen} options={({ navigation }) => ({ headerShown: false })} />
            <Tab.Screen name="Schedule" component={BatchNavigation} options={({ navigation }) => ({ headerShown: false })} />
            {/* <Tab.Screen name="Message" component={MessageNavigation} options={({ navigation }) => ({ headerShown: false })} /> */}
            <Tab.Screen name="Overdue" component={OverdueNavigation} options={({ navigation }) => ({ headerShown: false })} />
            <Tab.Screen name="Other" component={OtherNavigation} options={({ navigation }) => ({ headerShown: false })} />
        </Tab.Navigator>
    );
}



export default FacultyNavigation;
