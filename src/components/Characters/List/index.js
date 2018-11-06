import React from "react";
import Character from "./../Item";

export default function CharactersList({ characters, setRef, onSelect }) {
  return characters.map((character, index) => (
    <Character setRef={setRef} key={character.id} character={character} onClick={() => onSelect(index)} />
  ));
}
