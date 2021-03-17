import MainLogo from "../assets/MainLogo.png";

import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { useSelector } from "react-redux";

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
          <div>
            {myID !== null ? <Link to={`/forest/${myID}`}>My Forest</Link> : ""}
          </div>
        </div>
        <div>
          {myID !== null ? (
            <Link to={`/forest/${myID}`}>Account!</Link>
          ) : (
            <Link to={`/login`}>Account</Link>
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
