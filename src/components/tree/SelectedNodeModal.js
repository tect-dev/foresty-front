import React from "react";
import styled from "styled-components";
import { reduxStore } from "../../index";
import { closeNode } from "../../redux/tree";
import { colorPalette } from "../../lib/style";

export const SelectedNodeModal = React.memo(({ node }) => {
  const [text, setText] = React.useState("");
  const [isEditing, setIsEditing] = React.useState(false);

  let relativeX;
  let relativeY;

  function handleDragStart(e) {
    relativeX = e.clientX - e.target.getBoundingClientRect().x;
    relativeY = e.clientY - e.target.getBoundingClientRect().y;
  }
  function handleDrag(e) {
    e.preventDefault();
    console.log(e.clientX);
    //const modalDOM = document.getElementById(node.id);
    const rect = e.target.getBoundingClientRect();
    console.log("getBounding: ", rect);
    e.target.style.position = "absolute";
    //const offsetLeft = e.target.style.left;
    const offsetTop = e.target.style.top;
    e.target.style.left = e.clientX - relativeX + "px";
    e.target.style.top = e.clientY - relativeY + "px";
  }

  function handleDragEnd(e) {
    e.preventDefault();
    console.log("drag end: ", e.clientX);

    //const modalDOM = document.getElementById(node.id);
    e.target.style.position = "absolute";
    const rect = e.target.getBoundingClientRect();
    e.target.style.left = e.clientX - relativeX + "px";
    e.target.style.top = e.clientY - relativeY + "px";
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
      </div>
    </ModalWrapper>
  );
});

const ModalWrapper = styled.div`
  position: absolute;
  z-index: 1000;
  background-color: #ffffff;
  border: 1px solid ${colorPalette.gray3};
  width: 50vw;
  @media (max-width: 768px) {
    width: 90vw;
  }
`;
