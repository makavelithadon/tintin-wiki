import React, { Component, createRef } from "react";
import { Transition, Spring } from "react-spring";
import styled from "styled-components";

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

const StyledContainer = styled.div.attrs({
  style: ({ opacity, show }) => ({
    opacity,
    visibility: opacity > 0 ? "visible" : "hidden",
    pointerEvents: show ? "auto" : "none"
  })
})`
  z-index: 10;
  left: ${({ coordinates: { left } }) => left};
  top: ${({ coordinates: { top } }) => top};
  transform: ${({ coordinates: { transform } }) => (transform ? transform : "none")};
  width: ${({ coordinates: { width } }) => (width ? width + "px" : "auto")};
  height: ${({ coordinates: { height } }) => (height ? height + "px" : "auto")};
  position: fixed;
  border-radius: 6px;
`;

const StyledOther = styled.div.attrs({
  style: ({ opacity, show }) => ({
    opacity,
    visibility: opacity > 0 ? "visible" : "hidden",
    pointerEvents: show ? "auto" : "none"
  })
})`
  position: relative;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: tomato;
  width: 70vw;
  height: 70vh;
  color: #fff;
`;

export default class Block extends Component {
  state = {
    coords: {
      left: "auto",
      top: "auto",
      transform: "none",
      width: "auto",
      height: "auto"
    },
    originalItems: [
      {
        id: 1,
        name: "menu",
        element: StyledMenu
      },
      {
        id: 2,
        name: "other",
        element: StyledOther
      }
    ],
    items: []
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    console.log("nextProps.originNode !== prevState.originNode", nextProps.originNode !== prevState.originNode);
    if (nextProps.originNode !== prevState.originNode) {
      return {
        originNode: nextProps.originNode
      };
    }
    const itemToShow = prevState.originalItems.find(item => item.name === nextProps.focused);
    return {
      items: [itemToShow],
      originNode: nextProps.originNode
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.originNode !== this.props.originNode || prevProps.focused !== this.props.focused) {
      this.setCoords();
    }
  }

  node = createRef();
  setCoords = () => {
    if (!this.state.originNode) return;
    console.log("this.props.focused", this.props.focused);
    if (this.props.focused === "other") {
      this.setState({
        coords: {
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: this.node.current.firstElementChild.clientWidth,
          height: this.node.current.firstElementChild.clientHeight
        }
      });
      return;
    }
    let { left, top, right, height } = this.state.originNode.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    const offsetTop = 30;
    const { height: menuHeight, width: menuWidth } = this.node.current.getBoundingClientRect();
    const requiredHeight = menuHeight + offsetTop;
    const hasAvailableHeight = viewportHeight - (top + height + requiredHeight) >= 0;
    const hasAvailableWidth = viewportWidth - (left + menuWidth) >= 0;
    const overflowedWidth = !hasAvailableWidth ? left + menuWidth - viewportWidth : 0;
    const decalageTop = height + offsetTop;
    left = (hasAvailableWidth ? left : left - overflowedWidth - (viewportWidth - right)) + "px";
    top = top + (hasAvailableHeight ? decalageTop : -requiredHeight) + "px";
    this.setState({
      coords: {
        left,
        top
      }
    });
  };
  render() {
    const { focused, show, goTo } = this.props;
    const { items } = this.state;
    console.log("focused", focused, "show", show, "items", items);

    return (
      <Spring from={{ opacity: 0 }} to={{ opacity: Number(show) }}>
        {containerProps => (
          <StyledContainer
            className={"Hello"}
            ref={this.node}
            coordinates={this.state.coords}
            opacity={containerProps.opacity}
            show={show}
          >
            <Transition
              items={items}
              keys={item => item.id}
              from={{ opacity: 0 }}
              enter={{ opacity: 1 }}
              leave={{ opacity: 0 }}
            >
              {({ name, element: Element }) => props => (
                <Element opacity={props.opacity} show={focused === name}>
                  {name === "menu" && (
                    <>
                      <StyledMenuItem onClick={goTo("other")} hoveredBgColor={"#40a1c1"}>
                        Profil
                      </StyledMenuItem>
                      <StyledMenuItem onClick={goTo("other")} hoveredBgColor={"#1e364a"}>
                        Illustrations
                      </StyledMenuItem>
                    </>
                  )}
                  {name === "other" && <div onClick={goTo("menu")}>other...</div>}
                </Element>
              )}
            </Transition>
          </StyledContainer>
        )}
      </Spring>
    );
  }
}
