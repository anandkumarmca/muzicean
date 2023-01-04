import React from 'react';
import { View, Image, Text, ScrollView, KeyboardAvoidingView, TouchableOpacity, Modal } from 'react-native';
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


class FacultyProfile extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false,
        };
        this.openMessage = this.openMessage.bind(this);
    }

    openMessage(message) {
        this.setState({ open: true });
    }


    /**
     * called to display page
     * @returns 
     */
    render() {


        return (<KeyboardAvoidingView behavior='position' contentContainerStyle={{ height: height - 80 }}>
            <View style={{ flex: 1, backgroundColor: PROPERTY.screenBackground }} showsVerticalScrollIndicator={false}>
                <Users navigation={this.props.navigation}/>
                <Animatable.View animation="fadeInUpBig" style={{ ...STYLES.topCurvedPage, width: width, flex: 80 }}>

                    {/** Display student list */}


                    <View style={{ flexDirection: 'row', paddingTop: 10, paddingBottom: 0, width: width - 40 }}>
                        <View style={{ flex: 100 }}>
                            <View style={{ alignItems: 'center', paddingTop: 10, paddingBottom: 10 }}>
                                <Text style={{ ...STYLES.fontLarge, ...STYLES.fontColor }}>Your Profile</Text>
                            </View>

                        </View>
                    </View>

                    <ScrollView style={{ width: width, padding: 20 }} showsVerticalScrollIndicator={true}>
                        <View style={{ paddingBottom: 200 }}>
                            <TextInput label="First Name" mode="flat" mode="flat" defaultValue={""} style={{ ...STYLES.simpleInput }}
                                theme={STYLES.inputTheme} />
                            <TextInput label="Last Name" mode="flat" mode="flat" defaultValue={""} style={{ ...STYLES.simpleInput }}
                                theme={STYLES.inputTheme} />
                            <TextInput label="Address" mode="flat" mode="flat" defaultValue={""} style={{ ...STYLES.simpleInput }}
                                theme={STYLES.inputTheme} />
                            <TextInput label="City" mode="flat" mode="flat" defaultValue={""} style={{ ...STYLES.simpleInput }}
                                theme={STYLES.inputTheme} />
                            <TextInput label="State" mode="flat" mode="flat" defaultValue={""} style={{ ...STYLES.simpleInput }}
                                theme={STYLES.inputTheme} />
                            <TextInput label="Pin Code" mode="flat" mode="flat" defaultValue={""} style={{ ...STYLES.simpleInput }}
                                theme={STYLES.inputTheme} />

                            <TextInput label="Mobile" mode="flat" mode="flat" defaultValue={""} style={{ ...STYLES.simpleInput }}
                                theme={STYLES.inputTheme} />



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




export default connect(mapstate)(FacultyProfile);