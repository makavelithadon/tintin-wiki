import React, { memo } from "react";
import styled from "styled-components";
import { Spring } from "react-spring";

const StyledOverlay = styled.div.attrs({
  style: ({ opacity, show }) => ({
    opacity,
    zIndex: opacity > 0 ? 2 : 0,
    display: opacity > 0 ? "block" : "none",
    pointerEvents: show ? "auto" : "none"
  })
})`
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 228, 181, 0.775);
`;

const getScrollbarWidth = () => {
  return window.innerWidth - document.documentElement.clientWidth;
};

const Overlay = ({ show, onClick }) => {
  document.body.style.paddingRight = show ? getScrollbarWidth() + "px" : 0;
  document.body.style.overflow = show ? "hidden" : "auto";
  return (
    <Spring config={{ duration: 250 }} from={{ opacity: 0 }} to={{ opacity: Number(show) }}>
      {({ opacity }) => <StyledOverlay show={show} opacity={opacity} onClick={onClick} />}
    </Spring>
  );
};

export default memo(Overlay);
