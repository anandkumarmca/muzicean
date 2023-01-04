import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { PROPERTY } from '../../Common/Settings';
import GuestScreen from './GuestHome'
import GuestCourse from  './GuestCourse'
import GuestVideo from  './GuestVideo'
import GuestFaq from  './GuestFaq'

import { height, width, STYLES } from '../../Common/Style';
import Icon from 'react-native-vector-icons/FontAwesome';

const Tab = createBottomTabNavigator();

function GuestNavigation() {
    return (
        <Tab.Navigator screenOptions={({ route }) => ({
            tabBarActiveTintColor: PROPERTY.darkFontColor,
            tabBarInactiveTintColor: PROPERTY.fontColor,
            tabBarActiveBackgroundColor: PROPERTY.lightButtonBackground,
            tabBarInactiveBackgroundColor: PROPERTY.screenBackground,
            tabBarIcon: ({ color }) => {
                let icon = 'home';
                switch (route.name) {
                    case 'Lessons':
                        icon = 'book';
                        break;
                    case 'FAQ':
                        icon = 'question';
                        break;
                    case 'Video':
                        icon = 'film';
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
            <Tab.Screen name="Home" component={GuestScreen} options={({ navigation }) => ({ headerShown: false })} />
            <Tab.Screen name="Lessons" component={GuestCourse} options={({ navigation }) => ({ headerShown: false })} />
            <Tab.Screen name="Video" component={GuestVideo} options={({ navigation }) => ({ headerShown: false })} />
            <Tab.Screen name="FAQ" component={GuestFaq} options={({ navigation }) => ({ headerShown: false })} />
        </Tab.Navigator>
    );
}



export default GuestNavigation;
