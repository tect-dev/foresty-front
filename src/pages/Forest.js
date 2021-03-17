import { TreeCard } from "../components/tree/TreeCard";
import { GridWrapper } from "../wrapper/GridWrapper";

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { readTreeList, createTree } from "../redux/forest";
import styled from "styled-components";

export const ForestPage = ({ match }) => {
  const { userID } = match.params;
  const dispatch = useDispatch();
  const { treeList } = useSelector((state) => {
    return { treeList: state.forest.treeList };
  });
  const { myID, myNickname } = useSelector((state) => {
    return { myID: state.user.myID, myNickname: state.user.myNickname };
  });

  React.useEffect(() => {
    dispatch(readTreeList(userID));
  }, []);
  return (
    <div className="Home">
      <ForestHeader>
        <div>Forest</div>
        <button
          onClick={() => {
            dispatch(createTree(myID, myNickname));
          }}
        >
          새나무 심기
        </button>
      </ForestHeader>
      <ForestGrid>
        {treeList.map((ele, idx) => {
          return (
            <TreeCard
              key={idx}
              treeID={ele.treeID}
              treeTitle={ele.treeTitle}
              thumbnail={ele.thumbnail}
              //createdAt={ele.createdAt}
            ></TreeCard>
          );
        })}
      </ForestGrid>
    </div>
  );
};

const ForestHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-left: 10vw;
  margin-right: 10vw;
`;
const ForestGrid = styled(GridWrapper)`
  margin-left: 10vw;
  margin-right: 10vw;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-gap: 3rem;
  grid-auto-columns: minmax(125px, auto);
  grid-auto-rows: minmax(125px, auto);
  justify-content: "center";
  @media (max-width: 1440) {
    grid-template-columns: 1fr 1fr 1fr;
  }
  @media (max-width: 768) {
    grid-template-columns: 1fr 1fr;
  }
  @media (max-width: 650) {
    grid-template-columns: 1fr;
  }
`;
