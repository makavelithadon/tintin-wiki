import React from "react";
import { createGlobalStyle } from "styled-components";
import App from "./App";

const GlobalStyle = createGlobalStyle`
  html, *, *::before, *::after {
    box-sizing: border-box;
  }
  body {
    background-color: moccasin;
    font-family: 'Roboto Condensed', sans-serif;
  }
`;

export default function Root() {
  return (
    <>
      <GlobalStyle />
      <App />
    </>
  );
}
