import React, { memo } from "react";
import styled from "styled-components";
import { Keyframes, animated } from "react-spring";

const StyledOverlay = styled(animated.div).attrs({
  style: ({ opacity, pointerEvents }) => ({
    opacity,
    zIndex: opacity.interpolate(o => (o > 0 ? 2 : 0)),
    display: opacity.interpolate(o => (o > 0 ? "block" : "none")),
    pointerEvents
  })
})`
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 228, 181, 0.775);
`;

const AnimatedOverlay = Keyframes.Spring({
  show: { o: 1, from: { o: 0 } },
  hide: { o: 0 }
});

const getScrollbarWidth = () => {
  return window.innerWidth - document.documentElement.clientWidth;
};

const setBodyStyles = isOverlayDisplayed => {
  document.body.style.paddingRight = isOverlayDisplayed ? `${getScrollbarWidth()}px` : 0;
  document.body.style.overflow = isOverlayDisplayed ? "hidden" : "auto";
};

const Overlay = ({ show, onClick }) => {
  setBodyStyles(show);
  return (
    <AnimatedOverlay native config={{ duration: 250 }} state={show ? "show" : "hide"}>
      {({ o }) => <StyledOverlay pointerEvents={show ? "auto" : "none"} opacity={o} onClick={onClick} />}
    </AnimatedOverlay>
  );
};

export default memo(Overlay);
