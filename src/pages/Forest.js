import { TreeCard } from "../components/tree/TreeCard";
import { GridWrapper } from "../wrapper/GridWrapper";
import { EditButton, XIcon, DefaultButton } from "../components/Buttons";

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { readTreeList, createTree } from "../redux/forest";
import styled from "styled-components";
import { authService } from "../lib/firebase";
import { useHistory } from "react-router-dom";
import Swal from "sweetalert2";
import { colorPalette } from "../lib/style";
import { deleteTree } from "../redux/forest";

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

  const [isEdit, setIsEdit] = React.useState();

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
        <div>
          <DefaultButton
            onClick={() => {
              dispatch(createTree(myID, myNickname));
            }}
          >
            Create New Canvas
          </DefaultButton>
          <DefaultButton
            onClick={() => {
              setIsEdit(!isEdit);
            }}
            //style={{ background: colorPalette.red3 }}
          >
            {isEdit ? "Done" : "Edit"}
          </DefaultButton>
        </div>
      </ForestHeader>
      <ForestGrid>
        {treeList.map((ele, idx) => {
          const date = new Date(ele.createdAt.seconds * 1000);
          return (
            <div>
              {isEdit ? (
                <EditButton
                  onClick={() => {
                    Swal.fire({
                      title: "Do you want to delete the tree?",
                      text: "You won't be able to revert this!",
                      icon: "warning",
                      confirmButtonColor: "#d33", // "#3085d6",
                      //                    cancelButtonColor: "#d33",
                      confirmButtonText: "Yes, delete it!",
                      showCancelButton: true,
                    }).then((result) => {
                      if (result.isConfirmed) {
                        dispatch(deleteTree(ele.treeID));
                        Swal.fire(
                          "Deleted!",
                          "Tree has been deleted.",
                          "success"
                        );
                      }
                    });
                  }}
                >
                  <XIcon />
                </EditButton>
              ) : null}

              <TreeCard
                key={idx}
                treeID={ele.treeID}
                treeTitle={ele.title}
                thumbnail={ele.thumbnail}
                createdAt={JSON.stringify(date).substr(1, 10)}
              />
            </div>
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
