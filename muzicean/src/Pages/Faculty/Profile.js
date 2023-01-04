import React from 'react';
import { View, Image, Text, ScrollView, KeyboardAvoidingView, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import { Dimensions } from "react-native";
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
import * as ImagePicker from "react-native-image-picker";
import BottomDrawer from '../Component/Drawer';


class Profile extends React.Component {

    scrollRef = null;
    currentMonth = 0;
    info = {}

    form = {
        address: '',
        password: '',
        cpassword: '',
        contactCode: '',
        changeContact: '',
        changeEmail: '',
    };

    constructor(props) {
        super(props);
        let defaultImage = require('../../Assets/icons/dp.png');
        let users = {
            name: global.userinfo.firstname + ' ' + global.userinfo.lastname,
            email: global.userinfo.email,
            role: 'Teacher',
            photo: (global.userinfo.photo === '') ? defaultImage : { uri: global.userinfo.photo }
        }
        this.info.user = users;
        this.state = {
            resourcePath: {},
            selectedClass: 0,
            eye: true,
            eye1: true,
            emailModal: false,
            contactModal: false,
            profileModal: false,
            showprofileModal: false,
            filePath: {},
            fileUri: null,
            valEmail: false,
            valMobile: false,
            mobilemsg: '',
        };
        this.setSecurePass = this.setSecurePass.bind(this);
        this.setSecurePass1 = this.setSecurePass1.bind(this);
        this.saveChanges = this.saveChanges.bind(this);
        this.sendRequestContact = this.sendRequestContact.bind(this);
        this.setProfilePicture = this.setProfilePicture.bind(this);
    }

    componentDidMount() {
        POST(SERVER + 'api/showFaculty.json').then(response => {
            this.setState({ loading: false });
            if (response.error) {
                console.log(response.error);
            } else {
                console.log(response.data[0].address);
                global.userinfo.address = response.data[0].address;
            }
        });
    }


    cameraLaunch = () => {
        let options = {
            storageOptions: {
                quality: 1.0,
                maxWidth: 500,
                maxHeight: 500,
                skipBackup: true,
                path: 'images',
            },
        };
        ImagePicker.launchCamera(options, (res) => {
            console.log('Response = ', res);
            if (res.didCancel) {
                console.log('User cancelled image picker');
            } else if (res.error) {
                console.log('ImagePicker Error: ', res.error);
            } else if (res.customButton) {
                console.log('User tapped custom button: ', res.customButton);
                alert(res.customButton);
            } else {
                this.setState({
                    filePath: res,
                    fileUri: res.assets[0].uri,
                    showprofileModal: true,
                });
            }
        });
    }

    imageGalleryLaunch = () => {
        let options = {
            storageOptions: {
                quality: 1.0,
                maxWidth: 500,
                maxHeight: 500,
                skipBackup: true,
                path: 'images',
            },
        };
        ImagePicker.launchImageLibrary(options, (res) => {
            //console.log('Response = ', res);
            if (res.didCancel) {
                console.log('User cancelled image picker');
            } else if (res.error) {
                console.log('ImagePicker Error: ', res.error);
            } else if (res.customButton) {
                console.log('User tapped custom button: ', res.customButton);
                alert(res.customButton);
            } else {
                // console.log(res);
                this.setState({
                    filePath: res,
                    fileUri: res.assets[0].uri,
                    showprofileModal: true,
                });
            }
        });
    }

    createFormData = (photo, body) => {
        const data = new FormData();
      
        data.append('file', {
          name: photo.assets[0].fileName,
          type: photo.assets[0].type,
          uri:
            Platform.OS === 'android' ? photo.assets[0].uri : photo.assets[0].uri.replace('file://', ''),
        });
      
        Object.keys(body).forEach((key) => {
          data.append(key, body[key]); 
        });
      
        return data;
    };

    setProfilePicture() {

        this.setState({ profileModal: false, showprofileModal: false });
        UPLOAD(SERVER + 'users/photo.json', this.createFormData(this.state.filePath,{})
         ).then(response => {
            if (response.error) {
                console.log(response.error);
            } else {
               // console.log(response.res);
                if (response.res != '') {
                    Alert.alert(
                        "Profile Alert",
                        "Profile picture has been updated successfully!!!"
                    );
                    global.userinfo.photo = SERVER + 'upload/' + response.res;
                    this.props.navigation.reset({ index: 0, routes: [{ name: 'Profile' }] });
                }
            }
        });

    }

    setSecurePass() {
        if (this.state.eye == true) {
            this.setState({ eye: false });
        } else {
            this.setState({ eye: true });
        }
    }
    setSecurePass1() {
        if (this.state.eye1 == true) {
            this.setState({ eye1: false });
        } else {
            this.setState({ eye1: true });
        }
    }

    validateEmail = (text) => {
        console.log(text);
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
        if (reg.test(text) === false) {
            return false;
        }
        else {
            return true;
        }
    }

    sendRequestEmail = () => {

        if (this.validateEmail(this.form.changeEmail.state.value)) {

            POST(SERVER + 'users/requestprofile.json', {
                req: "EMAIL",
                email: this.form.changeEmail.state.value,
                mobile: "-",
            })
                .then(response => {
                    this.setState({ emailModal: false, valEmail: false });
                    Alert.alert(
                        "Request Alert",
                        "Email request has been sent to staff."
                    );
                    this.props.navigation.reset({ index: 0, routes: [{ name: 'Profile' }] });
                });

        } else {
            this.setState({ valEmail: true });
        }

    }

    sendRequestContact() {


        if (this.form.contactCode.state.value != '' && this.form.changeContact.state.value != '') {

            if (this.form.changeContact.state.value.length == 10) {

                let reqmobile = this.form.contactCode.state.value + "-" + this.form.changeContact.state.value;

                POST(SERVER + 'users/requestprofile.json', {
                    req: "MOBILE",
                    email: "-",
                    mobile: reqmobile,
                })
                    .then(response => {
                        this.setState({ contactModal: false, valMobile: false });
                        Alert.alert(
                            "Request Alert",
                            "Contact request has been sent to staff."
                        );
                        this.props.navigation.reset({ index: 0, routes: [{ name: 'Profile' }] });
                    });

            } else {
                this.setState({ valMobile: true });
                this.state.mobilemsg = "Please enter 10 digit mobile no..";
            }

        } else {

            if (this.form.contactCode.state.value == '' && this.form.changeContact.state.value == '') {
                this.setState({ valMobile: true });
                this.state.mobilemsg = "Please enter contry code and mobile no..";
            } else if (this.form.contactCode.state.value == '') {
                this.setState({ valMobile: true });
                this.state.mobilemsg = "Country code should not be empty..";
            } else {
                this.setState({ valMobile: true });
                this.state.mobilemsg = "Mobile no should not be empty..";
            }
        }

    }

    saveChanges() {

        if (this.form.password.state.value !== this.form.cpassword.state.value) {
            Alert.alert(
                "Password Alert",
                "Password and confirm password does not matched!!"
            );
        } else if(this.form.password.state.value.length < 5 && this.form.password.state.value != "" && this.form.cpassword.state.value != ""){
            Alert.alert(
                "Password Alert",
                "Password must be at least 5 characters!!"
            );
        }else {

            if (this.form.password.state.value == "" || this.form.cpassword.state.value == "") {

                POST(SERVER + 'users/profileedit.json', {
                    address: this.form.address.state.value,
                    password: "",
                }).then(response => {
                    if (response.error) {
                        console.log(response.error);
                    } else {
                        if (response.data == true) {
                            global.userinfo.address = this.form.address.state.value;
                            Alert.alert(
                                "Profile Alert",
                                "Your profile has been updated!!!"
                            );
                            this.props.navigation.reset({ index: 0, routes: [{ name: 'Profile' }] });
                        }
                    }
                });

            } else {

                POST(SERVER + 'users/profileedit.json', {
                    address: this.form.address.state.value,
                    password: this.form.password.state.value,
                }).then(response => {
                    if (response.error) {
                        console.log(response.error);
                    } else {
                        if (response.data == true) {
                            global.userinfo.address = this.form.address.state.value;
                            Alert.alert(
                                "Profile Alert",
                                "Your profile has been updated!!!"
                            );
                            this.props.navigation.reset({ index: 0, routes: [{ name: 'Profile' }] });
                        }
                    }
                });

            }

        }

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
                            <TouchableOpacity onPress={() => { this.props.navigation.reset({ index: 0, routes: [{ name: 'Faculty' }] }) }}>
                                <View style={{ paddingLeft: 20, paddingTop: 25 }}><Icon name={'chevron-left'} size={20} /></View>
                            </TouchableOpacity>
                            <View style={{ flex: 9, alignItems: 'flex-start' }}></View>
                            <View style={{ flex: 91, alignItems: 'flex-start', justifyContent: "center", paddingTop: 20, paddingRight: 30 }}>
                                <Text style={{ ...STYLES.fontLarge, color: PROPERTY.selectedColor, fontWeight: 'bold' }}>Profile</Text>
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
                                    source={this.info.user.photo}
                                    style={{
                                        width: 110,
                                        height: 110,
                                        resizeMode: 'cover',
                                        borderRadius: 60,
                                        borderWidth: 1,
                                        borderColor: PROPERTY.selectedColor,
                                    }}
                                />
                                <TouchableOpacity style={{ marginTop: -35, marginLeft: 85 }} onPress={() => { this.setState({ profileModal: true }) }} >
                                    <View style={{ alignItems: 'center' }}>
                                        <View style={{ width: 40, height: 40, backgroundColor: PROPERTY.buttonColor, borderRadius: 50, marginRight: 7, overflow: "hidden", alignItems: 'center', justifyContent: 'center' }}>
                                            <Image source={require('../../Assets/icons/edit_pen_w.png')} style={{ width: 18, height: 18, resizeMode: 'cover' }} />
                                        </View>
                                    </View>
                                </TouchableOpacity>
                                <View style={{ width: width, padding: 20, marginTop: -20 }} showsVerticalScrollIndicator={true}>
                                    <View style={{ paddingBottom: 200 }}>
                                        <View style={{ flexDirection: 'row', marginLeft: 18, marginRight: 18 }}>
                                            <View style={{ flex: 2, paddingTop: 21 }}>
                                                <Icon name={'user'} color={PROPERTY.scrollDateColor} size={35} />
                                            </View>
                                            <View style={{ flex: 10 }}>
                                                <TextInput label="Name" mode="outlined" disabled='true' defaultValue={global.userinfo.firstname + " " + global.userinfo.lastname} style={{ height: 40, marginTop: 12 }} theme={STYLES.inputStyle} />
                                            </View>
                                        </View>
                                        <View style={{ flexDirection: 'row', marginLeft: 18, marginRight: 18 }}>
                                            <View style={{ flex: 2, paddingTop: 22 }}>
                                                <Icon name={'phone'} color={PROPERTY.scrollDateColor} size={36} />
                                            </View>
                                            <View style={{ flex: 10 }}>
                                                <TextInput label="Mobile" mode="outlined" disabled='true' defaultValue={global.userinfo.mobile} style={{ height: 40, marginTop: 12 }} theme={STYLES.inputStyle} />
                                            </View>
                                        </View>
                                        <View style={{ flexDirection: 'row', marginLeft: 18, marginRight: 18 }}>
                                            <View style={{ flex: 2, paddingTop: 24 }}>
                                                <Icon name={'envelope'} color={PROPERTY.scrollDateColor} size={30} />
                                            </View>
                                            <View style={{ flex: 10 }}>
                                                <TextInput label="Email" mode="outlined" disabled='true' defaultValue={global.userinfo.email} style={{ height: 40, marginTop: 12 }} theme={STYLES.inputStyle} />
                                            </View>
                                        </View>
                                        <Text style={{ paddingLeft: width - 265, fontSize: 19, color: PROPERTY.selectedColor, paddingTop: 18 }}>Send request to</Text>
                                        <View style={{ flexDirection: 'row', marginLeft: 35, marginRight: 18 }}>
                                            <View style={{ margin: 20 }}></View>
                                            <View style={{ flex: 6, paddingTop: 15 }}>
                                                <Button color={PROPERTY.buttonColor} onPress={() => { this.setState({ contactModal: true }) }} labelStyle={{ fontSize: 11 }} mode="contained">Edit Contact</Button>
                                            </View>
                                            <View style={{ margin: 5 }}></View>
                                            <View style={{ flex: 6, paddingTop: 15 }}>
                                                <Button color={PROPERTY.buttonColor} onPress={() => { this.setState({ emailModal: true }) }} labelStyle={{ fontSize: 11 }} mode="contained">Edit Email</Button>
                                            </View>
                                        </View>
                                        <View style={{ flexDirection: 'row', marginLeft: 18, marginRight: 18, marginTop: 15 }}>
                                            <View style={{ flex: 2, paddingTop: 24 }}>
                                                <Icon name={'address-card'} color={PROPERTY.scrollDateColor} size={30} />
                                            </View>
                                            <View style={{ flex: 10 }}>
                                                <TextInput label="Address" mode="outlined" ref={ref => this.form.address = ref} defaultValue={global.userinfo.address} style={{ height: 40, marginTop: 12 }} theme={STYLES.inputStyle} />
                                            </View>
                                        </View>
                                        <View style={{ flexDirection: 'row', marginLeft: 18, marginRight: 18 }}>
                                            <View style={{ flex: 2, paddingTop: 19, paddingLeft: 0 }}>
                                                <Icon name={'lock'} color={PROPERTY.scrollDateColor} size={40} />
                                            </View>
                                            <View style={{ flex: 10 }}>
                                                <TextInput label="Password" ref={ref => this.form.password = ref} secureTextEntry={this.state.eye} right={<TextInput.Icon name="eye" style={{ paddingTop: 6, paddingLeft: 8 }} onPress={() => { this.setSecurePass(); }} />} mode="outlined" defaultValue={""} style={{ height: 40, marginTop: 12 }} theme={STYLES.inputStyle} />
                                            </View>
                                        </View>
                                        <View style={{ flexDirection: 'row', marginLeft: 18, marginRight: 18 }}>
                                            <View style={{ flex: 2, paddingTop: 19, paddingLeft: 0 }}>
                                                <Icon name={'lock'} color={PROPERTY.scrollDateColor} size={40} />
                                            </View>
                                            <View style={{ flex: 10 }}>
                                                <TextInput label="Confirm Password" ref={ref => this.form.cpassword = ref} secureTextEntry={this.state.eye1} right={<TextInput.Icon name="eye" style={{ paddingTop: 6, paddingLeft: 8 }} onPress={() => { this.setSecurePass1(); }} />} mode="outlined" defaultValue={""} style={{ height: 40, marginTop: 12 }} theme={STYLES.inputStyle} />
                                            </View>
                                        </View>
                                        <View style={{ flexDirection: 'row', marginLeft: 35, marginRight: 35, marginTop: 15 }}>
                                            <View style={{ flex: 20, paddingTop: 15 }}>
                                            </View>
                                            <View style={{ flex: 60, paddingTop: 15 }}>
                                                <Button color={PROPERTY.buttonColor} labelStyle={{ fontSize: 14 }} onPress={() => { this.saveChanges(); }} mode="contained">Save Changes</Button>
                                            </View>
                                            <View style={{ flex: 20, paddingTop: 15 }}>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </Animatable.View>
                    {/** Send Email Modal Dialog */}
                    <Modal visible={this.state.emailModal} dismissable={false}
                        contentContainerStyle={{ ...STYLES.modalDialog, backgroundColor: PROPERTY.background }}>

                        <TouchableOpacity onPress={() => { this.setState({ emailModal: false, valEmail: false }) }} >
                            <Image source={require('../../Assets/icons/close.png')} style={{ resizeMode: 'contain', width: 40, height: 40, marginLeft: 325, marginTop: 8 }} />
                        </TouchableOpacity>

                        <View style={{ paddingTop: 0, paddingLeft: 20, }}><Text style={{ ...STYLES.fontNormal, fontWeight: 'bold' }}></Text></View>
                        <View style={{ flexDirection: 'row', marginLeft: 18, marginRight: 18, marginTop: -40 }}>
                            <View style={{ flex: 1 }}></View>
                            <View style={{ flex: 10 }}>
                                <TextInput label="Insert New Email" ref={ref => this.form.changeEmail = ref} mode="outlined" defaultValue={""} style={{ height: 40, marginTop: 12 }} theme={STYLES.inputStyle} />
                            </View>
                            <View style={{ flex: 1 }}></View>
                        </View>

                        {this.state.valEmail && (
                            <View
                                style={{
                                    marginStart: width - 325,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                <Text style={{ color: PROPERTY.overdueColor }}>
                                    Please enter valid email address...
                                </Text>
                            </View>
                        )}

                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flex: 2, padding: 5 }}>
                            </View>
                            <View style={{ flex: 8, paddingTop: 5 }}>
                                <Button color={PROPERTY.buttonColor} onPress={() => { this.sendRequestEmail(); }} labelStyle={{ fontSize: 13 }} mode="contained" style={{ ...STYLES.button, height: 40, paddingTop: 2 }}  >
                                    Send Request To Staff
                                </Button>
                            </View>
                            <View style={{ flex: 2, padding: 5 }}>
                            </View>
                        </View>
                    </Modal>
                    {/** Send Contact Modal Dialog */}
                    <Modal visible={this.state.contactModal} dismissable={false}
                        contentContainerStyle={{ ...STYLES.modalDialog, backgroundColor: PROPERTY.background }}>

                        <TouchableOpacity onPress={() => { this.setState({ contactModal: false, valMobile: false, mobilemsg: '' }) }} >
                            <Image source={require('../../Assets/icons/close.png')} style={{ resizeMode: 'contain', width: 40, height: 40, marginLeft: 325, marginTop: 8 }} />
                        </TouchableOpacity>

                        <View style={{ paddingTop: 0, paddingLeft: 20, }}><Text style={{ ...STYLES.fontNormal, fontWeight: 'bold' }}></Text></View>
                        <View style={{ flexDirection: 'row', marginLeft: 18, marginRight: 18, marginTop: -40 }}>
                            <View style={{ flex: 1 }}></View>
                            <View style={{ flex: 2, marginRight: 5 }}>
                                <TextInput label="" disabled mode="outlined" ref={ref => this.form.contactCode = ref} defaultValue={"91"} placeholder={"91"} keyboardType='numeric' maxLength={2} style={{ height: 40, marginTop: 12 }} theme={STYLES.inputStyle} />
                            </View>
                            <View style={{ flex: 8 }}>
                                <TextInput label="Insert New Contact" mode="outlined" ref={ref => this.form.changeContact = ref} defaultValue={""} keyboardType='numeric' maxLength={10} style={{ height: 40, marginTop: 12 }} theme={STYLES.inputStyle} />
                            </View>
                            <View style={{ flex: 1 }}></View>
                        </View>

                        {this.state.valMobile && (
                            <View
                                style={{
                                    marginStart: width - 350,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                <Text style={{ color: PROPERTY.overdueColor }}>
                                    {this.state.mobilemsg}
                                </Text>
                            </View>
                        )}

                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flex: 2, padding: 5 }}>
                            </View>
                            <View style={{ flex: 8, paddingTop: 5 }}>
                                <Button color={PROPERTY.buttonColor} onPress={() => { this.sendRequestContact(); }} labelStyle={{ fontSize: 13 }} mode="contained" style={{ ...STYLES.button, height: 40, paddingTop: 2 }}  >
                                    Send Request To Staff
                                </Button>
                            </View>
                            <View style={{ flex: 2, padding: 5 }}>
                            </View>
                        </View>
                    </Modal>
                    {/** Set Profile Modal Dialog */}
                    <Modal visible={this.state.profileModal} dismissable={false}
                        contentContainerStyle={{ ...STYLES.modalDialog, backgroundColor: PROPERTY.background, marginTop: 15 }}>

                        <TouchableOpacity onPress={() => { this.setState({ profileModal: false }) }} >
                            <Image source={require('../../Assets/icons/close.png')} style={{ resizeMode: 'contain', width: 40, height: 40, marginLeft: 325, marginTop: 8 }} />
                        </TouchableOpacity>

                        <View style={{ paddingTop: 0, paddingLeft: 20 }}><Text style={{ fontSize: 18, fontWeight: '500', marginTop: -25 }}>Profile photo</Text></View>
                        <View style={{ flexDirection: 'row', marginLeft: 15, marginTop: 30 }}>
                            <View style={{ flex: 3, height: 85 }}>
                                <TouchableOpacity onPress={() => { this.cameraLaunch() }}>
                                    <View style={{ alignItems: 'center' }}>
                                        <View style={{ width: 60, height: 60, backgroundColor: PROPERTY.bwColor, borderRadius: 50, marginRight: 7, overflow: "hidden", alignItems: 'center', justifyContent: 'center' }}>
                                            <Image source={require('../../Assets/icons/camera.png')} style={{ width: 35, height: 35, resizeMode: 'cover' }} />
                                        </View>
                                        <Text style={{ fontSize: 13, color: PROPERTY.selectedColor, marginTop: 3, paddingRight: 5 }}>Camera</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={{ flex: 3, height: 85 }}>
                                <TouchableOpacity onPress={() => { this.imageGalleryLaunch() }}>
                                    <View style={{ alignItems: 'center' }}>
                                        <View style={{ width: 60, height: 60, backgroundColor: PROPERTY.bwColor, borderRadius: 50, marginRight: 7, overflow: "hidden", alignItems: 'center', justifyContent: 'center' }}>
                                            <Image source={require('../../Assets/icons/gallery.png')} style={{ width: 35, height: 35, resizeMode: 'cover' }} />
                                        </View>
                                        <Text style={{ fontSize: 13, color: PROPERTY.selectedColor, marginTop: 3, paddingRight: 5 }}>Gallery</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={{ flex: 3 }}></View>
                            <View style={{ flex: 3 }}></View>
                        </View>
                    </Modal>
                    {/** show Profile Modal Dialog */}
                    <Modal visible={this.state.showprofileModal} dismissable={false}
                        contentContainerStyle={{ ...STYLES.modalDialog, backgroundColor: PROPERTY.background, marginTop: 15 }}>

                        <TouchableOpacity onPress={() => { this.setState({ showprofileModal: false }) }} >
                            <Image source={require('../../Assets/icons/close.png')} style={{ resizeMode: 'contain', width: 40, height: 40, marginLeft: 325, marginTop: 8 }} />
                        </TouchableOpacity>

                        <View style={{ paddingTop: 0, paddingLeft: 20 }}><Text style={{ fontSize: 18, fontWeight: '500', marginTop: -25 }}>Profile photo</Text></View>
                        <View style={{ flexDirection: 'row', marginTop: 30 }}>
                            <View style={{ flex: 3 }}></View>
                            <View style={{ flex: 6, height: 400 }}>
                                <View style={{ alignItems: 'center' }}>
                                    <Image source={{ "uri": this.state.fileUri }} style={{ width: 300, height: 400, resizeMode: 'cover' }} />
                                </View>
                            </View>
                            <View style={{ flex: 3 }}></View>
                        </View>
                        <View style={{ flexDirection: 'row', marginTop: 5 }}>
                            <View style={{ flex: 3, padding: 5 }}>
                            </View>
                            <View style={{ flex: 6, paddingTop: 5 }}>
                                <Button color={PROPERTY.overdueColor} onPress={() => { this.setProfilePicture() }} labelStyle={{ fontSize: 13 }} mode="contained" style={{ ...STYLES.button, height: 40, paddingTop: 2 }}  >
                                    Set as Profile
                                </Button>
                            </View>
                            <View style={{ flex: 3, padding: 5 }}>
                            </View>
                        </View>
                    </Modal>
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


export default connect(mapstate)(Profile);
