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

import { PROPERTY } from '../../Common/Settings';
import { height, width, STYLES } from '../../Common/Style';




class GuestFaq extends React.Component {


    welcome = "FAQ";
    subTitle = "If you have any question, you can search for answers ";
    //initital data

    faq = [
        { question: 'How do I enrol for the courses?', answer: 'We have courses running at our centres, online and also within some companies and residential societies. Please call us at +91 9156303400 about your learning needs and someone will assist you or you will get an call back within 24 hours.' },
        { question: 'I don\'t know which instrument to learn. Can you help me choose?', answer: 'Yes. Our counsellors are highly equipped to help you align your purpose of learning and right course and faculty to help you pursue your passion.' },
        { question: 'How young can children start learning at Muziclub?', answer: 'For special kids courses for some instruments and singing classes, we take students between 4 years and 7 years old. For the normal courses in all other instruments we take students above 7 years.' },
        { question: 'Are there are any special discounts available?', answer: 'We keep running some deals and offers during special times in the year, please check at the front-desk or the counsellor about active deals at the time of registration.' },
        { question: 'Do you give platform for excelling students?', answer: 'Our top focus is on quality music education and that involves classes, practice sessions, Performances, Workshops, Sunday Jam, Annual day and outside performance opportunities and well as mentoring students for any competitions.' },
        { question: 'Can I learn more than one instrument?', answer: 'Sure, it all depends on how much time you can give to each instrument.' },
    ]


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
            <KeyboardAvoidingView behavior='position' contentContainerStyle={{ height: height - 80 }}>
                <View style={{ flex: 1, backgroundColor: PROPERTY.screenBackground }} showsVerticalScrollIndicator={false}>
                    <Animatable.View animation="fadeInUpBig" style={{ width: width, flex: 10 }}>
                        <View style={{ flexDirection: "row", paddingTop: 0, paddingLeft: 15 }}>
                            <View style={{ flex: 20, alignItems: 'flex-start' }}><Image source={require('../../Assets/logo.png')} style={{ ...STYLES.smallLogo }} /></View>
                            <View style={{ flex: 80, alignItems: 'flex-start', justifyContent: "center" }}>
                                <Text style={{ ...STYLES.fontNormal, color: PROPERTY.fontColor }}>{this.welcome}</Text>
                                <Text style={{ ...STYLES.fontSmall, color: PROPERTY.fontColor }}>{this.subTitle}</Text>
                            </View>
                        </View>
                    </Animatable.View>
                    <Animatable.View animation="fadeInUpBig" style={{ ...STYLES.topCurvedPage, width: width, flex: 90 }}>
                        <ScrollView style={{ width: width, }} showsVerticalScrollIndicator={true}>
                            {this.faq.map((value, index) => {
                                return (
                                        <List.Accordion key={"faq" + index} title={value.question}>
                                            <List.Item description={value.answer} titleNumberOfLines={0} />
                                        </List.Accordion>
                                )
                            })}
                        </ScrollView>
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

export default connect(mapstate)(GuestFaq);