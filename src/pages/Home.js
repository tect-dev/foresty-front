import { DefaultButton } from "../components/Buttons";

import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

export const HomePage = () => {
  return (
    <Container className="Home" style={{}}>
      홈 화면 제작중
      <DefaultButton>
        <Link to="/login">Log In</Link>
      </DefaultButton>
    </Container>
  );
};

const Container = styled.div`
  display: grid;
  justify-content: center;
  align-items: center;
  margin-left: auto;
  margin-right: auto;
`;
