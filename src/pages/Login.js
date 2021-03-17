//import MainWrapperDefault from '../wrappers/MainWrapper'
//import { Spinner } from '../components/Spinner'
//import { Button, DefaultButton } from '../components/Button'
//import { TitleInput } from '../components/TitleInput'
//import MainLogo from '../assets/MainLogo.png'
//
import React, { useState, useRef, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { boxShadow, colorPalette } from "../lib/style";
import styled from "styled-components";
import { useHistory } from "react-router";
import { authService } from "../lib/firebase";

export const LoginPage = React.memo(() => {
  // 6~20자리. 최소 하나이상의 숫자 또는 특수문자를 포함해야함.
  const passwordRegex = /^(?=.*[a-zA-Z])((?=.*\d)|(?=.*\W)).{6,20}$/;

  return (
    <>
      <input />
      <input />
      <button
        onClick={() => {
          authService.signInWithEmailAndPassword(
            "budlebeee@gmail.com",
            "jo761322"
          );
        }}
      >
        login
      </button>
      <button
        onClick={() => {
          authService.createUserWithEmailAndPassword(
            "budlebeee@gmail.com",
            "jo761322"
          );
        }}
      >
        sign up
      </button>
    </>
  );
});
