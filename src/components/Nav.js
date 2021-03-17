import MainLogo from "../assets/MainLogo.png";

import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { colorPalette, fontSize, fontWeight } from "../lib/style";

export const Nav = React.memo(() => {
  const { myID } = useSelector((state) => {
    return { myID: state.user.myID };
  });
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
        <div style={{ display: "flex", alignItems: "center" }}>
          <div>
            <Link to="/">
              <img src={MainLogo} style={{ height: "60px" }} />
            </Link>
          </div>
          <MyForest
            style={{
              marginLeft: "2rem",
            }}
          >
            {myID !== null ? <Link to={`/forest/${myID}`}>My Forest</Link> : ""}
          </MyForest>
        </div>
        <div>
          {myID !== null ? (
            <Dropdown class="dropdown" style={{ display: "inline-block" }}>
              <MyForest>Account</MyForest>
              <div
                class="dropdown-content"
                style={{
                  display: "none",
                  position: "absolute",
                  minWidth: "160px",
                  boxShadow: "0px 8px 16px 0px rgba(0,0,0,0.2)",
                  zIndex: "1",
                }}
              >
                <a href="#">Log Out</a>
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
  div:hover {
    .dropdown-content {
      display: block;
    }
  }
`;
