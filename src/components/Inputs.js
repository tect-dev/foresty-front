import styled from "styled-components";

import { colorPalette, fontSize } from "../lib/style";

export const LargeTextInput = styled.input`
  all: unset;
  font-weight: bold;
  color: ${colorPalette.gray8};

  padding-bottom: 10px;
  //size: 560;
  width: 100%;
  font-size: ${fontSize.large};
  &::placeholder {
    color: ${colorPalette.gray5};
  }
  border-bottom: 1px solid ${colorPalette.gray2};
`;
