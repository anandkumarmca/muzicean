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



class GuestHome extends React.Component {


    welcome = "Welcome Guest";
    subTitle = "Music club will help you to explore your passoin in musiz.";
    //initital data

    pageContent = [
        { type: 'image', content: 'https://i0.wp.com/muziclub.com/wp-content/uploads/2020/06/Muziclub-Feature.jpeg?fit=1280%2C640&ssl=1' },
        { type: 'header', content: 'About Us' },
        { type: 'text', content: 'Muziclub is a platform driven by people who live music and have a passion to develop the same with whoever they touch. Muziclub academy is found on quality and structured music education. Our model has the right balance of discipline and flexibility that is needed to learn music. Our classes are designed to provide personalized focus, practice facilities, fulfilling engagement with passionate teachers. Learning without performing does not go far. So we provide an opportunity to all students to perform every week in Sunday Jam. Moreover, our teaching methods are continuously improving so that we can provide the best experience and results for students. We provide professional guidance whether music is taken by students as a hobby or as a career optionMuziclub is all about living music i.e. making music a part of your life. We are committed to providing best in class music education and services around the world through our innovative and adaptive methods.' },
        {
            type: 'list', content: [
                { image: 'https://i1.wp.com/muziclub.com/wp-content/uploads/2017/06/Guitar-3.jpg?resize=300%2C300&ssl=1', text: 'Guitar' },
                { image: 'https://i1.wp.com/muziclub.com/wp-content/uploads/2017/06/Drums.jpg?resize=300%2C300&ssl=1', text: 'Drums' },
                { image: 'https://i1.wp.com/muziclub.com/wp-content/uploads/2017/06/Keyboards.jpg?resize=300%2C300&ssl=1', text: 'Keyboard' },
                { image: 'https://i1.wp.com/muziclub.com/wp-content/uploads/2017/06/Keyboards.jpg?resize=300%2C300&ssl=1', text: 'Keyboard' },
            ]
        },
    ];




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
            <KeyboardAvoidingView behavior='position' contentContainerStyle={{ height: height- 80 }}>
                <View style={{ flex: 1, backgroundColor: PROPERTY.screenBackground }}>
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

                        <ScrollView style={{ width: width}} showsVerticalScrollIndicator={true}>

                            <View style={{ width: width, paddingLeft: 15, paddingRight: 15, paddingBottom: 100, alignItems: 'center' }}>
                                {this.pageContent.map((value, index) => {

                                    switch (value['type']) {
                                        case 'list':
                                            let i, j, chunk = 3;
                                            let temp = [];
                                            for (i = 0, j = value.content.length; i < j; i += chunk) {
                                                temp[temp.length] = value.content.slice(i, i + chunk);
                                                // do whatever
                                            }
                                            let listData = temp.map((val, ind) => {
                                                return (<View key={'text' + index + '_' + ind} style={{ flex: 1, flexDirection: 'row' }}>
                                                    {val.map((v, i) => {
                                                        return (<View key={'text' + index + '_' + ind + '_' + i} style={{ flex: 1, padding: 10, alignItems: 'center' }}>
                                                            <Image source={{ uri: v['image'] }}
                                                                style={{ width: width * 0.25, height: 100, resizeMode: 'cover', marginBottom: 10 }} />
                                                            <Text style={{ ...STYLES.fontSmall, color: PROPERTY.darkFontColor }}>{v.text}</Text>

                                                        </View>);
                                                    })}
                                                </View>);
                                            })
                                            return listData;
                                        case 'image':
                                            return (
                                                <Image key={'text' + index} source={{ uri: value['content'] }}
                                                    style={{ width: width, height: 200, resizeMode: 'cover', marginBottom: 20 }} />
                                            )
                                            break;
                                        case 'header':
                                            return (
                                                <Text key={'text' + index} style={{ ...STYLES.fontNormal, color: PROPERTY.darkFontColor, fontWeight: 'bold', paddingBottom: 10 }}>{value.content}</Text>
                                            );

                                        case 'text':
                                            return (
                                                <Text key={'text' + index} style={{ ...STYLES.fontSmall, color: PROPERTY.darkFontColor, paddingBottom: 10 }}>{value.content}</Text>
                                            );

                                    }
                                })}

                            </View>
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

export default connect(mapstate)(GuestHome);