import React, { Component } from "react";
import "./App.css";
import styled from "styled-components";
import characters from "./data";

import Overlay from "./components/Overlay";
import CharactersList from "./components/Characters/List";
import Blocks from "./components/Blocks/index";
import FloatingAvatar from "./components/FloatingAvatar";

const defaultSpringConfig = { tension: 260, friction: 23 };

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

  getDetailsBlockSizes = () => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const sizes = { width: 0, height: 0, top: 0, left: 0 };
    if (window.matchMedia("(min-width: 1280px)").matches) {
      sizes.width = viewportWidth * (48 / 100);
      sizes.height = viewportHeight * (60 / 100);
    } else if (window.matchMedia("(min-width: 600px)").matches) {
      sizes.width = viewportWidth * (70 / 100);
      sizes.height = viewportHeight * (60 / 100);
    } else if (window.matchMedia("(min-width: 480px)").matches) {
      sizes.width = viewportWidth * (85 / 100);
      sizes.height = viewportHeight * (70 / 100);
    } else {
      sizes.width = viewportWidth * (92 / 100);
      sizes.height = viewportHeight * (82 / 100);
    }
    return {
      ...sizes,
      left: (viewportWidth - sizes.width) / 2,
      top: (viewportHeight - sizes.height) / 2 + viewportHeight * (5 / 100)
    };
  };

  handleSelect = index => {
    if (this.state.characters[index].selected) return;
    this.setState(prevState => ({
      characters: prevState.characters.map((character, i) => ({ ...character, selected: i === index })),
      showOverlay: true,
      previousShowOverlay: false,
      show: true,
      blocks: {
        ...prevState.blocks
      }
    }));
  };

  onOverlayClick = () => {
    this.setState(prevState => ({
      characters: prevState.characters.map(character => ({ ...character, selected: false })),
      showOverlay: false,
      show: false,
      blocks: {
        ...prevState.blocks,
        current: "menu"
      }
    }));
  };

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
    const oneCharacterIsSelected = selectedCharacterIndex >= 0;
    const selectedRef = oneCharacterIsSelected ? this.charactersNodes[selectedCharacterIndex] : null;
    return (
      <>
        <StyledContainer>
          <Overlay show={showOverlay} onClick={this.onOverlayClick} />
          <CharactersList
            characters={characters}
            setRef={node => this.charactersNodes.push(node)}
            onSelect={this.handleSelect}
          />
        </StyledContainer>
        <FloatingAvatar
          defaultSpringConfig={defaultSpringConfig}
          state={blocks.current}
          getDetailsBlockSizes={this.getDetailsBlockSizes}
          show={oneCharacterIsSelected}
          originPictureRef={this.charactersNodes[selectedCharacterIndex]}
          character={oneCharacterIsSelected ? characters[selectedCharacterIndex] : null}
        />
        <Blocks
          show={show}
          defaultSpringConfig={defaultSpringConfig}
          getDetailsBlockSizes={this.getDetailsBlockSizes}
          blocks={blocks}
          characters={characters}
          goTo={this.handleSelect}
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
