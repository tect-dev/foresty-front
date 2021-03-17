import { TreeCard } from "../components/tree/TreeCard";
import { GridWrapper } from "../wrapper/GridWrapper";
import { DefaultButton } from "../components/Buttons";

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { readTreeList, createTree } from "../redux/forest";
import styled from "styled-components";
import { authService } from "../lib/firebase";
import { useHistory } from "react-router-dom";
import Swal from "sweetalert2";

export const ForestPage = ({ match }) => {
  const { userID } = match.params;
  const dispatch = useDispatch();
  const history = useHistory();
  const { treeList } = useSelector((state) => {
    return { treeList: state.forest.treeList };
  });
  const { myID, myNickname } = useSelector((state) => {
    return { myID: state.user.myID, myNickname: state.user.myNickname };
  });

  React.useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        dispatch(readTreeList(userID));
      } else {
        Swal.fire("Login Required!");
        history.push("/login");
      }
    });
  }, []);
  return (
    <div style={{ paddingTop: "2rem", paddingBottom: "2rem" }}>
      <ForestHeader>
        <div></div>
        <DefaultButton
          onClick={() => {
            dispatch(createTree(myID, myNickname));
          }}
        >
          Plant New Tree
        </DefaultButton>
      </ForestHeader>
      <ForestGrid>
        {treeList.map((ele, idx) => {
          //console.log(ele.createdAt);
          const date = new Date(ele.createdAt.seconds * 1000);
          return (
            <TreeCard
              key={idx}
              treeID={ele.treeID}
              treeTitle={ele.title}
              thumbnail={ele.thumbnail}
              createdAt={JSON.stringify(date).substr(1, 10)}
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
  padding-top: 1rem;
  padding-bottom: 1rem;
`;
