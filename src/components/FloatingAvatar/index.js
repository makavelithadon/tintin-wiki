import React, { PureComponent } from "react";
import styled from "styled-components";
import { Spring, animated, config } from "react-spring";

const StyledFloatingAvatar = styled(animated.div).attrs({
  style: ({ o, left, top, zoom, boxShadow }) => {
    return {
      opacity: o.interpolate(o => o),
      zIndex: o.interpolate(o => (o > 0 ? 12 : 1)),
      transform: zoom.interpolate(zoom => `scale(${zoom})`),
      boxShadow: boxShadow.interpolate(boxShadow => boxShadow),
      cursor: o.interpolate(o => (o > 0 ? "initial" : "pointer")),
      left,
      top
    };
  }
})`
  background: ${({ picture }) => (picture ? `url(${picture}) no-repeat center top, #fff` : "#fff")};
  background-size: cover;
  width: 84px;
  height: 84px;
  border-radius: 50%;
  position: fixed;
  transition: transform 0.275s ease-out, box-shadow 0.425s ease-out;
  transform-origin: 50% 75%;
  /* transform: ${({ selected }) => `scale(${selected ? 1.25 : 1})`};*/
  /* box-shadow: ${({ withshadow }) => (withshadow ? "0 2px 48px rgba(0,0,0,0.0825)" : "none")}; */
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  &:hover {
    //transform: scale(1.25);
  }
`;

export default class FloatingAvatar extends PureComponent {
  zoomCoeficient = 1.2;
  setCoords = () => {
    const { originPictureRef, state, getDetailsBlockSizes } = this.props;
    let left, top;
    if (!originPictureRef) {
      left = 0;
      top = 0;
      return {
        left,
        top
      };
    } else {
      if (state === "menu") {
        const pictureCoords = this.props.originPictureRef.getBoundingClientRect();
        left = pictureCoords.left;
        top = pictureCoords.top;
        return {
          left: left,
          top: top
        };
      } else {
        const { top: detailsTop } = getDetailsBlockSizes();
        const width = 84;
        const height = width;
        left = window.innerWidth / 2 - width / 2;
        top = detailsTop - height / 2;
        return {
          left: left,
          top: top
        };
      }
    }
  };
  render() {
    const { character, show, state } = this.props;
    const { left, top } = this.setCoords();
    return (
      <Spring
        from={{
          o: 0,
          zoom: 1,
          boxShadow: "0 2px 48px rgba(0,0,0,0.0)",
          left: 0,
          top: 0
        }}
        to={{
          o: Number(show),
          zoom: show ? this.zoomCoeficient : 1,
          boxShadow: show ? "0 2px 48px rgba(0,0,0,0.125)" : "0 2px 48px rgba(0,0,0,0.0)",
          top,
          left
        }}
        config={key => {
          let customConfig = {
            ...config.default
          };
          customConfig.duration = /o|zoom|top|left/.test(key) && state === "menu" ? 0.000001 : show ? 0 : 0.00001;
          return customConfig;
        }}
        native
      >
        {({ o, zoom, left, top, boxShadow }) => {
          console.log("here");
          return (
            <StyledFloatingAvatar
              o={o}
              zoom={zoom}
              left={left}
              top={top}
              boxShadow={boxShadow}
              picture={character ? character.picture : null}
              selected
            />
          );
        }}
      </Spring>
    );
  }
}
