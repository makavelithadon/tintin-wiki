import React, { Component, createRef } from "react";
import styled from "styled-components";

const StyledMenu = styled.ul.attrs({
  style: ({ opacity, show }) => ({
    opacity,
    visibility: opacity > 0 ? "visible" : "hidden",
    pointerEvents: show ? "auto" : "none"
  })
})`
  padding: 0;
  margin: 0;
  position: fixed;
  border-radius: 6px;
  width: 190px;
  z-index: 10;
  left: ${({ coordinates: { left } }) => left};
  top: ${({ coordinates: { top } }) => top};
  background-color: #fff;
  list-style-type: none;
`;

class MenuList extends Component {
  render() {
    const { children } = this.props;
    return <StyledMenu>{children}</StyledMenu>;
  }
}

export default MenuList;
