import MainLogo from "../assets/MainLogo.png";

import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

export const Nav = React.memo(() => {
  return (
    <header>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ display: "flex" }}>
          <div>
            <Link to="/">
              <img src={MainLogo} style={{ height: "60px" }} />
            </Link>
          </div>
          <div>
            <Link to="/forest">My Forest</Link>
          </div>
        </div>
        <div>account</div>
      </div>
    </header>
  );
});
