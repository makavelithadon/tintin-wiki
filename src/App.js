import React, { Component } from "react";
import "./App.css";
import styled, { createGlobalStyle } from "styled-components";
import characters from "./data";

import Overlay from "./components/Overlay";
import CharactersList from "./components/Characters/List";
import Blocks from "./components/Blocks/index";

const GlobalStyle = createGlobalStyle`
  html, *, *::before, *::after {
    box-sizing: border-box;
  }
  body {
    background-color: moccasin;
    font-family: 'Roboto Condensed', sans-serif;
  }
`;

const StyledContainer = styled.div`
  position: relative;
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
  flex-wrap: wrap;
  max-width: 960px;
`;

class App extends Component {
  state = {
    characters,
    showOverlay: false,
    previousShowOverlay: false,
    show: false,
    toggle: false,
    blocks: {
      items: ["menu", "profile", "illustrations"],
      current: "menu"
    }
  };
  charactersNodes = [];

  componentDidMount() {
    //console.log("this.charactersNodes", this.charactersNodes);
  }

  handleSelect = index => {
    if (this.state.characters[index].selected) return;
    this.setState(prevState => ({
      characters: prevState.characters.map((character, i) => ({ ...character, selected: i === index })),
      showOverlay: true,
      previousShowOverlay: false,
      show: true,
      blocks: {
        ...prevState.blocks,
        current: "menu"
      }
    }));
  };

  onOverlayClick = () =>
    this.setState(prevState => ({
      characters: prevState.characters.map(character => ({ ...character, selected: false })),
      showOverlay: false,
      show: false
    }));
  showDetails = name => () => {
    this.setState(prevState => ({
      blocks: {
        ...prevState.blocks,
        current: name
      },
      previousShowOverlay: !!prevState.showOverlay
    }));
  };
  render() {
    const { characters, showOverlay, show, previousShowOverlay, blocks } = this.state;
    const selectedCharacterIndex = characters.findIndex(c => c.selected);
    const selectedRef =
      typeof selectedCharacterIndex !== "undefined" ? this.charactersNodes[selectedCharacterIndex] : null;
    return (
      <>
        <GlobalStyle />
        <StyledContainer>
          <Overlay show={showOverlay} onClick={this.onOverlayClick} />
          <CharactersList
            characters={characters}
            setRef={node => this.charactersNodes.push(node)}
            onSelect={this.handleSelect}
          />
        </StyledContainer>
        <Blocks
          show={show}
          blocks={blocks}
          previousShowOverlay={previousShowOverlay}
          selectedCharacter={characters.find(character => character.selected)}
          handleClickMenuItem={this.showDetails}
          selectedRef={selectedRef}
        />
      </>
    );
  }
}

export default App;
