import axios from "axios";

const initialState = {
  treeID: "",
  treeTitle: "",
  nodeList: [],
  linkList: [],
  selectedNodeList: [],
  treeAuthorID: "",
  treeAuthorNickname: "",
  loading: false,
  error: null,
  isEditingTree: false,
};

const EDIT_TREE = "tree/EDIT_TREE";
const FINISH_EDIT_TREE = "tree/FINISH_EDIT_TREE";

const SELECT_NODE = "tree/SELECT_NODE";
const CLOSE_NODE = "tree/CLOSE_NODE";

const READ_TREE_TRY = "tree/READ_TREE_TRY";
const READ_TREE_SUCCESS = "tree/READ_TREE_SUCCESS";
const READ_TREE_FAIL = "tree/READ_TREE_FAIL";

const UPDATE_TREE_TRY = "tree/UPDATE_TREE_TRY";
const UPDATE_TREE_SUCCESS = "tree/UPDATE_TREE_SUCCESS";
const UPDATE_TREE_FAIL = "tree/UPDATE_TREE_FAIL";

const UPDATE_DOCU_TRY = "tree/UPDATE_DOCU_TRY";
const UPDATE_DOCU_SUCCESS = "tree/UPDATE_DOCU_SUCCESS";
const UPDATE_DOCU_FAIL = "tree/UPDATE_DOCU_FAIL";

export const editTree = () => {
  return { type: EDIT_TREE };
};
export const finishEditTree = () => {
  return { type: FINISH_EDIT_TREE };
};

export const readTree = (treeID) => async (dispatch) => {
  dispatch({ type: READ_TREE_TRY });
  console.log("treeID: ", treeID);
  try {
    const res = await axios({
      method: "get",
      url: `${process.env.REACT_APP_BACKEND_URL}/techtree/${treeID}`,
    });
    const parsedNodeList = JSON.parse(res.data.nodeList);
    const parsedLinkList = JSON.parse(res.data.linkList);
    dispatch({
      type: READ_TREE_SUCCESS,
      nodeList: parsedNodeList,
      linkList: parsedLinkList,
      treeTitle: res.data.title,
      treeAuthorID: res.data.author.firebaseUid,
      treeAuthorNickname: res.data.author.displayName,
      treeID,
    });
  } catch (error) {
    dispatch({ type: READ_TREE_FAIL, error });
    console.log("error: ", error);
  }
};

export const updateDocu = (
  treeID,
  nodeList,
  node,
  title,
  text,
  nodeColor
) => async (dispatch) => {
  const changedNode = {
    ...node,
    name: title,
    body: text,
    fillColor: nodeColor,
  };
  const filteredList = nodeList.filter((ele) => {
    return ele.id !== node.id;
  });
  filteredList.push(changedNode);

  dispatch({ type: UPDATE_DOCU_TRY });
  try {
    const res = await axios({
      method: "put",
      url: `${process.env.REACT_APP_BACKEND_URL}/techtree/${treeID}`,
      data: {
        nodeList: JSON.stringify(filteredList),
      },
    });
    dispatch({ type: UPDATE_DOCU_SUCCESS, nodeList: filteredList });
  } catch (e) {
    console.log("error: ", e);
    dispatch({ type: UPDATE_DOCU_FAIL, error: e });
  }
};

export const createNode = () => {};
export const deleteNode = () => {};

export const createLink = () => {};
export const deleteLink = () => {};

const CHANGE_TREE_TITLE = "tree/CHANGE_TREE_TITLE";
export const changeTreeTitle = (treeTitle) => {
  return { type: CHANGE_TREE_TITLE, treeTitle };
};

export const updateTree = (treeID, treeTitle, thumbnail) => async (
  dispatch
) => {
  dispatch({ type: UPDATE_TREE_TRY });
  try {
    const res = await axios({
      type: "put",
      url: `${process.env.REACT_APP_BACKEND_URL}/techtree/${treeID}`,
      data: {
        title: treeTitle,
        thumbnail: thumbnail,
      },
    });
    dispatch({ type: UPDATE_TREE_SUCCESS, treeTitle });
  } catch (e) {
    console.log("error: ", e);
    dispatch({ type: UPDATE_TREE_FAIL, error: e });
  }
};

export const selectNode = (node) => {
  return { type: SELECT_NODE, node };
};
export const closeNode = (node) => {
  return { type: CLOSE_NODE, node };
};

export default function tree(state = initialState, action) {
  const prevSelected = state.selectedNodeList;
  switch (action.type) {
    case UPDATE_TREE_TRY:
      return {
        ...state,
        loading: true,
      };
    case UPDATE_TREE_SUCCESS:
      return {
        ...state,
        treeTitle: action.treeTitle,
        loading: false,
      };
    case UPDATE_TREE_FAIL:
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    case EDIT_TREE:
      return {
        ...state,
        isEditingTree: true,
      };
    case FINISH_EDIT_TREE:
      return {
        ...state,
        isEditingTree: false,
      };
    case UPDATE_DOCU_TRY:
      return {
        ...state,
        loading: true,
      };
    case UPDATE_DOCU_SUCCESS:
      return {
        ...state,
        nodeList: action.nodeList,
        loading: false,
      };
    case UPDATE_DOCU_SUCCESS:
      return {
        ...state,
        error: action.error,
        loading: false,
      };
    case READ_TREE_TRY:
      return {
        ...state,
        loading: true,
        isEditingTree: false,
      };
    case READ_TREE_SUCCESS:
      return {
        ...state,
        treeID: action.treeID,
        treeTitle: action.treeTitle,
        nodeList: action.nodeList,
        linkList: action.linkList,
        treeAuthorID: action.treeAuthorID,
        treeAuthorNickname: action.treeAuthorNickname,
        loading: false,
      };
    case READ_TREE_FAIL:
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    case SELECT_NODE:
      if (
        !prevSelected.find((ele) => {
          return ele.id === action.node.id;
        })
      ) {
        prevSelected.push(action.node);
      }
      return { ...state, selectedNodeList: prevSelected };
    case CLOSE_NODE:
      const removed = prevSelected.filter((ele) => {
        return ele.id !== action.node.id;
      });
      const thisIs = document.getElementById(action.node.id);
      thisIs.remove();
      return { ...state, selectedNodeList: removed };
    case CHANGE_TREE_TITLE:
      return {
        ...state,
        treeTitle: action.treeTitle,
      };
    default:
      return { ...state };
  }
}
