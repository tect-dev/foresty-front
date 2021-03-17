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
        <div style={{ display: "flex" }}>
          <div>
            <Link to="/">
              <img src={MainLogo} style={{ height: "60px" }} />
            </Link>
          </div>
          <div>
            <Link to={`/forest/${myID}`}>My Forest</Link>
          </div>
        </div>
        <div>account</div>
      </NavContainer>
    </header>
  );
});

const NavContainer = styled.div`
  align-items: "center";
  @media (max-width: 768px) {
    padding-left: 5vw;
    padding-right: 5vw;
  }
`;
