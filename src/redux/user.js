import Swal from "sweetalert2";
import { authService } from "../lib/firebase";

const initialState = {
  loading: false,
  error: null,
  userID: "",
  userNickname: "",
  myID: null,
  myNickname: "",
  loginState: false,
};

const INIT_USER = "user/INIT_USER";
export const authCheck = (user) => {
  return { type: INIT_USER, user };
};

const LOG_OUT = "user/LOG_OUT";
export const logout = () => {
  authService.signOut();
  return { type: LOG_OUT };
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
    //console.log(e)
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
    //console.log(e);
  }
};

export default function user(state = initialState, action) {
  switch (action.type) {
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
