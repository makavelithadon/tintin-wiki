import React, { Component } from "react";
import styled from "styled-components";
import { StyledCommon } from "./../styles";

const StyledMenu = styled(StyledCommon).attrs({
  style: ({ opacity }) => ({
    opacity,
    visibility: opacity > 0 ? "visible" : "hidden",
    zIndex: opacity > 0 ? 100 : 0
  })
})`
  padding: 0;
  margin: 0;
  list-style-type: none;
  overflow: hidden;
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

export default class Menu extends Component {
  render() {
    const { opacity, onClickItem, show } = this.props;
    return (
      <StyledMenu opacity={opacity} show={show}>
        <StyledMenuItem hoveredBgColor={"#40a1c1"} onClick={onClickItem("profile")}>
          Profil
        </StyledMenuItem>
        <StyledMenuItem hoveredBgColor={"#1e364a"} onClick={onClickItem("illustrations")}>
          Illustrations
        </StyledMenuItem>
        <StyledMenuItem hoveredBgColor={"#efad4b"} onClick={onClickItem("illustrations")}>
          Albums
        </StyledMenuItem>
      </StyledMenu>
    );
  }
}
