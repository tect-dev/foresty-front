import axios from "axios";
import Swal from "sweetalert2";
import { authService, db } from "../lib/firebase";

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
  Swal.fire({
    position: "bottom-end",
    icon: "success",
    title: "Your work has been saved",
    showConfirmButton: false,
    timer: 1000,
  });
  return { type: FINISH_EDIT_TREE };
};

export const readTree = (userID, treeID) => async (dispatch) => {
  dispatch({ type: READ_TREE_TRY });

  try {
    //const res = await axios({
    //  method: "get",
    //  url: `${process.env.REACT_APP_BACKEND_URL}/techtree/${treeID}`,
    //});
    //const parsedNodeList = JSON.parse(res.data.nodeList);
    //const parsedLinkList = JSON.parse(res.data.linkList);
    // const treeTitle = res.data.title
    // const treeAuthorID: res.data.author.firebaseUid,
    // const treeAuthorNickname: res.data.author.dispalyName
    const treeDoc = await db
      .collection("users")
      .doc(userID)
      .collection("trees")
      .doc(treeID)
      .get();
    const parsedNodeList = JSON.parse(treeDoc.data().nodeList);
    const parsedLinkList = JSON.parse(treeDoc.data().linkList);
    dispatch({
      type: READ_TREE_SUCCESS,
      nodeList: parsedNodeList,
      linkList: parsedLinkList,
      treeTitle: treeDoc.data().title,
      treeAuthorID: treeDoc.data().treeAuthorID,
      treeAuthorNickname: treeDoc.data().treeAuthorNickname,
      treeID,
    });
  } catch (error) {
    dispatch({ type: READ_TREE_FAIL, error });
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
    //const res = await axios({
    //  method: "put",
    //  url: `${process.env.REACT_APP_BACKEND_URL}/techtree/${treeID}`,
    //  data: {
    //    nodeList: JSON.stringify(filteredList),
    //  },
    //});
    if (treeID !== "homeDemo") {
      const user = authService.currentUser;
      const treeRef = db
        .collection("users")
        .doc(user.uid)
        .collection("trees")
        .doc(treeID);
      const res = await treeRef.update({
        nodeList: JSON.stringify(filteredList),
      });
    }
    dispatch({ type: UPDATE_DOCU_SUCCESS, nodeList: filteredList });
  } catch (e) {
    dispatch({ type: UPDATE_DOCU_FAIL, error: e });
  }
};

const CREATE_NODE_TRY = "tree/CREATE_NODE";
const CREATE_NODE_SUCCESS = "tree/CREATE_NODE_SUCCESS";
const CREATE_NODE_FAIL = "tree/CREATE_NODE_FAIL";

export const createNode = (treeID, nodeList) => async (dispatch) => {
  dispatch({ type: CREATE_NODE_TRY });
  try {
    //const res = await axios({
    //  method: "put",
    //  url: `${process.env.REACT_APP_BACKEND_URL}/techtree/${treeID}`,
    //  data: {
    //    nodeList: JSON.stringify(nodeList),
    //  },
    //});
    if (treeID !== "homeDemo") {
      const user = authService.currentUser;
      const treeRef = db
        .collection("users")
        .doc(user.uid)
        .collection("trees")
        .doc(treeID);
      const res = await treeRef.update({
        nodeList: JSON.stringify(nodeList),
      });
    }
    dispatch({ type: CREATE_NODE_SUCCESS, nodeList });
  } catch (e) {
    dispatch({ type: CREATE_NODE_FAIL });
  }
};

