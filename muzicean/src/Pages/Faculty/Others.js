import React from 'react';
import { View, Image, Text, ScrollView, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import { Dimensions } from "react-native";
import { connect } from 'react-redux';

import { TextInput, Button } from 'react-native-paper';
import LoginReducer from '../../Redux/Reducer/Login';

import { Card } from 'react-native-paper';

import { PROPERTY } from '../../Common/Settings'
import { height, width, STYLES } from '../../Common/Style';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/FontAwesome';
import Users from '../Component/User'
import BottomDrawer from '../Component/Drawer';


class FacutlyOthers extends React.Component {


    batchListing = [
        { location: 'Banner', name: 'Guitar evening batch', startTime: '11:00 AM', endTime: '12:00PM', status: 'pending', id: 1 },
        { location: 'Banner', name: 'Keyboard Batch', startTime: '11:00 AM', endTime: '12:00PM', status: 'active', id: 2 },
        { location: 'Shivaji Nagar', name: 'Vocal Training', startTime: '11:00 AM', endTime: '12:00PM', status: 'future', id: 3 },
    ];

    icons = [
        { title: 'Profile', icon: 'user', action: 'Profile' },
        { title: 'Change Password', icon: 'asterisk', action: 'Password' },
        { title: 'Assessment', icon: 'book', action: 'Assessment' },
        { title: 'Leave', icon: 'calendar', action: 'Leave' },
        { title: 'Payment', icon: 'money', action: 'Payment' },
        { title: 'Logout', icon: 'lock', action: 'Logout' },
    ]

    constructor(props) {
        super(props);
        this.state = {
            selectedClass: 0,
        };
        this.getDetails = this.getDetails.bind(this);
    }

    getDetails(data) {
        console.log(data);
        this.props.navigation.navigate('Other', { screen: data.action });

    }


    /**
     * called to display page
     * @returns 
     */
    render() {


        return (<KeyboardAvoidingView behavior='position' contentContainerStyle={{ height: height - 90 }}>
            <View style={{ flex: 1, backgroundColor: PROPERTY.screenBackground }} showsVerticalScrollIndicator={false}>
                <Users />
                <Animatable.View animation="fadeInUpBig" style={{ ...STYLES.topCurvedPage, width: width, flex: 80 }}>

                    {/** Display class list if non of the class is selected */}
                    <ScrollView style={{ width: width, padding: 20, paddingTop: 30 }} showsVerticalScrollIndicator={true}>
                        <View style={{ alignItems: 'center', width: width - 40, height: 50 }}>
                            <Text style={{ ...STYLES.fontLarge, ...STYLES.fontColor }}>Select Your Action</Text>
                        </View>
                        <View style={{ flexDirection: 'row', width: width - 40, flexWrap: 'wrap' }}>
                            {this.icons.map((value, index) => {
                                let color = PROPERTY.darkFontColor;
                                return (
                                    <TouchableOpacity key={'content' + index} onPress={() => { this.getDetails(value) }}>
                                        <View style={{ flex: 1, alignItems: 'center', margin: 10 }}>
                                            <Card style={{ width: (width - 100) / 2 }}>
                                                <Card.Content>
                                                    <View style={{ flex: 20, alignItems: 'center' }}>
                                                        <Icon name={value.icon} color={color} size={40} />
                                                        <Text style={{ ...STYLES.fontNormal }}>{value.title}</Text>
                                                    </View>

                                                </Card.Content>
                                            </Card>
                                        </View>
                                    </TouchableOpacity>

                                );
                            })}
                        </View>

                    </ScrollView>

                </Animatable.View>

            </View>
            <BottomDrawer {...this.props}></BottomDrawer>
        </KeyboardAvoidingView>)

        // return (<Tab.Navigator>
        //     {/* <Tab.Screen name="Classes" component={Classes} /> */}
        // </Tab.Navigator>)

    }

}

const mapstate = (state) => {
    return {
        login: LoginReducer
    };
};




export default connect(mapstate)(FacutlyOthers);