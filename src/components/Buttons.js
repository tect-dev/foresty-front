import Done from "../assets/done.svg";
import Edit from "../assets/edit.svg";
import Trash from "../assets/trash.png";
import X from "../assets/xCircle.svg";

import styled from "styled-components";
import { colorPalette } from "../lib/style";

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
  background-color: #ffffff;
  padding: 3px;
  margin: 3px;
  cursor: pointer;
  &:hover {
    background: ${colorPalette.green0};
    color: white;
  }
`;
