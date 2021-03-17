const initialState = {
  userID: "",
  userNickname: "",
  myID: "So1kSKj6UlUE3QBAXCvstos7Bu22",
  myNickname: "",
};

const INIT_USER = "user/INIT_USER";
export const authCheck = (user) => {
  return { type: INIT_USER, user };
};

export default function user(state = initialState, action) {
  switch (action.type) {
    case INIT_USER:
      return {
        ...state,
        myID: action.user.uid,
        myNickname: action.user.displayName,
      };
    default:
      return { ...state };
  }
}
