import { combineReducers } from "redux";
import tree from "./tree";
import user from "./user";

const rootReducer = combineReducers({
  user,
  tree,
});

// reducer는 export default 해야된다는데 why??
// default 가 아니라 const 로 해도 작동하는듯 한데.

export default rootReducer;
