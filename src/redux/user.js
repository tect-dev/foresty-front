import { authService } from "../lib/firebase";

const initialState = {
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

export default function user(state = initialState, action) {
  switch (action.type) {
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
        myID: null,
        myNickname: null,
      };
    default:
      return { ...state };
  }
}
