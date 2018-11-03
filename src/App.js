import React, { Component } from "react";
import "./App.css";
import styled, { createGlobalStyle } from "styled-components";
import { Transition, Spring } from "react-spring";
import tintinPicture from "./assets/img/tintin.png";
import milouPicture from "./assets/img/milou.png";
import haddockPicture from "./assets/img/haddock.jpg";
import tournesolPicture from "./assets/img/tournesol.png";
import dupondtPicture from "./assets/img/dupondt.jpg";
import nestorPicture from "./assets/img/nestor.png";
import castafiorePicture from "./assets/img/castafiore.jpg";
import alcazarPicture from "./assets/img/alcazar.jpg";

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
  @media only screen and (min-width: 960px) {
    width: 70vw;
  }
`;

const StyledAlbumContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 120px;
  height: 120px;
  margin-bottom: 50px;
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

const StyledAlbum = styled.div`
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

const StyledBlock = styled.div.attrs({
  style: props => {
    return {
      opacity: props.opacity,
      visibility: props.opacity > 0 ? "visible" : "hidden",
      pointerEvents: props.show ? "auto" : "none",
      width: props.width,
      height: props.height
    };
  }
})`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 10000;
  background-color: #fff;
  border-radius: 6px;
  overflow: hidden;
  //will-change: opacity, visibility, pointer-events, width, height;
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
  //will-change: opacity, visibility, z-index;
`;

const StyledMenu = styled(Common)`
  padding: 0;
  margin: 0;
  list-style-type: none;
`;

const StyledDetails = styled(Common)`
  padding: 16px 24px;
`;

const StyledMenuItem = styled.li`
  background-color: ${({ backgroundColor }) => backgroundColor || "#fff"};
  color: rgba(0, 0, 0, 0.7);
  padding: 12px;
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
    albums: [
      { id: 1, selected: false, name: "Tintin", picture: tintinPicture },
      { id: 2, selected: false, name: "Milou", picture: milouPicture },
      { id: 3, selected: false, name: "Capitaine Haddock", picture: haddockPicture },
      { id: 4, selected: false, name: "Professeur Tournesol", picture: tournesolPicture },
      { id: 5, selected: false, name: "Dupont & Dupond", picture: dupondtPicture },
      { id: 6, selected: false, name: "Nestor", picture: nestorPicture },
      { id: 7, selected: false, name: "Bianca Castafiore", picture: castafiorePicture },
      { id: 8, selected: false, name: "Général Alcazar", picture: alcazarPicture }
    ],
    showOverlay: false,
    previousShowOverlay: false,
    show: false,
    toggle: false,
    blocks: {
      items: [{ id: 1, name: "menu" }, { id: 2, name: "profile" }, { id: 3, name: "illustrations" }],
      current: "menu"
    }
  };
  nodes = [];

  onSelect = index => {
    if (this.state.albums[index].selected) return;
    this.setState(prevState => ({
      albums: prevState.albums.map((album, i) => ({ ...album, selected: i === index })),
      showOverlay: true,
      previousShowOverlay: false,
      show: true,
      toggle: false
    }));
  };

  getDetailsSizes = () => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const sizes = { width: 0, height: 0 };
    if (window.matchMedia("(min-width: 600px)").matches) {
      sizes.width = viewportWidth * (80 / 100);
      sizes.height = viewportHeight * (80 / 100);
    } else if (window.matchMedia("(min-width: 960px)").matches) {
      sizes.width = viewportWidth * (60 / 100);
      sizes.height = viewportHeight * (70 / 100);
    } else {
      sizes.width = viewportWidth * (92 / 100);
      sizes.height = viewportHeight * (80 / 100);
    }
    return sizes;
  };

  onOverlayClick = () =>
    this.setState(prevState => ({
      albums: prevState.albums.map(album => ({ ...album, selected: false })),
      showOverlay: false,
      show: false
    }));
  handleToggle = () =>
    this.setState(prevState => ({ toggle: !prevState.toggle, previousShowOverlay: !!prevState.showOverlay }));
  render() {
    const { albums: albumsFromState, showOverlay, toggle, show, previousShowOverlay } = this.state;
    const albums = albumsFromState.map((album, index) => (
      <StyledAlbumContainer key={album.id} selected={album.selected} name={album.name}>
        <StyledAlbum
          ref={node => this.nodes.push(node)}
          selected={album.selected}
          onClick={() => {
            this.onSelect(index);
          }}
          picture={album.picture}
        />
      </StyledAlbumContainer>
    ));
    return (
      <>
        <GlobalStyle />
        <button
          style={{ position: "absolute", top: 20, left: "50%", transform: "translateX(-50%)", zIndex: 10000 }}
          onClick={this.handleToggle}
        >
          toggle
        </button>
        <StyledContainer>
          <Overlay show={showOverlay} onClick={this.onOverlayClick} />
          {albums}
        </StyledContainer>
        <Spring
          from={{
            opacity: 0,
            width: 0,
            height: 0
          }}
          to={{
            opacity: Number(show),
            width: !toggle ? 190 : this.getDetailsSizes().width,
            height: !toggle ? 87 : this.getDetailsSizes().height
          }}
          config={key => {
            const duration =
              (key === "width" || key === "height") &&
              !toggle &&
              !previousShowOverlay /* really important! to know if its the first appearance of modal */
                ? 1
                : show
                  ? 225
                  : 100;
            return { duration };
          }}
        >
          {blockProps => {
            return (
              <StyledBlock {...blockProps} toggle={toggle} show={show}>
                <Transition
                  config={(item, type) => {
                    return { duration: type === "leave" ? 175 : 225 };
                  }}
                  items={toggle}
                  from={{ opacity: 0 }}
                  enter={{ opacity: 1 }}
                  leave={{ opacity: 0 }}
                >
                  {toggle => {
                    return toggle
                      ? props => (
                          <StyledDetails opacity={props.opacity} show={toggle}>
                            Details
                          </StyledDetails>
                        )
                      : props => (
                          <StyledMenu opacity={props.opacity} show={!toggle}>
                            <StyledMenuItem hoveredBgColor={"#40a1c1"}>Profil</StyledMenuItem>
                            <StyledMenuItem hoveredBgColor={"#1e364a"}>Illustrations</StyledMenuItem>
                          </StyledMenu>
                        );
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
