import { firebaseInstance, authService, db } from "../lib/firebase";
import axios from "axios";
import { uid } from "uid";
//const treeRef = db.collection('trees').doc(techtreeID)
//const res = await treeRef.update({
//  title: techtreeTitle,
//  nodeList: JSON.stringify(nodeList),
//  linkList: JSON.stringify(linkList),
//  thumbnail: thumbnailURL,
//})
const initialState = {
  treeList: [],
  loading: false,
};

// tree 썸네일에 필요한것: 트리 제목, 트리 썸네일, createdAt. 세가지.

const READ_TREE_LIST_TRY = "forest/READ_TREE_LIST_TRY";
const READ_TREE_LIST_SUCCESS = "forest/READ_TREE_LIST_SUCCESS";
const READ_TREE_LIST_FAIL = "forest/READ_TREE_LIST_FAIL";
export const readTreeList = (userID) => async (dispatch) => {
  dispatch({ type: READ_TREE_LIST_TRY });
  try {
    const userRef = await db.collection("users").doc(userID);
    const snapshot = await userRef.collection("trees").get();
    const treeList = [];
    snapshot.forEach((doc) => {
      console.log(doc.id, "=>", doc.data());
      treeList.push(doc.data());
    });
    dispatch({ type: READ_TREE_LIST_SUCCESS, treeList });
    //const res = await axios.get(
    //  `${process.env.REACT_APP_BACKEND_URL}/user/${userID}`,
    //  { withCredentials: true }
    //);
  } catch (e) {
    dispatch({ type: READ_TREE_LIST_FAIL, error: e });
  }
};

const CREATE_TREE_TRY = "tree/CREATE_TREE_TRY";
const CREATE_TREE_SUCCESS = "tree/CREATE_TREE_SUCCESS";
const CREATE_TREE_FAIL = "tree/CREATE_TREE_FAIL";
export const createTree = (myID, myNickname) => async (dispatch) => {
  dispatch({ type: CREATE_TREE_TRY });
  const uid24 = uid(24);
  try {
    const userRef = await db
      .collection("users")
      .doc(myID)
      .collection("trees")
      .doc(uid24)
      .set({
        title: "",
        nodeList: "[]",
        linkList: "[]",
        treeAuthorID: myID,
        treeAuthorNickname: myNickname,
        treeID: uid24,
        thumbnail: "",
        createdAt: firebaseInstance.firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        dispatch({ type: CREATE_TREE_SUCCESS });
      });
  } catch (e) {
    dispatch({ type: CREATE_TREE_FAIL, error: e });
  }
};

export default function user(state = initialState, action) {
  switch (action.type) {
    case READ_TREE_LIST_TRY:
      return { ...state, loading: true, error: null };
    case READ_TREE_LIST_SUCCESS:
      return { ...state, loading: false, treeList: action.treeList };
    case READ_TREE_LIST_FAIL:
      return { ...state, loading: false, error: action.error };
    default:
      return { ...state };
  }
}
