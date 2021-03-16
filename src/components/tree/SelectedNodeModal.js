import { MarkdownRenderer } from "../MarkdownRenderer";
import { MarkdownEditor } from "../MarkdownEditor";
import { DefaultButton, XIcon, EditIcon, DoneIcon } from "../Buttons";
import { LargeTextInput } from "../Inputs";
import { LargeText } from "../Texts";

import React from "react";
import styled from "styled-components";
import { reduxStore } from "../../index";
import { closeNode } from "../../redux/tree";
import { colorPalette } from "../../lib/style";
import { updateDocu } from "../../redux/tree";

export const SelectedNodeModal = React.memo(({ node }) => {
  const [title, setTitle] = React.useState(node.name);
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

  function finishDocuEdit() {
    reduxStore.dispatch(
      updateDocu(
        reduxStore.getState().tree.treeID,
        reduxStore.getState().tree.nodeList,
        node,
        title,
        text,
        nodeColor
      )
    );
  }

  function changeZIndex(e) {
    if (e.target) {
      const modalList = document.getElementsByClassName("nodeModal");
      const zIndexList = Array.from(modalList).map((ele) => {
        return ele.style.zIndex;
      });
      const max = Math.max(...zIndexList);
      const modalDOM = document.getElementById(`modal${node.id}`);
      if (modalDOM) {
        modalDOM.style.zIndex = max + 1;
      }
    }
  }

  return (
    <ModalWrapper
      draggable="true"
      onDragStart={handleDragStart}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      onClick={changeZIndex}
      className="nodeModal"
      id={`modal${node.id}`}
    >
      <DocuHeader>
        <div style={{ paddingLeft: "1rem", paddingTop: "10px" }}>
          {isEditing ? (
            <LargeTextInput
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
              placeholder="title..."
            />
          ) : (
            <LargeText>{title}</LargeText>
          )}
        </div>
        <div>
          {isEditing ? (
            <DefaultButton
              onClick={() => {
                if (isEditing) {
                  finishDocuEdit();
                }
                setIsEditing(!isEditing);
              }}
            >
              <DoneIcon />
            </DefaultButton>
          ) : (
            <DefaultButton
              onClick={() => {
                if (isEditing) {
                  finishDocuEdit();
                }
                setIsEditing(!isEditing);
              }}
            >
              <EditIcon />
            </DefaultButton>
          )}
          <DefaultButton
            onClick={() => {
              reduxStore.dispatch(closeNode(node));
            }}
          >
            <XIcon />
          </DefaultButton>
        </div>
      </DocuHeader>
      <DocuBodyArea>
        {isEditing ? (
          <MarkdownEditor bindingText={text} bindingSetter={setText} />
        ) : null}
        <MarkdownRenderer text={text} />
      </DocuBodyArea>
    </ModalWrapper>
  );
});

const ModalWrapper = styled.div`
  position: absolute;
  z-index: 100;
  background-color: #ffffff;
  border: 1px solid ${colorPalette.gray3};

  width: 50vw;
  @media (max-width: 768px) {
    width: 90vw;
  }
`;

const DocuHeader = styled.div`
  display: flex;
  justify-content: space-between;
`;

const DocuBodyArea = styled.div`
  padding: 2rem;
`;
