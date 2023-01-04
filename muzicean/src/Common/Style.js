import {Dimensions} from 'react-native';
import {StyleSheet} from 'react-native';
import {PROPERTY} from './Settings';

export const width = Dimensions.get('window').width;
export const height = Dimensions.get('window').height;

export const STYLES = StyleSheet.create({
  inputTheme: {
    colors: {
      background: 'transparent',
      primary: PROPERTY.darkFontColor,
    },
  },

  inputStyle: {
    colors: {
      background: PROPERTY.bwColor,
      underlineColor:'transparent',    
      primary: PROPERTY.darkFontColor,
    },
  },

  smallLogo: {width: 50, height: 50, resizeMode: 'cover', marginTop: '10%'},
  topPhoto: {
    width: 52,
    height: 52,
    resizeMode: 'cover',
    marginTop: '10%',
    marginLeft: '30%',
    borderRadius: 50,
    borderWidth: 1,
    borderColor: PROPERTY.selectedColor,
  },
  icon: {width: 60, height: 60, resizeMode: 'cover'},
  logo: {width: 70, height: 70, resizeMode: 'cover', marginTop: '10%'},

  curvedPage: {
    backgroundColor: PROPERTY.background,
    flex: 1,
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
  },

  hline: {
    margin: '25px 0px 15px 0px',
    height: '1px',
    width: '100%',
    backgroundColor: '#D3D3D3',
  },

  topCurvedPage: {
    backgroundColor: PROPERTY.background,
    flex: 1,
    overflow: 'hidden',
    marginBottom: -50,
  },

  modalDialog: {
    backgroundColor: PROPERTY.background,
    borderRadius: 10,
    margin: 20,
    marginTop: 120,
    minHeight: 100,
    alignItems: 'flex-start',
    paddingBottom: 30,
  },

  button: {
    borderWidth: 1,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
  },

  scheduleBtn: {
    borderRadius: 5,
    margin: 3,
    marginTop: 0,
    paddingLeft: 12,
    paddingRight: 12,
    paddingTop: 5,
    paddingBottom: 5,
    backgroundColor: PROPERTY.buttonColor,
  },

  scheduleBtn2: {
    borderRadius: 5,
    margin: 3,
    marginTop: 0,
    padding: 5,
    backgroundColor: PROPERTY.buttonColor,
  },

  scheduleBtnText: {
    textAlign: 'center',
    fontSize: 19,
    fontWeight: 'bold',
    color: '#E8E8E9',
  },

  darkButton: {},

  fontLarge: {
    fontSize: 20,
  },

  fontNormal: {
    fontSize: 20,
  },

  fontSmall: {
    fontSize: 15,
  },

  input: {
    width: width - 30,
    fontSize: 20,
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
  },

  smallInput: {
    width: width - 50,
    fontSize: 16,
    marginTop: 5,
    marginLeft: 0,
    marginRight: 0,
    padding: 0,
    background: PROPERTY.whiteColor,
  },

  button: {
    fontSize: 20,
    marginTop: 10,
  },

  container: {
    width: '100%',
    backgroundColor: PROPERTY.containerBackground,
    height: '100%',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  lightContainer: {
    width: '100%',
    backgroundColor: PROPERTY.lightBackground,
    height: '100%',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  pageView: {padding: 10, width: width},

  headerText: {fontSize: 20, fontWeight: 'normal'},

  calendarHeader: {
    alignItems: 'center',
    backgroundColor: PROPERTY.calendarHeaderBackground,
    borderWidth: 1,
    borderColor: PROPERTY.calendarHeaderBorderColor,
    borderRadius: 5,
    paddingTop: 14,
    paddingBottom: 14,
  },
  heading: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 13,
  },
  box: {
    flex: 1,
    height: 150,
    backgroundColor: PROPERTY.calendarHeaderBackground,
    borderRadius: 8,
    width: '100%',
    shadowOffset: {width: 1, height: 1},
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 5,
    borderColor: '#E8E8E9',
    margin: 10,
  },

  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 5,
  },

  dropdownBtnStyle: {
    width: '90%',
    height: 41,
    borderRadius: 8,
    borderColor: PROPERTY.bwColor,
    backgroundColor: PROPERTY.bwColor,
  },

  dropdownRowStyle: {
    backgroundColor: PROPERTY.bwColor,
    borderRadius: 8,
    borderWidth: 1,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 5,
  },

  dropdownDropdownStyle: {
    backgroundColor: PROPERTY.bwColor,
    borderRadius: 8,
    marginTop: -120,
  },
  dropdownBtnTxtStyle: {
    color: PROPERTY.selectedColor,
    textAlign: 'left',
    paddingRight: 10,
  },
  dropdownRowTxtStyle: {
    color: PROPERTY.selectedColor,
    textAlign: 'left',
    paddingLeft: 10,
  },
});
