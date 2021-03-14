import React from "react";
import styled from "styled-components";
import { reduxStore } from "../../index";
import { closeNode } from "../../redux/tree";

export const SelectedNodeModal = React.memo(({ node }) => {
  const [text, setText] = React.useState("");
  const [isEditing, setIsEditing] = React.useState(false);

  return (
    <ModalWrapper draggable="true">
      <button
        onClick={() => {
          reduxStore.dispatch(closeNode(node));
        }}
      >
        이 모달 삭제
      </button>
      <button
        onClick={() => {
          setIsEditing(!isEditing);
        }}
      >
        수정 토글
      </button>
      {isEditing ? (
        <input
          value={text}
          onChange={(e) => {
            setText(e.target.value);
          }}
        />
      ) : null}

      {text}
      {node.name}
    </ModalWrapper>
  );
});

const ModalWrapper = styled.div`
  //position: absolute;
  z-index: "1000";
`;
