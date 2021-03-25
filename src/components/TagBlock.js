import styled from "styled-components";
import { colorPalette, fontWeight } from "../lib/style";

export const StyledTagBlock = styled.div`
  border-radius: 5px;
  //background: ${colorPalette.mainGreen};
  font-weight: ${fontWeight.bold};
  color: #fafafa;
  padding-bottom: 3px;
  padding-top: 3px;
  padding-left: 5px;
  padding-right: 5px;
  margin: 2px;
  width: inherit;
  opacity: 0.9;
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Old versions of Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none;
  //&:hover {
  //  background: ${colorPalette.mainGreen};
  //  color: #ffffff;
  //  transition: all ease-in 0.2s;
  //  opacity: 1;
  //  cursor: pointer;
  //}
`;
