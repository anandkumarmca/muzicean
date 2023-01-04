import React from 'react';
import {
    TouchableOpacity,
    View,
    Image,
    Text,
    ScrollView,
    StyleSheet,
    KeyboardAvoidingView
} from 'react-native';
import { connect } from 'react-redux';
import { Button, Modal, TextInput, Divider, RadioButton } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import LoginReducer from '../../Redux/Reducer/Login';
import { PROPERTY } from '../../Common/Settings';
import { height, width, STYLES } from '../../Common/Style';



class GuestCourse extends React.Component {


    welcome = "Course List";
    subTitle = "Music club provide free course for practice";
    //initital data


    constructor(props) {
        super(props);
        this.state = {
            message: 'verifing your phone...',
            clicked: false,
            error: '',
            login: false,
        };

    }


    /**
     * called to display page
     * @returns
     */
    render() {
        return (
            // container start
            <KeyboardAvoidingView behavior='position' contentContainerStyle={{ height: height }}>
                <View style={{ flex: 1, backgroundColor: PROPERTY.screenBackground }} showsVerticalScrollIndicator={false}>
                    <Animatable.View animation="fadeInUpBig" style={{ width: width, flex: 10 }}>
                        <View style={{ flexDirection: "row", paddingTop: 0, paddingLeft: 15 }}>
                            <View style={{ flex: 20, alignItems: 'flex-start' }}><Image source={require('../../Assets/logo.png')} style={{...STYLES.smallLogo}}/></View>
                            <View style={{ flex: 80, alignItems: 'flex-start', justifyContent:"center" }}>
                                <Text style={{...STYLES.fontNormal, color: PROPERTY.fontColor}}>{this.welcome}</Text>
                                <Text style={{...STYLES.fontSmall, color: PROPERTY.fontColor}}>{this.subTitle}</Text>
                            </View>
                        </View>
                    </Animatable.View>
                    <Animatable.View animation="fadeInUpBig" style={{ ...STYLES.topCurvedPage, width: width, flex: 90 }}>
                        <Text></Text>
                    </Animatable.View>

                </View>
            </KeyboardAvoidingView>

        );
    }
}

const mapstate = state => {
    return {
        login: LoginReducer,
    };
};

export default connect(mapstate)(GuestCourse);