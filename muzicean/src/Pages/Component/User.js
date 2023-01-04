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
import { List } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import { PROPERTY } from '../../Common/Settings';
import { height, width, STYLES } from '../../Common/Style';




class Users extends React.Component {

    info = {}

    constructor(props) {
        super(props);
        let defaultImage = require('../../Assets/icons/dp.png');
        let users = {
          name: global.userinfo.firstname + ' ' + global.userinfo.lastname,
          email: global.userinfo.email,
          role: 'Teacher',
          photo:
            global.userinfo.photo === '' ? defaultImage : {uri: global.userinfo.photo}
        };
        this.info.user = users;
    }

    /**
     * called to display page
     * @returns
     */
    render() {
        return (
            // container start
            <Animatable.View animation="fadeInUpBig" style={{ width: width, flex: 20 }}>
            <View style={{ flexDirection: "row", paddingTop: 20, paddingLeft: 10 }}>
                <TouchableOpacity onPress={() => { 
                    if(this.props.navigation) {
                        this.props.navigation.goBack();
                    }                    
                }}>
                    <View style={{ paddingLeft: 20, paddingTop: 25 }}><Icon name={'chevron-left'} size={20} /></View>
                </TouchableOpacity>
                <View style={{ flex: 30, alignItems: 'flex-start' }}><Image source={ this.info.user.photo } style={{ ...STYLES.topPhoto }} /></View>
                <View style={{ flex: 70, alignItems: 'flex-start', justifyContent: "center", paddingTop: 12, paddingRight: 30 }}>
                    <Text style={{ ...STYLES.fontLarge, color: PROPERTY.fontColor }}>{this.info.user.name}</Text>
                    <Text style={{ ...STYLES.fontSmall, color: PROPERTY.fontColor }}>{this.info.user.role}</Text>
                </View>
            </View>
        </Animatable.View>

        );
    }
}

const mapstate = state => {
    return {
        login: LoginReducer,
    };
};

export default connect(mapstate)(Users);