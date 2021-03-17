import Done from "../assets/done.svg";
import Edit from "../assets/edit.svg";
import Trash from "../assets/trash.png";
import X from "../assets/xCircle.svg";

import styled from "styled-components";
import { colorPalette, fontSize, fontWeight } from "../lib/style";

export const DoneIcon = () => {
  return <img src={Done} style={{ width: "20px", height: "20px" }} />;
};

export const EditIcon = () => {
  return <img src={Edit} style={{ width: "20px", height: "20px" }} />;
};

export const TrashIcon = () => {
  return <img src={Trash} style={{ width: "20px", height: "20px" }} />;
};

export const XIcon = () => {
  return <img src={X} style={{ width: "20px", height: "20px" }} />;
};

export const DefaultButton = styled.button`
  background-color: ${colorPalette.green5};
  color: #ffffff;
  font-size: ${fontSize.medium};
  font-weight: ${fontWeight.bold};

  padding: 7px;
  text-align: center;

  border: 1px solid ${colorPalette.green5};
  border-radius: 5px;

  margin: 3px;
  cursor: pointer;
  &:hover {
    background: #ffffff;
    color: ${colorPalette.green5};
  }
  transition: all 0.2s ease 0s;
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Old versions of Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none;
`;

export const EditButton = styled.button`
  background-color: #ffffff;
  color: ${colorPalette.green5};
  &:hover {
    background: ${colorPalette.green5};
    color: #ffffff;
  }
  font-size: ${fontSize.medium};
  font-weight: ${fontWeight.bold};

  padding: 7px;
  text-align: center;

  border: 1px solid ${colorPalette.green5};
  border-radius: 5px;

  margin: 3px;
  cursor: pointer;
  transition: all 0.2s ease 0s;
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Old versions of Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none;
`;
