import React from 'react';
import { View, Image, Text, ScrollView, KeyboardAvoidingView, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import { Dimensions, Linking } from "react-native";
import { connect } from 'react-redux';

import { TextInput, Button, Modal } from 'react-native-paper';
import LoginReducer from '../../Redux/Reducer/Login';

import { Card } from 'react-native-paper';
import { PROPERTY, POST, SERVER, UPLOAD, DEVICE_ID, TOKEN } from '../../Common/Settings';
import { height, width, STYLES } from '../../Common/Style';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/FontAwesome';
import Users from '../Component/User'
import moment from 'moment';
import BottomDrawer from '../Component/Drawer';


class StudentProfile extends React.Component {

    scrollRef = null;
    currentMonth = 0;
    info = {};
    defaultImage = require('../../Assets/icons/dp.png');

    constructor(props) {
        super(props);
        this.state = {
            selectedClass: 0,
            studentProfile: false,
            studentDp: null,
        };
    }

    componentDidMount() {

        POST(SERVER + 'users/studentById.json', {
            users_id: this.props.route.params.users_id
        }).then(response => {
            this.setState({ loading: false });
            if (response.error) {
                console.log(response.error);
            } else {

                this.info = response.data;
                this.info.name = response.data.firstname + " " + response.data.lastname;
                console.log(this.info.student);
                if (response.data.photo != '') {
                    this.setState({ studentProfile: true, studentDp: SERVER + 'upload/' + response.data.photo });
                } else {
                    this.setState({ studentProfile: false });
                }
            }
        });
    }

    whatsappClick = (phone) => {
        Linking.openURL('whatsapp://send?phone='+phone);
    }

    mailClick = (mail) => {
        Linking.openURL('mailto:'+mail);
    }

    messageClick = () => {
        Alert.alert(
            "Message Alert",
            "Message icon clicked..."
        );
    }

    callClick = (phone) => {
        let phoneNumber = phone;
        if (Platform.OS !== 'android') {
            phoneNumber = `telprompt:${phone}`;
        }
        else {
            phoneNumber = `tel:${phone}`;
        }
        Linking.canOpenURL(phoneNumber)
            .then(supported => {
                if (!supported) {
                    Alert.alert('Phone number is not available');
                } else {
                    return Linking.openURL(phoneNumber);
                }
            })
            .catch(err => console.log(err));
    }

    /**
     * called to display page
     * @returns 
     */
    render() {

        return (
            <KeyboardAvoidingView behavior="position" contentContainerStyle={{ height: height - 90 }}>
                <View style={{ flex: 1, backgroundColor: PROPERTY.headerColorBackground }} showsVerticalScrollIndicator={false}>
                    <Animatable.View animation="fadeInUpBig" style={{ width: width }}>
                        <View style={{ flexDirection: "row", paddingTop: 5, paddingBottom: 25, paddingLeft: 10, backgroundColor: PROPERTY.bwColor }}>
                            <TouchableOpacity onPress={() => { this.props.navigation.reset({ index: 0, routes: [{ name: 'StudentsList' }] }) }}>
                                <View style={{ paddingLeft: 20, paddingTop: 25 }}><Icon name={'chevron-left'} size={20} /></View>
                            </TouchableOpacity>
                            <View style={{ flex: 9, alignItems: 'flex-start' }}></View>
                            <View style={{ flex: 91, alignItems: 'flex-start', justifyContent: "center", paddingTop: 20, paddingRight: 30 }}>
                                <Text style={{ ...STYLES.fontLarge, color: PROPERTY.selectedColor, fontWeight: 'bold' }}>Student Profile</Text>
                            </View>
                        </View>
                    </Animatable.View>
                    <Animatable.View animation="fadeInUpBig" style={{ width: width, marginTop: 0 }}>
                        <View style={{ backgroundColor: PROPERTY.innerColorBackground }}>
                            <View
                                style={{
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginTop: 20,
                                }}>
                                <Image
                                    source={this.state.studentProfile ? { uri: this.state.studentDp } : this.defaultImage}
                                    style={{
                                        width: 100,
                                        height: 100,
                                        resizeMode: 'cover',
                                        borderRadius: 60,
                                        borderWidth: 1,
                                        borderColor: PROPERTY.selectedColor,
                                    }}
                                />
                                <Text style={{ paddingLeft: 5, paddingTop: 7, fontSize: 16, color: PROPERTY.selectedColor }}>{this.info.name}</Text>
                                <View style={{ flexDirection: 'row', marginTop: 20 }}>
                                    <TouchableOpacity style={{ paddingLeft: 10, paddingRight: 10 }} onPress={() => { this.whatsappClick(this.info.mobile) }}>
                                        <View
                                            style={{
                                                ...STYLES.scheduleBtn,
                                                paddingLeft: 7,
                                                paddingRight: 7,
                                            }}>
                                            <Icon name={'whatsapp'} size={25} color={'#E8E8E9'} />
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{ paddingRight: 10 }} onPress={() => { this.callClick(this.info.mobile) }}>
                                        <View
                                            style={{
                                                ...STYLES.scheduleBtn,
                                                paddingLeft: 7,
                                                paddingRight: 7,
                                            }}>
                                            <Icon name={'phone'} size={25} color={'#E8E8E9'} />
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{ paddingRight: 10 }} onPress={() => { this.messageClick() }}>
                                        <View
                                            style={{
                                                ...STYLES.scheduleBtn,
                                                paddingLeft: 8,
                                                paddingRight: 8,
                                            }}>
                                            <Icon name={'comment'} size={25} color={'#E8E8E9'} />
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{ paddingRight: 10 }} onPress={() => { this.mailClick(this.info.email) }}>
                                        <View
                                            style={{
                                                ...STYLES.scheduleBtn,
                                                paddingLeft: 8,
                                                paddingRight: 8,
                                            }}>
                                            <Icon name={'envelope'} size={25} color={'#E8E8E9'} />
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                <ScrollView style={{ width: width, padding: 20, marginTop: 0 }} showsVerticalScrollIndicator={true}>
                                    <View style={{ paddingBottom: 200 }}>
                                        <View style={{ flexDirection: 'row', marginLeft: 18, marginRight: 18 }}>
                                            <View style={{ flex: 2, paddingTop: 21 }}>
                                                <Icon name={'user'} color={PROPERTY.scrollDateColor} size={35} />
                                            </View>
                                            <View style={{ flex: 10 }}>
                                                <TextInput mode="outlined" disabled='true' defaultValue={this.info.name} style={{ height: 40, marginTop: 12 }} theme={STYLES.inputStyle} />
                                            </View>
                                        </View>
                                        <View style={{ flexDirection: 'row', marginLeft: 18, marginRight: 18 }}>
                                            <View style={{ flex: 2, paddingTop: 22 }}>
                                                <Icon name={'phone'} color={PROPERTY.scrollDateColor} size={36} />
                                            </View>
                                            <View style={{ flex: 10 }}>
                                                <TextInput mode="outlined" disabled='true' defaultValue={this.info.mobile} style={{ height: 40, marginTop: 12 }} theme={STYLES.inputStyle} />
                                            </View>
                                        </View>
                                        <View style={{ flexDirection: 'row', marginLeft: 18, marginRight: 18 }}>
                                            <View style={{ flex: 2, paddingTop: 24 }}>
                                                <Icon name={'envelope'} color={PROPERTY.scrollDateColor} size={30} />
                                            </View>
                                            <View style={{ flex: 10 }}>
                                                <TextInput mode="outlined" disabled='true' defaultValue={this.info.email} style={{ height: 40, marginTop: 12 }} theme={STYLES.inputStyle} />
                                            </View>
                                        </View>
                                    </View>
                                </ScrollView>
                                <View style={{ paddingBottom: 100 }}></View>
                            </View>
                        </View>
                    </Animatable.View>
                </View>
                <BottomDrawer {...this.props}></BottomDrawer>
            </KeyboardAvoidingView>)

    }

}

const mapstate = (state) => {
    return {
        login: LoginReducer
    };
};


export default connect(mapstate)(StudentProfile);
