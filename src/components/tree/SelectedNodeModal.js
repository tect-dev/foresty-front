import { MarkdownRenderer } from "../MarkdownRenderer";
import { MarkdownEditor } from "../MarkdownEditor";
import { DefaultButton, XIcon, EditIcon, DoneIcon } from "../Buttons";
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

  let relativeX;
  let relativeY;

  function handleDragStart(e) {
    relativeX = e.clientX - e.target.getBoundingClientRect().x;
    relativeY = e.clientY - e.target.getBoundingClientRect().y;
  }
  function handleDrag(e) {
    //e.preventDefault();
    // e.target.style.position = "absolute";
    // e.target.style.left = e.clientX - relativeX + "px";
    // e.target.style.top = e.clientY - relativeY + "px";
  }

  function handleDragEnd(e) {
    e.preventDefault();
    e.target.style.position = "absolute";
    const scrolledTopLength = window.pageYOffset;
    e.target.style.left = e.clientX - relativeX + "px";
    e.target.style.top = scrolledTopLength + e.clientY - relativeY + "px";
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

  return (
    <ModalWrapper
      draggable="true"
      onDragStart={handleDragStart}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      onClick={(e) => {
        changeZIndex(e, node);
      }}
      className="nodeModal"
      id={`modal${node.id}`}
      style={{ zIndex: defaultZ }}
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
  display: flex;
  justify-content: space-between;
`;

const DocuBodyArea = styled.div`
  padding: 2rem;
`;

export const NodeColorButtonArea = styled.div`
  padding-left: 15px;
  padding-right: 15px;
  padding-bottom: 10px;
`;

export const NodeColorButton = styled.button`
  width: 30px;
  height: 30px;
  border-radius: 15px;
  border: none;
  margin-left: 3px;
  margin-right: 3px;
`;
