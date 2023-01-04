import React from 'react';
import { SafeAreaView, StatusBar, View, Image, Text, ScrollView, Platform } from 'react-native';
import { Dimensions } from "react-native";
import { connect } from 'react-redux';

import { TextInput, Button } from 'react-native-paper';

import NetInfo from '@react-native-community/netinfo';

import { PROPERTY } from '../../Common/Settings'
import { STYLES } from '../../Common/Style'




class StudentScreen extends React.Component {

    form = {
        username: '',
        password: '',
    };

    constructor(props) {
        super(props);
        this.state = {
            message: 'verifing your phone...',
            clicked: false,
            error: '',
        };
    }


    /**
     * called to display page
     * @returns 
     */
    render() {
        return (<SafeAreaView style={{ backgroundColor: PROPERTY.background, height: '100%', alignItems: 'center', justifyContent: 'center' }}>
            <ScrollView>
                <View
                    contentInsetAdjustmentBehavior="automatic"
                    style={{ backgroundColor: PROPERTY.background, height: '100%', justifyContent: 'center', alignItems: 'center', paddingTop: '30%' }}>
                    <Image source={require('../../Assets/logo.png')} style={{ width: 150, height: 150, resizeMode: 'cover' }} />




                </View>
            </ScrollView>
        </SafeAreaView>)

    }

}

const mapstate = (state) => {
    return {
        login: LoginReducer
    };
};


export default connect(mapstate)(StudentScreen);