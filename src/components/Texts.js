import styled from "styled-components";

import { colorPalette, fontSize } from "../lib/style";

export const LargeText = styled.div`
  all: unset;
  font-weight: bold;
  color: ${colorPalette.gray8};
  font-size: ${fontSize.large};
`;
