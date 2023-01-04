import { Caption } from "react-native-paper";

const LoginReducer = (state = {
    userinfo: {},
    profileSuccess: 0,
}, action) => {

    // creating active state
    switch (action.type) {

        case 'LOGIN_SUCCESS': {
            let deviceData = { userinfo: {}, device: false, checkDone: true, loginerror: false, loginsuccess: true };
            if (action.data.success === true) {
                deviceData.userinfo = action.data.users;
                deviceData.device = true;
            }

            return Object.assign({}, state, deviceData);
        }
            break;

        case 'LOGIN_FAILURE':
            return Object.assign({}, state, { loginerror: true });
            break;


        case 'LOGOUT':
            return Object.assign({}, state);
            break;

        case '@@redux/INIT':
            let deviceData = {
                userinfo: {},
            };
            return Object.assign({}, state, deviceData);
            break;
        default:
            return Object.assign({}, state);

    }
};

export default LoginReducer;