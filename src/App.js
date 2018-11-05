import React, { Component } from "react";
import "./App.css";
import styled, { createGlobalStyle } from "styled-components";
import { Transition, Spring, animated } from "react-spring";
import tintinPicture from "./assets/img/tintin.png";
import milouPicture from "./assets/img/milou.png";
import haddockPicture from "./assets/img/haddock.jpg";
import tournesolPicture from "./assets/img/tournesol.png";
import dupondtPicture from "./assets/img/dupondt.jpg";
import nestorPicture from "./assets/img/nestor.png";
import castafiorePicture from "./assets/img/castafiore.jpg";
import lampionPicture from "./assets/img/lampion.jpg";
import dafigueiraPicture from "./assets/img/dafigueira.jpg";
import tchangPicture from "./assets/img/tchang.jpg";
import alcazarPicture from "./assets/img/alcazar.jpg";
import abdallahPicture from "./assets/img/abdallah.png";

import Overlay from "./components/Overlay";

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
  /* @media only screen and (min-width: 960px) {
    width: 70vw;
  } */
`;

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

const StyledCharacter = styled.div`
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

const StyledBlock = styled(animated.div).attrs({
  style: ({ opacity, width, height, top, pointerEvents }) => {
    return {
      opacity: opacity.interpolate(o => o),
      visibility: opacity.interpolate(o => (o > 0 ? "visible" : "hidden")),
      pointerEvents,
      width,
      height,
      top: top.interpolate(top => `${top}%`)
    };
  }
})`
  position: fixed;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10000;
  background-color: #fff;
  border-radius: 6px;
  overflow: hidden;
`;

const Common = styled.div.attrs({
  style: props => ({
    opacity: props.opacity,
    visibility: props.opacity > 0 ? "visible" : "hidden",
    zIndex: props.opacity > 0 ? 100 : 0
  })
})`
  position: absolute;
  left: 50%;
  top: 50%;
  width: 100%;
  height: 100%;
  transform: translate(-50%, -50%);
`;

const StyledMenu = styled(Common)`
  padding: 0;
  margin: 0;
  list-style-type: none;
  overflow: hidden;
`;

const StyledDetails = styled(Common)`
  padding: 16px 24px;
  overflow: auto;
`;

const StyledMenuItem = styled.li`
  background-color: ${({ backgroundColor }) => backgroundColor || "#fff"};
  color: rgba(0, 0, 0, 0.7);
  padding: 12px 24px;
  font-size: 1rem;
  border-radius: none;
  cursor: pointer;
  transition: 0.15s ease-out;
  border-bottom-width: 1px;
  border-bottom-color: #e9e9e9;
  border-bottom-style: solid;
  user-select: none;
  &:first-child {
    border-radius: 6px 6px 0 0;
  }
  &:last-child {
    border-radius: 0 0 6px 6px;
    border-bottom: none;
  }
  &:hover {
    color: #fff;
    background-color: ${({ hoveredBgColor }) => (hoveredBgColor ? hoveredBgColor : "rgba(1, 22, 39, 0.7)")};
    border-color: transparent;
  }
`;

class App extends Component {
  state = {
    characters: [
      { id: 1, selected: false, displayName: "Tintin", picture: tintinPicture },
      { id: 2, selected: false, displayName: "Milou", picture: milouPicture },
      { id: 3, selected: false, displayName: "Capitaine Haddock", picture: haddockPicture },
      { id: 4, selected: false, displayName: "Professeur Tournesol", picture: tournesolPicture },
      { id: 5, selected: false, displayName: "Dupont et Dupond", picture: dupondtPicture },
      { id: 6, selected: false, displayName: "Nestor", picture: nestorPicture },
      { id: 7, selected: false, displayName: "Bianca Castafiore", picture: castafiorePicture },
      { id: 8, selected: false, displayName: "Séraphin Lampion", picture: lampionPicture },
      { id: 9, selected: false, displayName: "Señor Oliveira Da Figueira", picture: dafigueiraPicture },
      { id: 10, selected: false, displayName: "Tchang", picture: tchangPicture },
      { id: 11, selected: false, displayName: "Général Alcazar", picture: alcazarPicture },
      { id: 12, selected: false, displayName: "Abdallah", picture: abdallahPicture }
    ],
    showOverlay: false,
    previousShowOverlay: false,
    show: false,
    toggle: false,
    blocks: {
      items: ["menu", "profile", "illustrations"],
      current: "menu"
    }
  };
  nodes = [];

