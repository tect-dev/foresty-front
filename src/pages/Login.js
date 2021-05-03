import MainIcon from "../assets/MainIcon.png";
import { LargeTextInput } from "../components/Inputs";
import { DefaultButton } from "../components/Buttons";
import Loader from "react-loader-spinner";
import { StyledTagBlock } from "../components/TagBlock";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, signUp, sendSignUpVerificationEmail } from "../redux/user";
import { boxShadow, colorPalette } from "../lib/style";
import styled from "styled-components";
import { useHistory } from "react-router";
import { authService } from "../lib/firebase";
import Swal from "sweetalert2";

export const LoginPage = React.memo(() => {
  const history = useHistory();
  const dispatch = useDispatch();
  // 6~20자리. 최소 하나이상의 숫자 또는 특수문자를 포함해야함.
  const passwordRegex = /^(?=.*[a-zA-Z])((?=.*\d)|(?=.*\W)).{6,20}$/;

  const [isSignUp, setIsSignUp] = React.useState(false);
  const { loading, error, myID, verificationCode } = useSelector((state) => {
    return {
      loading: state.user.loading,
      error: state.user.error,
      myID: state.user.myID,
      verificationCode: state.user.verificationCode,
    };
  });

  React.useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        Swal.fire("Logged In!");
        history.push(`/`);
      } else {
      }
    });
  }, []);

  const [email, setEmail] = React.useState();
  const [password, setPassword] = React.useState("");
  const [checkPassword, setCheckPassword] = React.useState("");
  const [signUpCheck, setSignUpCheck] = React.useState(false);
  const [verificationCheck, setVerificationCheck] = React.useState(false);

  return (
    <>
      {isSignUp ? (
        <Container>
          <div style={{ textAlign: "center" }}>
            <img src={MainIcon} alt="sprout-icon" width="20%" />
          </div>

          <div>
            <FormInput
              value={email}
              type="email"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              style={{ imeMode: "disabled" }}
              placeholder="yours@example.com"
              disabled={loading}
            />
          </div>
          <div>
            <FormInput
              value={password}
              type="password"
              onChange={(e) => {
                setPassword(e.target.value);
                if (
                  e.target.value.length > 5 &&
                  e.target.value.length < 31 &&
                  e.target.value === checkPassword
                ) {
                  setSignUpCheck(true);
                } else {
                  setSignUpCheck(false);
                }
              }}
              style={{ imeMode: "disabled" }}
              placeholder="password (6 to 30 characters)"
              disabled={loading}
            />
          </div>
          <div>
            <FormInput
              value={checkPassword}
              type="password"
              onChange={(e) => {
                setCheckPassword(e.target.value);
                if (
                  password.length > 5 &&
                  password.length < 31 &&
                  e.target.value === password
                ) {
                  setSignUpCheck(true);
                } else {
                  setSignUpCheck(false);
                }
              }}
              style={{ imeMode: "disabled" }}
              placeholder="password check"
              disabled={loading}
            />
          </div>

          {/*
          //이메일 인증 관련 코드
           <div>
            <FormInput
              placeholder="email verification code"
              onChange={(e) => {
                if (e.target.value === verificationCode) {
                  setVerificationCheck(true);
                } else {
                  setVerificationCheck(false);
                }
              }}
            />
          </div>
          <ButtonArea>
            {verificationCheck ? (
              <StyledTagBlock style={{ backgroundColor: colorPalette.blue5 }}>
                Verification OK!
              </StyledTagBlock>
            ) : (
              <FormButton
                onClick={() => {
                  dispatch(sendSignUpVerificationEmail(email));
                }}
              >
                Send email verification code
              </FormButton>
            )}
          </ButtonArea>
          */}

          <ButtonArea>
            {!loading ? (
              <FormButton
                onClick={() => {
                  dispatch(signUp(email, password));
                }}
                disabled={!signUpCheck}
              >
                SIGN UP
              </FormButton>
            ) : (
              <ButtonArea>
                <Loader
                  type="ThreeDots"
                  color={colorPalette.green8}
                  height={30}
                  width={30}
                  //timeout={3000} //3 secs
                />
                Loading...
              </ButtonArea>
            )}
          </ButtonArea>
          <ChangeState>
            Already have an account?
            <div
              style={{ cursor: "pointer", color: colorPalette.green8 }}
              onClick={() => {
                setIsSignUp(false);
              }}
            >
              Log in
            </div>
          </ChangeState>
        </Container>
      ) : null}
      {!isSignUp ? (
        <Container>
          <div style={{ textAlign: "center" }}>
            <img src={MainIcon} alt="sprout-icon" width="20%" />
          </div>

          <div>
            <FormInput
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  dispatch(login(email, password));
                }
              }}
              value={email}
              type="email"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              style={{ imeMode: "disabled" }}
              placeholder="yours@example.com"
              disabled={loading}
            />
          </div>
          <div>
            <FormInput
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  dispatch(login(email, password));
                }
              }}
              value={password}
              type="password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              style={{ imeMode: "disabled" }}
              placeholder="your password"
              disabled={loading}
            />
          </div>
          {!loading ? (
            <ButtonArea>
              <FormButton
                onClick={() => {
                  dispatch(login(email, password));
                }}
              >
                LOG IN
              </FormButton>

              <ChangeState>
                New to Foresty?
                <div
                  style={{ cursor: "pointer", color: colorPalette.green8 }}
                  onClick={() => {
                    setIsSignUp(true);
                  }}
                >
                  Create New Foresty Account
                </div>
              </ChangeState>
            </ButtonArea>
          ) : (
            <ButtonArea>
              <Loader
                type="ThreeDots"
                color={colorPalette.green8}
                height={30}
                width={30}
                //timeout={3000} //3 secs
              />
              Loading...
            </ButtonArea>
          )}
        </Container>
      ) : null}
    </>
  );
});

export const Container = styled.div`
  margin-left: auto;
  margin-right: auto;
  margin-top: 3rem;
  display: grid;
  justify-content: center;
  align-items: center;
  border: 1px solid ${colorPalette.gray3};
  width: 350px;
  padding: 25px;
  @media (max-width: 650px) {
    width: 300px;
  }
`;

const FormButton = styled(DefaultButton)`
  width: 300px;
  :disabled {
    background-color: ${colorPalette.gray2};
    border: 1px solid ${colorPalette.gray2};
    cursor: not-allowed;
    &:hover {
      color: #fff;
    }
  }
`;

export const ButtonArea = styled.div`
  margin-left: auto;
  margin-right: auto;
`;

export const FormInput = styled(LargeTextInput)`
  //border-bottom: none;
  //width: 90%;
  border: 1px solid ${colorPalette.gray3};
  padding: 15px;
  margin-right: 25px;
  margin-left: 25px;
  margin-top: 15px;
  margin-bottom: 0.5rem;
  width: 300px;
  :disabled {
    background-color: ${colorPalette.gray2};
    color: ${colorPalette.gray6};
  }
`;

const ChangeState = styled.div`
  margin-top: 15px;
  text-align: center;
`;
