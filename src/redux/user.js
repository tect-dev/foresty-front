import Swal from "sweetalert2";
import { authService } from "../lib/firebase";
import { uid } from "uid";
import axios from "axios";

const initialState = {
  loading: false,
  error: null,
  userID: "",
  userNickname: "",
  myID: null,
  myNickname: "",
  loginState: false,
  verificationCode: "",
  powerMode: false,
};

const TOGGLE_POWER_MODE = "user/TOGGLE_POWER_MODE";
export const togglePowerMode = () => {
  return { type: TOGGLE_POWER_MODE };
};

const INIT_USER = "user/INIT_USER";
export const authCheck = (user) => {
  localStorage.setItem("user", JSON.stringify(user.uid));
  return { type: INIT_USER, user };
};

const LOG_OUT = "user/LOG_OUT";
export const logout = () => {
  authService.signOut();
  localStorage.removeItem("user");
  return { type: LOG_OUT };
};

const SEND_SIGNUP_VERIFICATION_EMAIL_TRY =
  "user/SEND_SIGNUP_VERIFICATION_EMAIL_TRY";
const SEND_SIGNUP_VERIFICATION_EMAIL_SUCCESS =
  "user/SEND_SIGNUP_VERIFICATION_EMAIL_SUCCESS";
const SEND_SIGNUP_VERIFICATION_EMAIL_FAIL =
  "user/SEND_SIGNUP_VERIFICATION_EMAIL_FAIL";
export const sendSignUpVerificationEmail = (email) => async (dispatch) => {
  dispatch({ type: SEND_SIGNUP_VERIFICATION_EMAIL_TRY });

  try {
    const socket = new WebSocket(process.env.REACT_APP_WSS_URL);

    socket.onopen = (e) => {
      socket.send(email);
    };
    //let key;
    socket.onmessage = (event) => {
      const key = JSON.parse(event.data).message;

      Swal.fire("e-Mail Went Smoothly", "Please Check Your Mail Box!");
      socket.close();
      dispatch({
        type: SEND_SIGNUP_VERIFICATION_EMAIL_SUCCESS,
        key,
      });
    };
    //const key = "123456";
  } catch (e) {
    Swal.fire("Sorry!", "Error. Please Re-try Verification");
    console.log(e);
    dispatch({ type: SEND_SIGNUP_VERIFICATION_EMAIL_FAIL, error: e });
  }
};

const SIGNUP_TRY = "user/SIGNUP_SUCCESS";
const SIGNUP_SUCCESS = "user/SIGNUP_SUCCESS";
const SIGNUP_FAIL = "user/SIGNUP_FAIL";
export const signUp = (email, password) => async (dispatch) => {
  dispatch({ type: SIGNUP_TRY });
  try {
    await authService.createUserWithEmailAndPassword(email, password);
    dispatch({ type: SIGNUP_SUCCESS });
  } catch (e) {
    dispatch({ type: SIGNUP_FAIL, error: e });
    Swal.fire(e.message);
  }
};

const LOG_IN_TRY = "user/LOG_IN_SUCCESS";
const LOG_IN_SUCCESS = "user/LOG_IN_SUCCESS";
const LOG_IN_FAIL = "user/LOG_IN_FAIL";
export const login = (email, password) => async (dispatch) => {
  dispatch({ type: LOG_IN_TRY });
  try {
    await authService.signInWithEmailAndPassword(email, password);
    dispatch({ type: LOG_IN_SUCCESS });
  } catch (e) {
    dispatch({ type: LOG_IN_FAIL, error: e });
    Swal.fire(e.message);
  }
};

export default function user(state = initialState, action) {
  switch (action.type) {
    case TOGGLE_POWER_MODE:
      return {
        ...state,
        powerMode: !state.powerMode,
      };
    case SEND_SIGNUP_VERIFICATION_EMAIL_TRY:
      return {
        ...state,
        verificationCode: "",
        loading: true,
      };
    case SEND_SIGNUP_VERIFICATION_EMAIL_SUCCESS:
      return {
        ...state,
        verificationCode: action.key,
        loading: false,
      };
    case SEND_SIGNUP_VERIFICATION_EMAIL_FAIL:
      return {
        ...state,
        error: action.error,
        loading: false,
      };
    case LOG_IN_TRY:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case LOG_IN_SUCCESS:
      return {
        ...state,
        loading: false,
      };
    case LOG_IN_FAIL:
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    case SIGNUP_TRY:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case SIGNUP_SUCCESS:
      return {
        ...state,
        loading: false,
      };
    case SIGNUP_FAIL:
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    case INIT_USER:
      return {
        ...state,
        myID: action.user.uid,
        myNickname: action.user.displayName,
        loginState: action.user,
      };
    case LOG_OUT:
      return {
        ...state,
        loginState: false,
        loading: false,

        myID: null,
        myNickname: null,
      };
    default:
      return { ...state };
  }
}