  onSelect = index => {
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

  getDetailsSizes = () => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const sizes = { width: 0, height: 0 };
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
    return sizes;
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
    const { characters: charactersFromState, showOverlay, show, previousShowOverlay, blocks } = this.state;
    const isFirstAppearance = !previousShowOverlay;
    const selected = charactersFromState.find(character => character.selected);
    const characters = charactersFromState.map((character, index) => (
      <StyledCharacterContainer key={character.id} selected={character.selected} name={character.displayName}>
        <StyledCharacter
          ref={node => this.nodes.push(node)}
          selected={character.selected}
          onClick={() => {
            this.onSelect(index);
          }}
          picture={character.picture}
        />
      </StyledCharacterContainer>
    ));
    return (
      <>
        <GlobalStyle />
        <StyledContainer>
          <Overlay show={showOverlay} onClick={this.onOverlayClick} />
          {characters}
        </StyledContainer>
        <Spring
          from={{
            opacity: 0,
            width: 0,
            height: 0,
            top: 50
          }}
          to={{
            opacity: Number(show),
            width: blocks.current === "menu" ? 190 : this.getDetailsSizes().width,
            height: blocks.current === "menu" ? /*87*/ 131 : this.getDetailsSizes().height,
            top: blocks.current === "menu" ? 50 : 55
          }}
          config={key => {
            const duration =
              (key === "width" || key === "height" || key === "top") &&
              isFirstAppearance /* really important! to know if its the first appearance of modal */
                ? 1
                : show
                  ? 225
                  : 1;
            return { duration };
          }}
          native
        >
          {({ opacity, top, width, height }) => {
            return (
              <StyledBlock
                pointerEvents={show ? "auto" : "none"}
                opacity={opacity}
                top={top}
                width={width}
                height={height}
              >
                <Transition
                  config={(_, type) => {
                    const duration = type === "leave" || !show ? 1 : 200;
                    return {
                      duration
                    };
                  }}
                  items={[blocks.items.find(item => item === blocks.current)]}
                  keys={item => item}
                  from={{ opacity: 0 }}
                  enter={[{ opacity: isFirstAppearance ? 1 : 0 }, { opacity: 1 }]}
                  leave={{ opacity: 0 }}
                >
                  {() => {
                    switch (blocks.current) {
                      case "menu":
                        return props => (
                          <StyledMenu opacity={props.opacity} show={blocks.current === "menu"}>
                            <StyledMenuItem hoveredBgColor={"#40a1c1"} onClick={this.showDetails("profile")}>
                              Profil
                            </StyledMenuItem>
                            <StyledMenuItem hoveredBgColor={"#1e364a"} onClick={this.showDetails("illustrations")}>
                              Illustrations
                            </StyledMenuItem>
                            <StyledMenuItem hoveredBgColor={"#efad4b"} onClick={this.showDetails("illustrations")}>
                              Albums
                            </StyledMenuItem>
                          </StyledMenu>
                        );
                      case "profile":
                        return props => (
                          <StyledDetails opacity={props.opacity} show={blocks.current === "profile"}>
                            <div style={{ overflow: "auto" }}>
                              {selected && (
                                <h2 style={{ marginTop: 0, fontSize: "1rem", fontWeight: 400 }}>
                                  {selected.displayName}
                                </h2>
                              )}
                            </div>
                          </StyledDetails>
                        );
                      case "illustrations":
                        return props => (
                          <StyledDetails opacity={props.opacity} show={blocks.current === "illustrations"}>
                            <h2 style={{ marginTop: 0, fontSize: "1rem", fontWeight: 400 }}>Illustrations</h2>
                            <div style={{ overflow: "auto" }}>42 images :</div>
                          </StyledDetails>
                        );
                      default:
                        return "";
                    }
                  }}
                </Transition>
              </StyledBlock>
            );
          }}
        </Spring>
      </>
    );
  }
}

export default App;
