import { MarkdownRenderer } from "../MarkdownRenderer";
import { MarkdownEditor } from "../MarkdownEditor";
import { EditButton, XIcon, EditIcon, DoneIcon } from "../Buttons";
import { LargeTextInput } from "../Inputs";
import { LargeText } from "../Texts";

import React from "react";
import styled from "styled-components";
import { reduxStore } from "../../index";
import { closeNode, updateDocu, changeNodeColor } from "../../redux/tree";
import { colorPalette } from "../../lib/style";
import { changeZIndex } from "../../lib/functions";

export const SelectedNodeModal = React.memo(({ defaultZ, node }) => {
  const [title, setTitle] = React.useState(node.name);
  const [text, setText] = React.useState(node.body);
  const [nodeColor, setNodeColor] = React.useState(node.fillColor);
  const [isEditing, setIsEditing] = React.useState(false);

  let onDrag = false;
  let relativeX;
  let relativeY;

  function handleDragStart(e) {
    relativeX = e.clientX - e.target.getBoundingClientRect().x;
    relativeY = e.clientY - e.target.getBoundingClientRect().y;
  }
  function handleDrag(e) {
    //e.preventDefault();
    console.log("left: ", e.target.style.left);
    console.log("top: ", e.target.style.top);
    //e.target.style.left = e.pageX + "px";
    // e.target.style.position = "absolute";
    // e.target.style.left = e.clientX - relativeX + "px";
    // e.target.style.top = e.clientY - relativeY + "px";
  }

  function handleDragEnd(e) {
    //e.preventDefault();
    console.log("drag end. e.target: ", e.target);
    //e.target.style.position = "absolute";
    const scrolledTopLength = window.pageYOffset;
    e.target.style.left = e.pageX + "px";
    //e.target.style.left = e.clientX - relativeX + "px";
    //e.target.style.top = scrolledTopLength + e.clientY - relativeY + "px";
    console.log("drag end. left: ", e.target.style.left);
    console.log("drag end. top: ", e.target.style.top);
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

  function startDrag(e) {
    console.log(e.target.tagName);
    if (!isEditing && e.target.tagName === "DIV") {
      onDrag = true;
      relativeX = e.clientX - e.target.getBoundingClientRect().x;
      relativeY = e.clientY - e.target.getBoundingClientRect().y;
    }
  }

  function isDragging(e) {
    if (onDrag) {
      //console.log("드래그중임!");
      const modal = document.getElementById(`modal${node.id}`);

      // console.log("modal.style.left: ", modal.getBoundingClientRect().x);
      const scrolledLeftLength = window.pageXOffset;
      const scrolledTopLength = window.pageYOffset;
      modal.style.left = e.clientX - relativeX + scrolledLeftLength + "px";
      modal.style.top = e.clientY - relativeY + scrolledTopLength + "px";
      //modal.style.left=e.clientY
    }
  }

  function endDrag(e) {
    onDrag = false;
    relativeX = 0;
    relativeY = 0;
  }

  return (
    <ModalWrapper
      //draggable="true"
      //onDragStart={handleDragStart}
      //onDrag={handleDrag}
      //onDragEnd={handleDragEnd}
      onMouseDown={(e) => {
        changeZIndex(e, node);
      }}
      onMouseMove={isDragging}
      id={`modal${node.id}`}
      style={{ zIndex: defaultZ }}
    >
      {isEditing ? (
        <DocuHeaderEdited onMouseMove={() => {}}>
          <div style={{ paddingLeft: "1rem", paddingTop: "10px" }}>
            <LargeTextInput
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
              placeholder="title..."
            />
          </div>
          <div>
            <EditButton
              onClick={() => {
                if (isEditing) {
                  finishDocuEdit();
                }
                setIsEditing(!isEditing);
              }}
            >
              <DoneIcon />
            </EditButton>
            <EditButton
              onClick={() => {
                reduxStore.dispatch(closeNode(node));
              }}
            >
              <XIcon />
            </EditButton>
          </div>
        </DocuHeaderEdited>
      ) : null}
      {!isEditing ? (
        <DocuHeader onMouseDown={startDrag} onMouseUp={endDrag}>
          <div style={{ paddingLeft: "1rem", paddingTop: "10px" }}>
            <LargeText>{title}</LargeText>
          </div>
          <div>
            <EditButton
              onClick={() => {
                if (isEditing) {
                  finishDocuEdit();
                }
                setIsEditing(!isEditing);
              }}
            >
              <EditIcon />
            </EditButton>
            <EditButton
              onClick={() => {
                reduxStore.dispatch(closeNode(node));
              }}
            >
              <XIcon />
            </EditButton>
          </div>
        </DocuHeader>
      ) : null}

      {isEditing ? (
        <NodeColorButtonArea>
          <NodeColorButton
            style={{ background: colorPalette.red7 }}
            onClick={() => {
              setNodeColor(colorPalette.red7);
              reduxStore.dispatch(changeNodeColor(node.id, colorPalette.red7));
            }}
          ></NodeColorButton>
          <NodeColorButton
            style={{ background: colorPalette.yellow5 }}
            onClick={() => {
              setNodeColor(colorPalette.yellow5);
              reduxStore.dispatch(
                changeNodeColor(node.id, colorPalette.yellow5)
              );
            }}
          ></NodeColorButton>
          <NodeColorButton
            style={{ background: colorPalette.green5 }}
            onClick={() => {
              setNodeColor(colorPalette.green5);
              reduxStore.dispatch(
                changeNodeColor(node.id, colorPalette.green5)
              );
            }}
          ></NodeColorButton>
          <NodeColorButton
            style={{ background: colorPalette.blue5 }}
            onClick={() => {
              setNodeColor(colorPalette.blue5);
              reduxStore.dispatch(changeNodeColor(node.id, colorPalette.blue5));
            }}
          ></NodeColorButton>
          <NodeColorButton
            style={{ background: colorPalette.violet5 }}
            onClick={() => {
              setNodeColor(colorPalette.violet5);
              reduxStore.dispatch(
                changeNodeColor(node.id, colorPalette.violet5)
              );
            }}
          ></NodeColorButton>
        </NodeColorButtonArea>
      ) : null}

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
  //  z-index: 100;
  background-color: #ffffff;
  border: 1px solid ${colorPalette.gray3};

  width: 50vw;
  @media (max-width: 768px) {
    width: 90vw;
  }
`;

const DocuHeader = styled.div`
  background-color: ${colorPalette.green0};

  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 5px;
  padding-bottom: 5px;
  display: flex;
  justify-content: space-between;
  cursor: grab;
`;

const DocuHeaderEdited = styled.div`
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 5px;
  padding-bottom: 5px;
  display: flex;
  justify-content: space-between;
`;

const DocuBodyArea = styled.div`
  padding-top: 1rem;
  padding-bottom: 2rem;
  padding-left: 2rem;
  padding-right: 2rem;
`;

export const NodeColorButtonArea = styled.div`
  padding-left: 1rem;
  //padding-right: 15px;
  padding-top: 1rem;
  //padding-bottom: 10px;
`;

export const NodeColorButton = styled.button`
  width: 30px;
  height: 30px;
  border-radius: 15px;
  border: none;
  margin-left: 3px;
  margin-right: 3px;
`;