const DELETE_NODE_TRY = "tree/DELETE_NODE_TRY";
const DELETE_NODE_SUCCESS = "tree/DELETE_NODE_SUCCESS";
const DELETE_NODE_FAIL = "tree/DELETE_NODE_FAIL";
export const deleteNode = (treeID, nodeList, linkList, node) => async (
  dispatch
) => {
  dispatch({ type: DELETE_NODE_TRY });
  try {
    const deletionBinaryList = linkList.map((link) => {
      if (link.startNodeID === node.id) {
        return 0;
      } else if (link.endNodeID === node.id) {
        return 0;
      } else {
        return 1;
      }
    });
    // 이러면 linkList 랑 원소의 갯수가 같은 0101010 배열이 나올것.
    const newLinkList = linkList.filter((link, index) => {
      return deletionBinaryList[index] === 1;
    });
    const newNodeList = nodeList.filter((ele, index) => {
      return ele.id !== node.id;
    });
    //const res = await axios({
    //  method: "put",
    //  url: `${process.env.REACT_APP_BACKEND_URL}/techtree/${treeID}`,
    //  headers: { "Content-Type": "application/json" },
    //  data: {
    //    nodeList: JSON.stringify(newNodeList),
    //    linkList: JSON.stringify(newLinkList),
    //  },
    //});
    if (treeID !== "homeDemo") {
      const user = authService.currentUser;
      const treeRef = db
        .collection("users")
        .doc(user.uid)
        .collection("trees")
        .doc(treeID);
      const res = await treeRef.update({
        nodeList: JSON.stringify(newNodeList),
        linkList: JSON.stringify(newLinkList),
      });
    }

    dispatch({
      type: DELETE_NODE_SUCCESS,
      nodeList: newNodeList,
      linkList: newLinkList,
    });
  } catch (e) {
    dispatch({ type: DELETE_NODE_FAIL, error: e });
  }
};

const CREATE_LINK_TRY = "tree/CREATE_LINK_TRY";
const CREATE_LINK_SUCCESS = "tree/CREATE_LINK_SUCCESS";
const CREATE_LINK_FAIL = "tree/CREATE_LINK_FAIL";
export const createLink = (treeID, linkList) => async (dispatch) => {
  dispatch({ type: CREATE_LINK_TRY });
  try {
    //const res = await axios({
    //  method: "put",
    //  url: `${process.env.REACT_APP_BACKEND_URL}/techtree/${treeID}`,
    //  data: {
    //    linkList: JSON.stringify(linkList),
    //  },
    //});
    if (treeID !== "homeDemo") {
      const user = authService.currentUser;
      const treeRef = db
        .collection("users")
        .doc(user.uid)
        .collection("trees")
        .doc(treeID);
      const res = await treeRef.update({
        linkList: JSON.stringify(linkList),
      });
    }

    dispatch({ type: CREATE_LINK_SUCCESS, linkList });
  } catch (e) {
    dispatch({ type: CREATE_LINK_FAIL, error: e });
  }
};

const DELETE_LINK_TRY = "tree/DELETE_LINK_TRY";
const DELETE_LINK_SUCCESS = "tree/DELETE_LINK_SUCCESS";
const DELETE_LINK_FAIL = "tree/DELETE_LINK_FAIL";
export const deleteLink = (treeID, linkList, link) => async (dispatch) => {
  dispatch({ type: DELETE_LINK_TRY });
  const newLinkList = linkList.filter((ele) => {
    return ele.id !== link.id;
  });
  try {
    // axios({
    //   method: "put",
    //   url: `${process.env.REACT_APP_BACKEND_URL}/techtree/${treeID}`,
    //   data: {
    //     linkList: JSON.stringify(newLinkList),
    //   },
    // });
    if (treeID !== "homeDemo") {
      const user = authService.currentUser;
      const treeRef = db
        .collection("users")
        .doc(user.uid)
        .collection("trees")
        .doc(treeID);
      const res = await treeRef.update({
        linkList: JSON.stringify(newLinkList),
      });
    }

    dispatch({ type: DELETE_LINK_SUCCESS, linkList: newLinkList });
  } catch (e) {
    dispatch({ type: DELETE_LINK_FAIL, error: e });
  }
};

