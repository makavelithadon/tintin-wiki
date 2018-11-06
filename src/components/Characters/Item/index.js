import React from "react";
import styled from "styled-components";
import CharacterPicture from "./Picture";

const StyledCharacterContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 120px;
  height: 120px;
  margin-bottom: 42px;
  position: relative;
  z-index: ${({ selected }) => (selected ? 3 : 1)};
  &:after {
    content: "${({ name }) => name}";
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: -22px;
    width: 92%;
    height: 24px;
    text-align: center;
    font-size: .9rem;
  }
`;

export default function Character({ character, onClick, setRef }) {
  const { displayName, selected } = character;
  return (
    <StyledCharacterContainer selected={selected} name={displayName}>
      <CharacterPicture setRef={setRef} character={character} onClick={onClick} />
    </StyledCharacterContainer>
  );
}
