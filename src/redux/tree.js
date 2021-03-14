const initialState = {
  treeID: "",
  treeTitle: "",
  nodeList: "",
  linkList: "",
  selectedNodeList: [],
  treeAuthorID: "",
  treeAuthorNickname: "",
};

const SELECT_NODE = "tree/SELECT_NODE";
const CLOSE_NODE = "tree/CLOSE_NODE";

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
