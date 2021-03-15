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
};

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
      treeTitle: res.data.techtreeTitle,
      treeAuthorID: res.data.author.firebaseUid,
      treeAuthorNickname: res.data.author.displayName,
      treeID,
    });
  } catch (error) {
    dispatch({ type: READ_TREE_FAIL, error });
    console.log("error: ", error);
  }
};

export const updateDocu = (treeID, nodeList, node, text, nodeColor) => async (
  dispatch
) => {
  const changedNode = { ...node, body: text, fillColor: nodeColor };
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

export const updateTree = () => {};

export const selectNode = (node) => {
  return { type: SELECT_NODE, node };
};
export const closeNode = (node) => {
  return { type: CLOSE_NODE, node };
};

export default function tree(state = initialState, action) {
  const prevSelected = state.selectedNodeList;
  switch (action.type) {
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
    default:
      return { ...state };
  }
}
