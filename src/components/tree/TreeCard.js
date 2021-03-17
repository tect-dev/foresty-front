import React from "react";
import { Link } from "react-router-dom";
//import { StyledTitle } from './TitleInput'
import {
  colorPalette,
  boxShadow,
  hoverAction,
  fontSize,
} from "../../lib/style";
//import { isoStringToNaturalLanguage } from '../lib/functions'
import styled from "styled-components";

export const TreeCard = React.memo(function ({
  treeID,
  treeTitle,
  createdAt,
  thumbnail,
}) {
  return (
    <TechtreeThumbnailCard>
      <Link to={`/tree/${treeID}`}>
        <TechtreeThumbnailBlock>
          <TechtreeThumbnailImage src={thumbnail} alt="treeThumbnail" />
        </TechtreeThumbnailBlock>
        <ThumbnailBottomLine />
        <TreeInfoArea>
          <TreeThumbnailHeader>
            <div style={{ fontSize: fontSize.medium }}>{treeTitle}</div>
          </TreeThumbnailHeader>
          <TreeThumbnailFooter>{createdAt}</TreeThumbnailFooter>
        </TreeInfoArea>
      </Link>
    </TechtreeThumbnailCard>
  );
});

export const TechtreeThumbnailBlock = styled.div`
  padding: 5px;
`;
export const ThumbnailBottomLine = styled.div`
  width: 90%;
  height: 0.5px;
  margin-left: 5px;
  margin-bottom: 5px;
  background: ${colorPalette.gray3};
  border-radius: 1px;
`;

export const TechtreeThumbnailImage = styled.img`
  width: 250px;
  height: 250px;
  //height: 250px;
  object-fit: fill;
  border-radius: 3px;
`;

export const TreeInfoArea = styled.div`
  padding-left: 1rem;
  padding-right: 1rem;
  padding-bottom: 1rem;
`;

export const TreeThumbnailHeader = styled.div`
  padding-top: 1rem;
  padding-bottom: 1rem;
`;

export const TreeThumbnailFooter = styled.div`
  text-align: center;
  font-size: ${fontSize.xsmall};
  color: ${colorPalette.gray7};
`;

export const TechtreeInfo = styled.div`
  padding: 0.625rem 1rem;
  border-top: 1px solid ${colorPalette.gray0};
  border-bottom: 1px solid ${colorPalette.gray0};
  display: flex;
  font-size: 0.75rem;
  line-height: 1.5;
  justify-content: space-between;
`;

export const TechtreeThumbnailCard = styled.div`
  border-radius: 3px;
  grid-row-start: span 1;
  grid-column-start: span 1;
  display: grid;
  width: 100%;
  height: 100%auto;
  justify-items: center;
  justify-content: center;
  border: 1px solid ${colorPalette.gray3};
  transition: 0.25s box-shadow ease-in, 0.25s transform ease-in;
  box-shadow: ${boxShadow.default};
  background-color: #ffffff;
  &:hover {
    ${hoverAction}
  }
`;
