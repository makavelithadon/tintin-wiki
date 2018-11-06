import React from "react";
import styled from "styled-components";

const StyledCharacterPicture = styled.div`
  background: ${({ picture }) => (picture ? `url(${picture}) no-repeat center top, #fff` : "#fff")};
  background-size: cover;
  width: 70%;
  height: 70%;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  cursor: pointer;
  position: relative;
  transition: transform 0.3s cubic-bezier(0.17, 0.67, 0.37, 1), box-shadow 0.3s ease-out;
  transform: ${({ selected }) => `scale(${selected ? 1.25 : 1})`};
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  &:hover {
    transform: scale(1.25);
  }
`;

export default function Picture({ character: { selected, picture }, onClick, setRef }) {
  return <StyledCharacterPicture ref={setRef} selected={selected} onClick={onClick} picture={picture} />;
}
