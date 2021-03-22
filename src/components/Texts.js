import styled from "styled-components";

import { colorPalette, fontSize, fontWeight } from "../lib/style";

export const LargeText = styled.div`
  all: unset;
  font-weight: ${fontWeight.semibold};
  color: ${colorPalette.gray8};
  font-size: ${fontSize.large};
`;

export const XXXLargeText = styled.div`
  all: unset;
  font-weight: ${fontWeight.heavybold};
  color: ${colorPalette.gray8};
  font-size: ${fontSize.xxlarge};
`;
