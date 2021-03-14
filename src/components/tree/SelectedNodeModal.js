import React from "react";
import styled from "styled-components";
import { reduxStore } from "../../index";
import { closeNode } from "../../redux/tree";

export const SelectedNodeModal = React.memo(({ node }) => {
  const [text, setText] = React.useState("");

  return (
    <ModalWrapper draggable="true">
      <button
        onClick={() => {
          reduxStore.dispatch(closeNode(node));
          const thisIs = document.getElementById(node.id);
          thisIs.remove();
        }}
      >
        이 모달 삭제
      </button>
      <input
        value={text}
        onChange={(e) => {
          setText(e.target.value);
        }}
      />
      {text}
      {node.name}
    </ModalWrapper>
  );
});

const ModalWrapper = styled.div`
  //position: absolute;
  z-index: "1000";
`;
