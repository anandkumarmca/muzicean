import React from 'react';
import {
    View,
    Image,
    Text,
    ScrollView,
    KeyboardAvoidingView,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
} from 'react-native';
import { Dimensions } from 'react-native';
import { connect } from 'react-redux';

import { TextInput, Button, Modal } from 'react-native-paper';
import LoginReducer from '../../Redux/Reducer/Login';

import { Card } from 'react-native-paper';
import { PROPERTY, POST, SERVER } from '../../Common/Settings';
import { height, width, STYLES } from '../../Common/Style';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';
import BottomDrawer from '../Component/Drawer';

class PendingList extends React.Component {
    scrollRef = null;
    currentMonth = 0;

    info = {};
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
    };

    scrolldate = [];

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
        this.maininfo.total = new Date(
            this.maininfo.year,
            new Date().getMonth() + 1,
            0,
        ).getDate();
        this.state = {
            selectedClass: 0,
            maininfo: this.maininfo,
            isLoading: true,
            batchListing: '',
            currentDateBatch: [],
            dataChecked: null,
            batch_total: null,
            sdate: null,
            heading: 'Pending Batch List',
            _css: PROPERTY.selectedColor,
        };
        this.goBack = this.goBack.bind(this);
    }

    componentDidMount() {

        this.setState({ isLoading: true });
        this.m = this.month.indexOf(this.state.maininfo.month) + 1;
        this.sdate = this.state.maininfo.year + '-' + this.m + '-' + this.state.maininfo.date;

        POST(SERVER + 'users/pendingschedule.json').then(response => {
            this.setState({ loading: false });
            if (response.error) {
                console.log(response.error);
            } else {

                this.setState({ batchListing: response.pending });
                this.c_date = moment().format('DD/MM/YYYY');
                this.setState({ sdate: this.c_date });

                Object.keys(this.state.batchListing).map(key => {
                    this.r_date = moment(this.state.batchListing[key].starttime).format(
                        'DD/MM/YYYY',
                    );
                    // if (this.c_date === this.r_date) {
                        this.state.currentDateBatch.push(this.state.batchListing[key]);
                        this.scrolldate.push(this.r_date);
                    // }
                });

                if (this.state.currentDateBatch.length == 0) {
                    this.dataChecked = false;
                } else {
                    this.dataChecked = true;
                }

                this.setState({
                    dataChecked: this.dataChecked,
                    batch_total: this.state.currentDateBatch.length,
                    isLoading: false,
                });
            }
        });
    }

    goBack() {
        this.props.navigation.reset({index: 0, routes: [{ name: 'Faculty' }]});
    }


    /**
     * called to display page
     * @returns
     */
    render() {

        return (
            <KeyboardAvoidingView
                behavior="position"
                contentContainerStyle={{ height: height - 80 }}>
                <View
                    style={{ flex: 1, backgroundColor: PROPERTY.headerColorBackground }}
                    showsVerticalScrollIndicator={false}>
                    <Animatable.View
                        animation="fadeInUpBig"
                        style={{ width: width, flex: 20 }}>
                        <View
                            style={{ flexDirection: 'row', paddingTop: 20, paddingLeft: 10 }}>
                            <TouchableOpacity
                                onPress={() => {
                                    this.goBack();
                                }}>
                                <View style={{ paddingLeft: 20, paddingTop: 25 }}>
                                    <Icon name={'chevron-left'} size={20} />
                                </View>
                            </TouchableOpacity>
                            <View style={{ flex: 30, alignItems: 'flex-start' }}>
                                <Image
                                    source={this.info.user.photo}
                                    style={{ ...STYLES.topPhoto }}
                                />
                            </View>
                            <View
                                style={{
                                    flex: 70,
                                    alignItems: 'flex-start',
                                    justifyContent: 'center',
                                    paddingTop: 12,
                                    paddingRight: 30,
                                }}>
                                <Text style={{ ...STYLES.fontLarge, color: PROPERTY.fontColor }}>
                                    {this.info.user.name}
                                </Text>
                                <Text style={{ ...STYLES.fontSmall, color: PROPERTY.fontColor }}>
                                    {this.info.user.role}
                                </Text>
                            </View>
                        </View>
                    </Animatable.View>
                    <Animatable.View
                        animation="fadeInUpBig"
                        style={{
                            ...STYLES.topCurvedPage,
                            width: width,
                            flex: 80,
                            marginTop: -70,
                        }}>

                        {/** Display class list if non of the class is selected */}
                        {this.state.selectedClass === 0 && (
                            <View
                                style={{
                                    height: height - 320,
                                    margin: 18,
                                    borderWidth: 2,
                                    borderRadius: 5,
                                    borderColor: PROPERTY.selectedColor,
                                    backgroundColor: PROPERTY.innerColorBackground,
                                }}>
                                <Text
                                    style={{
                                        textAlign: 'center',
                                        fontSize: 25,
                                        color: this.state._css,
                                        paddingBottom: 20,
                                        paddingTop: 10,
                                    }}>
                                    {this.state.heading} ({this.state.batch_total})
                                </Text>

                                <View>
                                    {this.state.isLoading && (
                                        <ActivityIndicator
                                            size="large"
                                            color={PROPERTY.selectedColor}
                                            style={{ marginTop: 130 }}
                                        />
                                    )}
                                    {this.state.dataChecked == false && (
                                        <View
                                            style={{
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginTop: -80,
                                            }}>
                                            <Image source={PROPERTY.noDataFound} />
                                            <Text
                                                style={{
                                                    color: PROPERTY.selectedColor,
                                                    fontSize: 15,
                                                    marginTop: -225,
                                                }}>
                                                No Data Found!
                                            </Text>
                                        </View>
                                    )}
                                    {this.state.dataChecked && (
                                        <FlatList
                                            style={{ height: height-400 }}
                                            data={this.state.currentDateBatch}
                                            renderItem={({ item, index }) => (
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        this.props.navigation.navigate(
                                                            'FacultyScheduleDetails',
                                                            {
                                                                indexcount: item.icount,
                                                                starttime: item.attdate,
                                                                _total: item.btotal,
                                                                navigate: 'pending'
                                                            },
                                                        );
                                                    }}>
                                                    <View
                                                        style={{
                                                            flex: 1,
                                                            alignItems: 'center',
                                                            marginBottom: 10,
                                                            paddingBottom:10,
                                                            paddingLeft:8,
                                                            paddingTop:10,
                                                            marginLeft: 10,
                                                            borderRadius: 10,
                                                            marginHorizontal: 10,
                                                            backgroundColor:
                                                                PROPERTY.calendarHeaderBackground,
                                                        }}>
                                                        <View style={{ flexDirection: 'row' }}>
                                                            <View style={{ flex: 34 }}>
                                                                <Text
                                                                    style={{
                                                                        ...STYLES.fontSmall,
                                                                        color: this.state._css,
                                                                    }}>
                                                                    {moment(item.starttime).format('DD-MM-YYYY')}
                                                                </Text>
                                                            </View>
                                                            <View style={{ flex: 29 }}>
                                                                <Text
                                                                    style={{
                                                                        ...STYLES.fontSmall,
                                                                        color: this.state._css,
                                                                    }}>
                                                                    {item.centre_name}
                                                                </Text>
                                                            </View>
                                                            <View style={{ flex: 28 }}>
                                                                <Text
                                                                    style={{
                                                                        ...STYLES.fontSmall,
                                                                        color: this.state._css,
                                                                    }}>
                                                                    {item.course}
                                                                </Text>
                                                            </View>
                                                            <View style={{ flex: 29 }}>
                                                                <Text
                                                                    style={{
                                                                        ...STYLES.fontSmall,
                                                                        paddingLeft:9,
                                                                        color: this.state._css,
                                                                    }}>
                                                                    {item.stime}
                                                                </Text>
                                                            </View>
                                                        </View>
                                                    </View>
                                                </TouchableOpacity>
                                            )}
                                            keyExtractor={(item, index) => index}
                                        />
                                    )}
                                </View>
                            </View>
                        )}
                    </Animatable.View>

                    {/** Overdue Modal Dialog */}
                    <Modal
                        visible={this.state.overdueModal}
                        dismissable={false}
                        contentContainerStyle={{
                            ...STYLES.modalDialog,
                            backgroundColor: PROPERTY.background,
                        }}>
                        <TouchableOpacity
                            onPress={() => {
                                this.setState({ overdueModal: false });
                            }}>
                            <Image
                                source={require('../../Assets/icons/close.png')}
                                style={{
                                    resizeMode: 'contain',
                                    width: 40,
                                    height: 40,
                                    marginLeft: 325,
                                    marginTop: 8,
                                }}
                            />
                        </TouchableOpacity>

                        <View style={{ paddingTop: 0, paddingLeft: 20 }}>
                            <Text style={{ ...STYLES.fontNormal, fontWeight: 'bold' }}></Text>
                        </View>

                        <View
                            style={{
                                width: 330,
                                height: 150,
                                backgroundColor: PROPERTY.bwColor,
                                paddingTop: 20,
                                padding: 15,
                                borderRadius: 20,
                                marginStart: 20,
                                paddingStart: 20,
                            }}>
                            <Text style={{ fontSize: 18 }}>
                                Time : {this.stime} - {this.etime}
                            </Text>
                            <Text style={{ fontSize: 18 }}>Day : {this.scheduledays} </Text>
                            <Text style={{ fontSize: 18 }}>Class : {this.course} </Text>
                            <Text style={{ fontSize: 18 }}>Mode : {this.mode} </Text>
                        </View>
                        <View style={{ paddingStart: 100, paddingTop: 10 }}>
                            <Text style={{ color: PROPERTY.overdueColor }}>
                                Send request for this batch?
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'row', paddingTop: 8 }}>
                            <View style={{ flex: 1, padding: 5 }}></View>
                            <View style={{ flex: 1, paddingTop: 5 }}>
                                <Button
                                    color={PROPERTY.buttonColor}
                                    mode="contained"
                                    style={{ ...STYLES.button, height: 40, paddingTop: 0 }}
                                >
                                    Proceed
                                </Button>
                            </View>
                            <View style={{ flex: 1, padding: 5 }}></View>
                        </View>
                    </Modal>

                    {/** Success Modal Dialog */}
                    <Modal
                        visible={this.state.successModal}
                        dismissable={false}
                        contentContainerStyle={{
                            ...STYLES.modalDialog,
                            backgroundColor: PROPERTY.background,
                            marginBottom: 60,
                        }}>
                        <View style={{ flexDirection: 'row', paddingTop: 20 }}>
                            <View style={{ flex: 1, padding: 5 }}>
                                <View
                                    style={{
                                        width: 280,
                                        height: 70,
                                        backgroundColor: PROPERTY.bwColor,
                                        paddingTop: 20,
                                        padding: 15,
                                        borderRadius: 20,
                                        marginStart: 15,
                                        paddingStart: 20,
                                    }}>
                                    <Text style={{ fontSize: 18, color: PROPERTY.green }}>
                                        Request sent successfully...
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    style={{ marginTop: -63, marginLeft: -14 }}
                                    onPress={() => {
                                        this.setState({ successModal: false });
                                    }}>
                                    <Image
                                        source={require('../../Assets/icons/close.png')}
                                        style={{
                                            resizeMode: 'contain',
                                            width: 40,
                                            height: 40,
                                            marginLeft: 325,
                                            marginTop: 8,
                                        }}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                </View>
                <BottomDrawer {...this.props}></BottomDrawer>
            </KeyboardAvoidingView>
        );
    }
}

const mapstate = state => {
    return {
        login: LoginReducer,
    };
};

export default connect(mapstate)(PendingList);
