import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { colorPalette, fontWeight } from "../lib/style";

export const Footer = React.memo(() => {
  return (
    <StyledFooter>
      <Copyright>Foresty © 2021</Copyright>
      <StyledUL>
        <StyledLI>
          <Link to="/contact">Contact</Link>
        </StyledLI>
        <StyledLI>
          <Link to="/faq">FAQ</Link>
        </StyledLI>

        {/*
        
        
        <StyledLI>
          <Link to="/">Github(</Link>
        </StyledLI>*/}
      </StyledUL>
    </StyledFooter>
  );
});

const StyledFooter = styled.footer`
  padding: 20px 0;
  background-color: ${colorPalette.gray0};
  color: ${colorPalette.gray8};
`;

const StyledUL = styled.ul`
  display: inline;
  padding: 0;
  list-style: none;
  text-align: center;
  font-size: 18px;
  line-height: 1.6;
  margin-bottom: 0;
`;

const StyledLI = styled.li`
  padding: 0 10px;
  font-weight: ${fontWeight.semibold};
  opacity: 0.8;
  :hover {
    opacity: 1;
  }
`;

const Copyright = styled.p`
  margin-top: 15px;
  text-align: center;
  font-size: 13px;
  color: #aaa;
  margin-bottom: 0;
`;
