import React from 'react';
import { View, Image, Text, ScrollView, KeyboardAvoidingView, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Dimensions, Linking } from "react-native";
import { connect } from 'react-redux';

import { TextInput, Button, Modal } from 'react-native-paper';
import LoginReducer from '../../Redux/Reducer/Login';

import { Card } from 'react-native-paper';

import { PROPERTY, POST, SERVER } from '../../Common/Settings';
import { height, width, STYLES } from '../../Common/Style';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/FontAwesome';
import Users from '../Component/User'
import moment from 'moment';
import SelectDropdown from 'react-native-select-dropdown';
import BottomDrawer from '../Component/Drawer';


class MessageRead extends React.Component {

    scrollRef = null;
    currentMonth = 0;

    month = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];

    selectDated = new Date().getDate();

    maininfo = {
        month: this.month[new Date().getMonth()],
        year: new Date().getYear() + 1900,
        date: this.selectDated,
    }

    constructor(props) {
        super(props);
        this.maininfo.total = new Date(this.maininfo.year, new Date().getMonth(), 0).getDate();
        this.state = {
            maininfo: this.maininfo,
            readlisting: '',
            readlist: [],
            isLoading: true,
            fname: '',
            tname: '',
            subject: '',
            msg: '',
        };
    }

    componentDidMount() {

        // console.log(this.props.route.params.data);
        this.id = this.props.route.params.data.messages_id;
        this.uid = this.props.route.params.data.users_id;
        this.stype = this.props.route.params.data.sendtype;

        POST(SERVER + 'messages/getAllRead.json?id=' + this.id + '&users_id=' + this.uid + '&sendtype=' + this.stype, {
            permission: 'faculty'
        }).then(response => {
            if (response.error) {
                console.log(response.error);
            } else {
                console.log(response.form);
                this.setState({ readlist: response.form });

                this.setState({
                    isLoading: false,
                    fname: this.state.readlist.firstname + " " + this.state.readlist.lastname,
                    tname: response.msgto,
                    subject: this.state.readlist.subject,
                    msg: this.state.readlist.message,
                });

            }
        });
    }


    /**
     * called to display page
     * @returns 
     */
    render() {

        return (
            <KeyboardAvoidingView behavior="position" contentContainerStyle={{ height: height - 90 }}>
                <View style={{ flex: 1, backgroundColor: PROPERTY.headerColorBackground, marginBottom: -70 }} showsVerticalScrollIndicator={false}>
                    <Animatable.View animation="fadeInUpBig" style={{ width: width }}>
                        <View style={{ flexDirection: "row", paddingTop: 5, paddingBottom: 25, paddingLeft: 10, backgroundColor: PROPERTY.bwColor }}>
                            <TouchableOpacity onPress={() => {
                                this.props.navigation.reset({
                                    index: 0,
                                    routes: [{ name: 'FacultyMessage' }],
                                });
                            }}>
                                <View style={{ paddingLeft: 20, paddingTop: 25 }}><Icon name={'chevron-left'} size={20} /></View>
                            </TouchableOpacity>
                            <View style={{ flex: 9, alignItems: 'flex-start' }}></View>
                            <View style={{ flex: 91, alignItems: 'flex-start', justifyContent: "center", paddingTop: 20, paddingRight: 30 }}>
                                <Text style={{ ...STYLES.fontLarge, color: PROPERTY.selectedColor, fontWeight: 'bold' }}>Message Read</Text>
                            </View>
                        </View>
                    </Animatable.View>
                    {this.state.isLoading && (
                        <ActivityIndicator
                            size="large"
                            color={PROPERTY.selectedColor}
                            style={{ marginTop: 440 }}
                        />
                    )}
                    {!this.state.isLoading && (
                        <Animatable.View animation="fadeInUpBig" style={{ width: width, marginTop: 10 }}>
                            <View
                                style={{
                                    height: height - 660,
                                    margin: 18,
                                    borderWidth: 1,
                                    borderRadius: 5,
                                    borderColor: PROPERTY.selectedColor,
                                    backgroundColor: PROPERTY.innerColorBackground,
                                }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ flex: 30 }}>
                                        <Text style={{ fontSize: 18, fontWeight: '600', paddingLeft: 10, paddingTop: 10 }}>From        :</Text>
                                    </View>
                                    <View style={{ flex: 70 }}>
                                        <Text style={{ fontSize: 18, fontWeight: '600', paddingLeft: 10, paddingTop: 10 }}>{this.state.fname}</Text>
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ flex: 30 }}>
                                        <Text style={{ fontSize: 18, fontWeight: '600', paddingLeft: 10, paddingTop: 10 }}>To             :</Text>
                                    </View>
                                    <View style={{ flex: 70 }}>
                                        <Text style={{ fontSize: 18, fontWeight: '600', paddingLeft: 10, paddingTop: 10 }}>{this.state.tname}</Text>
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ flex: 30 }}>
                                        <Text style={{ fontSize: 18, fontWeight: '600', paddingLeft: 10, paddingTop: 10 }}>Subject    :</Text>
                                    </View>
                                    <View style={{ flex: 70 }}>
                                        <Text style={{ fontSize: 18, fontWeight: '600', paddingLeft: 10, paddingTop: 10, paddingRight: 2 }}>{this.state.subject}</Text>
                                    </View>
                                </View>
                            </View>
                            <View
                                style={{
                                    height: height - 320,
                                    margin: 18,
                                    marginTop: -20,
                                    borderWidth: 1,
                                    borderRadius: 5,
                                    borderColor: PROPERTY.selectedColor,
                                    backgroundColor: PROPERTY.innerColorBackground,
                                }}>

                                <Text style={{ fontSize: 18, paddingLeft: 10, paddingTop: 20 }}>{this.state.msg}</Text>
                                <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={()=>{
                                    this.props.navigation.navigate('MessageReply', {
                                        data: this.props.route.params.data,
                                    });
                                }}
                                style={styles.touchableOpacityStyle}>
                                <Image
                                    style={{
                                        resizeMode: 'contain',
                                        width: 50,
                                        height: 50,
                                        marginLeft: 40,
                                        marginTop: 40,
                                    }}
                                    source={require('../../Assets/icons/share.png')}
                                />
                            </TouchableOpacity>

                            </View>
                        </Animatable.View>
                    )}
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


export default connect(mapstate)(MessageRead);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'blue',
        padding: 10,
    },
    titleStyle: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        padding: 10,
    },
    textStyle: {
        fontSize: 16,
        textAlign: 'center',
        padding: 10,
    },
    touchableOpacityStyle: {
        position: 'absolute',
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        right: 30,
        bottom: 30,
    },
    floatingButtonStyle: {
        resizeMode: 'contain',
        width: 50,
        height: 50,
        backgroundColor: 'blue',
    },
});