import "@github/task-lists-element";

import React from "react";
import styled from "styled-components";

export const BlockEditor = React.memo(() => {
  const [textBlockList, setTextBlockList] = React.useState([
    "첫번째",
    "두번째",
  ]);

  return (
    <>
      <task-lists sortable>
        <ul class="contains-task-list">
          {textBlockList.map((blockText) => {
            return (
              <StyledList
                class="task-list-item"
                contentEditable
                onChange={(e) => {
                  console.log("value: ", e.target.value);
                }}
              >
                {blockText}
              </StyledList>
            );
          })}
        </ul>
        <ul class="contains-task-list">
          <li class="task-list-item" contentEditable>
            <input type="checkbox" class="task-list-item-checkbox" />
            Hubot
          </li>
          <li class="task-list-item" contentEditable>
            <input type="checkbox" class="task-list-item-checkbox" />
            Bender
          </li>
        </ul>

        <ul class="contains-task-list" contentEditable>
          <li class="task-list-item">BB-8</li>
          <li class="task-list-item">WALL-E</li>
        </ul>
      </task-lists>
    </>
  );
});

const StyledList = styled.li`
  //all: unset;
  :focus {
    //    all: unset;
  }
`;
