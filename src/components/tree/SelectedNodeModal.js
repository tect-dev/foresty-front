import { MarkdownRenderer } from "../MarkdownRenderer";
import { MarkdownEditor } from "../MarkdownEditor";
import { EditButton, XIcon, EditIcon, DoneIcon } from "../Buttons";
import { LargeTextInput } from "../Inputs";
import { LargeText } from "../Texts";
import { BlockEditor } from "../BlockEditor";

import React from "react";
import styled from "styled-components";
import { reduxStore } from "../../index";
import { closeNode, updateDocu, changeNodeColor } from "../../redux/tree";
import { colorPalette } from "../../lib/style";
import _ from "lodash";
//import { changeZIndex } from "../../lib/functions";

export const SelectedNodeModal = React.memo(({ defaultZ, node }) => {
  const [title, setTitle] = React.useState(node.name);
  const [text, setText] = React.useState(node.body);
  const [nodeColor, setNodeColor] = React.useState(node.fillColor);
  const [isEditing, setIsEditing] = React.useState(false);

  React.useEffect(() => {
    const modalID = `domInModal${node.id}`;
    document.addEventListener("mousemove", function (e) {
      // 이거 쓰로틀링을 주고 싶은데 lodash 쓰로틀링은 제대로 작동을 안하네
      if (onDrag) {
        const modal = document.getElementById(modalID);
        const scrolledLeftLength = window.pageXOffset;
        const scrolledTopLength = window.pageYOffset;
        modal.style.left = e.clientX - relativeX + scrolledLeftLength + "px";
        modal.style.top = e.clientY - relativeY + scrolledTopLength + "px";
      }
    });
    document.addEventListener("mouseup", () => {
      onDrag = false;
      relativeX = 0;
      relativeY = 0;
    });
  }, [isEditing, title, text]);

  const modalID = `domInModal${node.id}`;
  let onDrag; // = false
  let relativeX;
  let relativeY;

  const colorList = [
    colorPalette.red7,
    colorPalette.yellow5,
    colorPalette.green5,
    colorPalette.blue5,
    colorPalette.violet5,
  ];

  const finishDocuEdit = React.useCallback(() => {
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
  }, [node, title, text, nodeColor]);

  function startDrag(e) {
    //modal.style.width = e.target.offsetWidth * 2 + "px";
    if (e.target.tagName === "DIV") {
      onDrag = true;

      relativeX = e.clientX - e.target.getBoundingClientRect().x;
      relativeY = e.clientY - e.target.getBoundingClientRect().y;
    }
  }

  function isDragging(e) {
    if (onDrag) {
      const modal = document.getElementById(modalID);
      const scrolledLeftLength = window.pageXOffset;
      const scrolledTopLength = window.pageYOffset;
      modal.style.left = e.clientX - relativeX + scrolledLeftLength + "px";
      modal.style.top = e.clientY - relativeY + scrolledTopLength + "px";
    }
  }

  function endDrag(e) {
    onDrag = false;
    relativeX = 0;
    relativeY = 0;
  }

  function changeZIndex(e, node) {
    if (e.target) {
      const modalList = document.getElementsByClassName("nodeModal");
      const zIndexList = Array.from(modalList).map((ele) => {
        return ele.style.zIndex;
      });
      const max = Math.max(...zIndexList);
      const modalDOM = document.getElementById(modalID);

      if (modalDOM) {
        modalDOM.style.zIndex = max + 2;
      }
    }
  }

  return (
    <ModalWrapper
      onMouseDown={(e) => {
        changeZIndex(e, node);
      }}
      //  onMouseMove={isDragging}
      //onMouseUp={endDrag}
      //onDrag={isDragging}
      id={modalID}
      className="nodeModal"
      style={{
        zIndex: defaultZ,
        top:
          window.pageYOffset +
          document.getElementsByClassName(node.id)[0].getBoundingClientRect()
            .y +
          30 +
          "px",
        left:
          window.pageXOffset +
          document.getElementsByClassName(node.id)[0].getBoundingClientRect()
            .x -
          30 +
          "px",
      }}
    >
      <DocuHeaderArea onMouseDown={startDrag}>
        {isEditing ? (
          <DocuHeaderEdited>
            <div style={{ paddingLeft: "1rem", paddingTop: "10px" }}>
              <LargeTextInput
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
                placeholder="title..."
                maxLength={50}
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
          <DocuHeader>
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
            {colorList.map((color) => {
              return (
                <NodeColorButton
                  style={{ background: color }}
                  onClick={() => {
                    setNodeColor(color);
                    reduxStore.dispatch(changeNodeColor(node.id, color));
                  }}
                ></NodeColorButton>
              );
            })}
          </NodeColorButtonArea>
        ) : null}
      </DocuHeaderArea>
      <DocuBodyArea>
        {isEditing ? (
          <>
            <MarkdownEditor bindingText={text} bindingSetter={setText} />
            <br />
            <LargeText>Preview</LargeText>
          </>
        ) : null}

        <MarkdownRenderer text={text} />
      </DocuBodyArea>
    </ModalWrapper>
  );
});

const ResizeArea = styled.div`
  background-color: #999999;
  padding: 23px;
`;

const ModalWrapper = styled.div`
  //left: 50px; // + ${window.pageXOffset};;

  position: absolute;
  //position: fixed;
  //position: static;
  //position: relative;
  //z-index: 100;
  background-color: #ffffff;
  border: 1px solid ${colorPalette.gray3};

  width: 650px;

  height: 90vh;
  resize: both;
  overflow: scroll;
  @media (max-width: 768px) {
    width: 90vw;
  }
`;

const DocuHeaderArea = styled.div`
  background-color: #ffffff;
  position: sticky;
  position: -webkit-sticky;
  top: 0px;
  z-index: 1;
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
  background-color: #ffffff;
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 5px;
  padding-bottom: 5px;
  display: flex;
  justify-content: space-between;
  cursor: grab;
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
