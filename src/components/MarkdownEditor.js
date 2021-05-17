import React, { useRef, useCallback, useState } from "react";
import { fontSize } from "../lib/style";
import styled from "styled-components";
import {
  FaBold,
  FaItalic,
  FaLink,
  FaCode,
  FaSuperscript,
  FaHeading,
} from "react-icons/fa";
import RagePower from "../lib/powerMode";
import ReactTooltip from "react-tooltip";

import axios from "axios";

export const MarkdownEditor = ({
  bindingText,
  bindingSetter,
  width,
  height,
}) => {
  //const [localText, setLocalText] = useState(bindingText)
  const [loading, setLoading] = useState(false);
  const textareaRef = useRef();

  const onChangeText = useCallback(
    (e) => {
      // e.target.value 에서 \n을 <br /> 으로 치환한뒤 이걸 넣어주자.

      //  setLocalText(e.target.value)
      bindingSetter(e.target.value);
    },
    [bindingSetter]
  );

  const onDrop = useCallback(
    async (e) => {
      e.preventDefault();
      // 여러 이미지를 드래그해도 하나만 선택
      const file = e?.dataTransfer?.files[0];
      // input attribute로 accept="image/*"를 지정하지
      // 않았기 때문에 여기서 image만 access 가능하게 처리
      const value = textareaRef.current.value;
      const selectionStart = textareaRef.current.selectionStart;
      const selectionEnd = textareaRef.current.selectionEnd;
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        let formData = new FormData();
        formData.append("image", file);
        await setLoading(true);
        const res = await axios({
          url: `${process.env.REACT_APP_BACKEND_URL}/image`,
          method: "POST",
          data: formData,
        });
        const imageUrl = res.data;
        const result = `${value.substring(0, selectionStart)}![${
          file.name
        }](${imageUrl})${value.substring(selectionEnd)}`;

        bindingSetter(result);
      } else {
      }
    },
    [bindingSetter]
  );

  const addCodeBlock = useCallback(
    (e) => {
      e.preventDefault();

      const value = textareaRef.current.value;
      const selectionStart = textareaRef.current.selectionStart;
      const selectionEnd = textareaRef.current.selectionEnd;
      const newText = `${value.substring(
        0,
        selectionStart
      )}\n\`\`\`c\nint main () {\n  printf('hello world!');\n  return 0;\n}\n\`\`\`\n${value.substring(
        selectionEnd
      )}`;

      //setLocalText(newText)
      bindingSetter(newText);
      if (textareaRef.current) {
        textareaRef.current.value = newText;
        textareaRef.current.selectionStart = selectionStart + 2;
        textareaRef.current.selectionEnd = selectionStart + 2;
      }
    },
    [bindingSetter]
  );

  const addMathBlock = useCallback(
    (e) => {
      e.preventDefault();

      const value = textareaRef.current.value;
      const selectionStart = textareaRef.current.selectionStart;
      const selectionEnd = textareaRef.current.selectionEnd;
      const newText = `${value.substring(
        0,
        selectionStart
      )}\n$$-\\frac{\\hbar^{2}}{2m} \\nabla^{2} \\psi + V \\psi = E \\psi$$\n${value.substring(
        selectionEnd
      )}`;

      //setLocalText(newText)
      bindingSetter(newText);
      if (textareaRef.current) {
        textareaRef.current.value = newText;
        textareaRef.current.selectionStart = selectionStart + 2;
        textareaRef.current.selectionEnd = selectionStart + 2;
      }
    },
    [bindingSetter]
  );

  const addBoldText = useCallback(
    (e) => {
      e.preventDefault();

      const value = textareaRef.current.value;
      const selectionStart = textareaRef.current.selectionStart;
      const selectionEnd = textareaRef.current.selectionEnd;
      const newText = `${value.substring(
        0,
        selectionStart
      )}**Bold Text**${value.substring(selectionEnd)}`;
      // setLocalText(newText)
      bindingSetter(newText);
      if (textareaRef.current) {
        textareaRef.current.value = newText;
        textareaRef.current.selectionStart = selectionStart + 2;
        textareaRef.current.selectionEnd = selectionStart + 2;
      }
    },
    [bindingSetter]
  );

  const addItalicText = useCallback(
    (e) => {
      e.preventDefault();

      const value = textareaRef.current.value;
      const selectionStart = textareaRef.current.selectionStart;
      const selectionEnd = textareaRef.current.selectionEnd;
      const newText = `${value.substring(
        0,
        selectionStart
      )}*Italic Text*${value.substring(selectionEnd)}`;

      //  setLocalText(newText)
      bindingSetter(newText);
      if (textareaRef.current) {
        textareaRef.current.value = newText;
        textareaRef.current.selectionStart = selectionStart + 2;
        textareaRef.current.selectionEnd = selectionStart + 2;
      }
    },
    [bindingSetter]
  );

  const addLargeTitle = useCallback(
    (e) => {
      e.preventDefault();
      const value = textareaRef.current.value;
      const selectionStart = textareaRef.current.selectionStart;
      const selectionEnd = textareaRef.current.selectionEnd;
      const newText = `${value.substring(
        0,
        selectionStart
      )}## Large Title${value.substring(selectionEnd)}`;
      // setLocalText(newText)
      bindingSetter(newText);
      if (textareaRef.current) {
        textareaRef.current.value = newText;
        textareaRef.current.selectionStart = selectionStart + 2;
        textareaRef.current.selectionEnd = selectionStart + 2;
      }
    },
    [bindingSetter]
  );

  const addLink = useCallback(
    (e) => {
      e.preventDefault();
      const value = textareaRef.current.value;
      const selectionStart = textareaRef.current.selectionStart;
      const selectionEnd = textareaRef.current.selectionEnd;
      const newText =
        value.substring(0, selectionStart) +
        "[Foresty external link!](https://www.foresty.net)" +
        value.substring(selectionEnd);

      // setLocalText(newText)
      bindingSetter(newText);
      if (textareaRef.current) {
        textareaRef.current.value = newText;
        textareaRef.current.selectionStart = selectionStart + 2;
        textareaRef.current.selectionEnd = selectionStart + 2;
      }
    },
    [bindingSetter]
  );

  const onKeydownTap = (e) => {
    //e.preventDefault()
    if (e.keyCode === 9) {
      e.preventDefault();
      //const tab = '\t'
      const value = e.target.value;
      const selectionStart = e.target.selectionStart;
      const selectionEnd = e.target.selectionEnd;
      const newText =
        value.substring(0, selectionStart) +
        "  " +
        value.substring(selectionEnd);

      //setLocalText(newText)
      bindingSetter(newText);
      if (textareaRef.current) {
        textareaRef.current.value = newText;
        textareaRef.current.selectionStart = selectionStart + 2;
        textareaRef.current.selectionEnd = selectionStart + 2;
      }
    }
  };

  return (
    <div>
      <MarkdownToolkit>
        <MarkdownButton
          onClick={addCodeBlock}
          data-tip="add code block"
          title="add code block"
        >
          <FaCode />
        </MarkdownButton>
        <ReactTooltip effect="solid" />
        <MarkdownButton
          onClick={addMathBlock}
          data-tip="add LaTeX block"
          title="add LaTeX"
        >
          <FaSuperscript />
        </MarkdownButton>
        <ReactTooltip effect="solid" />
        <MarkdownButton
          onClick={addBoldText}
          data-tip="add bold text"
          title="add bold text"
        >
          <FaBold />
        </MarkdownButton>
        <ReactTooltip effect="solid" />
        <MarkdownButton
          onClick={addLargeTitle}
          data-tip="add large text"
          title="add large title"
        >
          <FaHeading />
        </MarkdownButton>
        <ReactTooltip effect="solid" />
        <MarkdownButton
          onClick={addItalicText}
          data-tip="add italic text"
          title="add italic text"
        >
          <FaItalic />
        </MarkdownButton>
        <ReactTooltip effect="solid" />
        <MarkdownButton
          onClick={addLink}
          data-tip="add external link"
          title="add external link"
        >
          <FaLink />
        </MarkdownButton>
        <ReactTooltip effect="solid" />
      </MarkdownToolkit>
      <div>
        <RagePower>
          <StyledTextarea
            ref={textareaRef}
            id="content"
            placeholder="..."
            value={bindingText}
            onChange={onChangeText}
            maxLength={10000}
            onDrop={onDrop}
            style={{
              width: width,
              height: height,
              backgroundColor: () => {
                if (loading) {
                  return "#999999";
                } else {
                  return "#000000";
                }
              },
            }}
            onKeyDown={onKeydownTap}
          ></StyledTextarea>
        </RagePower>
      </div>
    </div>
  );
};

MarkdownEditor.defaultProps = {
  width: "100%",
  height: "400px",
};

export default React.memo(MarkdownEditor);

const MarkdownToolkit = styled.div`
  margin-bottom: 10px;
  position: sticky;
  position: -webkit-sticky;
  top: 0px;
  z-index: 1;
`;
const MarkdownButton = styled.button`
  border-radius: 3px;
  display: inline-flex;
  padding: 8px 10px;

  color: "#ffffff";
  background-color: transparent;
  outline: 0;
  cursor: pointer;
  border: none;
  justify-content: space-around;
  //font-family: Arial, sans-serif;
`;

const StyledTextarea = styled.textarea`
  font-family: "inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto",
    "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
    sans-serif;
  border: none;
  box-sizing: border-box;
  font-size: ${fontSize.medium};
  width: 100%;
  font-family: inherit;
  //resize: none;
  //padding: 10px;
  background-color: transparent;
  //background-color: #f8f9fa !important;
  &:active {
    border: none;
  }
  &:focus {
    outline: none;
  }
  &:hover {
    border: none;
  }
`;
