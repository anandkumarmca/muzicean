import React from 'react';
import { View, Image, Text, ScrollView, KeyboardAvoidingView, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
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
import moment from 'moment';
import BottomDrawer from '../Component/Drawer';


class FacultySchedule extends React.Component {

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

    days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    days1 = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    arr = [];

    maininfo = {
        month: this.month[new Date().getMonth()],
        year: new Date().getYear() + 1900,
        date: this.selectDated,
    }

    constructor(props) {
        super(props);
        this.maininfo.total = new Date(
            this.maininfo.year,
            new Date().getMonth() + 1,
            0,
        ).getDate();
        this.state = {
            selectedClass: 0,
            maininfo: this.maininfo,
            dates: [],
            _cdate: null,
        };

        this.changeMonth = this.changeMonth.bind(this);
        this.showDates = this.showDates.bind(this);
        this.navigateBatch = this.navigateBatch.bind(this);
    }

    componentDidMount() {
        this.state._cdate = this.selectDated;
        // console.log(this.maininfo.total);
        this.showDates(this.state.maininfo.month, this.state.maininfo.year, this.maininfo.total);
    }

    showDates(month, year, count) {

        this.m = (this.month.indexOf(month) + 1);
        let firstDay = moment(year + '-' + this.m + '-' + 1).format("dddd");
        let d = this.days1.indexOf(firstDay);

        if((0 == year % 4) && (0 != year % 100) || (0 == year % 400) )
		{
            if(this.m == 2){
                count = 29;
            } 
		}
		else
		{
            if(this.m == 2){
                count = 28;
            } 
		}

        let j = 1;
        let i = 0;
        let total = count + 1;
        // console.log("total:"+total);

        for (i = 0; i < 42; i++) {
            if (i < d) {
                this.arr[i] = "";
            }
            if (i >= d && j <= total) {
                this.arr[i] = j;
                j++;
            }
            if (i > d && j > total) {
                this.arr[i] = "";
            }
        }
        // console.log(firstDay);
        this.setState({ dates: this.arr });

    }

    navigateBatch(ind) {
        this.m = this.month.indexOf(this.state.maininfo.month) + 1;
        this.cdate = moment(this.state.maininfo.year + '-' + this.m + '-' + ind).format('DD-MM-YYYY');
        console.log(this.cdate);
        this.props.navigation.navigate('Batch', { sdate: this.cdate, goback: 'schedule' });
    }

    changeMonth(month) {
        this.state._cdate = null;
        this.currentMonth = month;
        const _d = new Date();
        _d.setMonth(new Date().getMonth() + this.currentMonth);
        this.maininfo = {
            month: this.month[_d.getMonth()],
            year: _d.getYear() + 1900,
            date: 1,
        };

        if ((new Date().getMonth()) == _d.getMonth()) {
            this.state._cdate = new Date().getDate();
        }

        this.maininfo.total = new Date(
            this.maininfo.year,
            new Date().getMonth() + 1 + this.currentMonth,
            0,
        ).getDate();
        this.setState({ maininfo: this.maininfo });
        this.showDates(this.month[_d.getMonth()], _d.getYear() + 1900, this.maininfo.total);
    }


    /**
     * called to display page
     * @returns 
     */
    render() {

        return (
            <KeyboardAvoidingView behavior="position" contentContainerStyle={{ height: height-90 }} >
                <View style={{ flex: 1, backgroundColor: PROPERTY.headerColorBackground }} showsVerticalScrollIndicator={false}>
                    <Animatable.View animation="fadeInUpBig" style={{ width: width }}>
                        <View style={{ flexDirection: "row", paddingTop: 5, paddingBottom: 25, paddingLeft: 10, backgroundColor: PROPERTY.bwColor }}>
                            <TouchableOpacity onPress={() => { this.props.navigation.reset({ index: 0, routes: [{ name: 'Faculty' }] }) }}>
                                <View style={{ paddingLeft: 20, paddingTop: 25 }}><Icon name={'chevron-left'} size={20} /></View>
                            </TouchableOpacity>
                            <View style={{ flex: 9, alignItems: 'flex-start' }}></View>
                            <View style={{ flex: 91, alignItems: 'flex-start', justifyContent: "center", paddingTop: 20, paddingRight: 30 }}>
                                <Text style={{ ...STYLES.fontLarge, color: PROPERTY.selectedColor, fontWeight: 'bold' }}>Schedule Calendar</Text>
                            </View>
                        </View>
                    </Animatable.View>
                    <Animatable.View animation="fadeInUpBig" style={{ width: width, marginTop: 10 }}>
                        <View style={{ backgroundColor: PROPERTY.innerColorBackground }}>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    paddingTop: 15,
                                    paddingLeft: 15,
                                    paddingRight: 15,
                                }}>
                                <View style={{ flex: 1, alignItems: 'flex-start' }}></View>
                                <View style={{ ...STYLES.calendarHeader, flex: 98 }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <TouchableOpacity
                                            style={{ alignItems: 'flex-start' }}
                                            onPress={() => {
                                                this.changeMonth(parseInt(this.currentMonth) - 1);
                                            }}>
                                            <Icon
                                                style={{ paddingRight: 70, paddingTop: 4 }}
                                                name={'chevron-left'}
                                                size={20}
                                            />
                                        </TouchableOpacity>
                                        <Text style={{ ...STYLES.fontLarge, fontWeight: 'bold' }}>
                                            {this.state.maininfo.month +
                                                ' ' +
                                                this.state.maininfo.year}
                                        </Text>
                                        <TouchableOpacity
                                            style={{ alignSelf: 'flex-end' }}
                                            onPress={() => {
                                                this.changeMonth(parseInt(this.currentMonth) + 1);
                                            }}>
                                            <Icon
                                                style={{ paddingLeft: 70, paddingBottom: 3 }}
                                                name={'chevron-right'}
                                                size={20}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={{ flex: 1, alignItems: 'flex-end' }}></View>
                            </View>

                            <View style={{ height: 320, margin: 15, borderWidth: 2, borderRadius: 5, marginTop: 30, borderColor: PROPERTY.selectedColor, backgroundColor: PROPERTY.innerColorBackground, padding: 5 }}>
                                <FlatList
                                    data={this.days}
                                    renderItem={({ item }) => (
                                        <View style={{ flex: 1, flexDirection: 'column', backgroundColor: PROPERTY.bwColor, borderWidth: 1, borderColor: PROPERTY.calendarHeaderBorderColor, borderRadius: 5, paddingBottom: 5, paddingTop: 5, margin: 2 }}>
                                            <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>{item}</Text>
                                        </View>
                                    )}
                                    numColumns={7}
                                    keyExtractor={(item, index) => index}
                                />
                                <FlatList
                                    style={{ marginBottom: 0 }}
                                    data={this.arr}
                                    renderItem={({ item }) => (
                                        <View style={
                                            item == this.state._cdate ?
                                                { flex: 1, flexDirection: 'column', backgroundColor: PROPERTY.selectedColor, borderWidth: 1, borderColor: PROPERTY.calendarHeaderBorderColor, borderRadius: 5, padding: 10, margin: 2 }
                                                :
                                                { flex: 1, flexDirection: 'column', backgroundColor: PROPERTY.bwColor, borderWidth: 1, borderColor: PROPERTY.calendarHeaderBorderColor, borderRadius: 5, padding: 10, margin: 2 }
                                        }>
                                            {item != "" ?
                                                <TouchableOpacity onPress={() => {
                                                    this.navigateBatch(item);
                                                }}>
                                                    <Text style={item == this.state._cdate ? { color: PROPERTY.bwColor, textAlign: 'center', fontWeight: '400' } : { color: PROPERTY.selectedColor, textAlign: 'center', fontWeight: '400' }}>{item}</Text>
                                                </TouchableOpacity>
                                                :
                                                <Text style={{ textAlign: 'center', fontWeight: '400' }}>{item}</Text>
                                            }
                                        </View>
                                    )}
                                    numColumns={7}
                                    keyExtractor={(item, index) => index}
                                />
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


export default connect(mapstate)(FacultySchedule);
