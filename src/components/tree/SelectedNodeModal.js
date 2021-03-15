import { MarkdownRenderer } from "../MarkdownRenderer";
import { MarkdownEditor } from "../MarkdownEditor";

import React from "react";
import styled from "styled-components";
import { reduxStore } from "../../index";
import { closeNode } from "../../redux/tree";
import { colorPalette } from "../../lib/style";
import { updateDocu } from "../../redux/tree";

export const SelectedNodeModal = React.memo(({ node }) => {
  const [text, setText] = React.useState(node.body);
  // 노드 컬러 클릭시 변경되는건 changeColor 라는 걸로 따로 만들자.
  // 로컬 color도 같이 변하게 한다음에, docuUpdate에 같이 보내줘야지/
  const [nodeColor, setNodeColor] = React.useState(node.fillColor);
  const [isEditing, setIsEditing] = React.useState(false);

  let relativeX;
  let relativeY;

  function handleDragStart(e) {
    relativeX = e.clientX - e.target.getBoundingClientRect().x;
    relativeY = e.clientY - e.target.getBoundingClientRect().y;
  }
  function handleDrag(e) {
    //e.preventDefault();
    e.target.style.position = "absolute";
    e.target.style.left = e.clientX - relativeX + "px";
    e.target.style.top = e.clientY - relativeY + "px";
  }

  function handleDragEnd(e) {
    e.preventDefault();
    e.target.style.position = "absolute";
    e.target.style.left = e.clientX - relativeX + "px";
    e.target.style.top = e.clientY - relativeY + "px";
  }

  function finishDocuEdit(text) {
    reduxStore.dispatch(
      updateDocu(
        reduxStore.getState().tree.treeID,
        reduxStore.getState().tree.nodeList,
        node,
        text,
        nodeColor
      )
    );
  }

  return (
    <ModalWrapper
      draggable="true"
      onDragStart={handleDragStart}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
    >
      <div>
        <button
          onClick={() => {
            reduxStore.dispatch(closeNode(node));
          }}
        >
          이 모달 삭제
        </button>
        <button
          onClick={() => {
            if (isEditing) {
              finishDocuEdit(text);
            }
            setIsEditing(!isEditing);
          }}
        >
          수정 토글
        </button>
        {isEditing ? (
          <MarkdownEditor bindingText={text} bindingSetter={setText} />
        ) : null}

        <div>{node.name}</div>

        <div>
          <MarkdownRenderer text={text} />
        </div>
      </div>
    </ModalWrapper>
  );
});

const ModalWrapper = styled.div`
  position: absolute;
  z-index: 1000;
  background-color: #ffffff;
  border: 1px solid ${colorPalette.gray3};
  padding: 3rem;
  width: 50vw;
  @media (max-width: 768px) {
    width: 90vw;
  }
`;
