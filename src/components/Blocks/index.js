import React, { PureComponent, createRef } from "react";
import { Spring, Transition, animated, config } from "react-spring";
import styled from "styled-components";
import Menu from "./Menu";
import Details from "./Details";

const StyledBlock = styled(animated.div).attrs({
  style: ({ opacity, width, height, top, pointerEvents, left }) => {
    return {
      opacity: opacity.interpolate(o => o),
      visibility: opacity.interpolate(o => (o > 0 ? "visible" : "hidden")),
      top,
      left,
      pointerEvents,
      width,
      height
    };
  }
})`
  position: fixed;
  z-index: 10000;
  background-color: #fff;
  border-radius: 6px;
  overflow: hidden;
`;

const getDetailsBlockSizes = () => {
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

export default class Blocks extends PureComponent {
  node = createRef();

  setCoords = () => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    let coords;
    if (!this.props.selectedRef) {
      coords = {
        top: viewportWidth / 2,
        left: viewportHeight / 2
      };
    } else {
      let { left, top, right, height } = this.props.selectedRef.getBoundingClientRect();
      const offsetTop = 50;
      const menuWidth = 190;
      const menuHeight = 131;
      const requiredHeight = menuHeight + offsetTop;
      const hasAvailableWidth = viewportWidth - (left + menuWidth) >= 0;
      const hasAvailableHeight = viewportHeight - (top + height + requiredHeight) >= 0;
      const overflowedWidth = !hasAvailableWidth ? left + menuWidth - viewportWidth : 0;
      const decalageTop = height + offsetTop;
      coords = {
        left: hasAvailableWidth ? left : left - overflowedWidth - (viewportWidth - right),
        top: top + (hasAvailableHeight ? decalageTop : -requiredHeight)
      };
    }
    return coords;
  };

  render() {
    const { show, blocks, previousShowOverlay, selectedCharacter: selected, handleClickMenuItem } = this.props;
    const isFirstAppearance = !previousShowOverlay;
    const coords = this.setCoords();
    return (
      <Spring
        from={{
          opacity: 0,
          width: 0,
          height: 0,
          top: 50
        }}
        to={{
          opacity: Number(show),
          width: blocks.current === "menu" ? 190 : getDetailsBlockSizes().width,
          height: blocks.current === "menu" ? /*87*/ 131 : getDetailsBlockSizes().height,
          left: blocks.current === "menu" ? coords.left : getDetailsBlockSizes().left,
          top: blocks.current === "menu" ? coords.top : getDetailsBlockSizes().top
        }}
        config={key => {
          const c = { ...config.default };
          if ((/width|height|top|left/.test(key) && isFirstAppearance) || !show) {
            c.duration = 1;
          }
          return c;
        }}
        native
      >
        {({ opacity, top, left, width, height }) => {
          return (
            <StyledBlock
              pointerEvents={show ? "auto" : "none"}
              opacity={opacity}
              left={left}
              top={top}
              width={width}
              height={height}
              ref={this.node}
              state={blocks.current}
            >
              <Transition
                config={(_, type) => {
                  const duration = type === "leave" || !show ? 1 : 225;
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
                        <Menu {...props} show={blocks.current === "menu"} onClickItem={handleClickMenuItem} />
                      );
                    case "profile":
                      return props => (
                        <Details {...props} show={blocks.current === "profile"}>
                          <div style={{ overflow: "auto" }}>
                            {selected && (
                              <h2 style={{ marginTop: 0, fontSize: "1rem", fontWeight: 400 }}>
                                {selected.displayName}
                              </h2>
                            )}
                          </div>
                        </Details>
                      );
                    case "illustrations":
                      return props => (
                        <Details {...props} show={blocks.current === "illusrations"}>
                          <h2 style={{ marginTop: 0, fontSize: "1rem", fontWeight: 400 }}>Illustrations</h2>
                          <div style={{ overflow: "auto" }}>42 images :</div>
                        </Details>
                      );
                    default:
                      return null;
                  }
                }}
              </Transition>
            </StyledBlock>
          );
        }}
      </Spring>
    );
  }
}