const CHANGE_TREE_TITLE = "tree/CHANGE_TREE_TITLE";
export const changeTreeTitle = (treeTitle) => {
  return { type: CHANGE_TREE_TITLE, treeTitle };
};

export const updateTree = (treeID, treeTitle, thumbnail) => async (
  dispatch
) => {
  dispatch({ type: UPDATE_TREE_TRY });
  try {
    //const res = await axios({
    //  method: "put",
    //  url: `${process.env.REACT_APP_BACKEND_URL}/techtree/${treeID}`,
    //  data: {
    //    title: treeTitle,
    //    thumbnail: thumbnail,
    //  },
    //});
    if (treeID !== "homeDemo") {
      const user = authService.currentUser;
      const treeRef = db
        .collection("users")
        .doc(user.uid)
        .collection("trees")
        .doc(treeID);
      const res = await treeRef.update({
        title: treeTitle,
        thumbnail: thumbnail,
      });
    }
    dispatch({ type: UPDATE_TREE_SUCCESS, treeTitle });
  } catch (e) {
    dispatch({ type: UPDATE_TREE_FAIL, error: e });
  }
};

export const selectNode = (node) => {
  return { type: SELECT_NODE, node };
};
export const closeNode = (node) => {
  return { type: CLOSE_NODE, node };
};

const CLEAN_UP = "tree/CLEAN_UP";
export const cleanUp = () => {
  const modalList = document.getElementsByClassName("nodeModalDOM");
  while (modalList.length > 0) {
    modalList[0].parentNode.removeChild(modalList[0]);
  }
  return { type: CLEAN_UP };
};

const CHANGE_NODE_COLOR = "tree/CHANGE_NODE_COLOR";
export const changeNodeColor = (nodeID, color) => {
  return { type: CHANGE_NODE_COLOR, nodeID, color };
};

export default function tree(state = initialState, action) {
  const prevSelected = state.selectedNodeList;
  switch (action.type) {
    case CHANGE_NODE_COLOR:
      const changed = state.nodeList.find((ele) => {
        return ele.id === action.nodeID;
      });
      const tempList = state.nodeList.filter((ele) => {
        return ele.id !== action.nodeID;
      });
      tempList.push({ ...changed, fillColor: action.color });
      return {
        ...state,
        nodeList: tempList,
      };
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
      if (thisIs) {
        thisIs?.remove();
        return { ...state, selectedNodeList: removed };
      }
    case CLEAN_UP:
      return {
        ...state,
        treeID: "",
        treeTitle: "",
        nodeList: [],
        linkList: [],
        treeAuthorID: "",
        treeAuthorNickname: "",
        selectedNodeList: [],
        error: null,
        isEditingTree: false,
      };
    case CHANGE_TREE_TITLE:
      return {
        ...state,
        treeTitle: action.treeTitle,
      };
    case CREATE_LINK_TRY:
      return {
        ...state,
        loading: true,
      };
    case CREATE_LINK_SUCCESS:
      return {
        ...state,
        loading: false,
        linkList: action.linkList,
      };
    case CREATE_LINK_FAIL:
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    case CREATE_NODE_TRY:
      return {
        ...state,
        loading: true,
      };
    case CREATE_NODE_SUCCESS:
      return {
        ...state,
        loading: false,
        nodeList: action.nodeList,
      };
    case CREATE_NODE_FAIL:
      return {
        ...state,
        loading: false,
      };
    case DELETE_LINK_TRY:
      return {
        ...state,
        loading: true,
      };
    case DELETE_LINK_SUCCESS:
      return {
        ...state,
        loading: false,
        linkList: action.linkList,
      };
    case DELETE_LINK_FAIL:
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    case DELETE_NODE_TRY:
      return {
        ...state,
        loading: true,
      };
    case DELETE_NODE_SUCCESS:
      return {
        ...state,
        loading: false,
        nodeList: action.nodeList,
        linkList: action.linkList,
      };
    case DELETE_NODE_FAIL:
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    default:
      return { ...state };
  }
}
