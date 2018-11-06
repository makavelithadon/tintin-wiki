import React from "react";
import styled from "styled-components";

export const StyledCharacterPicture = styled.div`
  background: ${({ picture }) => (picture ? `url(${picture}) no-repeat center top, #fff` : "#fff")};
  background-size: cover;
  width: 70%;
  height: 70%;
  border-radius: 50%;
  cursor: pointer;
  position: relative;
  transition: transform 0.275s ease-out, box-shadow 0.425s ease-out;
  transform-origin: 50% 75%;
  /* transform: ${({ selected }) => `scale(${selected ? 1.25 : 1})`};
  box-shadow: ${({ selected }) => (selected ? "0 2px 48px rgba(0,0,0,0.125)" : "none")}; */
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  &:hover {
    //transform: scale(1.25);
  }
`;

export default function Picture({ character: { selected, picture }, onClick, setRef }) {
  return <StyledCharacterPicture ref={setRef} selected={selected} onClick={onClick} picture={picture} />;
}
