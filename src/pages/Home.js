import { DefaultButton } from "../components/Buttons";
import { XXXLargeText } from "../components/Texts";

import { TreePage } from "./Tree";

import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { colorPalette } from "../lib/style";
import { useSelector } from "react-redux";

export const HomePage = () => {
  const containerRef = React.useRef(null);
  const headerRef = React.useRef(null);
  const loginCheck = localStorage.getItem("user");
  const { loginState, myID } = useSelector((state) => {
    return { loginState: state.user.loginState, myID: state.user.myID };
  });
  return (
    <MainWrapper className="Home" style={{}}>
      <BlockWrapper>
        <XXXLargeText>Cultivate Your Knowledge</XXXLargeText>
        <br />
        <div>Only Click and Drag For Organize think</div>
        <br />
        <div>
          <DefaultButton>
            {!loginCheck ? (
              <Link to="/login">Get Started</Link>
            ) : (
              <Link to={`/forest/${myID}`}>Get Started</Link>
            )}
          </DefaultButton>
        </div>
      </BlockWrapper>

      <BlockWrapper>
        <VideoWrapper
          src="https://foresty-tutorial.s3.ap-northeast-2.amazonaws.com/tuto.mp4"
          autoPlay={true}
          playsInline={true}
          muted={true}
          loop={true}
        ></VideoWrapper>
      </BlockWrapper>
    </MainWrapper>
  );
};

const MainWrapper = styled.div`
  display: grid;
  justify-content: center;
  align-items: center;
  margin-left: auto;
  margin-right: auto;
  grid-template-columns: 1fr;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const BlockWrapper = styled.div`
  padding: 3rem;
  text-align: center;
`;

const VideoWrapper = styled.video`
  width: 100%;
  border: 1px solid ${colorPalette.gray2};
  border-radius: 5px;
`;
