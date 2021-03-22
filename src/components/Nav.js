import MainLogo from "../assets/MainLogo.png";
import Loader from "react-loader-spinner";

import React from "react";
import { Link, useHistory } from "react-router-dom";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { colorPalette, fontSize, fontWeight } from "../lib/style";
import { logout } from "../redux/user";

export const Nav = React.memo(() => {
  const { myID, loginState } = useSelector((state) => {
    return { myID: state.user.myID, loginState: state.user.loginState };
  });
  const { treeLoading } = useSelector((state) => {
    return { treeLoading: state.tree.loading };
  });
  const { forestLoading } = useSelector((state) => {
    return { forestLoading: state.forest.loading };
  });
  const loginCheck = localStorage.getItem("user");
  const dispatch = useDispatch();
  const history = useHistory();
  return (
    <header>
      <NavContainer
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingLeft: "10vw",
          paddingRight: "10vw",
          paddingBottom: "10px",
          paddingTop: "10px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
          <div>
            <Link to="/">
              <img src={MainLogo} style={{ height: "60px" }} />
            </Link>
          </div>
          <MyForest>
            {loginCheck ? <Link to={`/forest/${myID}`}>My Forest</Link> : ""}
          </MyForest>
          {treeLoading || forestLoading ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                color: colorPalette.gray4,
              }}
            >
              <Loader
                type="ThreeDots"
                color={colorPalette.gray4}
                height={20}
                width={20}
                //timeout={3000} //3 secs
              />
              Sync...
            </div>
          ) : null}
        </div>
        <div>
          {loginState ? (
            <Dropdown class="dropdown" style={{ display: "inline-block" }}>
              <MyForest>Account</MyForest>
              <div
                onClick={() => {
                  history.push("/");
                  dispatch(logout());
                }}
                class="dropdown-content"
              >
                Log Out
              </div>
            </Dropdown>
          ) : (
            <MyForest>
              <Link to={`/login`}>Account</Link>
            </MyForest>
          )}
        </div>
      </NavContainer>
    </header>
  );
});
// 로그인 상태에선 account 에 마우스 올리면 메뉴가 드롭다운돼서 billing, log out 이런게 뜨게끔.
const NavContainer = styled.div`
  align-items: "center";
  @media (max-width: 768px) {
    padding-left: 5vw;
    padding-right: 5vw;
  }
`;

const MyForest = styled.div`
  font-size: ${fontSize.medium};
  font-weight: ${fontWeight.bold};
  cursor: pointer;
  &:hover {
    color: ${colorPalette.green7};
  }
`;
export const Dropdown = styled.div`
  cursor: pointer;
  .dropdown-content {
    display: none;
    position: absolute;
    //min-width: 160px;
    //box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
    z-index: 1;
  }
  &:hover {
    .dropdown-content {
      display: block;
      padding-top: 10px;
      &:hover {
        color: ${colorPalette.green5};
      }
    }
  }
`;

const Spinner = styled.div`
  @keyframes ldio-hvizk4z8xch {
    0% {
      transform: rotate(0deg);
    }
    50% {
      transform: rotate(180deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  .ldio-hvizk4z8xch div {
    position: absolute;
    animation: ldio-hvizk4z8xch 1s linear infinite;
    width: 116px;
    height: 116px;
    top: 42px;
    left: 42px;
    border-radius: 50%;
    box-shadow: 0 6.6000000000000005px 0 0 #e15b64;
    transform-origin: 58px 61.3px;
  }

  width: 200px;
  height: 200px;
  display: inline-block;
  overflow: hidden;
  background: #ffffff;

  .ldio-hvizk4z8xch {
    width: 100%;
    height: 100%;
    position: relative;
    transform: translateZ(0) scale(1);
    backface-visibility: hidden;
    transform-origin: 0 0; /* see note above */
  }
  .ldio-hvizk4z8xch div {
    box-sizing: content-box;
  }
`;
